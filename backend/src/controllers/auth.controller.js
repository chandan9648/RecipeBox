const userModel = require('../models/auth.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { OAuth2Client } = require('google-auth-library');

function setAuthCookie(res, token) {
    const isProd = String(process.env.NODE_ENV).toLowerCase() === 'production';
    res.cookie('token', token, {
        httpOnly: true,
        sameSite: isProd ? 'none' : 'lax',
        secure: isProd,
    });
}


//REGISTER CONTROLLER
 async function registerController(req, res) {
     const { name, email, password, role, adminSecret } = req.body;

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    let finalRole = role === 'seller' ? 'seller' : 'user';
    // Allow admin creation ONLY when explicitly enabled via env secret
    if (role === 'admin') {
        const secret = process.env.ADMIN_SECRET;
        if (secret && adminSecret && String(adminSecret) === String(secret)) {
            finalRole = 'admin';
        }
    }

    const user = await userModel.create({
        name,
        email,
        password: hashedPassword,
        provider: 'local',
        role: finalRole
    });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    setAuthCookie(res, token);

    const safeUser = await userModel.findById(user._id).select('-password');
    return res.status(201).json({ message: "User registered successfully", user: safeUser, token });

}


//LOGIN CONTROLLER
async function loginController(req, res) {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }

    if (user.provider === 'google') {
        return res.status(400).json({ message: "This account uses Google sign-in. Please continue with Google." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
   
    if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid credentials" });
    }
  
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    setAuthCookie(res, token);

    const safeUser = await userModel.findById(user._id).select('-password');
    return res.status(200).json({ message: "Login successful", user: safeUser, token });


}

// GOOGLE LOGIN CONTROLLER (Google Identity Services ID token)
async function googleLoginController(req, res) {
    try {
        const { credential } = req.body || {};
        if (!credential) {
            return res.status(400).json({ message: 'Missing Google credential' });
        }

        // Support multiple OAuth client IDs (e.g., local vs production)
        // Env options:
        // - GOOGLE_CLIENT_ID=...
        // - GOOGLE_CLIENT_IDS=id1,id2,id3
        const googleClientIds = [
            ...(process.env.GOOGLE_CLIENT_IDS || '')
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean),
            process.env.GOOGLE_CLIENT_ID,
        ].filter(Boolean);

        if (!googleClientIds.length) {
            return res.status(500).json({ message: 'Server misconfigured: GOOGLE_CLIENT_ID(S) missing' });
        }

        const client = new OAuth2Client();
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: googleClientIds,
        });
        const payload = ticket.getPayload();

        const email = payload?.email;
        const emailVerified = payload?.email_verified;
        const googleSub = payload?.sub;

        if (!email || !googleSub) {
            return res.status(400).json({ message: 'Invalid Google token payload' });
        }
        if (!emailVerified) {
            return res.status(400).json({ message: 'Google account email not verified' });
        }

        let user = await userModel.findOne({ $or: [{ googleSub }, { email }] });

        if (!user) {
            user = await userModel.create({
                name: payload?.name || payload?.given_name || 'User',
                email,
                provider: 'google',
                googleSub,
                avatar: payload?.picture,
                // password is optional for google users; keep a random hash for safety
                password: await bcrypt.hash(crypto.randomBytes(24).toString('hex'), 10),
            });
        } else {
            const updates = {};
            if (user.provider !== 'google') updates.provider = 'google';
            if (!user.googleSub) updates.googleSub = googleSub;
            if (payload?.picture && user.avatar !== payload.picture) updates.avatar = payload.picture;
            if (payload?.name && user.name !== payload.name) updates.name = payload.name;
            if (Object.keys(updates).length) {
                user = await userModel.findByIdAndUpdate(user._id, updates, { new: true });
            }
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        setAuthCookie(res, token);

        const safeUser = await userModel.findById(user._id).select('-password');
        return res.status(200).json({ message: 'Login successful', user: safeUser, token });
    } catch (error) {
        const msg = error?.message || String(error);
        console.error('Google login error:', msg);
        const isProd = String(process.env.NODE_ENV).toLowerCase() === 'production';
        return res.status(400).json({
            message: isProd ? 'Google login failed' : `Google login failed: ${msg}`,
        });
    }
}

//LOGOUT CONTROLLER
async function logoutController(req, res) {
    res.clearCookie('token');
    return res.status(200).json({ message: "Logout successful" });
}
module.exports = {
    registerController, loginController, logoutController, googleLoginController
};

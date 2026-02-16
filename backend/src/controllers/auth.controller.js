const userModel = require('../models/auth.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { OAuth2Client } = require('google-auth-library');
const otpGenerator = require('otp-generator');
const { sendEmail } = require('../utils/sendEmail');


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

    // Admin accounts: skip OTP verification (admin creation is already gated by ADMIN_SECRET)
    const shouldVerifyViaOtp = finalRole !== 'admin';
    const otp = shouldVerifyViaOtp
        ? otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        })
        : null;

    const user = await userModel.create({
        name,
        email,
        password: hashedPassword,
        provider: 'local',
        role: finalRole,
        otp,
        otpExpiry: shouldVerifyViaOtp ? new Date(Date.now() + 5 * 60 * 1000) : null,
        isVerified: shouldVerifyViaOtp ? false : true,
    });

   

    if (shouldVerifyViaOtp) {
        await sendEmail(email, "Your OTP for RecipeBox Registration", `Your OTP is: ${otp}. It expires in 5 minutes.`);
        const safeUser = await userModel.findById(user._id).select('-password');
        return res.status(201).json({ message: "OTP sent to email.", user: safeUser });
    }

    const safeUser = await userModel.findById(user._id).select('-password');
    return res.status(201).json({ message: "User registered successfully", user: safeUser });

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

    // Only non-admin local accounts require OTP verification
    if (!user.isVerified && user.role !== 'admin') {
        return res.status(401).json({ message: "Verify email first" });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.cookie('token', token, { httpOnly: true, sameSite: 'lax' });

    const safeUser = await userModel.findById(user._id).select('-password');
    return res.status(200).json({ message: "Login successful", user: safeUser, token });

}

// GOOGLE LOGIN CONTROLLER 
async function googleLoginController(req, res) {
    try {
        const { credential } = req.body || {};
        if (!credential) {
            return res.status(400).json({ message: 'Missing Google credential' });
        }

        const googleClientId = process.env.GOOGLE_CLIENT_ID;
        if (!googleClientId) {
            return res.status(500).json({ message: 'Server misconfigured: GOOGLE_CLIENT_ID missing' });
        }

        const client = new OAuth2Client(googleClientId);
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: googleClientId,
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
                isVerified: true,
                // password is optional for google users; keep a random hash for safety
                password: await bcrypt.hash(crypto.randomBytes(24).toString('hex'), 10),
            });
        } else {
            const updates = {};
            if (user.provider !== 'google') updates.provider = 'google';
            if (!user.googleSub) updates.googleSub = googleSub;
            if (payload?.picture && user.avatar !== payload.picture) updates.avatar = payload.picture;
            if (payload?.name && user.name !== payload.name) updates.name = payload.name;
            if (!user.isVerified) updates.isVerified = true;
            if (Object.keys(updates).length) {
                user = await userModel.findByIdAndUpdate(user._id, updates, { new: true });
            }
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.cookie('token', token, { httpOnly: true, sameSite: 'lax' });

        const safeUser = await userModel.findById(user._id).select('-password');
        return res.status(200).json({ message: 'Login successful', user: safeUser, token });
    } catch (error) {
        console.error('Google login error:', error?.message || error);
        return res.status(400).json({ message: 'Google login failed' });
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

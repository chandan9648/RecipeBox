const userModel = require('../models/auth.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


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
        role: finalRole
    });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.cookie('token', token, { httpOnly: true, sameSite: 'lax' });

    return res.status(201).json({ message: "User registered successfully", user, token });

}


//LOGIN CONTROLLER
async function loginController(req, res) {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
   
    if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid credentials" });
    }
  
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.cookie('token', token, { httpOnly: true, sameSite: 'lax' });

    return res.status(200).json({ message: "Login successful", user, token });


}

//LOGOUT CONTROLLER
async function logoutController(req, res) {
    res.clearCookie('token');
    return res.status(200).json({ message: "Logout successful" });
}
module.exports = {
    registerController, loginController, logoutController
};

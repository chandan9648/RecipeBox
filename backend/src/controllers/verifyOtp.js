const userModel = require("../models/auth.model");
const { sendEmail } = require("../utils/sendEmail");

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body || {};

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const user = await userModel.findOne({ email: String(email).toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(200).json({ message: "Account already verified" });
    }

    const isExpired = !user.otpExpiry || new Date(user.otpExpiry).getTime() < Date.now();
    const isMatch = user.otp && String(user.otp) === String(otp);

    if (!isMatch || isExpired) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    await sendEmail(email, "Welcome!", "Welcome to RecipeBox 🎉");

    return res.json({ message: "Account verified!" });
  } catch (err) {
    console.error("verifyOtp error:", err);
    return res.status(500).json({ message: "Failed to verify OTP" });
  }
};

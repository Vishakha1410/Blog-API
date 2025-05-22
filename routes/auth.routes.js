const express = require("express");
const router = express.Router();
const User = require("../models/users");
const { generateToken } = require("../utils/token");
const { route } = require("./comments");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const { generateResetCode } = require("../utils/codeGenerator");
const { authMiddleware, authorizeRoles } = require("../middleware/auth");

const {
  registerValidator,
  loginValidator,
  forgotPasswordValidator,
  recoverPasswordValidator,
  changePasswordValidator,
  sendVerificationCodeValidator,
  verifyEmailCodeValidator,
} = require("../Validators/authValidators");
const validate = require("../middleware/validate");

//For new user registration
router.post("/register", registerValidator, validate, async (req, res) => {
  try {
    const { name, email, password, gender, country, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already exist" });

    const user = new User({ name, email, password, gender, country, role });
    await user.save();

    // Send Welcome Email
    await sendEmail({
      to: user.email,
      subject: "Welcome to Our Blog App 🎉",
      html: `<p>Hi <b>${user.name}</b>,</p><p>Welcome to our blog platform! We're excited to have you on board.</p><p>Happy blogging! 🚀</p>`,
    });

    const token = generateToken({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

//for login Password
router.post("/login", loginValidator, validate, async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(400).json({ Message: " Inavlid credentials" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(400).json({ Message: " Inavlid credentials" });
    const token = generateToken({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
    res.status(200).json({ message: "Login succesfully", token });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

//for forgot password
router.post(
  "/forgot-password",
  forgotPasswordValidator,
  validate,
  async (req, res) => {
    try {
      const { email } = req.body;

      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ error: "User not found" });

      //Generate code
      const code = generateResetCode();
      user.resetCode = code;
      user.resetCodeExpires = Date.now() + 15 * 60 * 1000;
      await user.save();
      //send email
      await sendEmail({
        to: user.email,
        subject: "Your password reset code",
        html: `<p>Use this code to reset your password : <b>${code}</b></p>`,
      });
      res.json({ message: "Password reset email sent. Check your inbox." });
    } catch (err) {
      res.status(500).json({ error: "Server error" });
    }
  }
);

router.post(
  "/recover-password",
  recoverPasswordValidator,
  validate,
  async (req, res) => {
    try {
      const { email, code, newPassword } = req.body;
      const user = await User.findOne({ email }).select("+password");
      if (!user) return res.status(400).json({ error: "User not found" });
      const isCodeValid =
        user.resetCode === code && user.resetCodeExpires > Date.now();

      if (!isCodeValid)
        return res.status(400).json({ error: "Invalid or expired reset code" });

      user.password = newPassword;
      user.resetCode = undefined;
      user.resetCodeExpires = undefined;

      await user.save();

      res.json({ message: "Password reset successfully" });
    } catch (err) {
      res.status(500).json({ error: "Server error" });
    }
  }
);

//for changing password
router.post(
  "/change-password",
  changePasswordValidator,
  validate,
  authMiddleware,
  async (req, res, next) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const { _id } = req.user;
      const user = await User.findById(_id).select("+password");

      if (!user) return res.status(404).json({ error: "User not found" });

      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch)
        return res
          .status(400)
          .json({ error: "Current password is incorrect " });

      if (currentPassword === newPassword) {
        return res
          .status(400)
          .json({ error: "New password must be different from old password" });
      }

      //send email
      await sendEmail({
        to: user.email,
        subject: "Password Changed Successfully",
        html: `
        <p>Hello ${user.name},</p>
        <p>Your password has been changed successfully. If you did not perform this action, please contact support immediately.</p>
      `,
      });
      user.password = newPassword;
      await user.save();
      res.json({ message: "Password changed successfully" });
    } catch (err) {
      res.status(500).json({ error: "Server error" });
    }
  }
);

//for sending verification email
router.post(
  "/send-verification-code",
  sendVerificationCodeValidator,
  validate,
  async (req, res) => {
    try {
      const { email } = req.body;

      const user = await User.findOne({ email });

      if (!user) return res.status(404).json({ error: "User not found" });

      if (user.emailVerified)
        return res.status(400).json({ message: "Email already verified" });

      const code = generateResetCode();
      user.resetCode = code;
      user.resetCodeExpires = Date.now() + 15 * 60 * 1000; // 15 min
      await user.save();

      await sendEmail({
        to: email,
        subject: "Verify Your Email",
        html: `<p>Your verification code is: <b>${code}</b></p>`,
      });

      res.json({ message: "Verification code sent to your email" });
    } catch (err) {
      res.status(500).json({ error: "Server error" });
    }
  }
);
//verify email
router.post(
  "/verify-email",
  verifyEmailCodeValidator,
  validate,
  async (req, res) => {
    try {
      const { email, code } = req.body;

      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ error: "User not found" });

      const isCodeValid =
        user.resetCode === code && user.resetCodeExpires > Date.now();

      if (!isCodeValid)
        return res.status(400).json({ error: "Invalid or expired code" });

      user.emailVerified = true;
      user.resetCode = undefined;
      user.resetCodeExpires = undefined;
      await user.save();

      res.json({ message: "Email verified successfully" });
    } catch (err) {
      res.status(500).json({ error: "Server error" });
    }
  }
);

//for getting user details
router.get("/get-user", authMiddleware, async (req, res) => {
  try {
    const { _id } = req.body;

    const user = await User.findById(_id).select("-password");

    if (!user) return res.status(404).json({ error: "User not found" });

    return res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});
module.exports = router;

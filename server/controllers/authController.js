const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const buildTransporter = () => {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: SMTP_SECURE === "true",
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
};

// Register
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Name, email, and password are required" });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters" });
  }

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: "User registered successfully" });

  } catch (error) {
    console.error("Auth register error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Forgot password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(200)
        .json({ message: "If the email exists, password reset instructions were sent." });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetExpires = Date.now() + 3600000; // 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetExpires;
    await user.save();

    const resetLink = `${process.env.CLIENT_URL || "http://localhost:5173"}/reset-password?token=${resetToken}`;
    let emailStatus = "No SMTP config; copy link to use manually.";

    const transporter = buildTransporter();
    if (transporter) {
      try {
        const mailOptions = {
          from: process.env.SMTP_FROM || process.env.SMTP_USER,
          to: email,
          subject: "Password Reset Request",
          text: `You requested a password reset. Click or copy this link: ${resetLink}`,
          html: `<p>You requested a password reset.</p><p>Click <a href="${resetLink}">here to reset your password</a>.</p><p>If you cannot click, copy this link:</p><p>${resetLink}</p>`,
        };

        await transporter.sendMail(mailOptions);
        emailStatus = "Reset email sent successfully";
      } catch (mailerError) {
        emailStatus = `Failed to send email: ${mailerError.message}`;
      }
    }

    return res.status(200).json({
      message: "If the email exists, password reset instructions were sent.",
      resetToken,
      resetLink,
      emailStatus,
    });
  } catch (error) {
    console.error("forgotPassword error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.resetPassword = async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password) {
    return res.status(400).json({ message: "Token and new password are required" });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password has been reset successfully" });
  } catch (error) {
    console.error("resetPassword error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// Login
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

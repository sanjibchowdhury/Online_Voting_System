const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const ADMIN_EMAILS = process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(',') : [];

router.post('/register', async (req, res) => {
  
  const { username, email, password, role } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Username, email, and password are required' });
  }

  if (role === 'admin' && !ADMIN_EMAILS.includes(email)) {
    return res.status(403).json({ message: 'You are not authorized to register as an admin.' });
  }

  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User or email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ username, email, password: hashedPassword, role });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('REGISTER FAILED:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('LOGIN ROUTE FAILED:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.patch('/profile', auth.authenticateToken, async (req, res) => {
    const { username } = req.body;
    const userId = req.user.id;
    if (!username) {
        return res.status(400).json({ message: 'Username is required' });
    }
    try {
        const existingUser = await User.findOne({ username: username });
        if (existingUser && existingUser._id.toString() !== userId) {
            return res.status(400).json({ message: 'Username is already taken' });
        }
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { username: username },
            { new: true }
        ).select('-password');
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({
            message: 'Profile updated successfully',
            user: updatedUser
        });
    } catch (err) {
        console.error('PROFILE UPDATE FAILED:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(200).json({ message: 'If an account with that email exists, a reset link has been sent.' });
        }
        const token = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Password Reset Request',
            text: `Please click on the following link to reset your password:\n\n` +
                  `https://online-voting-system-45.vercel.app/reset-password/${token} \n\n` +
                  `If you did not request this, please ignore this email.\n`
        };
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'A password reset link has been sent to your email.' });
    } catch (err) {
        console.error('FORGOT PASSWORD FAILED:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/reset-password/:token', async (req, res) => {
    try {
        const user = await User.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() }
        });
        if (!user) {
            return res.status(400).json({ message: 'Password reset token is invalid or has expired.' });
        }
        const { password } = req.body;
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        res.status(200).json({ message: 'Password has been updated successfully.' });
    } catch (err) {
        console.error('RESET PASSWORD FAILED:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
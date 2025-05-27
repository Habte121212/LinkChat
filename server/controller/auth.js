const express = require('express')
const User = require('../model/User')
const Joi = require('joi')
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')

// Register
const registerUser = async (req, res) => {
  try {
    let { name, email, password } = req.body

    // Trim inputs to avoid whitespace issues
    name = name?.trim()
    email = email?.trim().toLowerCase()
    password = password?.trim()

    // validations
    const schema = Joi.object({
      name: Joi.string().min(3).max(30).required(),
      email: Joi.string().email().required(),
      // Password with complexity: min 6 chars, at least one uppercase, one lowercase, one number, one special char
      password: Joi.string()
        .min(6)
        .max(100)
        .pattern(
          new RegExp(
            '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,}$',
          ),
        )
        .message(
          'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
        )
        .required(),
    })

    const { error } = schema.validate({ name, email, password })
    if (error) {
      return res.status(400).json({ error: error.details[0].message })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' })
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Generate verification token using crypto
    const rawToken = crypto.randomBytes(32).toString('hex')
    const verificationToken = await bcrypt.hash(rawToken, 10)
    const verificationTokenExpires = Date.now() + 1000 * 60 * 60 * 24 // 24 hours

    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      isVerified: false,
      verificationToken,
      verificationTokenExpires,
    })

    await user.save()

    // Send verification email
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })
    const verifyUrl = `http://localhost:5000/api/auth/verify-email?token=${encodeURIComponent(
      rawToken,
    )}&email=${encodeURIComponent(email)}`
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verify your email',
      html: `<p>Click <a href="${verifyUrl}">here</a> to verify your email. This link will expire in 24 hours.</p>`,
    })

    return res.status(201).json({
      message:
        'User registered successfully. Please check your email to verify your account.',
    })
  } catch (error) {
    console.error('Error during registration:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

// Verify Email
const verifyEmail = async (req, res) => {
  const { token, email } = req.query
  const user = await User.findOne({
    email,
    verificationTokenExpires: { $gt: Date.now() },
  })
  if (!user) {
    return res.status(400).json({ error: 'Invalid or expired token' })
  }
  const isMatch = await bcrypt.compare(token, user.verificationToken)
  if (!isMatch) {
    return res.status(400).json({ error: 'Invalid or expired token' })
  }
  user.isVerified = true
  user.verificationToken = undefined
  user.verificationTokenExpires = undefined
  await user.save()
  return res.json({ message: 'Email verified successfully' })
}

// login
const loginUser = async (req, res) => {
  try {
    let { email, password } = req.body

    // Trim inputs
    email = email?.trim().toLowerCase()
    password = password?.trim()

    // validations
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).max(100).required(),
    })

    const { error } = schema.validate({ email, password })
    if (error) {
      return res.status(400).json({ error: 'Error in validations' })
    }

    //check  if user exists
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ error: 'user does not exist' })
    }

    // check if user is verified
    if (!user.isVerified) {
      return res
        .status(400)
        .json({ error: 'Please verify your email before logging in' })
    }

    // check password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' })
    }

    // generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
    )
    // Return user info (excluding password) and token
    return res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
      },
    })
  } catch (error) {
    console.error('Error during login:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

// Forgot Password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body
    if (!email) return res.status(400).json({ error: 'Email is required' })
    const user = await User.findOne({ email: email.trim().toLowerCase() })
    if (!user) return res.status(400).json({ error: 'No user with that email' })
    // Generate reset token
    const rawToken = crypto.randomBytes(32).toString('hex')
    const resetToken = await bcrypt.hash(rawToken, 10)
    const resetTokenExpires = Date.now() + 1000 * 60 * 30 // 30 min
    user.resetPasswordToken = resetToken
    user.resetPasswordExpires = resetTokenExpires
    await user.save()
    // Send email
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    })
    const resetUrl = `http://localhost:5000/server/auth/reset-password?token=${encodeURIComponent(
      rawToken,
    )}&email=${encodeURIComponent(email)}`
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Reset your password',
      html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. This link will expire in 30 minutes.</p>`,
    })
    return res.json({ message: 'Password reset email sent' })
  } catch (error) {
    console.error('Error in forgotPassword:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

// Reset Password
const resetPassword = async (req, res) => {
  try {
    const { email, token, newPassword } = req.body
    if (!email || !token || !newPassword)
      return res.status(400).json({ error: 'Missing fields' })
    const user = await User.findOne({
      email: email.trim().toLowerCase(),
      resetPasswordExpires: { $gt: Date.now() },
    })
    if (!user)
      return res.status(400).json({ error: 'Invalid or expired token' })
    const isMatch = await bcrypt.compare(token, user.resetPasswordToken)
    if (!isMatch)
      return res.status(400).json({ error: 'Invalid or expired token' })
    // Validate new password (reuse registration rules)
    const schema = Joi.string()
      .min(6)
      .max(100)
      .pattern(
        new RegExp(
          '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,}$',
        ),
      )
      .required()
    const { error } = schema.validate(newPassword)
    if (error) return res.status(400).json({ error: error.details[0].message })
    // Hash and save new password
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(newPassword, salt)
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined
    await user.save()
    return res.json({ message: 'Password reset successful' })
  } catch (error) {
    console.error('Error in resetPassword:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

module.exports = {
  registerUser,
  verifyEmail,
  loginUser,
  forgotPassword,
  resetPassword,
}

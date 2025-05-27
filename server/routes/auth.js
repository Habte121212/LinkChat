const express = require('express')
const router = express.Router()
const {
  registerUser,
  verifyEmail,
  loginUser,
  forgotPassword,
  resetPassword,
} = require('../controller/auth')

// register
router.post('/register', registerUser)
router.get('/verify-email', verifyEmail)

// login
router.post('/login', loginUser)

// forgot password
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)

const registerRoute = router
const verifyRoute = router
const loginRoute = router

module.exports = { registerRoute, verifyRoute, loginRoute }

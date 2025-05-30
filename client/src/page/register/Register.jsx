import { useState } from 'react'
import { Link } from 'react-router-dom'
import './register.scss'
import { toast } from 'react-hot-toast'
import axios from 'axios'

const Register = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')

  const API_URL = 'http://localhost:8500/server/auth'

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const validatePassword = (password) => {
    // At least 6 chars, one uppercase, one lowercase, one number, one special char
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(
      password,
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (name.length < 3) {
      toast.error('Name must be at least 3 characters long')
      return
    }
    if (!validateEmail(email)) {
      toast.error('Please enter a valid email')
      return
    }
    if (!validatePassword(password)) {
      toast.error(
        'Password must be at least 6 characters and include uppercase, lowercase, number, and special character',
      )
      return
    }
    if (password !== confirm) {
      toast.error('Passwords do not match')
      return
    }
    setLoading(true)
    try {
      const res = await axios.post(`${API_URL}/register`, {
        name,
        email,
        password,
      })
      toast.success(res.data.message || 'Registration successful!')
      if (onSuccess) onSuccess()
    } catch (err) {
      toast.error(
        err.response?.data?.error || err.message || 'Registration failed',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="register">
      <div className="container">
        <h1>Register</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirm}
            required
            onChange={(e) => setConfirm(e.target.value)}
            disabled={loading}
          />
          <button type="submit" disabled={loading}>
            {loading ? <span className="loader"></span> : 'Register'}
          </button>
        </form>
        <div className="register-link">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  )
}

export default Register

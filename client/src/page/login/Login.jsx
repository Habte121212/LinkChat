import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './login.scss'
import { toast } from 'react-hot-toast'
import axios from 'axios'

const API_URL = 'http://localhost:8500/server/auth'

const Login = ({ onSuccess }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    toast.dismiss()
    setLoading(true)
    try {
      const res = await axios.post(`${API_URL}/login`, { email, password })
      toast.success(res.data.message || 'Login successful!')
      localStorage.setItem('token', res.data.token)
      if (onSuccess) onSuccess()
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.error || err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login">
      <div className="container">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? <span className="loader"></span> : 'Login'}
          </button>
        </form>
        <div className="register-link">
          Don't have an account? <a href="/register">Register</a>
        </div>
      </div>
    </div>
  )
}

export default Login

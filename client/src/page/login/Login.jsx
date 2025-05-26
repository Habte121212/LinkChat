import { useState } from 'react'
import './login.scss'

const Login = () => {
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    // Simulate async login (replace with real logic)
    setTimeout(() => setLoading(false), 1500)
  }

  return (
    <div className="login">
      <div className="container">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="Email" disabled={loading} />
          <input type="password" placeholder="Password" disabled={loading} />
          <div className="forgot-password">
            <span>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#4f8cff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 12a10 10 0 1 1-4.93-8.36" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              Forgot Password?
            </span>
          </div>
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

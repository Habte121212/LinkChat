import { useState } from 'react'
import './register.scss'

const Register = () => {
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    // Simulate async register (replace with real logic)
    setTimeout(() => setLoading(false), 1500)
  }

  return (
    <div className="register">
      <div className="container">
        <h1>Register</h1>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Username" disabled={loading} />
          <input type="email" placeholder="Email" disabled={loading} />
          <input type="password" placeholder="Password" disabled={loading} />
          <input
            type="password"
            placeholder="Confirm Password"
            disabled={loading}
          />
          <button type="submit" disabled={loading}>
            {loading ? <span className="loader"></span> : 'Register'}
          </button>
        </form>
        <div className="register-link">
          Already have an account? <a href="/login">Login</a>
        </div>
      </div>
    </div>
  )
}

export default Register

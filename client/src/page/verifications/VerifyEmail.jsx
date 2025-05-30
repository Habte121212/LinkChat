import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import axios from 'axios'
import './verifyEmail.scss'

const API_URL = 'http://localhost:8500/server/auth/verify-email'
const RESEND_URL = 'http://localhost:8500/server/auth/resend-verification'

const VerifyEmail = () => {
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState('verifying')
  const [message, setMessage] = useState('')
  const [resendLoading, setResendLoading] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const navigate = useNavigate()
  const email = searchParams.get('email')
  const token = searchParams.get('token')

  // Cooldown timer for resend
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [cooldown])

  useEffect(() => {
    let toastShown = false // Use a local variable, not a ref
    if (!token || !email) {
      setStatus('error')
      setMessage('Invalid verification link.')
      if (!toastShown) {
        toast.dismiss()
        toast.error('Invalid verification link.')
        toastShown = true
      }
      return
    }
    fetch(
      `${API_URL}?token=${encodeURIComponent(token)}&email=${encodeURIComponent(
        email,
      )}`,
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setStatus('error')
          setMessage(data.error)
          if (!toastShown) {
            toast.dismiss()
            toast.error(data.error)
            toastShown = true
          }
          return
        }
        setStatus('success')
        setMessage('Email verified! Redirecting to login...')
        if (!toastShown) {
          toast.dismiss()
          toast.success('Email verified!')
          toastShown = true
        }
        setTimeout(() => navigate('/login'), 2000)
      })
      .catch(() => {
        if (!toastShown) {
          setStatus('error')
          setMessage('Verification failed. Please try again later.')
          toast.dismiss()
          toast.error('Verification failed.')
          toastShown = true
        }
      })
  }, [token, email, navigate])

  // Modern resend logic: POST to /resend-verification, show spinner, cooldown
  const handleResend = async () => {
    if (!email) return
    setResendLoading(true)
    try {
      await axios.post(RESEND_URL, { email })
      toast.success('Verification email resent! Check your inbox.')
      setCooldown(30) // 30s cooldown
    } catch (err) {
      toast.error(
        err.response?.data?.error || err.message || 'Failed to resend email',
      )
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <div
      className="verify-email-page"
      style={{
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #ded5b8 0%, #c8dcff 100%)',
      }}
    >
      <div
        style={{
          background: 'rgba(255,255,255,0.95)',
          borderRadius: 16,
          boxShadow: '0 8px 32px 0 rgba(31,38,135,0.18)',
          padding: '2.5rem 2rem',
          maxWidth: 400,
          width: '100%',
          textAlign: 'center',
        }}
      >
        <h2 style={{ marginBottom: 12 }}>Email Verification</h2>
        {status === 'verifying' && (
          <div
            style={{
              fontSize: 22,
              margin: 16,
            }}
          >
            🔄
            <br />
            Verifying your email...
          </div>
        )}
        {status === 'success' && (
          <div
            style={{
              fontSize: 22,
              color: '#2ecc40',
              margin: 16,
            }}
          >
            ✅
            <br />
            {message}
          </div>
        )}
        {status === 'error' && (
          <div
            style={{
              fontSize: 22,
              color: '#e74c3c',
              margin: 16,
            }}
          >
            ❌
            <br />
            {message}
          </div>
        )}
        {status === 'success' && (
          <div
            style={{
              marginTop: 18,
              color: '#555',
            }}
          >
            Redirecting...
          </div>
        )}
        {status === 'error' && email && (
          <button
            onClick={handleResend}
            disabled={resendLoading || cooldown > 0}
            style={{
              marginTop: 18,
              padding: '0.7em 1.5em',
              borderRadius: 8,
              border: 'none',
              background: resendLoading || cooldown > 0 ? '#ccc' : '#3a7bd5',
              color: '#fff',
              fontWeight: 600,
              fontSize: 16,
              cursor: resendLoading || cooldown > 0 ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s',
            }}
          >
            {resendLoading
              ? 'Sending...'
              : cooldown > 0
              ? `Resend in ${cooldown}s`
              : 'Resend Verification Email'}
          </button>
        )}
      </div>
    </div>
  )
}

export default VerifyEmail

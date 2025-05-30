import './App.css'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'
import { useState } from 'react'
import Home from './page/home/Home'
import Login from './page/login/Login'
import Register from './page/register/Register'
import VerifyEmail from './page/verifications/VerifyEmail'
import { Toaster } from 'react-hot-toast'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  return (
    <Router>
      <div className="container">
        <Toaster position="top-center" />
        <Routes>
          <Route path="/register" element={<Register onSuccess={() => {}} />} />
          <Route
            path="/login"
            element={<Login onSuccess={() => setIsAuthenticated(true)} />}
          />
          <Route
            path="/"
            element={
              isAuthenticated ? <Home /> : <Navigate to="/login" replace />
            }
          />
          <Route path="/verify-email" element={<VerifyEmail />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App

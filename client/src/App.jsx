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

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [registered, setRegistered] = useState(false)

  return (
    <Router>
      <div className="container">
        <Routes>
          <Route
            path="/register"
            element={
              <Register
                onSuccess={() => {
                  setRegistered(true)
                }}
              />
            }
          />
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
        </Routes>
      </div>
    </Router>
  )
}

export default App

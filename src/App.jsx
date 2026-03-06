import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './components/dashboard/Dashboard'
import Login from './components/auth/Login'
import Signup from './components/auth/Signup'

import './styles/index.css'
import { supabase } from './utils/supabase'

function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  const checkSession = () => {
    const isMockAuth = localStorage.getItem('aqua_auth') === 'true'
    if (isMockAuth) {
      setSession({ user: { email: 'testhome@gmail.com' } })
      setLoading(false)
      return true
    }
    return false
  }

  useEffect(() => {
    if (!checkSession()) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session)
        setLoading(false)
      })
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    localStorage.removeItem('aqua_auth')
    await supabase.auth.signOut()
    setSession(null)
  }

  if (loading) {
    return <div className="loading">Checking session...</div>
  }

  return (
    <Router>
      <div className="app">

        <Routes>
          <Route
            path="/login"
            element={session ? <Navigate to="/" /> : <Login onAuthChange={checkSession} />}
          />
          <Route
            path="/signup"
            element={session ? <Navigate to="/" /> : <Signup />}
          />
          <Route
            path="/"
            element={session ? <Dashboard onLogout={handleLogout} /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App

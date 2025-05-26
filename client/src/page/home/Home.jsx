import React from 'react'
import './home.scss'
import ChatWindow from '../../components/chat/ChatWindow'

const Home = () => {
  return (
    <div className="home-page">
      <div className="chat-container">
        <header className="chat-header">
          <h2>LinkChat</h2>
          <span className="status-indicator online">● Online</span>
        </header>
        <ChatWindow />
        <footer className="chat-footer">
          <span className="footer-text">
            &copy; {new Date().getFullYear()} LinkChat &mdash; Modern Chat
          </span>
        </footer>
      </div>
    </div>
  )
}

export default Home

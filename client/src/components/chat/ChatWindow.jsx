import React, { useState } from 'react'
import './ChatWindow.scss'
import ContactList from '../contactlist/ContactList'
import Profile from '../profile/Profile'
import MessageItem from '../message/MessageItem'

const initialContacts = [
  {
    id: 1,
    name: 'Alice',
    avatar: '/image.png',
    online: true,
    status: 'Online',
    bio: 'Alice bio',
  },
  {
    id: 2,
    name: 'Bob',
    avatar: '/image.png',
    online: false,
    status: 'Offline',
    bio: 'Bob bio',
  },
  {
    id: 3,
    name: 'Charlie',
    avatar: '/image.png',
    online: true,
    status: 'Online',
    bio: 'Charlie bio',
  },
]

const ChatWindow = () => {
  const [contacts] = useState(initialContacts)
  const [selectedContact, setSelectedContact] = useState(null)
  const [showProfile, setShowProfile] = useState(false)
  const [profileContact, setProfileContact] = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerView, setDrawerView] = useState('main')

  // Example messages per contact (replace with real data in real app)
  const messages = selectedContact
    ? [
        {
          id: 1,
          type: 'received',
          sender: selectedContact.name,
          avatar: selectedContact.avatar,
          content: { text: `Hey! 👋 I'm ${selectedContact.name}` },
          time: '10:30 AM',
        },
        {
          id: 2,
          type: 'sent',
          sender: 'You',
          avatar: '',
          content: { text: 'Hi! How are you?' },
          time: '10:31 AM',
        },
      ]
    : []

  // Handlers
  const handleSelectContact = (contact) => {
    setSelectedContact(contact)
  }
  const handleShowProfile = (contact) => {
    setProfileContact(contact)
    setShowProfile(true)
  }
  const handleCloseProfile = () => {
    setShowProfile(false)
    setProfileContact(null)
  }

  // Mobile drawer navigation handlers
  const openContacts = () => setDrawerView('contacts')
  const openSettings = () => {
    setDrawerView('settings')
    setDrawerOpen(true)
  }
  const openTheme = () => {
    setDrawerView('theme')
    setDrawerOpen(true)
  }
  const backToMain = () => setDrawerView('main')
  const handleDrawerClose = () => setDrawerOpen(false)

  return (
    <div className="chat-app-layout">
      <ContactList
        contacts={contacts}
        activeContact={selectedContact}
        onSelectContact={handleSelectContact}
        onShowProfile={handleShowProfile}
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        drawerView={drawerView}
        setDrawerView={setDrawerView}
        openContacts={openContacts}
        openSettings={openSettings}
        openTheme={openTheme}
        backToMain={backToMain}
        handleDrawerClose={handleDrawerClose}
      />
      <div className="chat-window">
        {/* Profile Modal */}
        {showProfile && profileContact && (
          <Profile profile={profileContact} onClose={handleCloseProfile} />
        )}
        {/* Chat Header or Placeholder */}
        {selectedContact ? (
          <>
            <div className="chat-header-bar">
              <div
                className="profile-section"
                onClick={() => handleShowProfile(selectedContact)}
                style={{ cursor: 'pointer' }}
              >
                <img
                  className="profile-avatar"
                  src={selectedContact.avatar}
                  alt="Profile"
                />
                <div className="profile-info">
                  <span className="profile-name">{selectedContact.name}</span>
                  <span
                    className={`profile-status ${
                      selectedContact.online ? 'online' : 'offline'
                    }`}
                  >
                    {selectedContact.online ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>
              <div className="chat-actions">
                <button className="icon-btn" title="Video Call">
                  <span role="img" aria-label="video">
                    📹
                  </span>
                </button>
                <button className="icon-btn" title="Voice Call">
                  <span role="img" aria-label="call">
                    📞
                  </span>
                </button>
                <button
                  className="icon-btn"
                  title="See Profile"
                  onClick={() => handleShowProfile(selectedContact)}
                >
                  <span role="img" aria-label="profile">
                    👤
                  </span>
                </button>
              </div>
            </div>
            {/* Messages */}
            <div className="messages">
              {messages.length === 0 ? (
                <div className="empty-state">
                  No messages yet. Start the conversation!
                </div>
              ) : (
                messages.map((msg) => <MessageItem key={msg.id} {...msg} />)
              )}
            </div>
            {/* Message Input */}
            <form className="message-input">
              <input type="text" placeholder="Type your message..." />
              <label className="icon-btn attach-btn" title="Attach Image">
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                />
                <span role="img" aria-label="attach">
                  📎
                </span>
              </label>
              <button type="submit">Send</button>
            </form>
          </>
        ) : (
          <div
            className="empty-state"
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem',
              color: '#aaa',
            }}
          >
            Select a contact to start chatting
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatWindow

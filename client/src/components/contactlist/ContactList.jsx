import React, { useState, useMemo, useRef, useEffect } from 'react'
import './ContactList.scss'
import { THEME_OPTIONS } from './themeOptions'

const ContactList = ({
  contacts = [],
  activeContact,
  onSelectContact,
  onShowProfile,
  drawerOpen,
  drawerView,
  setDrawerOpen,
  setDrawerView,
  showAddContact: propShowAddContact,
  setShowAddContact: propSetShowAddContact,
  newContact: propNewContact,
  setNewContact: propSetNewContact,
  handleAddContact: propHandleAddContact,
  handleAddContactChange: propHandleAddContactChange,
  theme: propTheme,
  handleThemeChange: propHandleThemeChange,
  editProfile: propEditProfile,
  handleProfileChange: propHandleProfileChange,
  saveProfile: propSaveProfile,
  backToMain,
  openContacts,
  openSettings,
  openTheme,
  handleDrawerClose,
}) => {
  // Mobile menu button handler
  const handleMenuClick = () => {
    setDrawerOpen(true)
    setDrawerView('main')
  }

  // Modern notification: unseen message from Alice
  const [unseenAlice, setUnseenAlice] = useState(true)

  // Memoize notification visibility for Alice
  const showAliceNotif = useMemo(
    () =>
      unseenAlice &&
      contacts.some((c) => c.name === 'Alice') &&
      (!activeContact || activeContact.name !== 'Alice'),
    [unseenAlice, contacts, activeContact],
  )

  // SVG bell icon for notification
  const BellIcon = (
    <svg
      width="18"
      height="18"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      style={{ verticalAlign: 'middle' }}
    >
      <path
        d="M10 18a2 2 0 0 0 2-2H8a2 2 0 0 0 2 2Zm6-4V9a6 6 0 1 0-12 0v5l-2 2v1h16v-1l-2-2Z"
        fill="#fff"
        stroke="#3a7bd5"
        strokeWidth="1.2"
      />
    </svg>
  )

  // --- Local fallback state for mobile/standalone use ---
  const [localShowAddContact, setLocalShowAddContact] = useState(false)
  const [localNewContact, setLocalNewContact] = useState({
    name: '',
    email: '',
  })
  const [localEditProfile, setLocalEditProfile] = useState({
    name: '',
    email: '',
  })
  const [localTheme, setLocalTheme] = useState('default')

  // --- Fallback handlers ---
  const _showAddContact =
    typeof propShowAddContact !== 'undefined'
      ? propShowAddContact
      : localShowAddContact
  const _setShowAddContact = propSetShowAddContact || setLocalShowAddContact
  const _newContact = propNewContact || localNewContact
  const _setNewContact = propSetNewContact || setLocalNewContact
  const _editProfile = propEditProfile || localEditProfile
  const _handleProfileChange =
    propHandleProfileChange ||
    ((e) => {
      const { name, value } = e.target
      setLocalEditProfile((prev) => ({ ...prev, [name]: value }))
    })
  const _saveProfile = propSaveProfile || (() => {})
  const _theme = propTheme || localTheme
  const _handleThemeChange =
    propHandleThemeChange ||
    ((t) => {
      setLocalTheme(t)
      if (t === 'default') {
        document.body.removeAttribute('data-theme')
      } else {
        document.body.setAttribute('data-theme', t)
      }
    })
  const _handleAddContactChange =
    propHandleAddContactChange ||
    ((e) => {
      const { name, value } = e.target
      setLocalNewContact((prev) => ({ ...prev, [name]: value }))
    })
  const _handleAddContact =
    propHandleAddContact ||
    (() => {
      // Demo: add to local list (not persistent)
      if (_newContact.name && _newContact.email) {
        // Optionally, you could push to a local contacts state here
        setLocalNewContact({ name: '', email: '' })
        setLocalShowAddContact(false)
      }
    })
  // Mobile menu navigation handlers for mobile drawer
  // (Do not define openContacts, openSettings, openTheme, backToMain here; use props only)

  const addContactNameRef = useRef(null)

  useEffect(() => {
    if (_showAddContact && addContactNameRef.current) {
      addContactNameRef.current.focus()
      addContactNameRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }
  }, [_showAddContact])

  return (
    <>
      {/* Mobile menu icon and title */}
      <div className="contact-list-mobile-menu">
        <button
          className="menu-btn"
          onClick={handleMenuClick}
          title="Menu"
          aria-label="Open menu"
        >
          <span aria-hidden="true">☰</span>
        </button>
        <span className="menu-title">Menu</span>
      </div>
      {/* Mobile drawer for contacts/settings/theme/profile */}
      {drawerOpen && (
        <div className="contact-list-mobile-drawer" onClick={handleDrawerClose}>
          <div className="drawer-content" onClick={(e) => e.stopPropagation()}>
            <button className="drawer-close-btn" onClick={handleDrawerClose}>
              &times;
            </button>
            {drawerView === 'main' && (
              <>
                <button
                  className="drawer-action-btn contacts-btn"
                  onClick={openContacts}
                >
                  👥 Contacts
                </button>
                <button
                  className="drawer-action-btn settings-btn"
                  onClick={openSettings}
                >
                  ⚙️ Settings
                </button>
                <button
                  className="drawer-action-btn theme-btn"
                  onClick={openTheme}
                >
                  🎨 Theme
                </button>
              </>
            )}
            {drawerView === 'contacts' && (
              <>
                <button className="drawer-back-btn" onClick={backToMain}>
                  ← Back
                </button>
                <div className="drawer-section-title">Contacts</div>
                {_showAddContact ? (
                  <div className="add-contact-form">
                    <label>Name</label>
                    <input
                      name="name"
                      value={_newContact.name}
                      onChange={_handleAddContactChange}
                      placeholder="Contact Name"
                      ref={addContactNameRef}
                      autoFocus
                    />
                    <label>Email</label>
                    <input
                      name="email"
                      value={_newContact.email}
                      onChange={_handleAddContactChange}
                      placeholder="Contact Email"
                    />
                    <button
                      className="drawer-action-btn save-btn"
                      onClick={_handleAddContact}
                    >
                      Add
                    </button>
                    <button
                      className="drawer-back-btn"
                      onClick={() => _setShowAddContact(false)}
                    >
                      Cancel
                    </button>
                  </div>
                ) : contacts.length === 0 ? (
                  <div className="no-contacts-msg">
                    No contacts found.
                    <button
                      className="drawer-action-btn add-btn"
                      onClick={() => _setShowAddContact(true)}
                      style={{ marginTop: '1.2rem', float: 'right' }}
                    >
                      ➕ Add Contact
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="contacts-header-row">
                      <span></span>
                      <button
                        className="drawer-action-btn add-btn"
                        onClick={() => _setShowAddContact(true)}
                        style={{ float: 'right' }}
                      >
                        ➕ Add Contact
                      </button>
                    </div>
                    <ul className="drawer-list">
                      {contacts.map((contact) => (
                        <li
                          key={contact.id}
                          className={
                            (contact.online ? 'online' : 'offline') +
                            (activeContact && activeContact.id === contact.id
                              ? ' active'
                              : '')
                          }
                          onClick={() =>
                            onSelectContact && onSelectContact(contact)
                          }
                        >
                          <img
                            src={contact.avatar}
                            alt={contact.name}
                            className="contact-avatar"
                            onClick={(e) => {
                              e.stopPropagation()
                              onSelectContact && onSelectContact(contact)
                            }}
                          />
                          <span
                            className="contact-name"
                            onClick={(e) => {
                              e.stopPropagation()
                              onSelectContact && onSelectContact(contact)
                            }}
                          >
                            {contact.name}
                          </span>
                          <span
                            className="status-dot"
                            title={contact.online ? 'Online' : 'Offline'}
                          ></span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </>
            )}
            {drawerView === 'settings' && (
              <>
                <button className="drawer-back-btn" onClick={backToMain}>
                  ← Back
                </button>
                <div className="drawer-section-title">User Settings</div>
                <div className="drawer-settings-user">
                  <div className="drawer-settings-avatar-wrap">
                    <img
                      src={_editProfile.avatar || '/image.png'}
                      alt="User Avatar"
                      className="drawer-settings-avatar"
                    />
                    <label className="drawer-settings-avatar-upload">
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          const file = e.target.files[0]
                          if (file) {
                            const reader = new window.FileReader()
                            reader.onload = (ev) => {
                              _handleProfileChange({
                                target: {
                                  name: 'avatar',
                                  value: ev.target.result,
                                },
                              })
                            }
                            reader.readAsDataURL(file)
                          }
                        }}
                      />
                      <span>Change</span>
                    </label>
                  </div>
                  <div className="drawer-settings-user-info">
                    <div className="drawer-settings-user-name">
                      {_editProfile.name || 'Your Name'}
                    </div>
                    <div className="drawer-settings-user-email">
                      {_editProfile.email || 'your@email.com'}
                    </div>
                  </div>
                </div>
                <div className="drawer-settings-form">
                  <label>Name</label>
                  <input
                    name="name"
                    value={_editProfile.name}
                    onChange={_handleProfileChange}
                  />
                  <label>Email</label>
                  <input
                    name="email"
                    value={_editProfile.email}
                    onChange={_handleProfileChange}
                  />
                  <div className="drawer-settings-darkmode-row">
                    <span>Dark Mode</span>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={_theme === 'dark'}
                        onChange={(e) =>
                          _handleThemeChange(
                            e.target.checked ? 'dark' : 'light',
                          )
                        }
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                  <button
                    className="drawer-action-btn save-btn"
                    onClick={_saveProfile}
                  >
                    Save
                  </button>
                </div>
              </>
            )}
            {drawerView === 'theme' && (
              <>
                <button className="drawer-back-btn" onClick={backToMain}>
                  ← Back
                </button>
                <div className="drawer-section-title">Theme Color</div>
                <div className="drawer-theme-options">
                  {THEME_OPTIONS.map((opt) => (
                    <button
                      key={opt.key}
                      className={`${opt.className}${
                        _theme === opt.key ? ' active' : ''
                      }`}
                      onClick={() => _handleThemeChange(opt.key)}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
      {/* Desktop/tablet contact list */}
      <aside className="contact-list">
        <div className="contact-list-header">
          <span>Contacts</span>
          {/* Modern notification badge for new messages from Alice (desktop) */}
          {showAliceNotif && (
            <div
              className="notif-badge notif-badge-desktop"
              role="status"
              aria-live="polite"
              tabIndex={0}
              style={{
                display: 'flex',
                alignItems: 'center',
                background: 'linear-gradient(90deg, #ff5e62 0%, #ff9966 100%)',
                color: '#fff',
                borderRadius: '50%',
                padding: '0.08rem 0.7rem',
                fontWeight: 900,
                fontSize: '0.92rem',
                boxShadow: '0 2px 8px #ff5e6244',
                marginLeft: '0.7rem',
                cursor: 'pointer',
                position: 'relative',
                zIndex: 2,
                outline: 'none',
                minWidth: '1.5rem',
                justifyContent: 'center',
                height: '1.5rem',
              }}
              onClick={() => {
                setUnseenAlice(false)
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') setUnseenAlice(false)
              }}
            >
              1
            </div>
          )}
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <button
              className="add-friend-btn"
              title="Add Friend"
              aria-label="Add Friend"
              onClick={() => {
                _setShowAddContact(true)
                if (
                  typeof setDrawerView === 'function' &&
                  typeof setDrawerOpen === 'function'
                ) {
                  setDrawerView('contacts')
                  setDrawerOpen(true)
                }
              }}
            >
              +
            </button>
            {/* Settings and Theme buttons for desktop/tablet */}
            <button
              className="settings-btn"
              title="Settings"
              aria-label="Settings"
              onClick={openSettings}
            >
              <span aria-hidden="true">⚙️</span>
            </button>
            <button
              className="theme-btn"
              title="Theme"
              aria-label="Theme"
              onClick={openTheme}
            >
              <span aria-hidden="true">🎨</span>
            </button>
          </div>
        </div>
        {/* Add contact form for desktop/tablet */}
        {_showAddContact && (
          <div className="add-contact-form">
            <label>Name</label>
            <input
              name="name"
              value={_newContact.name}
              onChange={_handleAddContactChange}
              placeholder="Contact Name"
              ref={addContactNameRef}
              autoFocus
            />
            <label>Email</label>
            <input
              name="email"
              value={_newContact.email}
              onChange={_handleAddContactChange}
              placeholder="Contact Email"
            />
            <button
              className="drawer-action-btn save-btn"
              onClick={_handleAddContact}
            >
              Add
            </button>
            <button
              className="drawer-back-btn"
              onClick={() => _setShowAddContact(false)}
            >
              Cancel
            </button>
          </div>
        )}
        <ul>
          {contacts.map((contact) => (
            <li
              key={contact.id}
              className={
                (contact.online ? 'online' : 'offline') +
                (activeContact && activeContact.id === contact.id
                  ? ' active'
                  : '')
              }
              onClick={() => {
                onSelectContact && onSelectContact(contact)
                // If Alice is clicked, clear the notification
                if (contact.name === 'Alice' && unseenAlice)
                  setUnseenAlice(false)
              }}
              tabIndex={0}
              role="button"
              aria-pressed={activeContact && activeContact.id === contact.id}
              aria-label={`Open chat with ${contact.name}${
                contact.online ? ', online' : ', offline'
              }`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onSelectContact && onSelectContact(contact)
                  if (contact.name === 'Alice' && unseenAlice)
                    setUnseenAlice(false)
                }
              }}
            >
              <img
                src={contact.avatar}
                alt={contact.name}
                className="contact-avatar"
              />
              <span
                className="contact-name"
                style={{ position: 'relative', display: 'inline-block' }}
              >
                {contact.name}
                {/* Telegram-style badge for Alice if unseen */}
                {contact.name === 'Alice' && showAliceNotif && (
                  <span
                    className="notif-badge-telegram"
                    aria-label="Unseen message"
                    style={{
                      position: 'absolute',
                      top: '-0.45em',
                      right: '-1.1em',
                      minWidth: '1.5em',
                      height: '1.5em',
                      background:
                        'linear-gradient(90deg, #3a7bd5 0%, #00d2ff 100%)',
                      color: '#fff',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '0.95em',
                      boxShadow: '0 2px 8px #3a7bd533',
                      zIndex: 3,
                      padding: '0 0.5em',
                      border: '2px solid #fff',
                      pointerEvents: 'none',
                    }}
                  >
                    1
                  </span>
                )}
              </span>
              <span
                className="status-dot"
                title={contact.online ? 'Online' : 'Offline'}
                aria-label={contact.online ? 'Online' : 'Offline'}
              ></span>
            </li>
          ))}
        </ul>
      </aside>
      {/* Desktop/tablet settings and theme drawers */}
      {drawerOpen && (drawerView === 'settings' || drawerView === 'theme') && (
        <div
          className="contact-list-desktop-drawer-overlay"
          onClick={handleDrawerClose}
        >
          <div className="drawer-content" onClick={(e) => e.stopPropagation()}>
            <button className="drawer-close-btn" onClick={handleDrawerClose}>
              &times;
            </button>
            {drawerView === 'settings' && (
              <>
                <button className="drawer-back-btn" onClick={backToMain}>
                  ← Back
                </button>
                <div className="drawer-section-title">User Settings</div>
                <div className="drawer-settings-user">
                  <div className="drawer-settings-avatar-wrap">
                    <img
                      src={_editProfile.avatar || '/image.png'}
                      alt="User Avatar"
                      className="drawer-settings-avatar"
                    />
                    <label className="drawer-settings-avatar-upload">
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          const file = e.target.files[0]
                          if (file) {
                            const reader = new window.FileReader()
                            reader.onload = (ev) => {
                              _handleProfileChange({
                                target: {
                                  name: 'avatar',
                                  value: ev.target.result,
                                },
                              })
                            }
                            reader.readAsDataURL(file)
                          }
                        }}
                      />
                      <span>Change</span>
                    </label>
                  </div>
                  <div className="drawer-settings-user-info">
                    <div className="drawer-settings-user-name">
                      {_editProfile.name || 'Your Name'}
                    </div>
                    <div className="drawer-settings-user-email">
                      {_editProfile.email || 'your@email.com'}
                    </div>
                  </div>
                </div>
                <div className="drawer-settings-form">
                  <label>Name</label>
                  <input
                    name="name"
                    value={_editProfile.name}
                    onChange={_handleProfileChange}
                  />
                  <label>Email</label>
                  <input
                    name="email"
                    value={_editProfile.email}
                    onChange={_handleProfileChange}
                  />
                  <div className="drawer-settings-darkmode-row">
                    <span>Dark Mode</span>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={_theme === 'dark'}
                        onChange={(e) =>
                          _handleThemeChange(
                            e.target.checked ? 'dark' : 'light',
                          )
                        }
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                  <button
                    className="drawer-action-btn save-btn"
                    onClick={_saveProfile}
                  >
                    Save
                  </button>
                </div>
              </>
            )}
            {drawerView === 'theme' && (
              <>
                <button className="drawer-back-btn" onClick={backToMain}>
                  ← Back
                </button>
                <div className="drawer-section-title">Theme Color</div>
                <div className="drawer-theme-options">
                  {THEME_OPTIONS.map((opt) => (
                    <button
                      key={opt.key}
                      className={`${opt.className}${
                        _theme === opt.key ? ' active' : ''
                      }`}
                      onClick={() => _handleThemeChange(opt.key)}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default ContactList

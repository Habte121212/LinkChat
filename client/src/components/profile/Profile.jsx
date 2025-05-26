import React, { useState, useRef } from 'react'
import './Profile.scss'

const Profile = ({ profile, setProfile, onClose }) => {
  const [editMode, setEditMode] = useState(false)
  const [editBio, setEditBio] = useState(profile.bio)
  const fileInputRef = useRef(null)

  const handleEdit = () => setEditMode(true)
  const handleSave = () => {
    setProfile({ ...profile, bio: editBio })
    setEditMode(false)
  }
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (ev) => {
        setProfile({ ...profile, avatar: ev.target.result })
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="profile-modal">
      <div className="profile-modal-content">
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>
        <div className="profile-modal-avatar-section">
          <img
            className="profile-modal-avatar"
            src={profile.avatar}
            alt="Profile"
          />
          <button
            className="edit-img-btn"
            onClick={() => fileInputRef.current.click()}
            title="Change Image"
          >
            ✏️
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleImageChange}
          />
        </div>
        <h3>{profile.name}</h3>
        <span className={`profile-status ${profile.status.toLowerCase()}`}>
          {profile.status}
        </span>
        <div className="profile-bio-section">
          <label>Bio:</label>
          {editMode ? (
            <div>
              <textarea
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
              />
              <button className="save-btn" onClick={handleSave}>
                Save
              </button>
            </div>
          ) : (
            <div>
              <p>{profile.bio}</p>
              <button className="edit-btn" onClick={handleEdit}>
                Edit
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile

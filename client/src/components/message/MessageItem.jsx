import React from 'react'
import './MessageItem.scss'

const MessageItem = ({ type, sender, avatar, content, time }) => {
  // type: 'sent' | 'received' | 'call-info'
  // content: { text?, image?, callType? }
  return (
    <div
      className={`message-item ${type}${
        type === 'call-info' ? ' call-info' : ''
      }`}
    >
      {type !== 'sent' && avatar && (
        <img className="message-avatar" src={avatar} alt={sender} />
      )}
      <div className="message-content">
        {content.text && <span className="message-text">{content.text}</span>}
        {content.image && (
          <img className="shared-image" src={content.image} alt="Shared" />
        )}
        {type === 'call-info' && content.callType && (
          <>
            <span
              className="call-icon"
              role="img"
              aria-label={content.callType}
            >
              {content.callType === 'video' ? '📹' : '📞'}
            </span>
            <span className="call-text">
              You started a {content.callType === 'video' ? 'video' : 'voice'}{' '}
              call
            </span>
          </>
        )}
        <span className="message-time">{time}</span>
      </div>
    </div>
  )
}

export default MessageItem

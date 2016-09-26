import React from 'react';

const IPMessage = ({ author, body, timestamp}) => {
  let timeString = timestamp.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });

  return(
    <div className="chat-message-container">
      <div className="chat-message-header">
        <div className="chat-message-author">{author}</div>
        <div className="chat-message-timestamp">{` - ${timeString}`}</div>
      </div>
      <div className="chat-message-body">{body}</div>
    </div>
  );
};

export default IPMessage;

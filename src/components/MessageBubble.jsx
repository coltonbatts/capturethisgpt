import React from 'react';

const MessageBubble = ({ message, isUser, isTyping = false }) => {
  return (
    <div 
      className={`message-bubble py-6 px-4 ${!isUser ? 'border-b' : ''}`}
      style={{ 
        backgroundColor: isUser ? 'var(--user-bg)' : 'var(--assistant-bg)',
        borderColor: 'var(--border-light)'
      }}
    >
      <div className="max-w-3xl mx-auto flex gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {isUser ? (
            <div 
              className="w-8 h-8 rounded-sm flex items-center justify-center text-white font-medium text-sm"
              style={{ backgroundColor: 'var(--text-primary)' }}
            >
              U
            </div>
          ) : (
            <div 
              className="w-8 h-8 rounded-sm flex items-center justify-center text-white font-medium text-sm"
              style={{ backgroundColor: 'var(--brand-color)' }}
            >
              CT
            </div>
          )}
        </div>

        {/* Message Content */}
        <div className="flex-1 min-w-0">
          {isTyping ? (
            <div className="flex items-center">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          ) : (
            <div 
              className="prose prose-sm max-w-none"
              style={{ color: 'var(--text-primary)' }}
            >
              <div className="whitespace-pre-wrap break-words leading-relaxed">
                {message}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble; 
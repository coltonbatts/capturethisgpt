import React, { useState } from 'react';

const PromptInput = ({ onSendMessage, disabled = false, placeholder = "Ask anything" }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div 
        className="relative flex items-end rounded-3xl border shadow-sm bg-white"
        style={{ 
          borderColor: 'var(--border-medium)',
          minHeight: '52px'
        }}
      >
        {/* Attachment Button */}
        <div className="flex items-end pl-4 pb-3">
          <button
            type="button"
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            disabled={disabled}
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </button>
        </div>

        {/* Input Field */}
        <div className="flex-1 py-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            className="w-full resize-none bg-transparent text-base border-none outline-none placeholder-gray-500"
            style={{ 
              color: '#0d0d0d',
              lineHeight: '24px'
            }}
            onInput={(e) => {
              e.target.style.height = 'auto';
              e.target.style.height = Math.min(e.target.scrollHeight, 200) + 'px';
            }}
          />
        </div>
        
        {/* Right Side Buttons */}
        <div className="flex items-end pr-2 pb-2 gap-1">
          {/* Tools Button - when empty */}
          {!input.trim() && (
            <button
              type="button"
              className="flex items-center gap-1 px-3 py-2 rounded-lg border hover:bg-gray-50 transition-colors text-sm"
              style={{ borderColor: '#d1d5db' }}
              disabled={disabled}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
              <span className="text-gray-600">Tools</span>
            </button>
          )}

          {/* Voice Input Button */}
          <button
            type="button"
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            disabled={disabled}
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </button>

          {/* Send Button */}
          <button
            type="submit"
            disabled={!input.trim() || disabled}
            className="p-2 rounded-lg transition-all duration-200"
            style={{
              backgroundColor: input.trim() && !disabled ? '#0d0d0d' : '#f0f0f0',
              color: input.trim() && !disabled ? 'white' : '#8e8ea0'
            }}
          >
            <svg 
              className="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" 
              />
            </svg>
          </button>
        </div>
      </div>
    </form>
  );
};

export default PromptInput; 
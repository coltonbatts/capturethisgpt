import React, { useState, useRef, useEffect, useCallback } from 'react';
import MessageBubble from './MessageBubble';
import PromptInput from './PromptInput';
import { queryGPT } from '../lib/api';
import { PRESET_BUTTONS } from '../lib/prompts';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark like ChatGPT
  const [chatHistory, setChatHistory] = useState([
    { id: 1, title: "Frame.io feedback analysis", timestamp: "Today", messages: [] },
    { id: 2, title: "Client email drafting", timestamp: "Today", messages: [] },
    { id: 3, title: "Production workflow SOPs", timestamp: "Yesterday", messages: [] },
    { id: 4, title: "Color correction guidelines", timestamp: "Yesterday", messages: [] },
    { id: 5, title: "Equipment maintenance", timestamp: "Previous 7 Days", messages: [] },
  ]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Apply theme to document
    if (isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [isDarkMode]);

  const saveCurrentChat = useCallback(() => {
    if (currentChatId && messages.length > 0) {
      setChatHistory(prev => prev.map(chat => 
        chat.id === currentChatId 
          ? { ...chat, messages: [...messages] }
          : chat
      ));
    }
  }, [currentChatId, messages, setChatHistory]);

  useEffect(() => {
    // Auto-save current chat when messages change
    if (currentChatId && messages.length > 0) {
      const timer = setTimeout(() => {
        saveCurrentChat();
      }, 1000); // Save after 1 second of inactivity
      
      return () => clearTimeout(timer);
    }
  }, [messages, currentChatId, saveCurrentChat]);

  const handleSendMessage = async (message) => {
    if (!message.trim()) return;

    // If this is the first message, initialize with welcome
    if (messages.length === 0) {
      const welcomeMessage = {
        id: Date.now() - 1,
        text: "Hello! I'm Capture This GPT, your AI assistant for video production. I can help you analyze Frame.io feedback, draft client communications, answer questions about SOPs, and assist with general production workflows.",
        isUser: false,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }

    // Add user message
    const userMessage = {
      id: Date.now(),
      text: message,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Determine if we should use company context
      const useCompanyContext = selectedPreset?.id === 'sop' || 
        message.toLowerCase().includes('sop') || 
        message.toLowerCase().includes('procedure') ||
        message.toLowerCase().includes('workflow');

      // Construct prompt based on preset if any
      let finalPrompt = message;
      if (selectedPreset) {
        finalPrompt = selectedPreset.prompt + message;
      }

      const response = await queryGPT(finalPrompt, useCompanyContext);

      // Add AI response
      const aiMessage = {
        id: Date.now() + 1,
        text: response,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      
      // Add to chat history if this is a new chat
      if (!currentChatId) {
        const newChatId = Date.now() + 2;
        const newChat = {
          id: newChatId,
          title: message.substring(0, 30) + (message.length > 30 ? '...' : ''),
          timestamp: "Today",
          messages: [userMessage, aiMessage]
        };
        setChatHistory(prev => [newChat, ...prev]);
        setCurrentChatId(newChatId);
      } else {
        // Save current chat with updated messages
        saveCurrentChat();
      }

    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: "I apologize, but I encountered an error. Please check your API key configuration and try again.",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setSelectedPreset(null);
    }
  };

  const handlePresetClick = (preset) => {
    setSelectedPreset(preset);
  };

  const startNewChat = () => {
    setMessages([]);
    setSelectedPreset(null);
    setCurrentChatId(null);
  };

  const loadChat = (chatId) => {
    const chat = chatHistory.find(c => c.id === chatId);
    if (chat) {
      setMessages(chat.messages);
      setCurrentChatId(chatId);
      setSelectedPreset(null);
    }
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
    if (!showSearch) {
      setSearchTerm('');
    }
  };

  const openLibrary = () => {
    // Future: Open a modal or navigate to library view
    alert('Library feature coming soon! This will show saved prompts and templates.');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className="flex h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Sidebar - ChatGPT Style */}
      <div 
        className={`${sidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 overflow-hidden`}
        style={{ backgroundColor: '#171717' }}
      >
        <div className="flex flex-col h-full text-white">
          {/* Sidebar Header */}
          <div className="p-3 border-b border-gray-700">
            <button
              onClick={startNewChat}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-sm font-medium">New chat</span>
            </button>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto p-2">
            <div className="space-y-1">
              <button 
                onClick={toggleSearch}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors text-left ${showSearch ? 'bg-gray-700' : ''}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="text-sm">Search chats</span>
              </button>
              
              {showSearch && (
                <div className="px-3 py-2">
                  <input
                    type="text"
                    placeholder="Search your chats..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 text-white rounded-lg text-sm border border-gray-600 focus:border-gray-400 focus:outline-none"
                  />
                </div>
              )}
              
              <button 
                onClick={openLibrary}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors text-left"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <span className="text-sm">Library</span>
              </button>
            </div>

            {/* Chat History */}
            <div className="mt-4">
              {['Today', 'Yesterday', 'Previous 7 Days'].map(period => {
                const filteredChats = chatHistory.filter(chat => {
                  const matchesPeriod = chat.timestamp === period;
                  const matchesSearch = !searchTerm || chat.title.toLowerCase().includes(searchTerm.toLowerCase());
                  return matchesPeriod && matchesSearch;
                });

                if (filteredChats.length === 0) return null;

                return (
                  <div key={period}>
                    <div className="text-xs text-gray-400 px-3 py-2 font-medium mt-4 first:mt-0">{period}</div>
                    {filteredChats.map(chat => (
                      <button 
                        key={chat.id} 
                        onClick={() => loadChat(chat.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors group relative ${
                          currentChatId === chat.id ? 'bg-gray-700' : ''
                        }`}
                      >
                        <div className="text-sm text-gray-200 truncate pr-6">{chat.title}</div>
                        {currentChatId === chat.id && (
                          <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                );
              })}
              
              {searchTerm && chatHistory.filter(chat => 
                chat.title.toLowerCase().includes(searchTerm.toLowerCase())
              ).length === 0 && (
                <div className="px-3 py-4 text-center text-gray-400 text-sm">
                  No chats found matching "{searchTerm}"
                </div>
              )}
            </div>
          </div>

          {/* User Profile */}
          <div className="p-3 border-t border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img 
                  src="/ct-logo.png" 
                  alt="Capture This" 
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="text-sm text-gray-200">Capture This Team</span>
              </div>
              <button
                onClick={toggleTheme}
                className="p-1.5 rounded-lg hover:bg-gray-700 transition-colors"
                title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDarkMode ? (
                  <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b px-4 py-3 flex items-center justify-between" style={{ 
          borderColor: 'var(--border-light)', 
          backgroundColor: 'var(--bg-primary)' 
        }}>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSidebar}
              className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <div className="flex items-center gap-2">
              <img 
                src="/ct-logo.png" 
                alt="Capture This" 
                className="w-8 h-8 rounded-lg object-cover"
              />
              <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                Capture This GPT
              </span>
              <span className="text-xs px-2 py-1 rounded-full" style={{ 
                backgroundColor: 'var(--bg-secondary)', 
                color: 'var(--text-secondary)' 
              }}>
                4o
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Chat Messages or Empty State */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            // Empty State - Centered ChatGPT Style
            <div className="h-full flex flex-col items-center justify-center text-center px-4">
              <div className="w-full max-w-3xl">
                <h1 className="text-3xl font-medium mb-8" style={{ color: 'var(--text-primary)' }}>
                  Ready when you are.
                </h1>
                
                {/* Centered Input */}
                <div className="mb-8">
                  <PromptInput
                    onSendMessage={handleSendMessage}
                    disabled={isLoading}
                    placeholder={
                      selectedPreset 
                        ? selectedPreset.placeholder 
                        : "Ask anything"
                    }
                  />
                  
                  {/* Selected Preset Indicator */}
                  {selectedPreset && (
                    <div className="mt-2 flex items-center justify-between text-sm" style={{ color: 'var(--text-secondary)' }}>
                      <span>Using template: {selectedPreset.label}</span>
                      <button
                        onClick={() => setSelectedPreset(null)}
                        className="hover:underline"
                        style={{ color: 'var(--brand-color)' }}
                      >
                        Clear
                      </button>
                    </div>
                  )}
                  
                  <div className="text-xs text-center mt-2" style={{ color: 'var(--text-secondary)' }}>
                    Capture This GPT can make mistakes. Consider checking important information.
                  </div>
                </div>
                
                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-2xl mx-auto">
                  {PRESET_BUTTONS.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => handlePresetClick(preset)}
                      className="p-4 text-left rounded-xl border hover:border-gray-400 transition-colors"
                      style={{
                        backgroundColor: 'var(--bg-tertiary)',
                        borderColor: 'var(--border-light)',
                        color: 'var(--text-primary)'
                      }}
                    >
                      <div className="font-medium text-sm mb-2">{preset.label}</div>
                      <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                        {preset.placeholder}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            // Messages + Input at bottom
            <div className="h-full flex flex-col">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto">
                <div className="max-w-4xl mx-auto w-full">
                  {messages.map((message) => (
                    <MessageBubble
                      key={message.id}
                      message={message.text}
                      isUser={message.isUser}
                    />
                  ))}
                  
                  {isLoading && (
                    <MessageBubble
                      message=""
                      isUser={false}
                      isTyping={true}
                    />
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              </div>
              
              {/* Input Area - Bottom when messages exist */}
              <div className="border-t p-4" style={{ 
                borderColor: 'var(--border-light)', 
                backgroundColor: 'var(--bg-primary)' 
              }}>
                <div className="max-w-4xl mx-auto">
                  <PromptInput
                    onSendMessage={handleSendMessage}
                    disabled={isLoading}
                    placeholder={
                      selectedPreset 
                        ? selectedPreset.placeholder 
                        : "Ask anything"
                    }
                  />
                  
                  {/* Selected Preset Indicator */}
                  {selectedPreset && (
                    <div className="mt-2 flex items-center justify-between text-sm" style={{ color: 'var(--text-secondary)' }}>
                      <span>Using template: {selectedPreset.label}</span>
                      <button
                        onClick={() => setSelectedPreset(null)}
                        className="hover:underline"
                        style={{ color: 'var(--brand-color)' }}
                      >
                        Clear
                      </button>
                    </div>
                  )}
                  
                  <div className="text-xs text-center mt-2" style={{ color: 'var(--text-secondary)' }}>
                    Capture This GPT can make mistakes. Consider checking important information.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatInterface; 
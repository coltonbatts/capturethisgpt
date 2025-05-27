import React, { useState, useRef, useEffect, useCallback } from 'react';
import MessageBubble from './MessageBubble';
import PromptInput from './PromptInput';
import ModelSwitcher from './ModelSwitcher';
import { queryGPT } from '../lib/api';
import { PRESET_BUTTONS } from '../lib/prompts';
import { DEFAULT_MODEL } from '../lib/models';

// Utility functions for localStorage persistence
const STORAGE_KEY = 'captureThisGPT_chatHistory';
const SETTINGS_KEY = 'captureThisGPT_settings';

const saveChatHistoryToStorage = (chatHistory) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chatHistory));
  } catch (error) {
    console.error('Failed to save chat history to localStorage:', error);
  }
};

const loadChatHistoryFromStorage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load chat history from localStorage:', error);
    return [];
  }
};

const saveSettingsToStorage = (settings) => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save settings to localStorage:', error);
  }
};

const loadSettingsFromStorage = () => {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    // Check if we're on mobile (screen width < 768px)
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const defaultSidebarOpen = !isMobile; // Collapsed on mobile, open on desktop
    
    return stored ? JSON.parse(stored) : { 
      isDarkMode: true, 
      sidebarOpen: defaultSidebarOpen,
      selectedModel: DEFAULT_MODEL 
    };
  } catch (error) {
    console.error('Failed to load settings from localStorage:', error);
    // Check if we're on mobile for error fallback too
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    return { 
      isDarkMode: true, 
      sidebarOpen: !isMobile,
      selectedModel: DEFAULT_MODEL 
    };
  }
};

// Helper function to format timestamps
const formatTimestamp = (date) => {
  const now = new Date();
  const messageDate = new Date(date);
  const diffInDays = Math.floor((now - messageDate) / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays <= 7) return 'Previous 7 Days';
  if (diffInDays <= 30) return 'Previous 30 Days';
  return 'Older';
};

// Helper function to generate a smart title from the first message
const generateChatTitle = (firstMessage) => {
  if (!firstMessage || !firstMessage.trim()) return 'New Chat';
  
  // Clean up the message and create a concise title
  const cleaned = firstMessage.trim();
  if (cleaned.length <= 40) return cleaned;
  
  // Find a good break point near 40 characters
  const truncated = cleaned.substring(0, 40);
  const lastSpace = truncated.lastIndexOf(' ');
  
  return lastSpace > 20 ? truncated.substring(0, lastSpace) + '...' : truncated + '...';
};

const ChatInterface = () => {
  // Load persisted settings
  const [settings, setSettings] = useState(loadSettingsFromStorage());
  
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [selectedModel, setSelectedModel] = useState(settings.selectedModel);
  const [isDarkMode, setIsDarkMode] = useState(settings.isDarkMode);
  const [chatHistory, setChatHistory] = useState(loadChatHistoryFromStorage());
  const [sidebarOpen, setSidebarOpen] = useState(settings.sidebarOpen);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const messagesEndRef = useRef(null);

  // Save settings whenever they change
  useEffect(() => {
    const newSettings = {
      isDarkMode,
      sidebarOpen,
      selectedModel
    };
    setSettings(newSettings);
    saveSettingsToStorage(newSettings);
  }, [isDarkMode, sidebarOpen, selectedModel]);

  // Save chat history whenever it changes
  useEffect(() => {
    saveChatHistoryToStorage(chatHistory);
  }, [chatHistory]);

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

  // Handle responsive sidebar behavior
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      if (isMobile && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Check initial size
    handleResize();

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarOpen]);

  const saveCurrentChat = useCallback(() => {
    if (currentChatId && messages.length > 0) {
      setChatHistory(prev => prev.map(chat => 
        chat.id === currentChatId 
          ? { 
              ...chat, 
              messages: [...messages],
              updatedAt: new Date().toISOString(),
              // Update title if it's still generic and we have a first user message
              title: chat.title === 'New Chat' && messages.length > 0 && messages[0].isUser 
                ? generateChatTitle(messages[0].text)
                : chat.title
            }
          : chat
      ));
    }
  }, [currentChatId, messages]);

  // Auto-save current chat when messages change
  useEffect(() => {
    if (currentChatId && messages.length > 0) {
      const timer = setTimeout(() => {
        saveCurrentChat();
      }, 500); // Save after 500ms of inactivity for better performance
      
      return () => clearTimeout(timer);
    }
  }, [messages, currentChatId, saveCurrentChat]);

  const handleSendMessage = async (message) => {
    if (!message.trim()) return;

    let currentMessages = [...messages];

    // If this is the first message, initialize with welcome
    if (currentMessages.length === 0) {
      const welcomeMessage = {
        id: Date.now() - 1,
        text: "Hello! I'm Capture This GPT, your AI assistant for video production. I can help you analyze Frame.io feedback, draft client communications, answer questions about SOPs, and assist with general production workflows.",
        isUser: false,
        timestamp: new Date().toISOString()
      };
      currentMessages.push(welcomeMessage);
      setMessages(currentMessages);
    }

    // Add user message
    const userMessage = {
      id: Date.now(),
      text: message,
      isUser: true,
      timestamp: new Date().toISOString()
    };

    currentMessages.push(userMessage);
    setMessages(currentMessages);
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

      const response = await queryGPT(finalPrompt, useCompanyContext, selectedModel);

      // Add AI response
      const aiMessage = {
        id: Date.now() + 1,
        text: response,
        isUser: false,
        timestamp: new Date().toISOString()
      };

      const updatedMessages = [...currentMessages, aiMessage];
      setMessages(updatedMessages);
      
      // Create or update chat in history
      if (!currentChatId) {
        // Create new chat
        const newChatId = Date.now() + 2;
        const chatTitle = generateChatTitle(message);
        const newChat = {
          id: newChatId,
          title: chatTitle,
          timestamp: formatTimestamp(new Date()),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          messages: updatedMessages
        };
        setChatHistory(prev => [newChat, ...prev]);
        setCurrentChatId(newChatId);
      } else {
        // Update existing chat
        setChatHistory(prev => prev.map(chat => 
          chat.id === currentChatId 
            ? { 
                ...chat, 
                messages: updatedMessages,
                updatedAt: new Date().toISOString(),
                timestamp: formatTimestamp(new Date())
              }
            : chat
        ));
      }

    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: "I apologize, but I encountered an error. Please check your API key configuration and try again.",
        isUser: false,
        timestamp: new Date().toISOString()
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
    // Save current chat before starting new one
    if (currentChatId && messages.length > 0) {
      saveCurrentChat();
    }
    
    setMessages([]);
    setSelectedPreset(null);
    setCurrentChatId(null);
  };

  const handleModelChange = (modelId) => {
    setSelectedModel(modelId);
  };

  const loadChat = (chatId) => {
    // Save current chat before switching
    if (currentChatId && messages.length > 0) {
      saveCurrentChat();
    }
    
    const chat = chatHistory.find(c => c.id === chatId);
    if (chat) {
      setMessages(chat.messages || []);
      setCurrentChatId(chatId);
      setSelectedPreset(null);
      
      // Update timestamp to reflect recent access
      setChatHistory(prev => prev.map(c => 
        c.id === chatId 
          ? { ...c, timestamp: formatTimestamp(new Date()) }
          : c
      ));
    }
  };

  const deleteChat = (chatId, event) => {
    event.stopPropagation(); // Prevent loading the chat when delete is clicked
    
    setChatHistory(prev => prev.filter(chat => chat.id !== chatId));
    
    // If we're deleting the current chat, start a new one
    if (currentChatId === chatId) {
      setMessages([]);
      setCurrentChatId(null);
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

  // Group chats by time period for better organization
  const groupedChats = chatHistory.reduce((groups, chat) => {
    const period = chat.timestamp;
    if (!groups[period]) {
      groups[period] = [];
    }
    groups[period].push(chat);
    return groups;
  }, {});

  // Sort periods by recency
  const sortedPeriods = ['Today', 'Yesterday', 'Previous 7 Days', 'Previous 30 Days', 'Older']
    .filter(period => groupedChats[period]?.length > 0);

  return (
    <div className="flex h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar - ChatGPT Style */}
      <div 
        className={`${sidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 overflow-hidden relative z-50 md:relative md:z-auto ${sidebarOpen ? 'fixed md:relative' : ''}`}
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
              {chatHistory.length === 0 ? (
                <div className="px-3 py-4 text-center text-gray-400 text-sm">
                  No chat history yet.<br />Start a conversation to see it here.
                </div>
              ) : (
                sortedPeriods.map(period => {
                  const filteredChats = groupedChats[period].filter(chat => {
                    const matchesSearch = !searchTerm || chat.title.toLowerCase().includes(searchTerm.toLowerCase());
                    return matchesSearch;
                  });

                  if (filteredChats.length === 0) return null;

                  return (
                    <div key={period}>
                      <div className="text-xs text-gray-400 px-3 py-2 font-medium mt-4 first:mt-0">{period}</div>
                      {filteredChats
                        .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
                        .map(chat => (
                          <div key={chat.id} className="relative group">
                            <button 
                              onClick={() => loadChat(chat.id)}
                              className={`w-full text-left px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors group-hover:pr-8 ${
                                currentChatId === chat.id ? 'bg-gray-700' : ''
                              }`}
                            >
                              <div className="text-sm text-gray-200 truncate">{chat.title}</div>
                              {currentChatId === chat.id && (
                                <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
                                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                </div>
                              )}
                            </button>
                            
                            {/* Delete button - shown on hover */}
                            <button
                              onClick={(e) => deleteChat(chat.id, e)}
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-600 rounded"
                              title="Delete chat"
                            >
                              <svg className="w-3 h-3 text-gray-400 hover:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                      ))}
                    </div>
                  );
                })
              )}
              
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
            
            <div className="flex items-center gap-3">
              <img 
                src="/ct-logo.png" 
                alt="Capture This" 
                className="w-8 h-8 rounded-lg object-cover"
              />
              <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                Capture This GPT
              </span>
              <ModelSwitcher 
                currentModel={selectedModel}
                onModelChange={handleModelChange}
                isDarkMode={isDarkMode}
              />
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
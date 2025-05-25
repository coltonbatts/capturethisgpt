import React, { useState, useRef, useEffect } from 'react';
import { AVAILABLE_MODELS, MODEL_CATEGORIES, getModelShortName } from '../lib/models';

const ModelSwitcher = ({ currentModel, onModelChange, isDarkMode = false, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleModelSelect = (modelId) => {
    onModelChange(modelId);
    setIsOpen(false);
  };

  const currentModelConfig = AVAILABLE_MODELS[currentModel];
  const shortName = getModelShortName(currentModel);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Model Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
        onMouseEnter={(e) => {
          if (!isOpen) {
            e.target.style.backgroundColor = isDarkMode ? '#374151' : '#f3f4f6';
          }
        }}
        onMouseLeave={(e) => {
          if (!isOpen) {
            e.target.style.backgroundColor = 'var(--bg-tertiary)';
          }
        }}
        style={{ 
          backgroundColor: isOpen ? 'var(--bg-secondary)' : 'var(--bg-tertiary)',
          color: 'var(--text-primary)',
          border: '1px solid var(--border-light)'
        }}
      >
        <span>{shortName}</span>
        <svg 
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div 
          className="absolute top-full left-0 mt-2 w-80 rounded-xl shadow-lg border z-50"
          style={{ 
            backgroundColor: 'var(--bg-primary)',
            borderColor: 'var(--border-light)'
          }}
        >
          <div className="p-4">
            <div className="text-sm font-medium mb-3" style={{ color: 'var(--text-primary)' }}>
              Choose model
            </div>
            
            {/* Current Model Info */}
            <div 
              className="p-3 rounded-lg mb-4 border"
              style={{ 
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-light)'
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                  {currentModelConfig?.name}
                </span>
                <span 
                  className="text-xs px-2 py-1 rounded-full"
                  style={{ 
                    backgroundColor: 'var(--brand-color)', 
                    color: 'white' 
                  }}
                >
                  Current
                </span>
              </div>
              <p className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>
                {currentModelConfig?.description}
              </p>
              <div className="flex gap-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
                <span>Cost: {currentModelConfig?.cost}</span>
                <span>Speed: {currentModelConfig?.speed}</span>
                <span>Tokens: {currentModelConfig?.maxTokens}</span>
              </div>
            </div>

            {/* Model Categories */}
            {Object.entries(MODEL_CATEGORIES).map(([categoryKey, category]) => (
              <div key={categoryKey} className="mb-4 last:mb-0">
                <div 
                  className="text-xs font-medium mb-2 uppercase tracking-wide"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {category.label}
                </div>
                
                {category.models.map((modelId) => {
                  const model = AVAILABLE_MODELS[modelId];
                  const isSelected = modelId === currentModel;
                  
                  return (
                    <button
                      key={modelId}
                      onClick={() => handleModelSelect(modelId)}
                      className={`w-full text-left p-3 rounded-lg transition-colors mb-1 ${
                        isSelected 
                          ? 'ring-2 ring-orange-500' 
                          : ''
                      }`}
                      onMouseEnter={(e) => {
                        if (!isSelected) {
                          e.target.style.backgroundColor = isDarkMode ? '#374151' : '#f9fafb';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) {
                          e.target.style.backgroundColor = 'transparent';
                        }
                      }}
                      style={{ 
                        backgroundColor: isSelected 
                          ? 'var(--bg-secondary)' 
                          : 'transparent',
                        borderColor: isSelected 
                          ? 'var(--brand-color)' 
                          : 'transparent'
                      }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span 
                          className="font-medium text-sm"
                          style={{ color: 'var(--text-primary)' }}
                        >
                          {model.name}
                        </span>
                        {isSelected && (
                          <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      
                      <p 
                        className="text-xs mb-2"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        {model.description}
                      </p>
                      
                      <div 
                        className="flex gap-3 text-xs"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        <span>Cost: {model.cost}</span>
                        <span>Speed: {model.speed}</span>
                        <span>Max tokens: {model.maxTokens}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            ))}
            
            {/* Footer */}
            <div 
              className="pt-3 mt-3 border-t text-xs"
              style={{ 
                borderColor: 'var(--border-light)',
                color: 'var(--text-secondary)' 
              }}
            >
              Model settings apply to new conversations. Existing chats maintain their original model.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelSwitcher; 
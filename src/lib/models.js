// AI Models Configuration
export const AVAILABLE_MODELS = {
  'gpt-4o': {
    id: 'gpt-4o',
    name: 'GPT-4o',
    description: 'Latest model with improved reasoning',
    provider: 'openai',
    maxTokens: 4000,
    temperature: 0.7,
    cost: 'Higher',
    speed: 'Fast'
  },
  'gpt-4': {
    id: 'gpt-4',
    name: 'GPT-4',
    description: 'Most capable model for complex tasks',
    provider: 'openai',
    maxTokens: 1000,
    temperature: 0.7,
    cost: 'High',
    speed: 'Slower'
  },
  'gpt-4-turbo': {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    description: 'Faster GPT-4 with larger context',
    provider: 'openai',
    maxTokens: 2000,
    temperature: 0.7,
    cost: 'Medium',
    speed: 'Medium'
  },
  'gpt-3.5-turbo': {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    description: 'Fast and efficient for most tasks',
    provider: 'openai',
    maxTokens: 1000,
    temperature: 0.7,
    cost: 'Low',
    speed: 'Fast'
  }
};

export const DEFAULT_MODEL = 'gpt-4o';

// Model categories for UI grouping
export const MODEL_CATEGORIES = {
  latest: {
    label: 'Latest',
    models: ['gpt-4o']
  },
  standard: {
    label: 'Standard',
    models: ['gpt-4', 'gpt-4-turbo']
  },
  efficient: {
    label: 'Efficient',
    models: ['gpt-3.5-turbo']
  }
};

// Get model display name for UI
export const getModelDisplayName = (modelId) => {
  return AVAILABLE_MODELS[modelId]?.name || modelId;
};

// Get short name for compact display
export const getModelShortName = (modelId) => {
  const shortcuts = {
    'gpt-4o': '4o',
    'gpt-4': '4',
    'gpt-4-turbo': '4T',
    'gpt-3.5-turbo': '3.5'
  };
  return shortcuts[modelId] || modelId;
}; 
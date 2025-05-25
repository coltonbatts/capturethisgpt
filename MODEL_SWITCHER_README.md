# Model Switcher Feature Documentation

## Overview

The Model Switcher feature allows users to dynamically switch between different OpenAI models during their chat sessions. This provides flexibility in choosing the right model for different types of tasks while being transparent about cost and performance trade-offs.

## Current Model Configuration

### How to Tell Which Model You're Using

1. **Header Display**: The current model is displayed as a clickable button in the header next to "Capture This GPT"
   - Shows shortened names: "4o" for GPT-4o, "4" for GPT-4, "4T" for GPT-4 Turbo, "3.5" for GPT-3.5 Turbo

2. **Model Dropdown**: Click the model button to see detailed information about the current model including:
   - Full model name
   - Description
   - Cost tier (Higher, High, Medium, Low)
   - Speed rating (Fast, Medium, Slower)
   - Maximum tokens allowed

## Available Models

### Latest Models
- **GPT-4o**: Latest model with improved reasoning
  - Cost: Higher
  - Speed: Fast
  - Max Tokens: 4000

### Standard Models
- **GPT-4**: Most capable model for complex tasks
  - Cost: High
  - Speed: Slower
  - Max Tokens: 1000

- **GPT-4 Turbo**: Faster GPT-4 with larger context
  - Cost: Medium
  - Speed: Medium
  - Max Tokens: 2000

### Efficient Models
- **GPT-3.5 Turbo**: Fast and efficient for most tasks
  - Cost: Low
  - Speed: Fast
  - Max Tokens: 1000

## How to Switch Models

1. **Click the Model Button**: In the header, click the current model indicator (e.g., "4o")

2. **Review Current Model**: The dropdown shows your current model with a "Current" badge and detailed specs

3. **Browse Available Models**: Models are organized by category (Latest, Standard, Efficient)

4. **Select New Model**: Click on any model to switch to it
   - Selected models show a checkmark
   - Hover effects provide visual feedback

5. **Immediate Effect**: Model changes apply to new conversations immediately

## Important Notes

### Conversation Behavior
- **New Chats**: Use the newly selected model
- **Existing Chats**: Continue using their original model for consistency
- **Model Persistence**: Each chat remembers which model it was started with

### Cost Considerations
- Higher-tier models (GPT-4o, GPT-4) cost more per token
- Consider using GPT-3.5 Turbo for simple tasks to save costs
- The interface clearly shows cost tiers to help you decide

### Performance Trade-offs
- **GPT-4o**: Best for complex reasoning, latest features
- **GPT-4**: Most reliable for complex tasks requiring high accuracy
- **GPT-4 Turbo**: Good balance of capability and speed
- **GPT-3.5 Turbo**: Best for fast, straightforward responses

## Implementation Details

### Files Modified
- `src/lib/models.js` - Model configuration and utilities
- `src/lib/api.js` - Updated to support dynamic model selection
- `src/components/ModelSwitcher.jsx` - New model switcher component
- `src/components/ChatInterface.jsx` - Integrated model switcher

### Configuration
Models are configured in `src/lib/models.js` with:
- Model ID (matches OpenAI API)
- Display name and description
- Cost and speed ratings
- Token limits and temperature settings

### API Integration
The `queryGPT` function now accepts a `selectedModel` parameter that:
- Defaults to the configured default model (GPT-4o)
- Uses model-specific settings (tokens, temperature)
- Validates model selection against available models

## Future Enhancements

### Potential Additions
- **Custom Models**: Support for fine-tuned or custom models
- **Model Presets**: Save model+prompt combinations
- **Usage Analytics**: Track token usage per model
- **Cost Estimation**: Real-time cost calculation
- **Model Comparison**: Side-by-side testing
- **Streaming Preferences**: Per-model streaming settings

### Accessibility
- Keyboard navigation for model selection
- Screen reader support for model descriptions
- High contrast mode support

## Troubleshooting

### Common Issues

**Model Not Available**
- Ensure your OpenAI API key has access to the selected model
- Some models may require special access or higher tier accounts

**Unexpected Costs**
- Monitor the cost indicators in the model switcher
- Consider using lower-cost models for testing and simple tasks

**Performance Issues**
- Slower models (GPT-4) may take longer to respond
- Consider GPT-4 Turbo or GPT-3.5 Turbo for faster responses

### Debug Information
- Model selection is logged to browser console
- API errors include model information
- Check browser network tab for API request details

## Best Practices

### Model Selection Strategy
1. **Simple Questions**: Use GPT-3.5 Turbo for speed and cost efficiency
2. **Complex Analysis**: Use GPT-4 or GPT-4o for best results
3. **Balanced Tasks**: Use GPT-4 Turbo for good performance at moderate cost
4. **Latest Features**: Use GPT-4o for cutting-edge capabilities

### Cost Management
- Start conversations with lower-cost models
- Upgrade to higher-tier models only when needed
- Monitor token usage through the interface indicators

### User Experience
- The model switcher maintains state across page refreshes
- Visual indicators make the current model always clear
- Hover states provide immediate feedback on model options 
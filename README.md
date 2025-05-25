# 🧠 Capture This GPT
![CT Smiley](https://i.ibb.co/CK4RjcCr/CT-Smiley-Sticker-Design-copy.png)

A branded, ChatGPT-style AI assistant designed specifically for the Capture This video production team. This application helps with Frame.io feedback analysis, client communications, and company SOP queries.

## ✨ Features

### Core Chat Experience
- **Intelligent Chat Interface** - Clean, ChatGPT-style UI with dark/light theme support
- **Professional AI Assistant** - Specialized for video production and client communication
- **Smart Message Handling** - Auto-scrolling, typing indicators, and error handling
- **Preset Templates** - Quick-start buttons for common workflows (Frame.io analysis, client emails, SOPs)

### Advanced Sidebar & Chat Management
- **Persistent Chat History** - Automatic saving to localStorage with no data loss
- **Smart Chat Organization** - Chats grouped by time periods (Today, Yesterday, Previous 7 Days, etc.)
- **Intelligent Chat Titles** - Auto-generated titles from first user message
- **Seamless Chat Switching** - Click any chat to instantly load full conversation history
- **Real-time Auto-save** - Messages saved automatically as you type (500ms debounce)
- **Chat Search** - Find any conversation instantly with built-in search
- **Chat Management** - Delete unwanted chats with hover-to-show delete buttons
- **Session Persistence** - Sidebar state, theme preferences, and model selection saved

### Professional Video Production Focus
- **Frame.io Integration** - Analyze client feedback and extract actionable insights
- **Client Communication** - Draft professional emails and project updates
- **SOP Knowledge Base** - Access company procedures and workflows
- **Multi-Model Support** - Switch between GPT models (GPT-4o, GPT-4, GPT-3.5 Turbo)

### User Experience Excellence
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **Keyboard Shortcuts** - Enter to send, Shift+Enter for new line
- **Visual Feedback** - Loading states, active chat indicators, hover effects
- **Theme Persistence** - Dark/light mode preference saved across sessions
- **Error Recovery** - Graceful handling of API errors with helpful messages

## 🛠 Tech Stack

- **Frontend**: React.js with functional components
- **Styling**: Tailwind CSS with custom brand colors
- **AI Integration**: OpenAI GPT-4 API
- **State Management**: React hooks (useState, useEffect)
- **Build Tool**: Create React App

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- OpenAI API key

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd CaptureThisGPT
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   REACT_APP_OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🔧 Configuration

### OpenAI API Key
1. Visit [OpenAI Platform](https://platform.openai.com)
2. Create an account or sign in
3. Generate a new API key
4. Add it to your `.env` file

### Customizing Company Knowledge
Edit `src/lib/prompts.js` to update:
- Company SOPs and procedures
- Contact information
- Workflow guidelines
- Common troubleshooting steps

## 📚 Usage

### Basic Chat
1. Type your question in the input field
2. Press Enter or click the send button
3. Receive AI-powered responses tailored to video production

### Navigation & Chat Management
1. **New Chat**: Click "New chat" in the sidebar to start fresh conversations
2. **Search Chats**: Click "Search chats" and type to filter your conversation history
3. **Load Previous Chats**: Click any chat in the history to continue where you left off
4. **Theme Toggle**: Use the sun/moon icon in the profile section to switch themes
5. **Auto-Save**: Conversations are automatically saved as you chat

### Using Preset Templates
1. Click on any of the quick action buttons:
   - "Summarize Frame.io Comments"
   - "Draft Client Email" 
   - "Company SOPs"
2. Follow the placeholder text guidance
3. Submit your specific content or question

### Frame.io Feedback Analysis
1. Click "Summarize Frame.io Comments"
2. Paste client feedback from Frame.io
3. Get structured analysis with:
   - Top 3 edit notes
   - Client tone assessment
   - Suggested next steps

## 🏗 Project Structure

```
src/
├── components/
│   ├── ChatInterface.jsx     # Main chat container with sidebar navigation
│   ├── MessageBubble.jsx     # Individual message display component
│   └── PromptInput.jsx       # User input component with submit handling
├── lib/
│   ├── api.js               # OpenAI API integration and context switching
│   └── prompts.js           # Preset templates and company knowledge base
├── App.js                   # Main application component
├── App.css                  # Additional component styles
├── index.css               # Tailwind directives and custom CSS variables
└── index.js                # React DOM render entry point
```

## 🎯 MVP Checklist

- [x] Chat-style interface with scrolling messages
- [x] Branded header (Capture This GPT logo and name)
- [x] Input field for natural language questions
- [x] Preset buttons for common workflows
- [x] Company knowledge base with SOPs
- [x] OpenAI GPT-4 integration
- [x] Responsive design with Tailwind CSS
- [x] Error handling for API calls
- [x] Loading states and typing indicators
- [x] Sidebar navigation with ChatGPT-style layout
- [x] Chat history persistence and management
- [x] Search functionality for filtering chats
- [x] Theme toggle (dark/light mode)
- [x] Auto-saving of conversations
- [x] Visual indicators for active chats

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on every commit

### Manual Build
```
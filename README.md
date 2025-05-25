# 🧠 Capture This GPT

A branded, ChatGPT-style AI assistant designed specifically for the Capture This video production team. This application helps with Frame.io feedback analysis, client communications, and company SOP queries.

![Capture This GPT Screenshot](https://via.placeholder.com/800x400/F97316/FFFFFF?text=Capture+This+GPT)

## ✨ Features

### 🎯 Core Functionality
- **Chat Interface**: Clean, modern ChatGPT-style conversation interface
- **AI-Powered Responses**: Integrated with OpenAI GPT-4 for intelligent responses
- **Preset Templates**: Quick-action buttons for common production tasks
- **Company Context**: Built-in knowledge base with SOPs and procedures
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### 🚀 Quick Actions
- **Summarize Frame.io Comments**: Analyze client feedback and extract key edit notes
- **Draft Client Email**: Generate professional client communication
- **Company SOPs**: Access internal procedures and workflow information

### 🎨 Design Features
- **Branded Interface**: Custom orange (#F97316) theme for Capture This
- **Dark Mode**: Professional dark theme optimized for video production work
- **Modern Typography**: Inter font for clean, readable text
- **Smooth Animations**: Typing indicators and smooth transitions

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
│   ├── ChatInterface.jsx     # Main chat container
│   ├── MessageBubble.jsx     # Individual message display
│   ├── PromptInput.jsx       # User input component
│   └── PresetPromptBar.jsx   # Quick action buttons
├── lib/
│   ├── api.js               # OpenAI API integration
│   └── prompts.js           # Templates and knowledge base
├── App.js                   # Main application component
├── index.css               # Tailwind directives and custom styles
└── index.js                # React DOM render
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

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on every commit

### Manual Build
```bash
npm run build
# Upload the `build` folder to your hosting provider
```

## 🔮 Future Enhancements

### Phase 2 Features
- [ ] File upload for documents and SOPs
- [ ] Chat history persistence (localStorage)
- [ ] User authentication for team members
- [ ] Frame.io API direct integration
- [ ] Google Drive document integration

### Phase 3 Features
- [ ] Voice input/output capabilities
- [ ] Advanced RAG with vector database
- [ ] Custom model fine-tuning
- [ ] Analytics and usage tracking
- [ ] Multi-language support

## 🛡 Security Notes

- API keys are stored in environment variables
- No sensitive data is logged or stored
- All API calls are made from the client side
- Consider implementing rate limiting for production

## 🐛 Troubleshooting

### Common Issues

**API Key Error**
- Ensure your OpenAI API key is correctly set in `.env`
- Verify the key has sufficient credits and permissions

**Styling Issues**
- Run `npm run build` to ensure Tailwind is compiled correctly
- Check that all Tailwind directives are properly imported

**Build Errors**
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Ensure all dependencies are compatible

## 📄 License

This project is for internal use by Capture This video production company.

## 🤝 Contributing

For internal team members:
1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

---

**Built with ❤️ for the Capture This team**

export const PROMPTS = {
  summarizeFeedback: `You're a production assistant for Capture This, a video production company. Summarize the following Frame.io client feedback into:
- Top 3 edit notes
- Client tone
- Suggested next steps

Feedback:
`,
  draftClientEmail: `Write a friendly, professional follow-up email to a client based on the following production notes. Keep it concise and action-oriented:

Notes:
`,
  sopQuery: `Based on our company SOPs and best practices at Capture This video production company, answer this question in a concise, helpful tone:

Question: `,
  general: `You are Capture This GPT, an AI assistant for Capture This video production company. You help with:
- Frame.io feedback analysis
- Client communication
- Production workflow questions
- Company SOPs and procedures

Please respond in a helpful, professional tone.

`
};

export const PRESET_BUTTONS = [
  {
    id: 'feedback',
    label: 'Summarize Frame.io Comments',
    prompt: PROMPTS.summarizeFeedback,
    placeholder: 'Paste Frame.io feedback here...'
  },
  {
    id: 'email',
    label: 'Draft Client Email',
    prompt: PROMPTS.draftClientEmail,
    placeholder: 'Describe the situation for the email...'
  },
  {
    id: 'sop',
    label: 'Company SOPs',
    prompt: PROMPTS.sopQuery,
    placeholder: 'Ask about our procedures, workflows, or policies...'
  }
];

// Company knowledge base (simulate uploaded SOPs)
export const COMPANY_KNOWLEDGE = `
# Capture This - Company SOPs and Knowledge Base

## Client Communication Guidelines
- Respond to client feedback within 24 hours
- Always acknowledge their input before providing solutions
- Use "we" language to show collaboration
- Provide realistic timelines with buffer time

## Frame.io Workflow
1. Upload rough cuts by end of business Tuesday
2. Client has 48 hours to provide feedback
3. Incorporate feedback and upload revision
4. Final approval needed before color/audio finishing

## Production Standards
- All footage backed up to 3 locations
- Color correction using DaVinci Resolve
- Audio mixing in Pro Tools
- Final delivery in client-specified formats

## Emergency Contacts
- Production Manager: [Contact info]
- Technical Support: [Contact info]
- Client Services: [Contact info]

## Common Issues & Solutions
- Frame.io not loading: Clear cache, try incognito
- Playback issues: Check internet connection, lower quality
- Missing footage: Check backup drives, contact PM
`; 
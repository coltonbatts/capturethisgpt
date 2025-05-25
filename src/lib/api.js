import { COMPANY_KNOWLEDGE } from './prompts.js';
import { AVAILABLE_MODELS, DEFAULT_MODEL } from './models.js';

export async function queryGPT(prompt, useCompanyContext = false, selectedModel = DEFAULT_MODEL) {
  const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
  
  if (!apiKey || apiKey === 'your_openai_api_key_here') {
    return "🔑 Please set your OpenAI API key in the .env file. Create a .env file in the root directory with:\nREACT_APP_OPENAI_API_KEY=your_actual_api_key";
  }

  try {
    // Get model configuration
    const modelConfig = AVAILABLE_MODELS[selectedModel] || AVAILABLE_MODELS[DEFAULT_MODEL];
    
    // Add company context if requested
    const systemMessage = useCompanyContext 
      ? `You are Capture This GPT, an AI assistant for Capture This video production company. Use the following company knowledge when relevant:\n\n${COMPANY_KNOWLEDGE}\n\nAlways respond in a helpful, professional tone.`
      : "You are Capture This GPT, an AI assistant for Capture This video production company. Please respond in a helpful, professional tone.";

    const messages = [
      { role: "system", content: systemMessage },
      { role: "user", content: prompt }
    ];

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: selectedModel,
        messages: messages,
        temperature: modelConfig.temperature,
        max_tokens: modelConfig.maxTokens
      })
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(`OpenAI API Error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await res.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    return `❌ Error: ${error.message}. Please check your API key and try again.`;
  }
}

export async function queryGPTStreaming(prompt, useCompanyContext = false, onChunk, selectedModel = DEFAULT_MODEL) {
  const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
  
  if (!apiKey || apiKey === 'your_openai_api_key_here') {
    onChunk("🔑 Please set your OpenAI API key in the .env file. Create a .env file in the root directory with:\nREACT_APP_OPENAI_API_KEY=your_actual_api_key");
    return;
  }

  try {
    // Get model configuration
    const modelConfig = AVAILABLE_MODELS[selectedModel] || AVAILABLE_MODELS[DEFAULT_MODEL];
    
    const systemMessage = useCompanyContext 
      ? `You are Capture This GPT, an AI assistant for Capture This video production company. Use the following company knowledge when relevant:\n\n${COMPANY_KNOWLEDGE}\n\nAlways respond in a helpful, professional tone.`
      : "You are Capture This GPT, an AI assistant for Capture This video production company. Please respond in a helpful, professional tone.";

    const messages = [
      { role: "system", content: systemMessage },
      { role: "user", content: prompt }
    ];

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: selectedModel,
        messages: messages,
        temperature: modelConfig.temperature,
        max_tokens: modelConfig.maxTokens,
        stream: true
      })
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(`OpenAI API Error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') return;

          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              onChunk(content);
            }
          } catch (e) {
            // Skip malformed chunks
          }
        }
      }
    }
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    onChunk(`❌ Error: ${error.message}. Please check your API key and try again.`);
  }
} 
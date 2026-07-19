// Simulated GenAI Service

export const simulateAIResponse = async (prompt) => {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
  
  if (!apiKey) {
    return "API key not configured. Please add VITE_OPENROUTER_API_KEY to your .env file.";
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro", // You can change this to any OpenRouter model
        max_tokens: 1000, // Explicit limit to prevent insufficient credit errors
        messages: [
          {
            role: "system",
            content: "You are the official AI Assistant for the FIFA World Cup 2026 Smart Hub. Your job is to help fans with stadium navigation, food & beverage options, wait times, and transportation. Keep your answers concise, energetic, and helpful. Do not mention that you are an AI model."
          },
          {
            role: "user",
            content: prompt
          }
        ]
      })
    });

    const data = await response.json();
    
    if (data.choices && data.choices.length > 0) {
      return data.choices[0].message.content;
    } else {
      console.error("OpenRouter Error Data:", data);
      // Return the specific error message from OpenRouter so we can see what went wrong
      return `API Error: ${data.error?.message || JSON.stringify(data)}`;
    }
  } catch (error) {
    console.error("OpenRouter API Error:", error);
    return `Network Error: ${error.message}`;
  }
};

export const simulateLiveMatchData = async (minute) => {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
  if (!apiKey) return null;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash", // Fast model for JSON response
        max_tokens: 200,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: "You are a live sports data provider. Generate a JSON payload for a simulated international football match. It is the Final match between Spain (ESP) and Argentina (ARG). Return ONLY valid JSON with no markdown formatting. The JSON must match this structure: {\"homeTeamCode\": \"ESP\", \"awayTeamCode\": \"ARG\", \"homeScore\": 0, \"awayScore\": 0, \"event\": \"Short commentary event\"}"
          },
          {
            role: "user",
            content: `The current match minute is ${minute}'. Generate a realistic scoreline for Spain (ESP) vs Argentina (ARG) and a single sentence live commentary event for what is happening right now in the final.`
          }
        ]
      })
    });

    const data = await response.json();
    if (data.choices && data.choices.length > 0) {
      const jsonString = data.choices[0].message.content;
      // Strip markdown code blocks if the model ignored response_format
      const cleaned = jsonString.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleaned);
    }
    return null;
  } catch (error) {
    console.error("Failed to simulate match data:", error);
    return null;
  }
};

export const getStaffInsights = () => {
  return [
    {
      id: 1,
      type: 'warning',
      title: 'Overcrowding at Gate 4',
      description: 'Density has reached 85%. GenAI recommends deploying 5 additional volunteers to redirect traffic to Gate 5.',
      time: 'Just now'
    },
    {
      id: 2,
      type: 'info',
      title: 'Beverage Stock Low',
      description: 'Predictive model indicates Section 102 will run out of water in 15 minutes. Dispatching restock cart is recommended.',
      time: '5 mins ago'
    },
    {
      id: 3,
      type: 'success',
      title: 'Transport Flow Optimal',
      description: 'Metro coordination successful. Outbound fan dispersion is operating 12% faster than baseline.',
      time: '12 mins ago'
    }
  ];
};

export const getStadiumMetrics = () => {
  return {
    occupancy: 78,
    avgWaitTime: 12, // minutes
    incidents: 3,
    sentiment: 8.4 // out of 10
  };
};

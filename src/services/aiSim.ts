/**
 * Mock AI Simulation Service
 * 
 * SECURITY WARNING: In a production environment, this service should NEVER make direct calls to an LLM 
 * from the client-side using a hardcoded or exposed API key. All AI generation should be handled via a 
 * secure backend proxy that manages authentication, rate limiting, and prompt injection filtering.
 * 
 * PROMPT ALIGNMENT: Current prompts are simulated. Ensure real prompts restrict the LLM context strictly 
 * to stadium operations and fan assistance to prevent jailbreaks.
 */

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Simulated rate limiter state (in memory)
let requestCount = 0;
let lastReset = Date.now();

export async function simulateAIResponse(message: string): Promise<string> {
  // 1. SECURITY: Mock Rate Limiting
  const now = Date.now();
  if (now - lastReset > 60000) {
    // Reset every minute
    requestCount = 0;
    lastReset = now;
  }
  
  if (requestCount >= 10) { // Limit to 10 requests per minute
    await delay(500);
    throw new Error("Rate limit exceeded. Please try again later.");
  }
  requestCount++;

  // 2. SECURITY: Basic Input Validation Mock
  if (!message || message.length > 500) {
    throw new Error("Invalid input length.");
  }

  await delay(1200 + Math.random() * 1000); // 1.2s - 2.2s artificial delay
  
  const lowerMsg = message.toLowerCase();
  
  if (lowerMsg.includes('food') || lowerMsg.includes('eat')) {
    return "The nearest food concession is 'Gaucho Grill' near Section 112 (approx. 2 min walk). Wait time is currently very short (under 5 mins). Would you like me to guide you there?";
  }
  if (lowerMsg.includes('bathroom') || lowerMsg.includes('restroom') || lowerMsg.includes('toilet')) {
    return "The closest restrooms are located near Gate 4 and Gate 5. Gate 4 currently has a 3-minute wait. Would you like a route map?";
  }
  if (lowerMsg.includes('merch') || lowerMsg.includes('shop') || lowerMsg.includes('store')) {
    return "The official FIFA World Cup 26™ Superstore is located by the North Plaza. We also have express kiosks at Sections 105 and 209.";
  }
  if (lowerMsg.includes('festival') || lowerMsg.includes('fan')) {
    return "The official FIFA Fan Festival™ is happening downtown! Shuttles depart every 10 minutes from the East Transport Hub just outside the stadium.";
  }

  return "I'm your FIFA '26 Assistant! I can help you find food, merchandise, restrooms, or navigate the stadium. How can I assist you today?";
}

export async function simulateLiveMatchData(minute: number) {
  // Simulate fetching a live data stream
  const events = [
    { minute: 10, homeScore: 0, awayScore: 0, event: "A tentative start. ESP controlling possession." },
    { minute: 20, homeScore: 0, awayScore: 0, event: "Close! ARG hits the post from a free kick." },
    { minute: 30, homeScore: 1, awayScore: 0, event: "GOAL! ESP breaks the deadlock with a stunning strike!" },
    { minute: 40, homeScore: 1, awayScore: 0, event: "Yellow card issued to ARG midfielder for a late tackle." },
    { minute: 45, homeScore: 1, awayScore: 0, event: "Half-time approaches. Stadium operations report heavy traffic at Gate 3 concessions." },
    { minute: 50, homeScore: 1, awayScore: 0, event: "Second half kicks off! Expect increased movement in concourses." },
    { minute: 60, homeScore: 1, awayScore: 1, event: "GOAL! ARG equalizes with a header from a corner!" },
    { minute: 70, homeScore: 1, awayScore: 1, event: "Tense moments. Both teams pushing for the winner." },
    { minute: 80, homeScore: 1, awayScore: 1, event: "Substitution for ESP. Tactical change to push for a late goal." },
    { minute: 90, homeScore: 2, awayScore: 1, event: "GOAL! ESP scores in the final minute! Absolute scenes in the stadium!" }
  ];

  const event = events.find(e => e.minute === minute);
  if (event) {
    return { ...event, homeTeamCode: "ESP", awayTeamCode: "ARG" };
  }
  return null;
}

export function getStaffInsights() {
  return [
    {
      id: "i1",
      title: "Congestion at NY/NJ Gate 3",
      description: "AI detects abnormal crowd buildup (98% capacity). Recommend opening overflow lanes A and B immediately to handle international arrivals.",
      severity: "high",
      time: "Just now"
    },
    {
      id: "i2",
      title: "Halftime Prediction (USA vs ENG)",
      description: "Predicting 35% surge in MetLife North Stand concessions during halftime. Suggest reallocating 5 staff members from West Stand to assist.",
      severity: "medium",
      time: "2 mins ago"
    },
    { id: 3, type: 'success', title: 'Transport Flow Optimal', time: '15 mins ago', description: 'Metro shuttles are clearing the East exit efficiently. Wait times are under 5 minutes.' },
  ];
}

export function getStadiumMetrics() {
  return {
    occupancy: 82,
    avgWaitTime: 8,
    incidents: 3,
    sentiment: "94%"
  };
}

// Web Worker for handling AI Simulation and calculations off the main thread

import { simulateLiveMatchData, simulateAIResponse, getStadiumMetrics, getStaffInsights } from './aiSim';

// Listen for messages from the main thread
self.addEventListener('message', async (e: MessageEvent) => {
  const { type, payload, id } = e.data;

  try {
    switch (type) {
      case 'AI_CHAT':
        const response = await simulateAIResponse(payload.message);
        self.postMessage({ id, type: 'AI_CHAT_RESULT', data: response });
        break;

      case 'FETCH_MATCH_DATA':
        const matchData = await simulateLiveMatchData(payload.minute);
        self.postMessage({ id, type: 'FETCH_MATCH_DATA_RESULT', data: matchData });
        break;
        
      case 'FETCH_DASHBOARD_DATA':
        // We can simulate heavy computation here
        const metrics = getStadiumMetrics();
        const insights = getStaffInsights();
        self.postMessage({ id, type: 'FETCH_DASHBOARD_DATA_RESULT', data: { metrics, insights } });
        break;

      default:
        console.warn(`[Worker] Unknown message type: ${type}`);
    }
  } catch (error) {
    const err = error as Error;
    self.postMessage({ type: 'ERROR', message: err.message || 'Unknown error occurred in worker' });
  }
});

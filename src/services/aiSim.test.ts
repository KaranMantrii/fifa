import { describe, it, expect } from 'vitest';
import { getStaffInsights, getStadiumMetrics, simulateLiveMatchData, simulateAIResponse } from './aiSim';

describe('aiSim service', () => {
  it('getStaffInsights should return an array of insights', () => {
    const insightsUSA = getStaffInsights('USA');
    expect(insightsUSA.length).toBe(3);

    const insightsMEX = getStaffInsights('MEX');
    expect(insightsMEX.length).toBe(2);
    expect(insightsMEX[0].title).toContain('Azteca');

    const insightsCAN = getStaffInsights('CAN');
    expect(insightsCAN.length).toBe(2);
    expect(insightsCAN[1].title).toContain('Weather');
  });

  it('getStadiumMetrics should return an object with correct properties', () => {
    const metricsUSA = getStadiumMetrics('USA');
    expect(metricsUSA).toHaveProperty('occupancy', 78);

    const metricsMEX = getStadiumMetrics('MEX');
    expect(metricsMEX).toHaveProperty('occupancy', 85);

    const metricsCAN = getStadiumMetrics('CAN');
    expect(metricsCAN).toHaveProperty('occupancy', 62);
  });

  it('simulateLiveMatchData should return valid match data for a known minute', async () => {
    const data = await simulateLiveMatchData(30);
    expect(data).toHaveProperty('homeScore', 1);
    expect(data).toHaveProperty('event');
  });

  it('simulateLiveMatchData should return null for an unknown minute', async () => {
    const data = await simulateLiveMatchData(999);
    expect(data).toBeNull();
  });

  describe('simulateAIResponse edge cases', () => {
    it('throws error on empty input', async () => {
      await expect(simulateAIResponse('')).rejects.toThrow('Invalid input length.');
    });

    it('throws error on extremely long input', async () => {
      const longString = 'a'.repeat(501);
      await expect(simulateAIResponse(longString)).rejects.toThrow('Invalid input length.');
    });

    it('returns a valid response for valid input', async () => {
      const response = await simulateAIResponse('food');
      expect(typeof response).toBe('string');
      expect(response).toContain('Gaucho Grill');
    });

    it('returns valid responses for all known intents', async () => {
      expect(await simulateAIResponse('bathroom')).toContain('Gate 4');
      expect(await simulateAIResponse('merch')).toContain('Superstore');
      expect(await simulateAIResponse('festival')).toContain('Shuttles');
      expect(await simulateAIResponse('sensory')).toContain('Section 120');
      expect(await simulateAIResponse('unknown general question')).toContain('FIFA \'26 Assistant');
    }, 15000);

    it('throws error on rate limit exceeded and resets after 60s', async () => {
      // Mock Date.now to test rate limit reset
      const realDateNow = Date.now.bind(globalThis.Date);
      
      try {
        // Run 10 quick requests to reach limit
        const promises = [];
        for (let i = 0; i < 10; i++) {
          promises.push(simulateAIResponse('hi').catch(() => {}));
        }
        await Promise.all(promises);
        
        // The 11th request should throw rate limit
        await expect(simulateAIResponse('hello')).rejects.toThrow('Rate limit exceeded. Please try again later.');

        // Fast forward 61 seconds
        const futureTime = realDateNow() + 61000;
        globalThis.Date.now = () => futureTime;

        // Should work now
        const response = await simulateAIResponse('hi');
        expect(response).toBeDefined();
      } finally {
        globalThis.Date.now = realDateNow;
      }
    });
  });
});

import { describe, it, expect } from 'vitest';
import { getStaffInsights, getStadiumMetrics, simulateLiveMatchData, simulateAIResponse } from './aiSim';

describe('aiSim service', () => {
  it('getStaffInsights should return an array of insights', () => {
    const insights = getStaffInsights();
    expect(Array.isArray(insights)).toBe(true);
    expect(insights.length).toBeGreaterThan(0);
    expect(insights[0]).toHaveProperty('title');
  });

  it('getStadiumMetrics should return an object with correct properties', () => {
    const metrics = getStadiumMetrics();
    expect(metrics).toHaveProperty('occupancy');
    expect(metrics).toHaveProperty('avgWaitTime');
    expect(metrics).toHaveProperty('incidents');
    expect(metrics).toHaveProperty('sentiment');
  });

  it('simulateLiveMatchData should return valid match data for a known minute', async () => {
    const data = await simulateLiveMatchData(30);
    expect(data).toHaveProperty('homeScore', 1);
    expect(data).toHaveProperty('event');
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

    // We avoid hitting the rate limit in this suite to not break subsequent tests,
    // but the validation checks above confirm the initial logic is sound.
  });
});

import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock the aiSim module
vi.mock('./aiSim', () => ({
  simulateLiveMatchData: vi.fn().mockResolvedValue({ homeScore: 1 }),
  simulateAIResponse: vi.fn().mockResolvedValue('Mock AI response'),
  getStadiumMetrics: vi.fn().mockReturnValue({ occupancy: 85 }),
  getStaffInsights: vi.fn().mockReturnValue([{ id: 1, message: 'Insight 1' }])
}));

describe('simulation.worker', () => {
  let mockPostMessage: ReturnType<typeof vi.fn>;
  let messageHandler: EventListener;

  beforeEach(async () => {
    vi.resetModules();
    
    // Mock the global self object for the worker environment
    mockPostMessage = vi.fn();
    const mockAddEventListener = vi.fn().mockImplementation((event, handler) => {
      if (event === 'message') {
        messageHandler = handler;
      }
    });

    (globalThis as any).self = {
      addEventListener: mockAddEventListener,
      postMessage: mockPostMessage
    };

    // Dynamically import the worker to ensure it uses the mocked globals
    await import('./simulation.worker');
  });

  it('handles AI_CHAT messages', async () => {
    const event = new MessageEvent('message', {
      data: { type: 'AI_CHAT', payload: { message: 'hello' }, id: 1 }
    });
    
    await messageHandler(event);
    expect(mockPostMessage).toHaveBeenCalledWith({
      id: 1,
      type: 'AI_CHAT_RESULT',
      data: 'Mock AI response'
    });
  });

  it('handles FETCH_MATCH_DATA messages', async () => {
    const event = new MessageEvent('message', {
      data: { type: 'FETCH_MATCH_DATA', payload: { minute: 45 }, id: 2 }
    });
    
    await messageHandler(event);
    expect(mockPostMessage).toHaveBeenCalledWith({
      id: 2,
      type: 'FETCH_MATCH_DATA_RESULT',
      data: { homeScore: 1 }
    });
  });

  it('handles FETCH_DASHBOARD_DATA messages', async () => {
    const event = new MessageEvent('message', {
      data: { type: 'FETCH_DASHBOARD_DATA', payload: {}, id: 3 }
    });
    
    await messageHandler(event);
    expect(mockPostMessage).toHaveBeenCalledWith({
      id: 3,
      type: 'FETCH_DASHBOARD_DATA_RESULT',
      data: {
        metrics: { occupancy: 85 },
        insights: [{ id: 1, message: 'Insight 1' }]
      }
    });
  });

  it('warns on unknown message type', async () => {
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const event = new MessageEvent('message', {
      data: { type: 'UNKNOWN', payload: {}, id: 4 }
    });
    
    await messageHandler(event);
    expect(consoleWarnSpy).toHaveBeenCalledWith('[Worker] Unknown message type: UNKNOWN');
    consoleWarnSpy.mockRestore();
  });

  it('catches and reports errors', async () => {
    const { simulateAIResponse } = await import('./aiSim');
    vi.mocked(simulateAIResponse).mockRejectedValueOnce(new Error('AI failed'));

    const event = new MessageEvent('message', {
      data: { type: 'AI_CHAT', payload: { message: 'break' }, id: 5 }
    });
    
    await messageHandler(event);
    expect(mockPostMessage).toHaveBeenCalledWith({
      type: 'ERROR',
      message: 'AI failed'
    });
  });
});

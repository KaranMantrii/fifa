import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MockWebSocket } from './wsSim';

describe('MockWebSocket', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should connect and dispatch open event after delay', () => {
    const ws = new MockWebSocket('wss://api.fifa26.com');
    expect(ws.readyState).toBe(MockWebSocket.CONNECTING);
    
    const onOpen = vi.fn();
    ws.addEventListener('open', onOpen);
    
    vi.advanceTimersByTime(500);
    
    expect(ws.readyState).toBe(MockWebSocket.OPEN);
    expect(onOpen).toHaveBeenCalled();
  });

  it('should dispatch match_update messages periodically', () => {
    const ws = new MockWebSocket('wss://api.fifa26.com');
    const onMessage = vi.fn();
    ws.addEventListener('message', onMessage);
    
    // Fast forward to open
    vi.advanceTimersByTime(500);
    
    // Fast forward for the first message (2000ms after open)
    vi.advanceTimersByTime(2000);
    expect(onMessage).toHaveBeenCalledTimes(1);
    
    const eventArg = onMessage.mock.calls[0][0] as MessageEvent;
    const data = JSON.parse(eventArg.data);
    expect(data.type).toBe('match_update');
    expect(data.payload).toHaveProperty('minute');
    
    // Fast forward for another message
    vi.advanceTimersByTime(2000);
    expect(onMessage).toHaveBeenCalledTimes(2);
  });

  it('should handle send method', () => {
    const ws = new MockWebSocket('wss://api.fifa26.com');
    
    expect(() => ws.send('test')).toThrow('WebSocket is not open');
    
    vi.advanceTimersByTime(500);
    
    // Should not throw now
    expect(() => ws.send('test')).not.toThrow();
  });

  it('should close connection and clear timer', () => {
    const ws = new MockWebSocket('wss://api.fifa26.com');
    vi.advanceTimersByTime(500); // open
    
    const onClose = vi.fn();
    ws.addEventListener('close', onClose);
    
    ws.close();
    expect(ws.readyState).toBe(MockWebSocket.CLOSING);
    
    vi.advanceTimersByTime(200);
    expect(ws.readyState).toBe(MockWebSocket.CLOSED);
    expect(onClose).toHaveBeenCalled();
  });
});

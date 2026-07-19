import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import FanAssistant from './FanAssistant';

// Mock the aiSim service to avoid real timers and API calls in tests
vi.mock('../services/aiSim', () => ({
  simulateAIResponse: vi.fn().mockResolvedValue("Mock AI Response"),
  simulateLiveMatchData: vi.fn().mockResolvedValue({ homeTeamCode: "ESP", awayTeamCode: "ARG", homeScore: 1, awayScore: 0, event: "Test event" }),
}));

// Mock the scrollIntoView to prevent errors in jsdom
window.HTMLElement.prototype.scrollIntoView = vi.fn();

describe('FanAssistant component', () => {
  it('renders initial welcome message and input form', () => {
    render(<FanAssistant />);
    expect(screen.getByText(/Welcome to the stadium! I'm your GenAI Companion/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Ask about navigation/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Send message/i })).toBeInTheDocument();
  });

  it('renders suggestion buttons', () => {
    render(<FanAssistant />);
    expect(screen.getByRole('button', { name: /Where's the nearest food/i })).toBeInTheDocument();
  });

  it('allows user to type and submit a message', async () => {
    render(<FanAssistant />);
    const input = screen.getByPlaceholderText(/Ask about navigation/i);
    const sendBtn = screen.getByRole('button', { name: /Send message/i });

    fireEvent.change(input, { target: { value: 'Hello Assistant' } });
    expect(input.value).toBe('Hello Assistant');
    
    // Initially disabled when empty, should be enabled when text is present
    expect(sendBtn).not.toBeDisabled();
    
    fireEvent.click(sendBtn);
    
    // Check if the user message is immediately rendered
    expect(await screen.findByText('Hello Assistant')).toBeInTheDocument();
  });

  describe('Edge Cases', () => {
    it('disables the send button while AI is typing', async () => {
      render(<FanAssistant />);
      const input = screen.getByPlaceholderText(/Ask about navigation/i);
      const sendBtn = screen.getByRole('button', { name: /Send message/i });

      fireEvent.change(input, { target: { value: 'Spam 1' } });
      fireEvent.click(sendBtn);

      // Immediately after sending, button should be disabled because isTyping = true
      expect(sendBtn).toBeDisabled();
    });

    it('sanitizes XSS input payloads using DOMPurify', async () => {
      render(<FanAssistant />);
      const input = screen.getByPlaceholderText(/Ask about navigation/i);
      const sendBtn = screen.getByRole('button', { name: /Send message/i });

      const xssPayload = '<img src=x onerror=alert(1)>';
      fireEvent.change(input, { target: { value: xssPayload } });
      fireEvent.click(sendBtn);

      // Zod validation should reject it before it even reaches the AI
      expect(await screen.findByText('Error: HTML tags are not allowed')).toBeInTheDocument();
      
      // The DOM should not contain the raw unescaped img tag
      const chatRegion = screen.getByRole('region', { name: /Fan Assistant Chat/i });
      expect(chatRegion.innerHTML).not.toContain('<img src="x" onerror="alert(1)">');
    });
  });
});

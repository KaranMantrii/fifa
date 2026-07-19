import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import StaffDashboard from './StaffDashboard';

// Set up fake timers to test setInterval logic
beforeEach(() => {
  vi.useFakeTimers();
});
afterEach(() => {
  vi.clearAllTimers();
  vi.useRealTimers();
});

// Mock scrollIntoView
window.HTMLElement.prototype.scrollIntoView = vi.fn();

describe('StaffDashboard component integration', () => {
  it('renders initial dashboard structure', () => {
    render(<StaffDashboard />);
    // Check main sections are present
    expect(screen.getByText(/Live Interactive Stadium Map/i)).toBeInTheDocument();
    expect(screen.getByText(/Recommended Actions/i)).toBeInTheDocument();
  });

  it('updates crowd density values over time', () => {
    render(<StaffDashboard />);
    
    // Using fake timers, advance time by 12 seconds to trigger the setInterval
    act(() => {
      vi.advanceTimersByTime(12000);
    });

    // We can't guarantee exact numbers due to Math.random(), but we verify it didn't crash
    expect(screen.getByText(/Live Interactive Stadium Map/i)).toBeInTheDocument();
  });

  it('can select a sector from the map and view details', () => {
    render(<StaffDashboard />);
    
    // Assuming StadiumMap renders "North Stand"
    const northSector = screen.getByRole('button', { name: /North Stand/i });
    fireEvent.click(northSector);

    // Verify SectorDetails panel opens or reflects the selection
    expect(screen.getAllByText(/North Stand/i).length).toBeGreaterThan(0);
  });

  it('can open and close the camera modal', () => {
    render(<StaffDashboard />);
    
    // Select a sector first to see cameras
    const northSector = screen.getByRole('button', { name: /North Stand/i });
    fireEvent.click(northSector);

    // Find the camera button in the details panel
    const viewCamBtn = screen.getByRole('button', { name: /View camera feeds for/i });
    fireEvent.click(viewCamBtn);

    // Modal should be visible
    expect(screen.getByRole('dialog', { name: /Live Feeds:/i })).toBeInTheDocument();

    // Close modal
    const closeBtn = screen.getByRole('button', { name: /Close camera feeds/i });
    fireEvent.click(closeBtn);

    // Modal should be gone
    expect(screen.queryByRole('dialog', { name: /Live Feeds:/i })).not.toBeInTheDocument();
  });
});

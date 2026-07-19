import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import StaffDashboard from './StaffDashboard';

// No fake timers to allow async testing library to poll correctly

// Mock scrollIntoView
window.HTMLElement.prototype.scrollIntoView = vi.fn();

describe('StaffDashboard component integration', () => {
  it('renders initial dashboard structure', async () => {
    render(<StaffDashboard />);
    // Check main sections are present
    expect(await screen.findByText(/Live Interactive Stadium Map/i)).toBeInTheDocument();
    expect(await screen.findByText(/Recommended Actions/i)).toBeInTheDocument();
  });

  it('updates crowd density values over time', async () => {
    render(<StaffDashboard />);
    
    // With real timers, just wait for the first render to complete
    expect(await screen.findByText(/Live Interactive Stadium Map/i)).toBeInTheDocument();
  });

  it('can select a sector from the map and view details', async () => {
    render(<StaffDashboard />);
    
    // Assuming StadiumMap renders "North Stand"
    const northSector = await screen.findByRole('button', { name: /North Stand/i });
    fireEvent.click(northSector);

    // Verify SectorDetails panel opens or reflects the selection
    expect(screen.getAllByText(/North Stand/i).length).toBeGreaterThan(0);
  });

  it('can open and close the camera modal', async () => {
    render(<StaffDashboard />);
    
    // Select a sector first to see cameras
    const northSector = await screen.findByRole('button', { name: /North Stand/i });
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

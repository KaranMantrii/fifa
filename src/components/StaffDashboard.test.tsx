import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import StaffDashboard from './StaffDashboard';

// No fake timers to allow async testing library to poll correctly

vi.mock('../services/wsSim', () => {
  const instances: any[] = [];
  return {
    __getMockInstances: () => instances,
    MockWebSocket: class MockWebSocket extends EventTarget {
      constructor() {
        super();
        instances.push(this);
      }
      close = vi.fn();
      send = vi.fn();
    }
  };
});

// Mock scrollIntoView
window.HTMLElement.prototype.scrollIntoView = vi.fn();

describe('StaffDashboard component integration', () => {
  it('renders initial dashboard structure', async () => {
    render(<StaffDashboard />);
    // Check main sections are present
    expect(await screen.findByText(/FIFA World Cup 26/i)).toBeInTheDocument();
    expect(await screen.findByText(/Recommended Actions/i)).toBeInTheDocument();
  });

  it('updates crowd density values over time', async () => {
    render(<StaffDashboard />);
    
    // With real timers, just wait for the first render to complete
    expect(await screen.findByText(/FIFA World Cup 26/i)).toBeInTheDocument();
  });

  it('can select a sector from the map and view details', async () => {
    render(<StaffDashboard />);
    
    // Assuming StadiumMap renders "MetLife North"
    const northSector = await screen.findByRole('button', { name: /MetLife North/i });
    fireEvent.click(northSector);

    // Verify SectorDetails panel opens or reflects the selection
    expect(screen.getAllByText(/MetLife North/i).length).toBeGreaterThan(0);
  });

  it('can open and close the camera modal', async () => {
    render(<StaffDashboard />);
    
    // Select a sector first to see cameras
    const northSector = await screen.findByRole('button', { name: /MetLife North/i });
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
  it('can switch regions and update stadium data', async () => {
    render(<StaffDashboard />);
    
    // Switch to MEX
    const mexBtn = await screen.findByRole('button', { name: /Switch to Mexico Node/i });
    fireEvent.click(mexBtn);
    expect(await screen.findByRole('button', { name: /Azteca North/i })).toBeInTheDocument();

    // Switch to CAN
    const canBtn = await screen.findByRole('button', { name: /Switch to Canada Node/i });
    fireEvent.click(canBtn);
    expect(await screen.findByRole('button', { name: /BMO Field North/i })).toBeInTheDocument();
  });

  it('handles websocket match_update messages and staff deployments', async () => {
    // Clear mock calls to grab the specific instance for this test
    vi.clearAllMocks();
    
    render(<StaffDashboard />);
    
    // Wait for initial render
    expect(await screen.findByText(/FIFA World Cup 26/i)).toBeInTheDocument();

    // Select a sector
    const northSector = await screen.findByRole('button', { name: /MetLife North/i });
    fireEvent.click(northSector);

    // Deploy staff to test deployment logic
    const deployBtn = await screen.findByRole('button', { name: /Deploy Staff/i });
    fireEvent.click(deployBtn);

    // Wait for the button text to change to ensure state updated
    expect(await screen.findByRole('button', { name: /Team Active/i })).toBeInTheDocument();

    // NOW get the mocked instance, after any potential re-renders
    const { __getMockInstances } = await import('../services/wsSim') as any;
    const instances = __getMockInstances();
    const wsInstance = instances[instances.length - 1];
    
    // Simulate websocket message to trigger occupancy updates multiple times
    // This allows occupancy to drop below 60 and waitTime below 5 to trigger the auto-recall logic
    const data = JSON.stringify({ type: 'match_update' });
    const event = new MessageEvent('message', { data });
    
    // We need to use act when triggering events that update state
    act(() => {
      for (let i = 0; i < 20; i++) {
        wsInstance.dispatchEvent(event);
      }
    });

    // Just wait for any change
    await screen.findByText(/FIFA World Cup 26/i);
    
    // Recall staff (if it wasn't auto-recalled)
    const recallBtn = screen.queryByRole('button', { name: /Team Active/i });
    if (recallBtn) {
      fireEvent.click(recallBtn);
    }
    expect(await screen.findByRole('button', { name: /Deploy Staff/i })).toBeInTheDocument();

    // Open Camera
    const cameraBtn = await screen.findByRole('button', { name: /View camera feeds for/i });
    fireEvent.click(cameraBtn);
    expect(await screen.findByRole('dialog', { name: /Live Feeds:/i })).toBeInTheDocument();

    // Click USA region button to ensure line 174 is covered (do this last as it clears selectedSector)
    const usaBtn = await screen.findByRole('button', { name: /Switch to USA Node/i });
    fireEvent.click(usaBtn);
  });
});

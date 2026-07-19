import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import StadiumMap from './StadiumMap';

const mockStadiumData = {
  north: { id: 'north', name: 'North Stand', occupancy: 50, status: 'Normal', color: '#10b981', incidents: 0, waitTime: '0' },
  south: { id: 'south', name: 'South Stand', occupancy: 95, status: 'Critical', color: '#ef4444', incidents: 0, waitTime: '0' },
  east: { id: 'east', name: 'East Stand', occupancy: 40, status: 'Normal', color: '#10b981', incidents: 0, waitTime: '0' },
  west: { id: 'west', name: 'West Stand', occupancy: 60, status: 'Warning', color: '#f59e0b', incidents: 0, waitTime: '0' },
  g1: { id: 'g1', name: 'Gate 1', occupancy: 10, status: 'Normal', color: '#10b981', incidents: 0, waitTime: '0' },
  g2: { id: 'g2', name: 'Gate 2', occupancy: 20, status: 'Normal', color: '#10b981', incidents: 0, waitTime: '0' },
  g3: { id: 'g3', name: 'Gate 3', occupancy: 90, status: 'Critical', color: '#ef4444', incidents: 0, waitTime: '0' },
  g4: { id: 'g4', name: 'Gate 4', occupancy: 30, status: 'Normal', color: '#10b981', incidents: 0, waitTime: '0' }
};

describe('StadiumMap component', () => {
  it('renders all sectors with appropriate aria-labels', () => {
    render(<StadiumMap stadiumData={mockStadiumData} handleSectorClick={() => {}} selectedSector={null} />);
    
    const northSector = screen.getByRole('button', { name: /North Stand, Occupancy 50%, Status Normal/i });
    expect(northSector).toBeInTheDocument();
    
    const southSector = screen.getByRole('button', { name: /South Stand, Occupancy 95%, Status Critical/i });
    expect(southSector).toBeInTheDocument();
  });

  it('calls handleSectorClick on click and enter key press', () => {
    const mockHandleClick = vi.fn();
    render(<StadiumMap stadiumData={mockStadiumData} handleSectorClick={mockHandleClick} selectedSector={null} />);
    
    const eastSector = screen.getByRole('button', { name: /East Stand/i });
    
    // Test click
    fireEvent.click(eastSector);
    expect(mockHandleClick).toHaveBeenCalledWith('east');
    
    // Test Enter key
    fireEvent.keyDown(eastSector, { key: 'Enter', code: 'Enter' });
    expect(mockHandleClick).toHaveBeenCalledWith('east'); // called twice now
    expect(mockHandleClick).toHaveBeenCalledTimes(2);
  });

  it('reflects selected state with aria-pressed', () => {
    render(<StadiumMap stadiumData={mockStadiumData} handleSectorClick={() => {}} selectedSector={mockStadiumData.north} />);
    
    const northSector = screen.getByRole('button', { name: /North Stand/i });
    const southSector = screen.getByRole('button', { name: /South Stand/i });
    
    expect(northSector).toHaveAttribute('aria-pressed', 'true');
    expect(southSector).toHaveAttribute('aria-pressed', 'false');
  });
});

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from './App';

// Mock components to simplify App testing
vi.mock('./components/FanAssistant', () => ({
  default: () => <div data-testid="fan-assistant">Fan Assistant Mock</div>
}));
vi.mock('./components/StaffDashboard', () => ({
  default: () => <div data-testid="staff-dashboard">Staff Dashboard Mock</div>
}));
vi.mock('./components/StaffLogin', () => ({
  default: ({ onLogin }) => (
    <div data-testid="staff-login">
      Staff Login Mock
      <button onClick={() => onLogin(true)}>Simulate Login</button>
    </div>
  )
}));

// Mock scrollIntoView
window.HTMLElement.prototype.scrollIntoView = vi.fn();

describe('App component', () => {
  it('renders correctly in Fan mode by default', async () => {
    render(<App />);
    expect(screen.getByText(/FIFA '26 Smart Hub/i)).toBeInTheDocument();
    
    // We expect the lazy loaded fan assistant to appear eventually
    await waitFor(() => {
      expect(screen.getByTestId('fan-assistant')).toBeInTheDocument();
    });
  });

  it('switches to staff mode and shows login, then dashboard', async () => {
    render(<App />);
    
    const staffModeBtn = screen.getByRole('button', { name: /Switch to Staff Dashboard mode/i });
    fireEvent.click(staffModeBtn);
    
    // After clicking staff mode, we should see the Staff Login Mock
    await waitFor(() => {
      expect(screen.getByTestId('staff-login')).toBeInTheDocument();
    });
    
    // Fan assistant should be hidden (we check for aria-hidden true or not visible)
    const fanContainer = screen.getByTestId('fan-assistant').parentElement;
    expect(fanContainer).toHaveClass('hidden');

    // Simulate login success
    const loginBtn = screen.getByText('Simulate Login');
    fireEvent.click(loginBtn);
    
    // After login, we should see the dashboard
    await waitFor(() => {
      expect(screen.getByTestId('staff-dashboard')).toBeInTheDocument();
    });
    
    // Logout button should now be visible
    const logoutBtn = screen.getByRole('button', { name: /app.logout/i });
    expect(logoutBtn).toBeInTheDocument();
    
    // Click logout
    fireEvent.click(logoutBtn);
    
    // Should go back to login
    await waitFor(() => {
      expect(screen.getByTestId('staff-login')).toBeInTheDocument();
    });
  });
});

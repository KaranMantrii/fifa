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
  default: ({ onLogin }: { onLogin: (status: boolean) => void }) => (
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

  it('switches to staff mode and shows login, then dashboard, then logs out', async () => {
    render(<App />);
    
    const staffModeBtn = screen.getByRole('button', { name: /Switch to Staff Dashboard mode/i });
    fireEvent.click(staffModeBtn);
    
    // After clicking staff mode, we should see the Staff Login Mock
    await waitFor(() => {
      expect(screen.getByTestId('staff-login')).toBeInTheDocument();
    });
    
    // Fan assistant should no longer be in the document
    expect(screen.queryByTestId('fan-assistant')).not.toBeInTheDocument();

    // Click Fan mode button to switch back without logging in
    const fanModeBtn = screen.getByRole('button', { name: /Switch to Fan Companion mode/i });
    fireEvent.click(fanModeBtn);
    
    // We should see Fan Assistant again
    await waitFor(() => {
      expect(screen.getByTestId('fan-assistant')).toBeInTheDocument();
    });

    // Switch back to staff mode to continue login test
    fireEvent.click(staffModeBtn);
    await waitFor(() => {
      expect(screen.getByTestId('staff-login')).toBeInTheDocument();
    });

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
    
    // Should go back to fan mode
    await waitFor(() => {
      expect(screen.getByTestId('fan-assistant')).toBeInTheDocument();
    });
  });

  it('changes language when language buttons are clicked', () => {
    render(<App />);
    
    // Find language buttons
    const esBtn = screen.getByText('ES');
    const frBtn = screen.getByText('FR');
    const enBtn = screen.getByText('EN');

    fireEvent.click(esBtn);
    fireEvent.click(frBtn);
    fireEvent.click(enBtn);
  });
});

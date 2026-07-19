import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import StaffLogin from './StaffLogin';
import * as authService from '../services/authService';

vi.mock('../services/authService', () => ({
  login: vi.fn(),
}));

describe('StaffLogin component', () => {
  it('renders login form', () => {
    render(<StaffLogin onLogin={() => {}} />);
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /authenticate/i })).toBeInTheDocument();
  });

  it('displays error on failed login', async () => {
    authService.login.mockRejectedValueOnce(new Error('Invalid credentials.'));
    
    render(<StaffLogin onLogin={() => {}} />);
    
    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'wrong' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'pass' } });
    fireEvent.click(screen.getByRole('button', { name: /authenticate/i }));
    
    await waitFor(() => {
      expect(screen.getByText('Invalid credentials.')).toBeInTheDocument();
    });
  });

  it('calls onLogin on successful login', async () => {
    const mockOnLogin = vi.fn();
    const mockUser = { username: 'admin', role: 'admin' };
    authService.login.mockResolvedValueOnce({ token: 'test-token', user: mockUser });
    
    render(<StaffLogin onLogin={mockOnLogin} />);
    
    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'admin' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /authenticate/i }));
    
    await waitFor(() => {
      expect(mockOnLogin).toHaveBeenCalledWith(mockUser);
    });
  });
});

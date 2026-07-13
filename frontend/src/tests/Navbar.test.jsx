import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Navbar from '../components/layout/Navbar';
import { useAuth } from '../hooks/useAuth';

vi.mock('../hooks/useAuth');

describe('Navbar', () => {
  it('displays user information and calls logout', () => {
    const mockLogout = vi.fn();
    useAuth.mockReturnValue({
      user: { username: 'testadmin' },
      role: 'ADMIN',
      logout: mockLogout,
    });

    render(<Navbar />);

    expect(screen.getByText('testadmin')).toBeInTheDocument();
    expect(screen.getByText('ADMIN')).toBeInTheDocument();

    const logoutBtn = screen.getByText('Logout');
    fireEvent.click(logoutBtn);

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});

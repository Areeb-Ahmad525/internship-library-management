import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import DashboardPage from '../pages/DashboardPage';
import { useAuth } from '../hooks/useAuth';

vi.mock('../hooks/useAuth');

describe('DashboardPage', () => {
  it('renders Member view correctly', () => {
    useAuth.mockReturnValue({
      user: { username: 'john' },
      role: 'MEMBER',
    });

    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Welcome, john!')).toBeInTheDocument();
    expect(screen.getByText('Go to Books')).toBeInTheDocument();
    expect(screen.getByText('Go to Loans')).toBeInTheDocument();
    expect(screen.queryByText('Go to Members')).not.toBeInTheDocument();
    expect(screen.queryByText('Go to Users')).not.toBeInTheDocument();
  });

  it('renders Admin view correctly', () => {
    useAuth.mockReturnValue({
      user: { username: 'admin' },
      role: 'ADMIN',
    });

    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Welcome, admin!')).toBeInTheDocument();
    expect(screen.getByText('Go to Books')).toBeInTheDocument();
    expect(screen.getByText('Go to Loans')).toBeInTheDocument();
    expect(screen.getByText('Go to Members')).toBeInTheDocument();
    expect(screen.getByText('Go to Users')).toBeInTheDocument();
  });
});

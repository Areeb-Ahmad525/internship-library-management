import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import UsersPage from '../pages/UsersPage';
import { useUsers } from '../hooks/useUsers';

vi.mock('../hooks/useUsers');

describe('UsersPage', () => {
  const mockChangeRole = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading skeleton', () => {
    useUsers.mockReturnValue({
      users: [],
      loading: true,
      error: null,
      submitting: false,
      changeRole: mockChangeRole,
    });

    const { container } = render(<UsersPage />);
    expect(container.querySelector('.skeleton-card')).toBeInTheDocument();
  });

  it('renders empty state if no users', () => {
    useUsers.mockReturnValue({
      users: [],
      loading: false,
      error: null,
      submitting: false,
      changeRole: mockChangeRole,
    });

    render(<UsersPage />);
    expect(screen.getByText('No Users Found')).toBeInTheDocument();
  });

  it('renders users grid and allows role change', async () => {
    useUsers.mockReturnValue({
      users: [
        { id: 1, username: 'adminuser', email: 'admin@test.com', role: 'ADMIN' },
        { id: 2, username: 'testuser', email: 'test@test.com', role: 'MEMBER' },
      ],
      loading: false,
      error: null,
      submitting: false,
      changeRole: mockChangeRole,
    });

    render(<UsersPage />);

    expect(screen.getByText('adminuser')).toBeInTheDocument();
    expect(screen.getByText('testuser')).toBeInTheDocument();

    const changeRoleBtns = screen.getAllByText('Change Role');
    fireEvent.click(changeRoleBtns[1]); // Click change role on testuser

    expect(screen.getByText('Change Role for testuser')).toBeInTheDocument();

    const select = screen.getByLabelText('Role');
    fireEvent.change(select, { target: { value: 'LIBRARIAN' } });

    const submitBtn = screen.getByText('Update Role');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockChangeRole).toHaveBeenCalledWith(2, 'LIBRARIAN');
    });
  });
});

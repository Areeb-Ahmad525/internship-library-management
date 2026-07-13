import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import RoleRoute from '../routes/RoleRoute';
import { AuthContext } from '../context/AuthContext';

describe('RoleRoute', () => {
  it('renders children if user has required role', () => {
    render(
      <AuthContext.Provider value={{ role: 'ADMIN', isAuthenticated: true }}>
        <MemoryRouter initialEntries={['/admin']}>
          <Routes>
            <Route element={<RoleRoute roles={['ADMIN']} />}>
              <Route path="/admin" element={<div>Admin Content</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>
    );

    expect(screen.getByText('Admin Content')).toBeInTheDocument();
  });

  it('renders AccessDenied if user lacks required role', () => {
    render(
      <AuthContext.Provider value={{ role: 'MEMBER', isAuthenticated: true }}>
        <MemoryRouter initialEntries={['/admin']}>
          <Routes>
            <Route element={<RoleRoute roles={['ADMIN']} />}>
              <Route path="/admin" element={<div>Admin Content</div>} />
            </Route>
            <Route path="/access-denied" element={<div>Access Denied Page</div>} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>
    );

    expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
    expect(screen.getByText('You do not have permission to view this page.')).toBeInTheDocument();
  });
});

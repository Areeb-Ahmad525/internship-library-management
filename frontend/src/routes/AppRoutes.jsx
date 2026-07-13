import { Routes, Route } from 'react-router-dom';

import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';

import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import BooksPage from '../pages/BooksPage';
import MembersPage from '../pages/MembersPage';
import LoansPage from '../pages/LoansPage';
import UsersPage from '../pages/UsersPage';
import NotFoundPage from '../pages/NotFoundPage';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public/Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      {/* Protected Routes (Main Layout) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />

          <Route element={<RoleRoute roles={['ADMIN', 'LIBRARIAN', 'MEMBER']} />}>
            <Route path="/books" element={<BooksPage />} />
            <Route path="/loans" element={<LoansPage />} />
          </Route>

          <Route element={<RoleRoute roles={['ADMIN', 'LIBRARIAN']} />}>
            <Route path="/members" element={<MembersPage />} />
          </Route>

          <Route element={<RoleRoute roles={['ADMIN']} />}>
            <Route path="/users" element={<UsersPage />} />
          </Route>
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;

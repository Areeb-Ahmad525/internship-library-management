import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import RoleRoute from './routes/RoleRoute';
import MainLayout from './layouts/MainLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import BooksPage from './pages/BooksPage';
import BookDetailsPage from './pages/BookDetailsPage';
import MembersPage from './pages/MembersPage';
import MemberDetailsPage from './pages/MemberDetailsPage';
import LoansPage from './pages/LoansPage';
import UsersPage from './pages/UsersPage';
import AccessDenied from './pages/AccessDenied';
import NotFound from './pages/NotFound';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="books" element={<BooksPage />} />
            <Route path="books/:id" element={<BookDetailsPage />} />
            <Route
              path="members"
              element={
                <RoleRoute roles={['LIBRARIAN', 'ADMIN']}>
                  <MembersPage />
                </RoleRoute>
              }
            />
            <Route
              path="members/:id"
              element={
                <RoleRoute roles={['LIBRARIAN', 'ADMIN']}>
                  <MemberDetailsPage />
                </RoleRoute>
              }
            />
            <Route
              path="loans"
              element={
                <RoleRoute roles={['LIBRARIAN', 'ADMIN']}>
                  <LoansPage />
                </RoleRoute>
              }
            />

            <Route element={<RoleRoute roles={['ADMIN']} />}>
              <Route path="users" element={<UsersPage />} />
            </Route>

            <Route path="access-denied" element={<AccessDenied />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster position="top-right" />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

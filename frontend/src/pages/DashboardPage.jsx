import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
  const { user, role } = useAuth();

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Welcome, {user?.username || 'User'}!</h1>
        <p style={{ color: '#bbb' }}>
          You are logged in as <strong>{role}</strong>
        </p>
      </header>

      <div
        className="dashboard-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginTop: '2rem',
        }}
      >
        <div className="book-card">
          <h3>📚 Books</h3>
          <p>Browse and search the library catalog.</p>
          <Link
            to="/books"
            className="btn btn-primary"
            style={{ display: 'inline-block', marginTop: '1rem', textDecoration: 'none' }}
          >
            Go to Books
          </Link>
        </div>

        {['LIBRARIAN', 'ADMIN'].includes(role) && (
          <div className="book-card">
            <h3>👥 Members</h3>
            <p>Manage library members.</p>
            <Link
              to="/members"
              className="btn btn-primary"
              style={{ display: 'inline-block', marginTop: '1rem', textDecoration: 'none' }}
            >
              Go to Members
            </Link>
          </div>
        )}

        <div className="book-card">
          <h3>🔄 Loans</h3>
          <p>
            {role === 'MEMBER'
              ? 'View your active loans and history.'
              : 'Manage all book loans and returns.'}
          </p>
          <Link
            to="/loans"
            className="btn btn-primary"
            style={{ display: 'inline-block', marginTop: '1rem', textDecoration: 'none' }}
          >
            Go to Loans
          </Link>
        </div>

        {role === 'ADMIN' && (
          <div className="book-card">
            <h3>🛡️ Users</h3>
            <p>System administrators user management.</p>
            <Link
              to="/users"
              className="btn btn-primary"
              style={{ display: 'inline-block', marginTop: '1rem', textDecoration: 'none' }}
            >
              Go to Users
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;

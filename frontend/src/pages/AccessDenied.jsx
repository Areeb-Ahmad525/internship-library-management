import { Link } from 'react-router-dom';

const AccessDenied = () => {
  return (
    <div className="empty-books" style={{ marginTop: '10vh' }}>
      <h1 style={{ fontSize: '4rem', color: '#c5221f' }}>403</h1>
      <h2>Access Denied</h2>
      <p>You do not have permission to view this page.</p>
      <Link
        to="/"
        className="btn btn-primary"
        style={{ display: 'inline-block', marginTop: '2rem', textDecoration: 'none' }}
      >
        Return to Dashboard
      </Link>
    </div>
  );
};

export default AccessDenied;

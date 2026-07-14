import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="empty-books" style={{ marginTop: '10vh' }}>
      <h1 style={{ fontSize: '4rem', color: '#646cff' }}>404</h1>
      <h2>Page Not Found</h2>
      <p>The page you are looking for doesn't exist or has been moved.</p>
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

export default NotFound;

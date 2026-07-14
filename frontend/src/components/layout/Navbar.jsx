import { useAuth } from '../../hooks/useAuth';

const Navbar = () => {
  const { user, role, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-brand">Library Management System</div>
      <div className="navbar-user">
        <span className="navbar-username">{user?.username}</span>
        <span className="navbar-role badge">{role}</span>
        <button onClick={logout} className="btn btn-secondary btn-sm">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

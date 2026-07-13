import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Sidebar = () => {
  const { role } = useAuth();

  return (
    <aside className="sidebar">
      <ul className="sidebar-nav">
        <li>
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            end
          >
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/books"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            Books
          </NavLink>
        </li>

        {['LIBRARIAN', 'ADMIN'].includes(role) && (
          <li>
            <NavLink
              to="/members"
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              Members
            </NavLink>
          </li>
        )}

        <li>
          <NavLink
            to="/loans"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            Loans
          </NavLink>
        </li>

        {role === 'ADMIN' && (
          <li>
            <NavLink
              to="/users"
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              Users
            </NavLink>
          </li>
        )}
      </ul>
    </aside>
  );
};

export default Sidebar;

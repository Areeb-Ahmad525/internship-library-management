import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';

const MainLayout = () => {
  return (
    <div className="layout-root">
      <Navbar />
      <div className="layout-body">
        <Sidebar />
        <main className="layout-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;

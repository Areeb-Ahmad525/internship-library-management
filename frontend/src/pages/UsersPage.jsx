import { useState } from 'react';
import { useUsers } from '../hooks/useUsers';
import UserGrid from '../components/users/UserGrid';
import UsersSkeleton from '../components/users/UsersSkeleton';
import EmptyUsers from '../components/users/EmptyUsers';
import RoleModal from '../components/users/RoleModal';

const UsersPage = () => {
  const { users, loading, error, submitting, changeRole } = useUsers();

  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChangeRoleInitiate = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleRoleConfirm = async (id, role) => {
    const success = await changeRole(id, role);
    if (success) {
      setIsModalOpen(false);
      setSelectedUser(null);
    }
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Users Management</h1>
      </header>

      {error && <div className="error-banner">{error}</div>}

      {!error && loading && <UsersSkeleton />}

      {!error && !loading && users.length === 0 && <EmptyUsers />}

      {!error && !loading && users.length > 0 && (
        <UserGrid users={users} onChangeRole={handleChangeRoleInitiate} />
      )}

      <RoleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleRoleConfirm}
        user={selectedUser}
        submitting={submitting}
      />
    </div>
  );
};

export default UsersPage;

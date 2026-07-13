import UserCard from './UserCard';

const UserGrid = ({ users, onChangeRole, onViewUser }) => {
  return (
    <div className="book-grid">
      {users.map((user) => (
        <UserCard key={user.id} user={user} onChangeRole={onChangeRole} onViewUser={onViewUser} />
      ))}
    </div>
  );
};

export default UserGrid;

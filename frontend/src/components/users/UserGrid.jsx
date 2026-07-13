import UserCard from './UserCard';

const UserGrid = ({ users, onChangeRole }) => {
  return (
    <div className="book-grid">
      {users.map((user) => (
        <UserCard key={user.id} user={user} onChangeRole={onChangeRole} />
      ))}
    </div>
  );
};

export default UserGrid;

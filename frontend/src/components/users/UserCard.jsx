const UserCard = ({ user, onChangeRole }) => {
  const getBadgeClass = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'badge-out-of-stock';
      case 'LIBRARIAN':
        return 'badge-maintenance';
      default:
        return 'badge-available';
    }
  };

  return (
    <div className="book-card">
      <div className="book-card-header">
        <h3 className="book-title">{user.username}</h3>
        <span className={`badge ${getBadgeClass(user.role)}`}>{user.role}</span>
      </div>
      <p className="book-author" style={{ wordBreak: 'break-all' }}>
        {user.email}
      </p>

      <button
        className="btn btn-primary"
        style={{ marginTop: '1.5rem', width: '100%' }}
        onClick={() => onChangeRole(user)}
      >
        Change Role
      </button>
    </div>
  );
};

export default UserCard;

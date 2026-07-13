const UserCard = ({ user, onChangeRole, onViewUser }) => {
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

      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
        <button
          className="btn btn-secondary"
          style={{ flex: 1, margin: 0 }}
          onClick={() => onViewUser(user.id)}
        >
          View Details
        </button>
        <button
          className="btn btn-primary"
          style={{ flex: 1, margin: 0 }}
          onClick={() => onChangeRole(user)}
        >
          Change Role
        </button>
      </div>
    </div>
  );
};

export default UserCard;

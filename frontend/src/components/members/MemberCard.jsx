const MemberCard = ({ member, onEdit, onDelete }) => {
  return (
    <div className="book-card">
      <div className="book-card-header">
        <h3 className="book-title">{member.name}</h3>
      </div>

      <p className="book-author" style={{ wordBreak: 'break-all' }}>
        {member.email}
      </p>

      <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.5rem' }}>
        <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => onEdit(member)}>
          Edit
        </button>
        <button
          className="btn btn-secondary"
          style={{ flex: 1, backgroundColor: '#c5221f' }}
          onClick={() => onDelete(member)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default MemberCard;

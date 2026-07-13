const DeleteMemberModal = ({ isOpen, onClose, onConfirm, member, submitting }) => {
  if (!isOpen || !member) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Delete Member</h2>
        <p>
          Are you sure you want to delete <strong>{member.name}</strong>?
        </p>
        <p style={{ color: '#c5221f', fontSize: '0.9rem', marginTop: '0.5rem' }}>
          This action cannot be undone. If the member has active loans, deletion might fail.
        </p>

        <div className="modal-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            style={{ backgroundColor: '#c5221f' }}
            onClick={() => onConfirm(member.id)}
            disabled={submitting}
          >
            {submitting ? 'Deleting...' : 'Confirm Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteMemberModal;

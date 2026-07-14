import { createPortal } from 'react-dom';

const DeleteMemberModal = ({ isOpen, onClose, onConfirm, member, submitting }) => {
  if (!isOpen || !member) return null;

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 style={{ color: '#c5221f' }}>Delete Member</h2>
        <p>
          Are you sure you want to delete <strong>{member.name}</strong>?
        </p>
        <p style={{ fontSize: '0.9rem', color: '#888', marginTop: '1rem' }}>
          This action cannot be undone. Members with active loans cannot be deleted.
        </p>

        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onClose} disabled={submitting}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            style={{ backgroundColor: '#c5221f' }}
            onClick={() => onConfirm(member.id)}
            disabled={submitting}
          >
            {submitting ? 'Deleting...' : 'Yes, Delete Member'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default DeleteMemberModal;

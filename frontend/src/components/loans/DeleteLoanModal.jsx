import { createPortal } from 'react-dom';

const DeleteLoanModal = ({ isOpen, onClose, onConfirm, loan, submitting }) => {
  if (!isOpen || !loan) return null;

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 style={{ color: '#c5221f' }}>Delete Loan Record</h2>
        <p>
          Are you sure you want to permanently delete this loan record for{' '}
          <strong>{loan.book?.title}</strong>?
        </p>
        <p style={{ fontSize: '0.9rem', color: '#888', marginTop: '1rem' }}>
          This action cannot be undone.
        </p>

        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onClose} disabled={submitting}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            style={{ backgroundColor: '#c5221f' }}
            onClick={() => onConfirm(loan.id)}
            disabled={submitting}
          >
            {submitting ? 'Deleting...' : 'Yes, Delete Loan'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default DeleteLoanModal;

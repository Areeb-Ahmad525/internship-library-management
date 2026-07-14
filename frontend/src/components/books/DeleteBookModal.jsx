import { createPortal } from 'react-dom';

const DeleteBookModal = ({ isOpen, onClose, onConfirm, book, submitting }) => {
  if (!isOpen || !book) return null;

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 style={{ color: '#c5221f' }}>Delete Book</h2>
        <p>
          Are you sure you want to delete <strong>{book.title}</strong> by {book.author}?
        </p>
        <p style={{ fontSize: '0.9rem', color: '#888', marginTop: '1rem' }}>
          This action cannot be undone. Books with active loans may not be deleted depending on
          backend constraints.
        </p>

        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onClose} disabled={submitting}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            style={{ backgroundColor: '#c5221f' }}
            onClick={() => onConfirm(book.id)}
            disabled={submitting}
          >
            {submitting ? 'Deleting...' : 'Yes, Delete Book'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default DeleteBookModal;

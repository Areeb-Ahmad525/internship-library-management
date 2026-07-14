const ReturnConfirmation = ({ isOpen, onClose, onConfirm, loan, submitting }) => {
  if (!isOpen || !loan) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Return Book?</h2>
        <p>This action will mark the loan as returned.</p>
        <div className="loan-summary-box">
          <p>
            <strong>Book ID:</strong> {loan.book_id}
          </p>
          <p>
            <strong>Member ID:</strong> {loan.member_id}
          </p>
          <p>
            <strong>Borrowed:</strong> {new Date(loan.borrow_date).toLocaleDateString()}
          </p>
          <p>
            <strong>Due:</strong> {new Date(loan.due_date).toLocaleDateString()}
          </p>
        </div>

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
            onClick={() => onConfirm(loan.id)}
            disabled={submitting}
          >
            {submitting ? 'Returning...' : 'Return Book'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReturnConfirmation;

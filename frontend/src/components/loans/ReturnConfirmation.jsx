const ReturnConfirmation = ({ isOpen, onClose, onConfirm, loan, submitting }) => {
  if (!isOpen || !loan) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Confirm Return</h2>
        <p>Are you sure you want to mark this loan as returned?</p>
        <div className="loan-summary-box">
          <p>
            <strong>Loan ID:</strong> {loan.id}
          </p>
          <p>
            <strong>Book ID:</strong> {loan.book_id}
          </p>
          <p>
            <strong>Member ID:</strong> {loan.member_id}
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
            {submitting ? 'Returning...' : 'Confirm Return'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReturnConfirmation;

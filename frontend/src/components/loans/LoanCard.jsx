import { useAuth } from '../../hooks/useAuth';

const LoanCard = ({ loan, onInitiateReturn, onInitiateDelete }) => {
  const { role } = useAuth();

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const isOverdue = loan.status === 'BORROWED' && new Date(loan.due_date) < new Date();

  const getBadgeClass = (status, overdue) => {
    if (status === 'RETURNED') return 'badge-available'; // green
    if (overdue) return 'badge-out-of-stock'; // red
    return 'badge-maintenance'; // orange for active
  };

  return (
    <div className="loan-card book-card">
      <div className="book-card-header">
        <h3 className="book-title">Loan #{loan.id}</h3>
        <span className={`badge ${getBadgeClass(loan.status, isOverdue)}`}>
          {loan.status} {isOverdue ? '(OVERDUE)' : ''}
        </span>
      </div>

      <div className="loan-details">
        <p>
          <strong>Book ID:</strong> {loan.book_id}
        </p>
        <p>
          <strong>Member ID:</strong> {loan.member_id}
        </p>
        <p>
          <strong>Borrowed:</strong> {formatDate(loan.borrow_date)}
        </p>
        <p>
          <strong>Due:</strong> {formatDate(loan.due_date)}
        </p>
        {loan.return_date && (
          <p>
            <strong>Returned:</strong> {formatDate(loan.return_date)}
          </p>
        )}
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
        {role === 'LIBRARIAN' && loan.status === 'BORROWED' && (
          <button
            className="btn btn-primary return-btn"
            style={{ flex: 1, margin: 0 }}
            onClick={() => onInitiateReturn(loan)}
          >
            Return Book
          </button>
        )}
        {role === 'ADMIN' && (
          <button
            className="btn btn-secondary"
            style={{ flex: 1, backgroundColor: '#c5221f', margin: 0 }}
            onClick={() => onInitiateDelete(loan)}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default LoanCard;

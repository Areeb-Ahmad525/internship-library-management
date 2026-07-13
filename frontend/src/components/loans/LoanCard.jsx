import { useAuth } from '../../hooks/useAuth';

const LoanCard = ({ loan, onInitiateReturn }) => {
  const { role } = useAuth();

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const isOverdue = loan.status === 'ACTIVE' && new Date(loan.due_date) < new Date();

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

      {role === 'LIBRARIAN' && loan.status === 'ACTIVE' && (
        <button className="btn btn-primary return-btn" onClick={() => onInitiateReturn(loan)}>
          Process Return
        </button>
      )}
    </div>
  );
};

export default LoanCard;

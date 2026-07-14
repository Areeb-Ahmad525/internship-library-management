import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import BorrowModal from '../loans/BorrowModal';
import { useLoans } from '../../hooks/useLoans';

const BookCard = ({ book, onBorrowSuccess, onEdit, onDelete }) => {
  const { role } = useAuth();
  const { borrow, submitting } = useLoans(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const getBadgeClass = (status) => {
    switch (status) {
      case 'AVAILABLE':
        return 'badge-available';
      case 'OUT_OF_STOCK':
        return 'badge-out-of-stock';
      case 'UNDER_MAINTENANCE':
        return 'badge-maintenance';
      case 'ARCHIVED':
        return 'badge-archived';
      default:
        return 'badge-default';
    }
  };

  return (
    <div className="book-card">
      <div className="book-card-header">
        <h3 className="book-title">{book.title}</h3>
        <span className={`badge ${getBadgeClass(book.status)}`}>
          {book.status.replace(/_/g, ' ')}
        </span>
      </div>
      <p className="book-author">By {book.author}</p>
      <div className="book-copies">
        <p>
          Available: <strong>{book.available_copies}</strong>
        </p>
        <p>
          Total: <strong>{book.total_copies}</strong>
        </p>
      </div>

      {['LIBRARIAN', 'ADMIN'].includes(role) && (
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
          <button
            className="btn btn-primary"
            style={{ flex: 1 }}
            onClick={() => setIsModalOpen(true)}
            disabled={book.status !== 'AVAILABLE' || book.available_copies === 0}
            title={book.status !== 'AVAILABLE' ? 'Book is not available' : 'Borrow this book'}
          >
            Borrow
          </button>
          <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => onEdit(book)}>
            Edit
          </button>
          <button
            className="btn btn-secondary"
            style={{ flex: 1, backgroundColor: '#c5221f' }}
            onClick={() => onDelete(book)}
          >
            Delete
          </button>
        </div>
      )}

      {isModalOpen && (
        <BorrowModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={async (payload) => {
            const success = await borrow(payload);
            if (success) {
              setIsModalOpen(false);
              if (onBorrowSuccess) onBorrowSuccess();
            }
          }}
          book={book}
          submitting={submitting}
        />
      )}
    </div>
  );
};

export default BookCard;

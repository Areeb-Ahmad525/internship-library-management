import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchBookById } from '../services/bookService';
import { fetchBookLoans } from '../services/loanService';
import LoanGrid from '../components/loans/LoanGrid';
import LoansSkeleton from '../components/loans/LoansSkeleton';

const BookDetailsPage = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [bookData, loansData] = await Promise.all([fetchBookById(id), fetchBookLoans(id)]);
        setBook(bookData);
        setLoans(loansData);
      } catch (err) {
        setError('Failed to load book details.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  if (loading)
    return (
      <div className="page-container">
        <LoansSkeleton />
      </div>
    );
  if (error)
    return (
      <div className="page-container">
        <div className="error-banner">{error}</div>
      </div>
    );
  if (!book) return <div className="page-container">Book not found.</div>;

  return (
    <div className="page-container">
      <Link
        to="/books"
        className="btn btn-secondary"
        style={{ marginBottom: '1rem', display: 'inline-block', textDecoration: 'none' }}
      >
        &larr; Back to Books
      </Link>

      <div className="book-card" style={{ marginBottom: '2rem' }}>
        <h2>{book.title}</h2>
        <p>
          <strong>Author:</strong> {book.author}
        </p>
        <p>
          <strong>Status:</strong> {book.status}
        </p>
        <p>
          <strong>Copies:</strong> {book.available_copies} / {book.total_copies}
        </p>
      </div>

      <h3>Loan History</h3>
      {loans.length === 0 ? <p>No loan history for this book.</p> : <LoanGrid loans={loans} />}
    </div>
  );
};

export default BookDetailsPage;

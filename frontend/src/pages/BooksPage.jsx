import { useBooks } from '../hooks/useBooks';
import BookSearch from '../components/books/BookSearch';
import BooksSkeleton from '../components/books/BooksSkeleton';
import EmptyBooks from '../components/books/EmptyBooks';
import BookGrid from '../components/books/BookGrid';

const BooksPage = () => {
  const { books, loading, error, search, refresh } = useBooks();

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Book Catalog</h1>
        <BookSearch onSearch={search} />
      </header>

      {error && <div className="error-banner">{error}</div>}

      {!error && loading && <BooksSkeleton />}

      {!error && !loading && books.length === 0 && <EmptyBooks />}

      {!error && !loading && books.length > 0 && (
        <BookGrid books={books} onBorrowSuccess={refresh} />
      )}
    </div>
  );
};

export default BooksPage;

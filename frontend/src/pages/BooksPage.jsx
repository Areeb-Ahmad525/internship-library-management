import { useBooks } from '../hooks/useBooks';
import BookSearch from '../components/books/BookSearch';
import BooksSkeleton from '../components/books/BooksSkeleton';
import EmptyBooks from '../components/books/EmptyBooks';
import BookGrid from '../components/books/BookGrid';
import BookFormModal from '../components/books/BookFormModal';
import DeleteBookModal from '../components/books/DeleteBookModal';
import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';

const BooksPage = () => {
  const { role } = useAuth();
  const { books, loading, error, search, refresh, submitting, create, update, remove } = useBooks();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleCreateNew = () => {
    setSelectedBook(null);
    setIsFormOpen(true);
  };

  const handleEdit = (book) => {
    setSelectedBook(book);
    setIsFormOpen(true);
  };

  const handleDeleteInitiate = (book) => {
    setSelectedBook(book);
    setIsDeleteOpen(true);
  };

  const handleFormSubmit = async (payload) => {
    let success;
    if (selectedBook) {
      success = await update(selectedBook.id, payload);
    } else {
      success = await create(payload);
    }

    if (success) {
      setIsFormOpen(false);
      setSelectedBook(null);
    }
  };

  const handleDeleteConfirm = async (id) => {
    const success = await remove(id);
    if (success) {
      setIsDeleteOpen(false);
      setSelectedBook(null);
    }
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <h1 style={{ margin: 0 }}>Book Catalog</h1>
          {['LIBRARIAN', 'ADMIN'].includes(role) && (
            <button className="btn btn-primary" onClick={handleCreateNew}>
              Add Book
            </button>
          )}
        </div>
        <BookSearch onSearch={search} />
      </header>

      {error && <div className="error-banner">{error}</div>}

      {!error && loading && <BooksSkeleton />}

      {!error && !loading && books.length === 0 && <EmptyBooks />}

      {!error && !loading && books.length > 0 && (
        <BookGrid
          books={books}
          onBorrowSuccess={refresh}
          onEdit={handleEdit}
          onDelete={handleDeleteInitiate}
        />
      )}

      <BookFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        book={selectedBook}
        submitting={submitting}
      />

      <DeleteBookModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        book={selectedBook}
        submitting={submitting}
      />
    </div>
  );
};

export default BooksPage;

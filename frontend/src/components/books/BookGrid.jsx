import BookCard from './BookCard';

const BookGrid = ({ books, onBorrowSuccess, onEdit, onDelete }) => {
  return (
    <div className="book-grid">
      {books.map((book) => (
        <BookCard
          key={book.id}
          book={book}
          onBorrowSuccess={onBorrowSuccess}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default BookGrid;

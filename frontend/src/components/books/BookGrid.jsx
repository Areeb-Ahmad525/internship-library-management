import BookCard from './BookCard';

const BookGrid = ({ books, onBorrowSuccess }) => {
  return (
    <div className="book-grid">
      {books.map((book) => (
        <BookCard key={book.id} book={book} onBorrowSuccess={onBorrowSuccess} />
      ))}
    </div>
  );
};

export default BookGrid;

import { useState, useEffect, useRef } from 'react';

const BookSearch = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const timerId = setTimeout(() => {
      onSearch(query);
    }, 400); // 400ms debounce

    return () => clearTimeout(timerId);
  }, [query, onSearch]);

  return (
    <div className="book-search-container">
      <input
        type="text"
        className="book-search"
        placeholder="Search books by title or author..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  );
};

export default BookSearch;

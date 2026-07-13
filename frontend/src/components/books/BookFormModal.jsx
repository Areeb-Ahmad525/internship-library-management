import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

const BookFormModal = ({ isOpen, onClose, onSubmit, book, submitting }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [totalCopies, setTotalCopies] = useState(1);
  const [availableCopies, setAvailableCopies] = useState(1);
  const [status, setStatus] = useState('AVAILABLE');

  useEffect(() => {
    if (isOpen && book) {
      setTitle(book.title);
      setAuthor(book.author);
      setTotalCopies(book.total_copies);
      setAvailableCopies(book.available_copies);
      setStatus(book.status);
    } else if (isOpen && !book) {
      setTitle('');
      setAuthor('');
      setTotalCopies(1);
      setAvailableCopies(1);
      setStatus('AVAILABLE');
    }
  }, [isOpen, book]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !author || totalCopies < 1) return;

    onSubmit({
      title,
      author,
      total_copies: parseInt(totalCopies, 10),
      available_copies: parseInt(availableCopies, 10),
      status,
    });
  };

  const isUpdate = !!book;

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxHeight: '90vh', overflowY: 'auto' }}
      >
        <h2>{isUpdate ? 'Edit Book' : 'Add New Book'}</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="bookTitle">Title</label>
            <input
              id="bookTitle"
              type="text"
              required
              minLength="1"
              maxLength="255"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 1984"
            />
          </div>

          <div className="form-group">
            <label htmlFor="bookAuthor">Author</label>
            <input
              id="bookAuthor"
              type="text"
              required
              minLength="1"
              maxLength="255"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="e.g. George Orwell"
            />
          </div>

          <div className="form-group">
            <label htmlFor="totalCopies">Total Copies</label>
            <input
              id="totalCopies"
              type="number"
              required
              min="1"
              value={totalCopies}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10) || 1;
                setTotalCopies(val);
                if (!isUpdate) setAvailableCopies(val); // Sync on create
              }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="availableCopies">Available Copies</label>
            <input
              id="availableCopies"
              type="number"
              required
              min="0"
              max={totalCopies}
              value={availableCopies}
              onChange={(e) => setAvailableCopies(parseInt(e.target.value, 10) || 0)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="bookStatus">Status</label>
            <select
              id="bookStatus"
              required
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="form-control"
              style={{
                padding: '0.75rem',
                borderRadius: '6px',
                backgroundColor: '#333',
                color: 'white',
                border: '1px solid #444',
              }}
            >
              <option value="AVAILABLE">Available</option>
              <option value="OUT_OF_STOCK">Out of Stock</option>
              <option value="UNDER_MAINTENANCE">Under Maintenance</option>
              <option value="ARCHIVED">Archived</option>
            </select>
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
              type="submit"
              className="btn btn-primary"
              disabled={submitting || !title || !author}
            >
              {submitting ? 'Saving...' : isUpdate ? 'Update Book' : 'Create Book'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default BookFormModal;

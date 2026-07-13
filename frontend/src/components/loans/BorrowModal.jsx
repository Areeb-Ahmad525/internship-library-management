import { useState, useEffect } from 'react';
import { useMembers } from '../../hooks/useMembers';

const BorrowModal = ({ isOpen, onClose, onSubmit, book, submitting }) => {
  const { members, loading, error } = useMembers();
  const [memberId, setMemberId] = useState('');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    if (!isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMemberId('');

      setDueDate('');
    }
  }, [isOpen]);

  if (!isOpen || !book) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!memberId || !dueDate) return;

    // Standardize due_date to ISO string for backend
    const payload = {
      book_id: book.id,
      member_id: parseInt(memberId, 10),
      due_date: new Date(dueDate).toISOString(),
    };

    onSubmit(payload);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Borrow {book.title}</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="memberId">Select Member</label>
            {loading ? (
              <select id="memberId" disabled className="form-control">
                <option>Loading members...</option>
              </select>
            ) : error ? (
              <select id="memberId" disabled className="form-control">
                <option>Error loading members</option>
              </select>
            ) : (
              <select
                id="memberId"
                required
                value={memberId}
                onChange={(e) => setMemberId(e.target.value)}
                className="form-control"
                style={{
                  padding: '0.75rem',
                  borderRadius: '6px',
                  backgroundColor: '#333',
                  color: 'white',
                  border: '1px solid #444',
                }}
              >
                <option value="" disabled>
                  -- Select a Member --
                </option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.email})
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="dueDate">Due Date</label>
            <input
              id="dueDate"
              type="date"
              required
              value={dueDate}
              min={new Date().toISOString().split('T')[0]} // Prevents past dates
              onChange={(e) => setDueDate(e.target.value)}
            />
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
              disabled={submitting || !memberId || !dueDate || loading || error}
            >
              {submitting ? 'Borrowing...' : 'Confirm Borrow'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BorrowModal;

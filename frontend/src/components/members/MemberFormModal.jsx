import { useState, useEffect } from 'react';

const MemberFormModal = ({ isOpen, onClose, onSubmit, member, submitting }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (isOpen && member) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName(member.name);

      setEmail(member.email);
    } else if (isOpen && !member) {
      setName('');

      setEmail('');
    }
  }, [isOpen, member]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email) return;

    // Use null for email if it hasn't changed on update, to avoid unique constraint if backend complains,
    // actually it's fine, the backend allows sending the same email on update.
    onSubmit({ name, email });
  };

  const isUpdate = !!member;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{isUpdate ? 'Edit Member' : 'Add New Member'}</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="memberName">Name</label>
            <input
              id="memberName"
              type="text"
              required
              minLength="2"
              maxLength="255"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. John Doe"
            />
          </div>

          <div className="form-group">
            <label htmlFor="memberEmail">Email</label>
            <input
              id="memberEmail"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. john@example.com"
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
              disabled={submitting || !name || !email}
            >
              {submitting ? 'Saving...' : isUpdate ? 'Update Member' : 'Create Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MemberFormModal;

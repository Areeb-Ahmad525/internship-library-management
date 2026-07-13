import { useState, useEffect } from 'react';

const RoleModal = ({ isOpen, onClose, onConfirm, user, submitting }) => {
  const [role, setRole] = useState('MEMBER');

  useEffect(() => {
    if (isOpen && user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRole(user.role);
    }
  }, [isOpen, user]);

  if (!isOpen || !user) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (role === user.role) {
      onClose();
      return;
    }
    onConfirm(user.id, role);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Change Role for {user.username}</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="roleSelect">Role</label>
            <select
              id="roleSelect"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="form-control"
              style={{
                padding: '0.75rem',
                borderRadius: '6px',
                backgroundColor: '#333',
                color: 'white',
                border: '1px solid #444',
              }}
            >
              <option value="MEMBER">MEMBER</option>
              <option value="LIBRARIAN">LIBRARIAN</option>
              <option value="ADMIN">ADMIN</option>
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
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Updating...' : 'Update Role'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoleModal;

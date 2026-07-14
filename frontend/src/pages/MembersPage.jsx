import { useState } from 'react';
import { useMembers } from '../hooks/useMembers';
import MemberGrid from '../components/members/MemberGrid';
import MembersSkeleton from '../components/members/MembersSkeleton';
import EmptyMembers from '../components/members/EmptyMembers';
import MemberFormModal from '../components/members/MemberFormModal';
import DeleteMemberModal from '../components/members/DeleteMemberModal';

const MembersPage = () => {
  const { members, loading, error, submitting, create, update, remove } = useMembers();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null); // Used for both Edit and Delete
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleCreateNew = () => {
    setSelectedMember(null);
    setIsFormOpen(true);
  };

  const handleEdit = (member) => {
    setSelectedMember(member);
    setIsFormOpen(true);
  };

  const handleDeleteInitiate = (member) => {
    setSelectedMember(member);
    setIsDeleteOpen(true);
  };

  const handleFormSubmit = async (payload) => {
    let success;
    if (selectedMember) {
      success = await update(selectedMember.id, payload);
    } else {
      success = await create(payload);
    }

    if (success) {
      setIsFormOpen(false);
      setSelectedMember(null);
    }
  };

  const handleDeleteConfirm = async (id) => {
    const success = await remove(id);
    if (success) {
      setIsDeleteOpen(false);
      setSelectedMember(null);
    }
  };

  return (
    <div className="page-container">
      <header
        className="page-header"
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <h1>Members Management</h1>
        <button className="btn btn-primary" onClick={handleCreateNew}>
          Add Member
        </button>
      </header>

      {error && <div className="error-banner">{error}</div>}

      {!error && loading && <MembersSkeleton />}

      {!error && !loading && members.length === 0 && <EmptyMembers />}

      {!error && !loading && members.length > 0 && (
        <MemberGrid members={members} onEdit={handleEdit} onDelete={handleDeleteInitiate} />
      )}

      <MemberFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        member={selectedMember}
        submitting={submitting}
      />

      <DeleteMemberModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        member={selectedMember}
        submitting={submitting}
      />
    </div>
  );
};

export default MembersPage;

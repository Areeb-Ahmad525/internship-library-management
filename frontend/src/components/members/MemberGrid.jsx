import MemberCard from './MemberCard';

const MemberGrid = ({ members, onEdit, onDelete }) => {
  return (
    <div className="book-grid">
      {members.map((member) => (
        <MemberCard key={member.id} member={member} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
};

export default MemberGrid;

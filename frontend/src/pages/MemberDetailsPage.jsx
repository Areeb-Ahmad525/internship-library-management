import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchMember } from '../services/memberService';
import { fetchMemberLoans } from '../services/loanService';
import LoanGrid from '../components/loans/LoanGrid';
import LoansSkeleton from '../components/loans/LoansSkeleton';

const MemberDetailsPage = () => {
  const { id } = useParams();
  const [member, setMember] = useState(null);
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [memberData, loansData] = await Promise.all([fetchMember(id), fetchMemberLoans(id)]);
        setMember(memberData);
        setLoans(loansData);
      } catch {
        setError('Failed to load member details.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  if (loading)
    return (
      <div className="page-container">
        <LoansSkeleton />
      </div>
    );
  if (error)
    return (
      <div className="page-container">
        <div className="error-banner">{error}</div>
      </div>
    );
  if (!member) return <div className="page-container">Member not found.</div>;

  return (
    <div className="page-container">
      <Link
        to="/members"
        className="btn btn-secondary"
        style={{ marginBottom: '1rem', display: 'inline-block', textDecoration: 'none' }}
      >
        &larr; Back to Members
      </Link>

      <div className="book-card" style={{ marginBottom: '2rem' }}>
        <h2>{member.name}</h2>
        <p>
          <strong>Email:</strong> {member.email}
        </p>
        <p>
          <strong>Status:</strong> {member.is_active ? 'Active' : 'Inactive'}
        </p>
      </div>

      <h3>Loan History</h3>
      {loans.length === 0 ? <p>No loan history for this member.</p> : <LoanGrid loans={loans} />}
    </div>
  );
};

export default MemberDetailsPage;

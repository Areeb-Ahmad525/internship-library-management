import { useState } from 'react';
import { useLoans } from '../hooks/useLoans';
import LoanGrid from '../components/loans/LoanGrid';
import LoansSkeleton from '../components/loans/LoansSkeleton';
import EmptyLoans from '../components/loans/EmptyLoans';
import ReturnConfirmation from '../components/loans/ReturnConfirmation';
import DeleteLoanModal from '../components/loans/DeleteLoanModal';
import { useAuth } from '../hooks/useAuth';

const LoansPage = () => {
  const { role } = useAuth();
  const { loans, loading, error, submitting, returnLoan, remove, refresh } = useLoans();
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [deleteLoanData, setDeleteLoanData] = useState(null);
  const [filter, setFilter] = useState('ALL');

  const handleReturnConfirm = async (loanId) => {
    const success = await returnLoan(loanId);
    if (success) {
      setSelectedLoan(null);
    }
  };

  const handleDeleteConfirm = async (loanId) => {
    const success = await remove(loanId);
    if (success) {
      setDeleteLoanData(null);
    }
  };

  const toggleFilter = () => {
    const newFilter = filter === 'ALL' ? 'ACTIVE' : 'ALL';
    setFilter(newFilter);
    refresh(newFilter);
  };

  return (
    <div className="page-container">
      <header
        className="page-header"
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <h1>Loan Management</h1>
        <button className="btn btn-secondary" onClick={toggleFilter} disabled={loading}>
          {filter === 'ALL' ? 'Show Active Only' : 'Show All Loans'}
        </button>
      </header>

      {error && <div className="error-banner">{error}</div>}

      {!error && loading && <LoansSkeleton />}

      {!error && !loading && loans.length === 0 && <EmptyLoans />}

      {!error && !loading && loans.length > 0 && (
        <LoanGrid
          loans={loans}
          onInitiateReturn={(loan) => setSelectedLoan(loan)}
          onInitiateDelete={(loan) => setDeleteLoanData(loan)}
        />
      )}

      <ReturnConfirmation
        isOpen={!!selectedLoan}
        onClose={() => setSelectedLoan(null)}
        onConfirm={handleReturnConfirm}
        loan={selectedLoan}
        submitting={submitting}
      />

      <DeleteLoanModal
        isOpen={!!deleteLoanData}
        onClose={() => setDeleteLoanData(null)}
        onConfirm={handleDeleteConfirm}
        loan={deleteLoanData}
        submitting={submitting}
      />
    </div>
  );
};

export default LoansPage;

import { useState } from 'react';
import { useLoans } from '../hooks/useLoans';
import LoanGrid from '../components/loans/LoanGrid';
import LoansSkeleton from '../components/loans/LoansSkeleton';
import EmptyLoans from '../components/loans/EmptyLoans';
import ReturnConfirmation from '../components/loans/ReturnConfirmation';

const LoansPage = () => {
  const { loans, loading, error, submitting, returnLoan } = useLoans();
  const [selectedLoan, setSelectedLoan] = useState(null);

  const handleReturnConfirm = async (loanId) => {
    const success = await returnLoan(loanId);
    if (success) {
      setSelectedLoan(null);
    }
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Loan Management</h1>
      </header>

      {error && <div className="error-banner">{error}</div>}

      {!error && loading && <LoansSkeleton />}

      {!error && !loading && loans.length === 0 && <EmptyLoans />}

      {!error && !loading && loans.length > 0 && (
        <LoanGrid loans={loans} onInitiateReturn={(loan) => setSelectedLoan(loan)} />
      )}

      <ReturnConfirmation
        isOpen={!!selectedLoan}
        onClose={() => setSelectedLoan(null)}
        onConfirm={handleReturnConfirm}
        loan={selectedLoan}
        submitting={submitting}
      />
    </div>
  );
};

export default LoansPage;

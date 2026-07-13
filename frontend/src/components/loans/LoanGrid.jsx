import LoanCard from './LoanCard';

const LoanGrid = ({ loans, onInitiateReturn }) => {
  return (
    <div className="book-grid">
      {loans.map((loan) => (
        <LoanCard key={loan.id} loan={loan} onInitiateReturn={onInitiateReturn} />
      ))}
    </div>
  );
};

export default LoanGrid;

import LoanCard from './LoanCard';

const LoanGrid = ({ loans, onInitiateReturn, onInitiateDelete }) => {
  return (
    <div className="book-grid">
      {loans.map((loan) => (
        <LoanCard
          key={loan.id}
          loan={loan}
          onInitiateReturn={onInitiateReturn}
          onInitiateDelete={onInitiateDelete}
        />
      ))}
    </div>
  );
};

export default LoanGrid;

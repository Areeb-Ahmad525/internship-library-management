const LoansSkeleton = () => {
  const skeletons = Array.from({ length: 4 });

  return (
    <div className="book-grid">
      {skeletons.map((_, index) => (
        <div key={index} className="book-card skeleton-card">
          <div className="skeleton-pulse skeleton-title" style={{ width: '40%' }}></div>
          <div
            className="skeleton-pulse skeleton-author"
            style={{ width: '60%', margin: '0.25rem 0' }}
          ></div>
          <div
            className="skeleton-pulse skeleton-author"
            style={{ width: '50%', margin: '0.25rem 0' }}
          ></div>
          <div
            className="skeleton-pulse skeleton-author"
            style={{ width: '55%', margin: '0.25rem 0' }}
          ></div>
          <div
            className="skeleton-pulse skeleton-copies"
            style={{ height: '2.5rem', marginTop: '1rem' }}
          ></div>
        </div>
      ))}
    </div>
  );
};

export default LoansSkeleton;

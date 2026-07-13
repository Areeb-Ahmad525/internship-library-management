const MembersSkeleton = () => {
  const skeletons = Array.from({ length: 4 });

  return (
    <div className="book-grid">
      {skeletons.map((_, index) => (
        <div key={index} className="book-card skeleton-card">
          <div className="skeleton-pulse skeleton-title" style={{ width: '60%' }}></div>
          <div
            className="skeleton-pulse skeleton-author"
            style={{ width: '80%', margin: '0.25rem 0' }}
          ></div>
          <div
            className="skeleton-pulse skeleton-copies"
            style={{ height: '2.5rem', marginTop: '2rem' }}
          ></div>
        </div>
      ))}
    </div>
  );
};

export default MembersSkeleton;

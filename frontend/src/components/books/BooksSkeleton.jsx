const BooksSkeleton = () => {
  // Render 8 skeleton cards
  const skeletons = Array.from({ length: 8 });

  return (
    <div className="book-grid">
      {skeletons.map((_, index) => (
        <div key={index} className="book-card skeleton-card">
          <div className="skeleton-pulse skeleton-title"></div>
          <div className="skeleton-pulse skeleton-author"></div>
          <div className="skeleton-pulse skeleton-copies"></div>
        </div>
      ))}
    </div>
  );
};

export default BooksSkeleton;

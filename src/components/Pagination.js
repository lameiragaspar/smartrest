import React from 'react';

const Pagination = ({ totalPages, currentPage, setCurrentPage }) => {
  const getPageNumbers = () => {
    const pageNumbers = [];
    const showLeftDots = currentPage > 3;
    const showRightDots = currentPage < totalPages - 2;

    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(totalPages - 1, currentPage + 1);

    if (!showLeftDots) {
      startPage = 2;
      endPage = Math.min(totalPages - 1, 4);
    }

    if (!showRightDots) {
      startPage = Math.max(2, totalPages - 3);
      endPage = totalPages - 1;
    }

    pageNumbers.push(1); // always show first page

    if (showLeftDots) pageNumbers.push('left-dots');

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    if (showRightDots) pageNumbers.push('right-dots');

    if (totalPages > 1) pageNumbers.push(totalPages); // always show last page

    return pageNumbers;
  };

  return (
    <div className="col-lg-12">
      <div className="pagination mt-4 d-flex justify-content-center">
        <ul className="d-flex list-unstyled gap-2">
          {getPageNumbers().map((page, index) => {
            if (page === 'left-dots' || page === 'right-dots') {
              return (
                <li key={page + index}>
                  <span className="btn btn-light disabled">...</span>
                </li>
              );
            }

            return (
              <li key={page}>
                <button
                  className={`btn ${currentPage === page ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Pagination;
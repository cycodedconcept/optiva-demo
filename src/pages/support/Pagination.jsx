import React from 'react'

const Pagination = ({ currentPage, totalPages, perPage, total, onPageChange, onPerPageChange}) => {
    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxPagesToShow = 5; // Show max 5 page numbers at a time
    
        if (totalPages <= maxPagesToShow) {
          // If total pages is less than max, show all pages
          for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(i);
          }
        } else {
          // Complex logic for when we have many pages
          if (currentPage <= 3) {
            // At the start
            for (let i = 1; i <= 5; i++) {
              pageNumbers.push(i);
            }
          } else if (currentPage >= totalPages - 2) {
            // At the end
            for (let i = totalPages - 4; i <= totalPages; i++) {
              pageNumbers.push(i);
            }
          } else {
            // In the middle
            for (let i = currentPage - 2; i <= currentPage + 2; i++) {
              pageNumbers.push(i);
            }
          }
        }
        return pageNumbers;
    };
    
    const perPageOptions = [10, 20, 50, 100];

    return (
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-3 mt-4 p-3 bg-white">
          {/* Items per page selector */}
          <div className="d-flex align-items-center gap-2">
            <span className="text-secondary">Show</span>
            <select
              value={perPage}
              onChange={(e) => onPerPageChange(Number(e.target.value))}
              className="form-select form-select-sm"
              style={{ width: 'auto' }}
            >
              {perPageOptions.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <span className="text-secondary ml-3">entries</span>
          </div>
    
          {/* Pagination info */}
          <div className="text-secondary">
            Showing {Math.min((currentPage - 1) * perPage + 1, total)} to{' '}
            {Math.min(currentPage * perPage, total)} of {total} entries
          </div>
    
          {/* Page navigation */}
          <nav aria-label="Page navigation">
            <ul className="pagination mb-0">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button
                  className="page-link"
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <span aria-hidden="true">&laquo;</span>
                </button>
              </li>
    
              {getPageNumbers().map(pageNum => (
                <li
                  key={pageNum}
                  className={`page-item ${currentPage === pageNum ? 'active' : ''}`}
                >
                  <button
                    className="page-link"
                    onClick={() => onPageChange(pageNum)}
                  >
                    {pageNum}
                  </button>
                </li>
              ))}
    
              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <button
                  className="page-link"
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <span aria-hidden="true">&raquo;</span>
                </button>
              </li>
            </ul>
          </nav>
        </div>
    );
}

export default Pagination
import React from 'react'

const Pagination = ({ currentPage, totalPages, perPage, total, onPageChange, onPerPageChange}) => {
    // Convert currentPage to number to ensure it's always a number
    const currentPageNum = Number(currentPage) || 1; // Default to 1 if conversion fails
    
    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxPagesToShow = 5;
    
        if (totalPages <= maxPagesToShow) {
          for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(i);
          }
        } else {
          if (currentPageNum <= 3) {
            for (let i = 1; i <= 5; i++) {
              pageNumbers.push(i);
            }
          } else if (currentPageNum >= totalPages - 2) {
            for (let i = totalPages - 4; i <= totalPages; i++) {
              pageNumbers.push(i);
            }
          } else {
            for (let i = currentPageNum - 2; i <= currentPageNum + 2; i++) {
              pageNumbers.push(i);
            }
          }
        }
        return pageNumbers;
    };
    
    // Ensure page changes always pass numbers
    const handlePageChange = (page) => {
        onPageChange(Number(page));
    };
    
    // const perPageOptions = [10, 20, 50, 100];

    return (
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-3 mt-4 p-3 bg-white">
          {/* Items per page selector */}
          {/* <div className="d-flex align-items-center gap-2">
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
          </div> */}
    
          
          <div className="text-secondary">
            Showing {total > 0 ? Math.min((currentPageNum - 1) * perPage + 1, total) : 0} to{' '}
            {total > 0 ? Math.min(currentPageNum * perPage, total) : 0} of {total} entries
          </div>
    
          {/* Page navigation */}
          <nav aria-label="Page navigation">
            <ul className="pagination mb-0">
              <li className={`page-item ${currentPageNum === 1 ? 'disabled' : ''}`}>
                <button
                  className="page-link btn"
                  onClick={() => handlePageChange(currentPageNum - 1)}
                  disabled={currentPageNum === 1}
                >
                  <span aria-hidden="true">&laquo;</span>
                </button>
              </li>
    
              {getPageNumbers().map(pageNum => (
                <li
                  key={pageNum}
                  className={`page-item ${currentPageNum === pageNum ? 'active' : ''}`}
                >
                  <button
                    className="page-link btn"
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </button>
                </li>
              ))}
    
              <li className={`page-item ${currentPageNum === totalPages ? 'disabled' : ''}`}>
                <button
                  className="page-link btn"
                  onClick={() => handlePageChange(currentPageNum + 1)}
                  disabled={currentPageNum === totalPages}
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
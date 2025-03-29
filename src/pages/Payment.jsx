import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPayments, clearPayment, updatePaymentPin, updatePaymentStatus, cancelPaymentPinProcess, filterPayment, searchPayment } from '../features/paymentSlice';
import { Fil, Inv } from '../assets/images';
import Swal from 'sweetalert2';
import Pagination from './support/Pagination';
import { debounce }  from 'lodash';

const Payment = () => {
  const dispatch = useDispatch();
  let token = localStorage.getItem("token");
  const getId = localStorage.getItem("sid");
  const { error, loading, payment, currentPage, per_page, total, total_pages, fillItem, fillCurrentPage, fillPerPage, fillTotal, fillTotalPages, search, sCurrentPage, sTotalPages, sTotal, sPerPage} = useSelector((state) => state.payment);
  const [payData, setPayData] = useState(null);
  const [mod, setMod] = useState(false)
  const [statusInv, setStatusInv] = useState(false);
  const [dvalue, setDvalue] = useState('');
  const [second, setSecond] = useState(false);
  const [second2, setSecond2] = useState(false);

  const filterStatus = [
    { label: "All", value: "All" },
    { label: "Paid", value: "Paid" },
    { label: "Pending", value: "Pending" },
    { label: "Cancelled", value: "Cancel" },
    { label: "Refunded", value: "Refund" }
  ];
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [isFiltering, setIsFiltering] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [inputValue, setInputValue] = useState('');

  const handleSearch = (e) => {
    let value = e.target.value
    setInputValue(value)

    if (value.trim() === '') {
      setIsSearching(false);
      dispatch(getPayments({token, shop_id: getId, page: currentPage, per_page: per_page}));
    } else {
      setIsSearching(true);
      setIsFiltering(false); // Turn off filtering when searching
      
      if (token) {
        dispatch(searchPayment({token, shop_id: getId, search_value: value, page: sCurrentPage, per_page: sPerPage}));
      }
    }
  }

  const handleFilterClick = (status) => {
    setSelectedStatus(status.label);
    setActiveFilter(status.value);
    setInputValue(''); // Clear search input when filtering
    
    if (token) {
      if (status.value === "All") {
        setIsFiltering(false);
        setIsSearching(false);
        dispatch(getPayments({
          token, 
          shop_id: getId, 
          page: 1, 
          per_page
        }));
      } else {
        setIsFiltering(true);
        setIsSearching(false);
        dispatch(filterPayment({
          token, 
          shop_id: getId, 
          search_value: status.value, 
          page: 1,
          per_page: fillPerPage
        }));
      }
    }
  };

  const itemFilter = filterStatus.map((item) => (
    <button 
      key={item.value} 
      className="btn"
      onClick={() => handleFilterClick(item)}
      style={{
        backgroundColor: selectedStatus === item.label ? "#7A0091" : "",
        color: selectedStatus === item.label ? "#fff" : "#000",
        padding: "8px 16px",
        margin: "5px",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "16px",
        outline: "none",
        boxShadow: "none"
      }}
    >
      {item.label}
    </button>
  ));

  useEffect(() => {
    if (token) {
      dispatch(getPayments({token, shop_id: getId, page: currentPage, per_page: per_page}))
    }
  }, [token, dispatch, currentPage, per_page])

  const debouncedSearch = useCallback(
    debounce((searchValue) => {
      dispatch(clearPayment());
      dispatch(getPayments({ token, shop_id: getId, page: 1, per_page }));
    }, 300),
    [dispatch, token, getId, per_page]
  );
  
  useEffect(() => {
    return () => {
        debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const hideModal = () => {
    setMod(false)
    setStatusInv(false);
    setSecond(false);
    setSecond2(false);
    localStorage.removeItem("p-status");
  }

  // Determine which data to display based on filters and search
  const getDisplayData = () => {
    if (isSearching) return search;
    if (isFiltering) return fillItem;
    return payment;
  };

  // Get pagination parameters based on current mode
  const getPaginationParams = () => {
    if (isSearching) {
      return {
        currentPage: sCurrentPage,
        totalPages: sTotalPages,
        perPage: sPerPage,
        total: sTotal
      };
    }
    if (isFiltering) {
      return {
        currentPage: fillCurrentPage,
        totalPages: fillTotalPages,
        perPage: fillPerPage,
        total: fillTotal
      };
    }
    return {
      currentPage: currentPage,
      totalPages: total_pages,
      perPage: per_page,
      total: total
    };
  };

  const proDetails = (iNumber) => {
    setMod(true)
    const payItem = localStorage.getItem("payment");
    const det = JSON.parse(payItem);

    const selectedPayment = det.data.find((item) => item.invoice_number === iNumber);
    console.log(selectedPayment)

    if (selectedPayment) {
      setPayData(selectedPayment)
    }
  }

  const changeStatus = (payment, inum) => {
    if (payment === "Paid" || payment === "paid") {
      localStorage.setItem("ivv2", inum)
      setStatusInv(true)
    }else if (payment === "Pending" || "pending") {
      localStorage.setItem("ivv2", inum);
      localStorage.setItem("p-status", payment)
      setStatusInv(true)
      console.log("this is pending")
    }
    else {
      setStatusInv(false)
    }
  }

  const handlePinChange = async (e) => {
    e.preventDefault();
    const getIn = localStorage.getItem("ivv2");
    const getSta = localStorage.getItem("p-status");

    if (dvalue === "") {
        Swal.fire({
            icon: "info",
            title: "updating product",
            text: 'All these fields are required!',
            confirmButtonColor: '#7A0091'
        })
        return;
    }
    try {
        Swal.fire({
            title: "Validating Pin...",
            text: "Please wait while we process your request.",
            allowOutsideClick: false,
            showConfirmButton: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });

        const response = await dispatch(updatePaymentPin({token, invoice_number: getIn, pin: dvalue})).unwrap();

        Swal.close();

        if (response.message === "success") {
          hideModal();
          setDvalue('');
          if (getSta) {
           setSecond2(true);
          }else {
           setSecond(true);
          }
        }
        else {
            Swal.fire({
                icon: "info",
                title: "Validating Pin",
                text: `${response.message}`,
            });
        }
    } 
    catch (error) {
        Swal.close();
        let errorMessage = "Something went wrong";
            
        if (error && typeof error === "object") {
            if (Array.isArray(error)) {
                errorMessage = error.map(item => item.message).join(", ");
            } else if (error.message) {
                errorMessage = error.message;
            } else if (error.response && error.response.data) {
                errorMessage = Array.isArray(error.response.data) 
                    ? error.response.data.map(item => item.message).join(", ") 
                    : error.response.data.message || JSON.stringify(error.response.data);
            }
        }
    
        Swal.fire({
            icon: "error",
            title: "Error Occurred",
            text: errorMessage,
        });
    }
  }

  const handlePaid = async (e) => {
    e.preventDefault();
    const getIn = localStorage.getItem("ivv2");

    try {
        Swal.fire({
            title: "Validating Payment Status...",
            text: "Please wait while we process your request.",
            allowOutsideClick: false,
            showConfirmButton: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });

        const response = await dispatch(updatePaymentStatus({token, invoice_number: getIn, shop_id: getId, status: 'Refund'})).unwrap();

        if (response.message === "Payment updated") {
            Swal.fire({
                icon: "success",
                title: "updating payment status",
                text: `${response.message}`,
            });

            hideModal();
            dispatch(getPayments({token, shop_id: getId, page: currentPage, per_page: per_page}))
        }
        else {
            Swal.fire({
              icon: "info",
              title: "updating payment status",
              text: `${response.message}`,
            });
        }
    } catch (error) {
      let errorMessage = "Something went wrong";
          
      if (error && typeof error === "object") {
          if (Array.isArray(error)) {
              errorMessage = error.map(item => item.message).join(", ");
          } else if (error.message) {
              errorMessage = error.message;
          } else if (error.response && error.response.data) {
              errorMessage = Array.isArray(error.response.data) 
                  ? error.response.data.map(item => item.message).join(", ") 
                  : error.response.data.message || JSON.stringify(error.response.data);
          }
      }
  
      Swal.fire({
          icon: "error",
          title: "Error Occurred",
          text: errorMessage,
      });
    }
  }

  const handleCancle = async (e) => {
    e.preventDefault();
    const getIn = localStorage.getItem("ivv2");

    try {
        Swal.fire({
            title: "canceling Payment Status...",
            text: "Please wait while we process your request.",
            allowOutsideClick: false,
            showConfirmButton: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });

        const response = await dispatch(cancelPaymentPinProcess({token, invoice_number: getIn})).unwrap();

        if (response.message === "success") {
            Swal.fire({
                icon: "success",
                title: "canceling payment status",
                text: `${response.message}`,
            });

            hideModal();
            dispatch(getPayments({token, shop_id: getId, page: currentPage, per_page: per_page}))
        }
        else {
            Swal.fire({
              icon: "info",
              title: "canceling payment status",
              text: `${response.message}`,
            });
        }
    } catch (error) {
      let errorMessage = "Something went wrong";
          
      if (error && typeof error === "object") {
          if (Array.isArray(error)) {
              errorMessage = error.map(item => item.message).join(", ");
          } else if (error.message) {
              errorMessage = error.message;
          } else if (error.response && error.response.data) {
              errorMessage = Array.isArray(error.response.data) 
                  ? error.response.data.map(item => item.message).join(", ") 
                  : error.response.data.message || JSON.stringify(error.response.data);
          }
      }
  
      Swal.fire({
          icon: "error",
          title: "Error Occurred",
          text: errorMessage,
      });
    }
  }

  const handlePending = async (e) => {
    e.preventDefault();
    const getIn = localStorage.getItem("ivv2");

    try {
        Swal.fire({
            title: "Validating Payment Status...",
            text: "Please wait while we process your request.",
            allowOutsideClick: false,
            showConfirmButton: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });

        const response = await dispatch(updatePaymentStatus({token, invoice_number: getIn, shop_id: getId, status: 'Cancel'})).unwrap();

        if (response.message === "Payment updated") {
            Swal.fire({
                icon: "success",
                title: "updating payment status",
                text: `${response.message}`,
            });

            hideModal();
            dispatch(getPayments({token, shop_id: getId, page: currentPage, per_page: per_page}))
        }
        else {
            Swal.fire({
              icon: "info",
              title: "updating payment status",
              text: `${response.message}`,
            });
        }
    } catch (error) {
      let errorMessage = "Something went wrong";
          
      if (error && typeof error === "object") {
          if (Array.isArray(error)) {
              errorMessage = error.map(item => item.message).join(", ");
          } else if (error.message) {
              errorMessage = error.message;
          } else if (error.response && error.response.data) {
              errorMessage = Array.isArray(error.response.data) 
                  ? error.response.data.map(item => item.message).join(", ") 
                  : error.response.data.message || JSON.stringify(error.response.data);
          }
      }
  
      Swal.fire({
          icon: "error",
          title: "Error Occurred",
          text: errorMessage,
      });
    }
  }

  // Get pagination parameters
  const paginationParams = getPaginationParams();
  const displayData = getDisplayData();

  return (
    <>
      <div className='mt-5 py-3 px-4' style={{background: '#fff'}}>
        {itemFilter}

        <hr/>
        <div className="search-container text-right">
          <input 
              type="text" 
              placeholder="Search..." 
              className="search-input" 
              style={{borderRadius: '5px'}} 
              value={inputValue} 
              onChange={handleSearch}
          />
          <span 
              className="search-icon" 
              style={{
                  position: "absolute",
                  right: "10px",
                  top: "20px",
                  fontSize: "20px",
                  color: "#222",
                  cursor: "pointer"
              }}
          >
              &#128269;
          </span>
        </div>

        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>Error: {error?.message || 'Something went wrong'}</div>
        ) : (
          <div className="table-content">
            <div className="table-container mt-5">
              <table className="my-table w-100">
                <thead>
                  <tr>
                    <th style={{width: '5%'}}><div className='d-flex justify-content-between'><p>S/N</p><div><img src={Fil} alt="" /></div></div></th>
                    <th style={{width: '25%'}}><div className='d-flex justify-content-between'><p>Customer Name</p><div><img src={Fil} alt="" /></div></div></th>
                    <th style={{width: '13%'}}><div className='d-flex justify-content-between'><p>Invoice Number</p><div><img src={Fil} alt="" /></div></div></th>
                    <th style={{width: '12%'}}><div className='d-flex justify-content-between'><p>Date</p><div><img src={Fil} alt="" /></div></div></th>
                    <th style={{width: '13%'}}><div className='d-flex justify-content-between'><p>Payment Method</p><div><img src={Fil} alt="" /></div></div></th>
                    <th style={{width: '18%'}}><div className='d-flex justify-content-between'><p>Discount Name</p><div><img src={Fil} alt="" /></div></div></th>
                    <th style={{width: '25%'}}><div className='d-flex justify-content-between'><p>Payment Status</p><div><img src={Fil} alt="" /></div></div></th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="9">Loading...</td></tr>
                  ) : displayData && displayData.length > 0 ? (
                    displayData.map((item, index) => (
                      <tr key={index} onClick={() => proDetails(item.invoice_number)} style={{ cursor: 'pointer' }}>
                        <td>{index + 1}</td>
                        <td>{item.customer_name}</td>
                        <td>{item.invoice_number}</td>
                        <td>{item.date}</td>
                        <td>{item.payment_method}</td>
                        <td>{item.invoicedata.discount_name || '-------'}</td>
                        <td onClick={(e) => {changeStatus(item.payment_status, item.invoice_number); e.stopPropagation();}}>
                          <button className={item.payment_status}>{item.payment_status}</button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9">
                        {isSearching ? 'No search results found' : 
                         isFiltering ? 'No filtered payments available' : 
                         'No payments available'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="sticky-pagination">
              <Pagination
                currentPage={paginationParams.currentPage}
                totalPages={paginationParams.totalPages}
                perPage={paginationParams.perPage}
                total={paginationParams.total}
                onPageChange={(newPage) => {
                  if (isSearching) {
                    dispatch(searchPayment({
                      token,
                      shop_id: getId,
                      search_value: inputValue,
                      page: newPage,
                      per_page: sPerPage
                    }));
                  } else if (isFiltering) {
                    dispatch(filterPayment({
                      token,
                      shop_id: getId,
                      search_value: activeFilter,
                      page: newPage,
                      per_page: fillPerPage
                    }));
                  } else {
                    dispatch(getPayments({
                      token,
                      shop_id: getId,
                      page: newPage,
                      per_page
                    }));
                  }
                }}
                onPerPageChange={(newPerPage) => {
                  if (isSearching) {
                    dispatch(searchPayment({
                      token,
                      shop_id: getId,
                      search_value: inputValue,
                      page: 1,
                      per_page: newPerPage
                    }));
                  } else if (isFiltering) {
                    dispatch(filterPayment({
                      token,
                      shop_id: getId,
                      search_value: activeFilter,
                      page: 1,
                      per_page: newPerPage
                    }));
                  } else {
                    dispatch(getPayments({
                      token,
                      shop_id: getId,
                      page: 1,
                      per_page: newPerPage
                    }));
                  }
                }}
              />
            </div>
          </div>
        )}
      </div>
      
      {/* Modal for Transaction Details */}
      {mod && (
        <div className="modal-overlay">
          <div className="modal-content2">
            <div className="head-mode">
              <h6 style={{color: '#7A0091'}}>Transaction Details</h6>
              <button className="modal-close" onClick={hideModal}>&times;</button>
            </div>
            <div className="modal-body">
              {payData ? (
                <>
                <div className="d-lg-flex d-block justify-content-between">
                  <div>
                    <img src={Inv} alt="img" className='mb-3'/>
                  </div>
                  <div>
                    <div className="d-flex justify-content-between">
                      <p className='mr-5 mt-2'>Transaction status:</p>
                      <p><button className={payData.payment_status}>{payData.payment_status}</button></p>
                    </div>
                    <div className="d-flex justify-content-between">
                      <p className='mr-5'>Transaction method:</p>
                      <p>{payData.payment_method}</p>
                    </div>
                    <div className="d-flex justify-content-between">
                      <p className='mr-5'>Invoice number:</p>
                      <p style={{color: '#7A0091'}}>{payData.invoice_number}</p>
                    </div>
                    <div className="d-flex justify-content-between">
                      <p className='mr-5'>Created By:</p>
                      <p>{payData.invoicedata.created_by}</p>
                    </div>
                  </div>
                </div>
                <hr />

                <div className="d-lg-flex d-block justify-content-between">
                  <div>
                    <div className="d-flex">
                      <p className='mr-3'>Customer name:</p>
                      <p>{payData.invoicedata.customer_name}</p>
                    </div>
                    <div className="d-flex">
                      <p className='mr-3'>Date:</p>
                      <p>{payData.invoicedata.date}</p>
                    </div>
                    <div className="d-flex">
                      <p className='mr-3'>Discount name:</p>
                      <p>{payData.invoicedata.discount_name || "none"}</p>
                    </div>
                  </div>
                  <div>
                  <div className="d-flex mt-5">
                    <p className='mr-3'>Total Amount:</p>
                    <p style={{color: '#7A0091', fontWeight: '700'}}>₦{Number(payData.invoicedata.total_amount).toLocaleString()}</p>
                  </div>
                  </div>
                </div>
                <hr />
                <div className="table-content">
                  <div className="table-container">
                    <table className="w-100 table-borderless bin">
                    <thead className='th-d'>
                    <tr className='m-0'>
                        <th className="p-2 text-light">Sr. No</th>
                        <th className="p-2 text-light">Product Name </th>
                        <th className="p-2 text-light">Price</th>
                        <th className="p-2 text-light">Quantity</th>
                        <th className="p-2 text-light">Amount</th>
                    </tr>
                    </thead>
                    <tbody>
                    {payData.invoicedata.products_ordered.map((product, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{product.product_name} - {product.inches} inches</td>
                            <td>₦{Number(product.product_price).toLocaleString()}</td>
                            <td>{product.quantity}</td>
                            <td>₦{Number(product.product_price * product.quantity).toLocaleString()}</td>
                        </tr>
                    ))}
                    </tbody>
                  </table>
                  </div>
                </div>
              </>) : null}
            </div>
          </div>
        </div>
      )}

      {/* Modal for Pin Validation */}
      {statusInv && (
        <div className="modal-overlay">
          <div className="modal-content2">
            <div className="head-mode">
              <h6 style={{color: '#7A0091'}}>Update Payment Pin</h6>
              <button className="modal-close" onClick={hideModal}>&times;</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handlePinChange}>
                <div className="form-group mb-4">
                  <label htmlFor="exampleInputEmail1">Payment Pin <span style={{color: '#7A0091'}}>*</span></label>
                  <input type="text" placeholder='Enter Pin' value={dvalue} onChange={(e) => setDvalue(e.target.value)}/>
                </div>
                <button className='in-btn'>
                  {loading ? (
                    <>
                      <div className="spinner-border spinner-border-sm text-light" role="status">
                        <span className="sr-only"></span>
                      </div>
                      <span>Validating Pin... </span>
                    </>
                  ) : (
                    'Validate Pin'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Payment Actions */}
      {second && (
        <div className="modal-overlay">
          <div className="modal-content2" style={{width: '35%'}}>
            <div className="head-mode">
              <h6 style={{color: '#7A0091'}}>Update Invoice Status</h6>
              <button className="modal-close" onClick={hideModal}>&times;</button>
            </div>
            <div className="modal-body text-center d-flex justify-content-between">
              <button className='in-btn w-50 mr-3' onClick={handlePaid}>Refund</button>
              <button className='in-btn c-btn w-50' onClick={handleCancle}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {second2 && (
        <div className="modal-overlay">
          <div className="modal-content2" style={{width: '35%'}}>
            <div className="head-mode">
              <h6 style={{color: '#7A0091'}}>Update Invoice Status</h6>
              <button className="modal-close" onClick={hideModal}>&times;</button>
            </div>
            <div className="modal-body text-center d-flex justify-content-between">
              <button className='in-btn w-100 mr-3' onClick={handlePending}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Payment;
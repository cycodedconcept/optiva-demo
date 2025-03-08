import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPayments, clearPayment, searchPayment, updatePaymentPin, updatePaymentStatus, cancelPaymentPinProcess } from '../features/paymentSlice';
import { Fil, Inv } from '../assets/images';
import Swal from 'sweetalert2';
import Pagination from './support/Pagination';
import { debounce }  from 'lodash';


const Payment = () => {
  const dispatch = useDispatch();
  let token = localStorage.getItem("token");
  const getId = localStorage.getItem("sid");
  const { error, loading, isSearching, payment, search, currentPage, per_page, total, total_pages} = useSelector((state) => state.payment);
  const [inputValue, setInputValue] = useState('');
  const [payData, setPayData] = useState(null);
  const [mod, setMod] = useState(false)
  const [statusInv, setStatusInv] = useState(false);
  const [dvalue, setDvalue] = useState('');
  const [second, setSecond] = useState(false);

  const filterStatus = [
    { label: "All", value: "All" },
    { label: "Paid", value: "Paid" },
    { label: "Pending", value: "Pending" },
    { label: "Cancelled", value: "Cancelled" },
    { label: "Refunded", value: "Refund" }
  ];
  const [selectedStatus, setSelectedStatus] = useState("All");

  const handleFilterClick = (status) => {
    setSelectedStatus(status.label);
    debouncedSearch(status.value);
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

  const handleSearch = (e) => {
    const value = e.target.value;
    setInputValue(value);
    debouncedSearch(value);
  };

  useEffect(() => {
    if (token) {
      dispatch(getPayments({token, shop_id: getId, page: currentPage, per_page: per_page}))
    }
  }, [token, dispatch, currentPage, per_page])

  // const debouncedSearch = useCallback(
  //   debounce((value) => {
  //       if (value.trim() === "") {
  //           dispatch(clearPayment());
  //           dispatch(getPayments({ 
  //               token, 
  //               shop_id: getId, 
  //               page: 1, 
  //               per_page: per_page 
  //           }));
  //       } else {
  //           dispatch(searchPayment({ 
  //               token, 
  //               shop_id: getId, 
  //               search_value: value, 
  //               page: 1, 
  //               per_page: per_page 
  //           }));
  //       }
  //   }, 300),
  //   [dispatch, token, getId, per_page]
  // );

  const debouncedSearch = useCallback(
    debounce((statusValue) => {
      if (statusValue === "All") {
        dispatch(clearPayment());
        dispatch(getPayments({ token, shop_id: getId, page: 1, per_page }));
      } else {
        dispatch(searchPayment({ 
          token, 
          shop_id: getId, 
          search_value: statusValue, 
          page: 1, 
          per_page 
        }));
      }
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

}


const displayData = isSearching ? search : payment;

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
    }else {
      setStatusInv(false)
    }
  }

  const handlePinChange = async (e) => {
    e.preventDefault();
    const getIn = localStorage.getItem("ivv2");

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
            setSecond(true);
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
        Swal.fire({
            icon: "error",
            title: "Error Occurred",
            text: error.message || "Something went wrong while validating Pin. Please try again.",
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
        Swal.fire({
            icon: "error",
            title: "Error Occurred",
            text: error.message || "Something went wrong while updating invoice payment status. Please try again.",
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
        Swal.fire({
            icon: "error",
            title: "Error Occurred",
            text: error.message || "Something went wrong while canceling invoice payment status. Please try again.",
        });
    }
}

  return (
    <>


      <div className='mt-5 py-3 px-4' style={{background: '#fff'}}>
        {itemFilter}


        <hr/>
        <div className="mt-5 mt-lg-2 text-right">
          <div className="search-container text-right mt-3">
            <input type="text" placeholder="Search Supplier..." className="search-input" style={{borderRadius: '5px'}} value={inputValue} onChange={handleSearch}/>
            <span className="search-icon" style={{position: "absolute",
              right: "10px",
              top: "8px",
              fontSize: "20px",
              color: "#222",
              cursor: "pointer"}}>&#128269;</span>
         </div>
        </div>

        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>Error: {error?.message || 'Something went erong'}</div>
        ) : (
          <div className="table-content">
            <div className="table-container mt-5">
              <table className="my-table w-100" data={displayData}>
                <thead>
                  <tr>
                    <th style={{width: '5%'}}><div className='d-flex justify-content-between'><p>S/N</p><div><img src={Fil} alt="" /></div></div></th>
                    <th style={{width: '25%'}}><div className='d-flex justify-content-between'><p>Customer Name</p><div><img src={Fil} alt="" /></div></div></th>
                    <th style={{width: '13%'}}><div className='d-flex justify-content-between'><p>Invoice Number</p><div><img src={Fil} alt="" /></div></div></th>
                    <th style={{width: '12%'}}><div className='d-flex justify-content-between'><p>Date</p><div><img src={Fil} alt="" /></div></div></th>
                    <th style={{width: '13%'}}><div className='d-flex justify-content-between'><p>Pament Method</p><div><img src={Fil} alt="" /></div></div></th>
                    <th style={{width: '18%'}}><div className='d-flex justify-content-between'><p>Discount Name</p><div><img src={Fil} alt="" /></div></div></th>
                    <th style={{width: '25%'}}><div className='d-flex justify-content-between'><p>Payment Status</p><div><img src={Fil} alt="" /></div></div></th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="9">Loading...</td></tr>
                  ) : (isSearching ? search : payment).length > 0 ? (
                      (isSearching ? search : payment).map((item, index) => (
                        <tr key={index} onClick={() => proDetails(item.invoice_number)} style={{ cursor: 'pointer' }}>
                          <td>{index + 1}</td>
                          <td>{item.customer_name}</td>
                          <td>{item.invoice_number}</td>
                          <td>{item.date}</td>
                          <td>{item.payment_method}</td>
                          <td>{item.invoicedata.discount_name || '-------'}</td>
                          <td onClick={(e) => {changeStatus(item.payment_status, item.invoice_number); e.stopPropagation();}}><button className={item.payment_status}>{item.payment_status}</button></td>
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td colSpan="9">No Payments Available</td>
                    </tr>
                  )}
                </tbody>
              </table>
          </div>
          <div className="sticky-pagination">
            <Pagination
                currentPage={currentPage}
                totalPages={total_pages}
                perPage={per_page}
                total={total}
                onPageChange={(newPage) => {
                    if (isSearching) {
                        dispatch(searchPayment({
                            token,
                            shop_id: getId,
                            search_value: inputValue,
                            page: newPage,
                            per_page: per_page
                        }));
                    } else {
                        dispatch(getPayments({
                            token,
                            shop_id: getId,
                            page: newPage,
                            per_page: per_page
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
      

      {mod ? (
        <>
         <div className="modal-overlay">
          <div className="modal-content2">
            <div className="head-mode">
              <h6 style={{color: '#7A0091'}}>Transaction Details</h6>
              <button className="modal-close" onClick={hideModal}>&times;</button>
            </div>
            <div className="modal-body">
              {payData ? (
                <>
                <div className="d-flex justify-content-between">
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

                <div className="d-flex justify-content-between">
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

              </>) : ('')}
            </div>
          </div>
         </div>
        </>
      ) : ('')}

    {statusInv ? (
      <>

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
      </>
    ) : ('')}

    {second ? (
      <>
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
      </>
    ) : ('')}
      
    </>
  );
};

export default Payment;

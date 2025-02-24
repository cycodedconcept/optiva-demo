import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPayments, clearPayment, searchPayment, updatePaymentPin, updatePaymentStatus, cancelPaymentPinProcess } from '../features/paymentSlice';
import { Fil, Inv} from '../assets/images';
import Pagination from './support/Pagination';
import { debounce }  from 'lodash';


const Payment = () => {
  const dispatch = useDispatch();
  let token = localStorage.getItem("token");
  const getId = localStorage.getItem("sid");
  const { error, loading, isSearching, payment, search, currentPage, per_page, total, total_pages} = useSelector((state)=> state.payment);
  const [inputValue, setInputValue] = useState('');
  const [payData, setPayData] = useState(null);
  const [mod, setMod] = useState(false)

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

  const debouncedSearch = useCallback(
    debounce((value) => {
        if (value.trim() === "") {
            dispatch(clearPayment());
            dispatch(getPayments({ 
                token, 
                shop_id: getId, 
                page: 1, 
                per_page: per_page 
            }));
        } else {
            dispatch(searchPayment({ 
                token, 
                shop_id: getId, 
                search_value: value, 
                page: 1, 
                per_page: per_page 
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

  return (
    <>
      <div className="mt-5 mt-lg-5 text-right">
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
                        <td><button className={item.payment_status}>{item.payment_status}</button></td>
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
      
    </>
  );
};

export default Payment;

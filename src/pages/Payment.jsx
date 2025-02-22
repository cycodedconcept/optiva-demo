import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPayments, clearPayment, searchPayment } from '../features/paymentSlice';
import { Fil} from '../assets/images';
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
              <h6 style={{color: '#7A0091'}}>Payment Details</h6>
              <button className="modal-close" onClick={hideModal}>&times;</button>
            </div>
            <div className="modal-body"></div>
          </div>
         </div>
        </>
      ) : ('')}
      
    </>
  );
};

export default Payment;

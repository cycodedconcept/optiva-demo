import React, { useState, useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getSorted, clearSearch, getSortedValue, sortUpdateStatus } from '../features/sortedSlice';
import { Fil, Inv } from '../assets/images';
import Pagination from './support/Pagination';
import Swal from 'sweetalert2';
import { debounce }  from 'lodash';




const Sorted = () => {
    const dispatch = useDispatch();
    let token = localStorage.getItem("token");
    const getId = localStorage.getItem("sid");
    const {loading, error, sort, card, currentPage, per_page, total, total_pages, sortValue, isSearching} = useSelector((state) => state.sorted);
    const [inputValue, setInputValue] = useState('');
    const [mod, setMod] = useState(false);
    const [payData, setPayData] = useState(null);
    const [second, setSecond] = useState(false)

    const filterStatus = [
        { label: "All", value: "" },
        { label: "Sorted", value: "Sorted" },
        { label: "Not Sorted", value: "Not Sorted" },
    ];

    const [selectedStatus, setSelectedStatus] = useState("");

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

    useEffect(() => {
        if (token) {
            dispatch(getSorted({token, shop_id: getId, search_value: "", page: currentPage, per_page: per_page}))
        }
    }, [dispatch, token, currentPage, per_page])

    const cardItems = [
        {
          id: 0,
          cvalue: card.totalsorted,
          content: "Total Sorted Orders"
        },
        {
          id: 1,
          cvalue: card.totalnotsorted,
          content: "Not Sorted Orders",
        }
    ]
  
    const colors = ['#8E18AC', '#34C759', '#FFCC00', '#5965F9']; 
  
    const reportItem = cardItems.map((item, index) => (
        <div
          className="card-single px-3 py-3"
          key={item.id}
          style={{
            borderLeft: `4px solid ${colors[index % colors.length]}`,
          }}
        >
          <h5 className="mb-4">{item.content}</h5>
          <div className="d-flex justify-content-between">
            <h5>{Number(item.cvalue || 0).toLocaleString()}</h5>
            <p className={item.sub === '4.06%' ? 're' : ''}>{item.sub}</p>
          </div>
        </div>
    ));

    const handleSearch = (e) => {
        const value = e.target.value;
        setInputValue(value);
        debouncedSearch(value);
    };

    const debouncedSearch = useCallback(
        debounce((statusValue) => {
          if (statusValue === "") {
            dispatch(clearSearch());
            dispatch(getSorted({token, shop_id: getId, search_value: "", page: currentPage, per_page: per_page}))
          } else {
            dispatch(getSortedValue({ 
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
        setMod(false);
        setSecond(false);
    }

    const displayData = isSearching ? sortValue : sort;

    const proDetails = (iNumber) => {
        setMod(true)
        const payItem = localStorage.getItem("sortItem");
        const det = JSON.parse(payItem);
      
        const selectedPayment = det.data.find((item) => item.invoice_number === iNumber);
      
        if (selectedPayment) {
          setPayData(selectedPayment)
        }
    }

    const sortInvoice = (vnumber, istatus) => {
        if (istatus === "Not Sorted") {
            localStorage.setItem("siv", vnumber)
            setSecond(true)
        }else {
            Swal.fire({
                icon: "info",
                title: "Sorted",
                text: "This invoice has been sorted...",
            });
        }
        
    }

    const handleSortedStatus = async (e) => {
        e.preventDefault();
        const getInv = localStorage.getItem("siv");

        try {
            Swal.fire({
                title: "Sorting Invoice Status...",
                text: "Please wait while we process your request.",
                allowOutsideClick: false,
                showConfirmButton: false,
                didOpen: () => {
                    Swal.showLoading();
                },
            });

            const response = await dispatch(sortUpdateStatus({token, invoice_number: getInv, sorted_status: "Sorted"})).unwrap();

            if (response.message === "success") {
                Swal.fire({
                    icon: "success",
                    title: "Sorting Status...",
                    text: `${response.message}`,
                });
                hideModal();
                dispatch(getSorted({token, shop_id: getId, search_value: "", page: currentPage, per_page: per_page}))
            }
            else {
               Swal.fire({
                    icon: "info",
                    title: "Sorting invoice",
                    text: `${response.message}`,
                }); 
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error Occurred",
                text: error.message || "Something went wrong while sorting invoice. Please try again.",
            });
        }
    }

  return (
    <>
        <div className="dash-cards mt-5 osicard" style={{gridTemplateColumns: "repeat(2, 1fr)"}}>
            { reportItem }
        </div>

        <div className="mt-5 mb-3 d-block d-lg-flex justify-content-between">
           <div className='mt-3'>
             {itemFilter}
          </div>
          <div className="search-container">
            <input type="text" placeholder="Search Supplier..." className="search-input" style={{borderRadius: '5px'}} value={inputValue} onChange={handleSearch}/>
            <span className="search-icon" style={{position: "absolute",
              right: "10px",
              top: "20px",
              fontSize: "20px",
              color: "#222",
              cursor: "pointer"}}>&#128269;</span>
          </div>
        </div>

        <hr />

        {loading ? (
           <div>Loading...</div>
        ) : error ? (
          <div>Error: {error?.message || 'No records available'}</div> 
        ) : (
            <>
              <div className="lp px-0 py-0 px-lg-1">
                <div className="table-content">
                    <div className="table-container">
                        <table className="my-table w-100" data={displayData}>
                            <thead>
                                <tr>
                                    <th><div className='d-flex justify-content-between'><p>S/N</p><div><img src={Fil} alt="" /></div></div></th>
                                    <th><div className='d-flex justify-content-between'><p>Invoice Number</p><div><img src={Fil} alt="" /></div></div></th>
                                    <th><div className='d-flex justify-content-between'><p>Customer Name</p><div><img src={Fil} alt="" /></div></div></th>
                                    <th><div className='d-flex justify-content-between'><p>Date</p><div><img src={Fil} alt="" /></div></div></th>
                                    <th><div className='d-flex justify-content-between'><p>Total Amount</p><div><img src={Fil} alt="" /></div></div></th>
                                    <th style={{width: '15%'}}><div className='d-flex justify-content-between'><p>Payment Status</p><div><img src={Fil} alt="" /></div></div></th>
                                    <th><div className='d-flex justify-content-between'><p>Sorted Status</p><div><img src={Fil} alt="" /></div></div></th>
                                    <th style={{width: '15%'}}><div className='d-flex justify-content-between'><p>Created By</p><div><img src={Fil} alt="" /></div></div></th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="9">Loading...</td>
                                    </tr>
                                ) : displayData.data?.length > 0 ? (
                                    displayData.data?.map((item, index) => (
                                        <tr key={index} onClick={() => proDetails(item.invoice_number)} style={{cursor: 'pointer'}}>
                                            <td>{index + 1}</td>
                                            <td>{item.invoice_number}</td>
                                            <td>{item.customer_info.name}</td>
                                            <td>{item.date}</td>
                                            <td>₦{Number(item.total_amount).toLocaleString()}</td>
                                            <td><button className={item.payment_status}>{item.payment_status}</button></td>
                                            <td onClick={(e) => {e.stopPropagation(); sortInvoice(item.invoice_number, item.sorted_status)}}><button className={item.sorted_status}>{item.sorted_status}</button></td>
                                            <td>{item.created_by}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                      <td colSpan="9">No data Available</td>
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
                                    dispatch(getSorted({token, shop_id: getId, search_value: "", page: newPage, per_page: per_page}))
                                } else {
                                    dispatch(getSortedValue({ 
                                        token, 
                                        shop_id: getId, 
                                        search_value: statusValue, 
                                        page: newPage, 
                                        per_page: per_page
                                    }));
                                }
                            }}
                            onPerPageChange={(newPerPage) => {
                                if (isSearching) {
                                    dispatch(getSorted({token, shop_id: getId, search_value: "", page: 1, per_page: newPerPage}))
                                } else {
                                    dispatch(getSortedValue({ 
                                        token, 
                                        shop_id: getId, 
                                        search_value: statusValue, 
                                        page: 1, 
                                        per_page: newPerPage
                                    }));
                                }
                            }}
                        />

                    </div>
                </div>
              </div>
            </>
        )}

        {mod ? (
            <>
                <div className="modal-overlay">
                <div className="modal-content2">
                <div className="head-mode">
                    <h6 style={{color: '#7A0091'}}>Sorted Details</h6>
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
                        <div className="d-lg-flex d-block justify-content-between">
                            <p className='mr-5 mt-2'>Transaction status:</p>
                            <p className='w-lg-0 w-25'><button className={payData.payment_status}>{payData.payment_status}</button></p>
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
                            <p className='mr-5'>Status:</p>
                            <p><button className={payData.sorted_status}>{payData.sorted_status}</button></p>
                        </div>
                        <div className="d-flex justify-content-between">
                            <p className='mr-5'>Created By:</p>
                            <p>{payData.created_by}</p>
                        </div>
                        </div>
                    </div>
                    <hr />

                    <div className="d-lg-flex d-block justify-content-between">
                        <div>
                        <div className="d-flex">
                            <p className='mr-3'>Customer name:</p>
                            <p>{payData.customer_info.name}</p>
                        </div>
                        <div className="d-flex">
                            <p className='mr-3'>Customer email:</p>
                            <p>{payData.customer_info.email}</p>
                        </div><div className="d-flex">
                            <p className='mr-3'>Customer phone:</p>
                            <p>{payData.customer_info.phone_number}</p>
                        </div>
                        <div className="d-flex">
                            <p className='mr-3'>Date:</p>
                            <p>{payData.date}</p>
                        </div>
                        <div className="d-flex">
                            <p className='mr-3'>Discount name:</p>
                            <p>{payData.discount_name || "none"}</p>
                        </div>
                        </div>
                        <div>
                        <div className="d-flex mt-5">
                          <p className='mr-3'>Total Amount:</p>
                          <p style={{color: '#7A0091', fontWeight: '700'}}>₦{Number(payData.total_amount).toLocaleString()}</p>
                        </div>
                        <div className="d-flex">
                            <p className='mr-3'>Payment Approved Date:</p>
                            <p>{payData.payment_approved_date}</p>
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
                                {payData.products_ordered.map((product, index) => (
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
                    </>) : ('')}
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
              <div className="modal-body text-center">
                  <button className='in-btn w-50 mr-3' onClick={handleSortedStatus}>Sorted</button>
              </div>
          </div>
        </div>
      </>
    ) : ('')}
    </>
  )
}

export default Sorted
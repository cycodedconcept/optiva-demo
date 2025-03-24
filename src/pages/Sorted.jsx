// import React, { useState, useEffect, useCallback } from 'react'
// import { useDispatch, useSelector } from 'react-redux';
// // import { getSorted, clearSearch, getSortedValue, sortUpdateStatus } from '../features/sortedSlice';
// import { clearSearch, getSortedValue, sortUpdateStatus, setSearchValue } from '../features/sortedSlice';
// import { Fil, Inv } from '../assets/images';
// import Pagination from './support/Pagination';
// import Swal from 'sweetalert2';
// import { debounce }  from 'lodash';




// const Sorted = () => {
//     const dispatch = useDispatch();
//     let token = localStorage.getItem("token");
//     const getId = localStorage.getItem("sid");
//     const {loading, error, card, currentPage, per_page, total, total_pages, sortValue, isSearching, currentSearchValue} = useSelector((state) => state.sorted);
//     const [inputValue, setInputValue] = useState('');
//     const [mod, setMod] = useState(false);
//     const [payData, setPayData] = useState(null);
//     const [second, setSecond] = useState(false)

//     const filterStatus = [
//         { label: "All", value: "" },
//         { label: "Sorted", value: "Sorted" },
//         { label: "Not Sorted", value: "Not Sorted" },
//     ];

//     const [selectedStatus, setSelectedStatus] = useState("");
//     const [filterValue, setFilterValue] = useState("");

//     useEffect(() => {
//         if (token) {
//             dispatch(getSortedValue({
//                 token, 
//                 shop_id: getId, 
//                 search_value: filterValue, 
//                 page: currentPage, 
//                 per_page
//             }));
//         }
//     }, [dispatch, token, currentPage, per_page, filterValue]);

//     const handleFilterClick = (status) => {
//         setSelectedStatus(status.label);
//         setFilterValue(status.value);
        
//         dispatch(getSortedValue({
//             token, 
//             shop_id: getId, 
//             search_value: status.value, 
//             page: 1, 
//             per_page
//         }));
//     };

//     const itemFilter = filterStatus.map((item) => (
//         <button 
//           key={item.value} 
//           className="btn"
//           onClick={() => handleFilterClick(item)}
    
//           style={{
//             backgroundColor: selectedStatus === item.label ? "#7A0091" : "",
//             color: selectedStatus === item.label ? "#fff" : "#000",
//             padding: "8px 16px",
//             margin: "5px",
//             border: "none",
//             borderRadius: "5px",
//             cursor: "pointer",
//             fontSize: "16px",
//             outline: "none",
//             boxShadow: "none"
//           }}
//         >
//           {item.label}
//         </button>
//       ));

//     // useEffect(() => {
//     //     if (token) {
//     //         dispatch(getSorted({token, shop_id: getId, search_value: "", page: currentPage, per_page: per_page}))
//     //     }
//     // }, [dispatch, token, currentPage, per_page])

//     const cardItems = [
//         {
//           id: 0,
//           cvalue: card.totalsorted,
//           content: "Total Sorted Orders"
//         },
//         {
//           id: 1,
//           cvalue: card.totalnotsorted,
//           content: "Not Sorted Orders",
//         }
//     ]
  
//     const colors = ['#8E18AC', '#34C759', '#FFCC00', '#5965F9']; 
  
//     const reportItem = cardItems.map((item, index) => (
//         <div
//           className="card-single px-3 py-3"
//           key={item.id}
//           style={{
//             borderLeft: `4px solid ${colors[index % colors.length]}`,
//           }}
//         >
//           <h5 className="mb-4">{item.content}</h5>
//           <div className="d-flex justify-content-between">
//             <h5>{Number(item.cvalue || 0).toLocaleString()}</h5>
//             <p className={item.sub === '4.06%' ? 're' : ''}>{item.sub}</p>
//           </div>
//         </div>
//     ));

//     const handleSearch = (e) => {
//         const value = e.target.value;
//         setInputValue(value);
//         setFilterValue(value);
        
//         // Remove any calls to clearSearch or other actions
//         dispatch(getSortedValue({
//             token, 
//             shop_id: getId, 
//             search_value: value, 
//             page: 1, 
//             per_page
//         }));
//     };

//     //   const debouncedSearch = useCallback(
//     //     debounce((value) => {
//     //       if (value === "") {
//     //         dispatch(clearSearch());
//     //         dispatch(getSorted({token, shop_id: getId, search_value: "", page: 1, per_page}));
//     //       } else {
//     //         dispatch(getSortedValue({ 
//     //           token, 
//     //           shop_id: getId, 
//     //           search_value: value, 
//     //           page: 1, 
//     //           per_page 
//     //         }));
//     //       }
//     //     }, 300),
//     //     [dispatch, token, getId, per_page]
//     //   );

//     // useEffect(() => {
//     //     return () => {
//     //         debouncedSearch.cancel();
//     //     };
//     // }, [debouncedSearch]);

//     const hideModal = () => {
//         setMod(false);
//         setSecond(false);
//     }

//     const displayData = isSearching ? sortValue : sort;

//     const proDetails = (iNumber) => {
//         setMod(true)
//         const payItem = localStorage.getItem("sortItem");
//         const det = JSON.parse(payItem);
      
//         const selectedPayment = det.data.find((item) => item.invoice_number === iNumber);
      
//         if (selectedPayment) {
//           setPayData(selectedPayment)
//         }
//     }

//     const sortInvoice = (vnumber, istatus) => {
//         if (istatus === "Not Sorted") {
//             localStorage.setItem("siv", vnumber)
//             setSecond(true)
//         }else {
//             Swal.fire({
//                 icon: "info",
//                 title: "Sorted",
//                 text: "This invoice has been sorted...",
//             });
//         }
        
//     }

//     const handleSortedStatus = async (e) => {
//         e.preventDefault();
//         const getInv = localStorage.getItem("siv");

//         try {
//             Swal.fire({
//                 title: "Sorting Invoice Status...",
//                 text: "Please wait while we process your request.",
//                 allowOutsideClick: false,
//                 showConfirmButton: false,
//                 didOpen: () => {
//                     Swal.showLoading();
//                 },
//             });

//             const response = await dispatch(sortUpdateStatus({token, invoice_number: getInv, sorted_status: "Sorted"})).unwrap();

//             if (response.message === "success") {
//                 Swal.fire({
//                     icon: "success",
//                     title: "Sorting Status...",
//                     text: `${response.message}`,
//                 });
//                 hideModal();
//                 dispatch(getSorted({token, shop_id: getId, search_value: "", page: currentPage, per_page: per_page}))
//             }
//             else {
//                Swal.fire({
//                     icon: "info",
//                     title: "Sorting invoice",
//                     text: `${response.message}`,
//                 }); 
//             }
//         } catch (error) {
//             let errorMessage = "Something went wrong";
                
//             if (error && typeof error === "object") {
//                 if (Array.isArray(error)) {
//                     errorMessage = error.map(item => item.message).join(", ");
//                 } else if (error.message) {
//                     errorMessage = error.message;
//                 } else if (error.response && error.response.data) {
//                     errorMessage = Array.isArray(error.response.data) 
//                         ? error.response.data.map(item => item.message).join(", ") 
//                         : error.response.data.message || JSON.stringify(error.response.data);
//                 }
//             }
        
//             Swal.fire({
//                 icon: "error",
//                 title: "Error Occurred",
//                 text: errorMessage,
//             });
//         }
//     }

//   return (
//     <>
//         <div className="dash-cards mt-5 osicard" style={{gridTemplateColumns: "repeat(2, 1fr)"}}>
//             { reportItem }
//         </div>

//         <div className="mt-5 mb-3 d-block d-lg-flex justify-content-between">
//            <div className='mt-3'>
//              {itemFilter}
//           </div>
//           <div className="search-container">
//             <input type="text" placeholder="Search Supplier..." className="search-input" style={{borderRadius: '5px'}} value={inputValue} onChange={handleSearch}/>
//             <span className="search-icon" style={{position: "absolute",
//               right: "10px",
//               top: "20px",
//               fontSize: "20px",
//               color: "#222",
//               cursor: "pointer"}}>&#128269;</span>
//           </div>
//         </div>

//         <hr />

//         {loading ? (
//            <div>Loading...</div>
//         ) : error ? (
//           <div>Error: {error?.message || 'No records available'}</div> 
//         ) : (
//             <>
//               <div className="lp px-0 py-0 px-lg-1">
//                 <div className="table-content">
//                     <div className="table-container">
//                         <table className="my-table w-100" data={displayData}>
//                             <thead>
//                                 <tr>
//                                     <th><div className='d-flex justify-content-between'><p>S/N</p><div><img src={Fil} alt="" /></div></div></th>
//                                     <th><div className='d-flex justify-content-between'><p>Invoice Number</p><div><img src={Fil} alt="" /></div></div></th>
//                                     <th><div className='d-flex justify-content-between'><p>Customer Name</p><div><img src={Fil} alt="" /></div></div></th>
//                                     <th><div className='d-flex justify-content-between'><p>Date</p><div><img src={Fil} alt="" /></div></div></th>
//                                     <th><div className='d-flex justify-content-between'><p>Total Amount</p><div><img src={Fil} alt="" /></div></div></th>
//                                     <th style={{width: '15%'}}><div className='d-flex justify-content-between'><p>Payment Status</p><div><img src={Fil} alt="" /></div></div></th>
//                                     <th><div className='d-flex justify-content-between'><p>Sorted Status</p><div><img src={Fil} alt="" /></div></div></th>
//                                     <th style={{width: '15%'}}><div className='d-flex justify-content-between'><p>Created By</p><div><img src={Fil} alt="" /></div></div></th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {loading ? (
//                                     <tr>
//                                         <td colSpan="9">Loading...</td>
//                                     </tr>
//                                 ) : displayData.data?.length > 0 ? (
//                                     displayData.data?.map((item, index) => (
//                                         <tr key={index} onClick={() => proDetails(item.invoice_number)} style={{cursor: 'pointer'}}>
//                                             <td>{index + 1}</td>
//                                             <td>{item.invoice_number}</td>
//                                             <td>{item.customer_info.name}</td>
//                                             <td>{item.date}</td>
//                                             <td>₦{Number(item.total_amount).toLocaleString()}</td>
//                                             <td><button className={item.payment_status}>{item.payment_status}</button></td>
//                                             <td onClick={(e) => {e.stopPropagation(); sortInvoice(item.invoice_number, item.sorted_status)}}><button className={item.sorted_status}>{item.sorted_status}</button></td>
//                                             <td>{item.created_by}</td>
//                                         </tr>
//                                     ))
//                                 ) : (
//                                     <tr>
//                                       <td colSpan="9">No data Available</td>
//                                     </tr>
//                                 )}
//                             </tbody>
//                         </table>
//                     </div>
//                     <div className="sticky-pagination">
//                     <Pagination
//                         currentPage={currentPage}
//                         totalPages={total_pages}
//                         perPage={per_page}
//                         total={total}
//                         onPageChange={(newPage) => {
//                             // Just use getSortedValue - don't check isSearching
//                             dispatch(getSortedValue({
//                                 token, 
//                                 shop_id: getId, 
//                                 search_value: filterValue,  
//                                 page: newPage, 
//                                 per_page
//                             }));
//                         }}
//                         onPerPageChange={(newPerPage) => {
//                             // Just use getSortedValue - don't check isSearching
//                             dispatch(getSortedValue({
//                                 token, 
//                                 shop_id: getId, 
//                                 search_value: filterValue,
//                                 page: 1, 
//                                 per_page: newPerPage
//                             }));
//                         }}
//                     />

//                     </div>
//                 </div>
//               </div>
//             </>
//         )}

//         {mod ? (
//             <>
//                 <div className="modal-overlay">
//                 <div className="modal-content2">
//                 <div className="head-mode">
//                     <h6 style={{color: '#7A0091'}}>Sorted Details</h6>
//                     <button className="modal-close" onClick={hideModal}>&times;</button>
//                 </div>
//                 <div className="modal-body">
//                     {payData ? (
//                     <>
//                     <div className="d-lg-flex d-block justify-content-between">
//                         <div>
//                           <img src={Inv} alt="img" className='mb-3'/>
//                         </div>
//                         <div>
//                         <div className="d-lg-flex d-block justify-content-between">
//                             <p className='mr-5 mt-2'>Transaction status:</p>
//                             <p className='w-lg-0 w-25'><button className={payData.payment_status}>{payData.payment_status}</button></p>
//                         </div>
//                         <div className="d-flex justify-content-between">
//                             <p className='mr-5'>Transaction method:</p>
//                             <p>{payData.payment_method}</p>
//                         </div>
//                         <div className="d-flex justify-content-between">
//                             <p className='mr-5'>Invoice number:</p>
//                             <p style={{color: '#7A0091'}}>{payData.invoice_number}</p>
//                         </div>
//                         <div className="d-flex justify-content-between">
//                             <p className='mr-5'>Status:</p>
//                             <p><button className={payData.sorted_status}>{payData.sorted_status}</button></p>
//                         </div>
//                         <div className="d-flex justify-content-between">
//                             <p className='mr-5'>Created By:</p>
//                             <p>{payData.created_by}</p>
//                         </div>
//                         </div>
//                     </div>
//                     <hr />

//                     <div className="d-lg-flex d-block justify-content-between">
//                         <div>
//                         <div className="d-flex">
//                             <p className='mr-3'>Customer name:</p>
//                             <p>{payData.customer_info.name}</p>
//                         </div>
//                         <div className="d-flex">
//                             <p className='mr-3'>Customer email:</p>
//                             <p>{payData.customer_info.email}</p>
//                         </div><div className="d-flex">
//                             <p className='mr-3'>Customer phone:</p>
//                             <p>{payData.customer_info.phone_number}</p>
//                         </div>
//                         <div className="d-flex">
//                             <p className='mr-3'>Date:</p>
//                             <p>{payData.date}</p>
//                         </div>
//                         <div className="d-flex">
//                             <p className='mr-3'>Discount name:</p>
//                             <p>{payData.discount_name || "none"}</p>
//                         </div>
//                         </div>
//                         <div>
//                         <div className="d-flex mt-5">
//                           <p className='mr-3'>Total Amount:</p>
//                           <p style={{color: '#7A0091', fontWeight: '700'}}>₦{Number(payData.total_amount).toLocaleString()}</p>
//                         </div>
//                         <div className="d-flex">
//                             <p className='mr-3'>Payment Approved Date:</p>
//                             <p>{payData.payment_approved_date}</p>
//                         </div>
//                         </div>
//                     </div>
//                     <hr />
//                     <div className="table-content">
//                         <div className="table-container">
//                             <table className="w-100 table-borderless bin">
//                                 <thead className='th-d'>
//                                 <tr className='m-0'>
//                                     <th className="p-2 text-light">Sr. No</th>
//                                     <th className="p-2 text-light">Product Name </th>
//                                     <th className="p-2 text-light">Price</th>
//                                     <th className="p-2 text-light">Quantity</th>
//                                     <th className="p-2 text-light">Amount</th>
//                                 </tr>
//                                 </thead>
//                                 <tbody>
//                                 {payData.products_ordered.map((product, index) => (
//                                     <tr key={index}>
//                                         <td>{index + 1}</td>
//                                         <td>{product.product_name} - {product.inches} inches</td>
//                                         <td>₦{Number(product.product_price).toLocaleString()}</td>
//                                         <td>{product.quantity}</td>
//                                         <td>₦{Number(product.product_price * product.quantity).toLocaleString()}</td>
//                                     </tr>
//                                 ))}
//                                 </tbody>
//                             </table>
//                         </div>
//                     </div>
//                     </>) : ('')}
//                 </div>
//                 </div>
//                 </div>
//             </>
//         ) : ('')}

//     {second ? (
//       <>
//         <div className="modal-overlay">
//           <div className="modal-content2" style={{width: '35%'}}>
//               <div className="head-mode">
//                 <h6 style={{color: '#7A0091'}}>Update Invoice Status</h6>
//                 <button className="modal-close" onClick={hideModal}>&times;</button>
//               </div>
//               <div className="modal-body text-center">
//                   <button className='in-btn w-50 mr-3' onClick={handleSortedStatus}>Sorted</button>
//               </div>
//           </div>
//         </div>
//       </>
//     ) : ('')}
//     </>
//   )
// }

// export default Sorted

import React, { useState, useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getSortedValue, sortUpdateStatus } from '../features/sortedSlice';
import { Fil, Inv } from '../assets/images';
import Pagination from './support/Pagination';
import Swal from 'sweetalert2';
import { debounce } from 'lodash';

const Sorted = () => {
    const dispatch = useDispatch();
    const token = localStorage.getItem("token");
    const getId = localStorage.getItem("sid");
    const { loading, error, card, currentPage, per_page, total, total_pages, sortValue } = useSelector((state) => state.sorted);
    const [inputValue, setInputValue] = useState('');
    const [mod, setMod] = useState(false);
    const [payData, setPayData] = useState(null);
    const [second, setSecond] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState("All");
    const [filterValue, setFilterValue] = useState("");

    const filterStatus = [
        { label: "All", value: "" },
        { label: "Sorted", value: "Sorted" },
        { label: "Not Sorted", value: "Not Sorted" },
    ];

    // Initial data load
    // Initial data load - modified to avoid duplicate requests
useEffect(() => {
    if (token) {
        dispatch(getSortedValue({
            token,
            shop_id: getId,
            search_value: filterValue,
            page: currentPage,
            per_page
        }));
    }
}, [dispatch, token, getId, currentPage, per_page]); // Remove filterValue from dependencies

    // Handle filter button clicks
    // Your existing handleFilterClick function already does this correctly
    const handleFilterClick = (status) => {
        setSelectedStatus(status.label);
        setFilterValue(status.value);
        
        // This API call will handle the filtering
        dispatch(getSortedValue({
            token,
            shop_id: getId,
            search_value: status.value,
            page: 1,
            per_page
        }));
    };

    // Debounced search implementation
    const debouncedSearch = useCallback(
        debounce((value) => {
            setFilterValue(value);
            dispatch(getSortedValue({
                token,
                shop_id: getId,
                search_value: value,
                page: 1,
                per_page
            }));
        }, 500), // Longer debounce time to prevent excessive API calls
        [dispatch, token, getId, per_page]
    );

    // Handle search input changes
    const handleSearch = (e) => {
        const value = e.target.value;
        setInputValue(value);
        debouncedSearch(value);
    };

    // Clean up debounce on unmount
    useEffect(() => {
        return () => {
            debouncedSearch.cancel();
        };
    }, [debouncedSearch]);

    // Card data for dashboard
    const cardItems = [
        {
            id: 0,
            cvalue: card?.totalsorted,
            content: "Total Sorted Orders"
        },
        {
            id: 1,
            cvalue: card?.totalnotsorted,
            content: "Not Sorted Orders",
        }
    ];

    const colors = ['#8E18AC', '#34C759'];

    // Modal control functions
    const hideModal = () => {
        setMod(false);
        setSecond(false);
    };

    // View order details
    const proDetails = (iNumber) => {
        setMod(true);
        const payItem = localStorage.getItem("sortItem");
        if (!payItem) return;
        
        try {
            const det = JSON.parse(payItem);
            const selectedPayment = det.data.find((item) => item.invoice_number === iNumber);
            
            if (selectedPayment) {
                setPayData(selectedPayment);
            }
        } catch (error) {
            console.error("Error parsing order data:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Could not load order details",
            });
        }
    };

    // Handle sorting status click
    const sortInvoice = (vnumber, istatus) => {
        if (istatus === "Not Sorted") {
            localStorage.setItem("siv", vnumber);
            setSecond(true);
        } else {
            Swal.fire({
                icon: "info",
                title: "Already Sorted",
                text: "This invoice has been sorted...",
            });
        }
    };

    // useEffect(() => {
    //     // This will help you see what data is being returned from the API
    //     if (!loading && sortValue) {
    //       console.log("API Response Data:", {
    //         sortValue,
    //         currentPage,
    //         total_pages,
    //         total,
    //         per_page
    //       });
          
    //       // Check if pagination data is valid
    //       if (total_pages <= 1) {
    //         console.warn("Only one page detected. Check if your API is returning proper pagination data.");
    //       }
    //     }
    //   }, [loading, sortValue, currentPage, total_pages, total, per_page]);

    // Update sorting status
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

            const response = await dispatch(sortUpdateStatus({
                token, 
                invoice_number: getInv, 
                sorted_status: "Sorted"
            })).unwrap();

            if (response.message === "success") {
                Swal.fire({
                    icon: "success",
                    title: "Sorting Status Updated",
                    text: `${response.message}`,
                });
                hideModal();
                
                // Refresh data with current filter
                dispatch(getSortedValue({
                    token, 
                    shop_id: getId, 
                    search_value: filterValue, 
                    page: currentPage, 
                    per_page
                }));
            } else {
                Swal.fire({
                    icon: "info",
                    title: "Sorting invoice",
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
    };

    // Render filter buttons
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

    // Render dashboard cards
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

    return (
        <>
            {/* Dashboard Cards */}
            <div className="dash-cards mt-5 osicard" style={{gridTemplateColumns: "repeat(2, 1fr)"}}>
                {reportItem}
            </div>

            {/* Filters and Search */}
            <div className="mt-5 mb-3 d-block d-lg-flex justify-content-between">
                <div className='mt-3'>
                    {itemFilter}
                </div>
                <div className="search-container">
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
            </div>

            <hr />

            {/* Data Table */}
            {loading ? (
                <div>Loading...</div>
            ) : error ? (
                <div>Error: {error?.message || 'No records available'}</div> 
            ) : (
                <>
                    <div className="lp px-0 py-0 px-lg-1">
                        <div className="table-content">
                            <div className="table-container">
                                <table className="my-table w-100">
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
                                        ) : sortValue?.data?.length > 0 ? (
                                            sortValue.data?.map((item, index) => (
                                                <tr key={index} onClick={() => proDetails(item.invoice_number)} style={{cursor: 'pointer'}}>
                                                    <td>{index + 1}</td>
                                                    <td>{item.invoice_number}</td>
                                                    <td>{item.customer_info.name}</td>
                                                    <td>{item.date}</td>
                                                    <td>₦{Number(item.total_amount).toLocaleString()}</td>
                                                    <td><button className={item.payment_status}>{item.payment_status}</button></td>
                                                    <td onClick={(e) => {e.stopPropagation(); sortInvoice(item.invoice_number, item.sorted_status)}}>
                                                        <button className={item.sorted_status}>{item.sorted_status}</button>
                                                    </td>
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
                                        dispatch(getSortedValue({
                                            token, 
                                            shop_id: getId, 
                                            search_value: filterValue,  
                                            page: newPage, 
                                            per_page
                                        }));
                                    }}
                                    onPerPageChange={(newPerPage) => {
                                        dispatch(getSortedValue({
                                            token, 
                                            shop_id: getId, 
                                            search_value: filterValue,
                                            page: 1, 
                                            per_page: newPerPage
                                        }));
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Order Details Modal */}
            {mod && (
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
                                            </div>
                                            <div className="d-flex">
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
                                </>
                            ) : (
                                <div>No data available</div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Status Update Modal */}
            {second && (
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
            )}
        </>
    );
};

export default Sorted;
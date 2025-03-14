import React, {useState, useEffect} from 'react'
import { LineChart } from './support/Chart';
import Progress from './support/Progress'
import { useDispatch, useSelector } from 'react-redux';
import { getSalesChart, getSales, setSalesCurrentPage, getSearchValueData } from '../features/reportSlice';
import Pagination from './support/Pagination';
import { Fil, Inv } from '../assets/images';
import Swal from 'sweetalert2';


const Sales = () => {
    const dispatch = useDispatch();
    let token = localStorage.getItem("token");
    const getId = localStorage.getItem("sid");

    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

    const { loading, error, salesCard, salesCurrentPage, salesPerPage, salesTotal, salesTotalPages, sales, sValue, sCurrentPage, sPerPage, sTotal, sTotalPages } = useSelector((state) => state.report);
    const [mode, setMode] = useState(false);
    const [details, setDetails] = useState([]);
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [selectedMonth, setSelectedMonth] = useState(month);
    const [selectedYear2, setSelectedYear2] = useState(currentYear);
    const [selectedMonth2, setSelectedMonth2] = useState(month);
    const [searchItem, setSearchItem] = useState("");
    const [active, setActive] = useState(true);

    useEffect(() => {
        if (token) {
            dispatch(getSalesChart({token, shop_id: getId, month: month, year: year}));
            dispatch(getSales({token, shop_id: getId, month: month, year: year, page: salesCurrentPage, per_page: salesPerPage}))
        }
    }, [token, dispatch])


    const hideModal = () => {
        setMode(false)
    }

    

    const cardItems = [
        {
          id: 0,
          cvalue: salesCard.totalSalesValue,
          content: "Total Sales Value"
        },
        {
          id: 1,
          cvalue: salesCard.totalItemsSold,
          content: "Total Items Sold",
        },
        {
          id: 2,
          cvalue: salesCard.totalOrders,
          content: "Total Orders",
        },
        {
          id: 3,
          cvalue: salesCard.totalProfit,
          content: "Total Profit",
        }
    ]

    const colors = ['#8E18AC', '#34C759', '#FFCC00', '#5965F9']; 

    const reportItem = cardItems.map((item, index) => (
        <div
            className="card-single px-3 py-2"
            key={item.id}
            style={{
                borderLeft: `4px solid ${colors[index % colors.length]}`,
            }}
        >
            <h5 className="mb-4">{item.content}</h5>
            <div className="d-flex justify-content-between">
                <h5>
                    {["Total Sales Value", "Total Profit"].includes(item.content)
                        ? `₦${Number(item.cvalue || 0).toLocaleString()}`
                        : Number(item.cvalue || 0).toLocaleString()}
                </h5>
                <p className={item.sub === '4.06%' ? 're' : ''}>{item.sub}</p>
            </div>
        </div>
    ));
    
    

    const showDetails = (inumber) => {
        setMode(true);

        const theItem = localStorage.getItem("sale");
        const getItem = JSON.parse(theItem);

        const selectedSales = getItem.find((item) => item.invoice_number === inumber);
        console.log(selectedSales)

        if (selectedSales) {
            setDetails(selectedSales)
        }
    }

    const sortItem = (e) => {
        e.preventDefault();

        dispatch(getSalesChart({token, shop_id: getId, month: selectedMonth, year: selectedYear}))
            .then((result) => {
            if (result.meta.requestStatus === "fulfilled") {
                Swal.fire({
                title: "Success!",
                text: "Stock summary filtered successfully.",
                icon: "success",
                timer: 2000, 
                showConfirmButton: false
                });
            } else {
                Swal.fire({
                title: "Error!",
                text: "Failed to filter stock summary. Please try again.",
                icon: "error",
                timer: 3000,
                showConfirmButton: false
                });
            }
        });
    }

    const handleSearchItem = (e) => {
        e.preventDefault();
        setActive(false)
        dispatch(getSearchValueData({token, shop_id: getId, month: selectedMonth2, year: selectedYear2, search_value: searchItem, page: sCurrentPage, per_page: sPerPage}))
            .then((result) => {
            if (result.meta.requestStatus === "fulfilled") {
                Swal.fire({
                title: "Success!",
                text: "Stock summary filtered successfully.",
                icon: "success",
                timer: 2000, 
                showConfirmButton: false
                });

            } else {
                Swal.fire({
                title: "Error!",
                text: "Failed to filter stock summary. Please try again.",
                icon: "error",
                timer: 3000,
                showConfirmButton: false
                });
            }
        });
    }

    const switchTable = (e) => {
        e.preventDefault();
        
        setSelectedMonth2(month);
        setSelectedYear2(year);
        setSearchItem('')
    
        setActive(true);
        
        dispatch(getSales({ 
            token, 
            shop_id: getId, 
            month,
            year,
            page: salesCurrentPage, 
            per_page: salesPerPage
        }))
        .then((result) => {
            if (result.meta.requestStatus === "fulfilled") {
                Swal.fire({
                    title: "Success!",
                    text: "Reset successfully.",
                    icon: "success",
                    timer: 2000, 
                    showConfirmButton: false
                });
            } else {
                Swal.fire({
                    title: "Error!",
                    text: "Failed to reset. Please try again.",
                    icon: "error",
                    timer: 3000,
                    showConfirmButton: false
                });
            }
        });
    };
    

  return (
    <>
        <div className="dash-cards mt-5 mb-5">
            { reportItem }
        </div>
        <form onSubmit={sortItem}>
            <div className="d-lg-flex d-block">
                <div className="form-group mr-3">
                <label>Select Month:</label>
                <select 
                    value={selectedMonth} 
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className=""
                >
                    <option>--Selected Month---</option>
                    <option value="01">January</option>
                    <option value="02">February</option>
                    <option value="03">March</option>
                    <option value="04">April</option>
                    <option value="05">May</option>
                    <option value="06">June</option>
                    <option value="07">July</option>
                    <option value="08">August</option>
                    <option value="09">September</option>
                    <option value="10">October</option>
                    <option value="11">November</option>
                    <option value="12">December</option>
                </select>
                </div>
                <div className="form-group mr-3">
                    <label>Select Year:</label>
                    <select 
                    value={selectedYear} 
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className=" "
                    >
                    {years.map((year) => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                    </select>
                </div>
                <div style={{marginTop: '33px'}}>
                    <button className='b-sum'>Get Sales Report</button>
                </div>
            </div>
        </form>

        <div className="chart-item p-4">
            <LineChart />
        </div>

        <div className="pro-item">
            <Progress />
        </div>
        
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>Waiting: {error?.message || 'waiting on data'}</div>
        ) : (
            <>

            <form onSubmit={handleSearchItem} className='mt-5'>
            <div className="d-lg-flex d-block">
                <div className="form-group mr-3">
                    <label>Select Month:</label>
                    <select 
                    value={selectedMonth2} 
                    onChange={(e) => setSelectedMonth2(e.target.value)}
                    className=""
                    >
                    <option>--Selected Month---</option>
                    <option value="01">January</option>
                    <option value="02">February</option>
                    <option value="03">March</option>
                    <option value="04">April</option>
                    <option value="05">May</option>
                    <option value="06">June</option>
                    <option value="07">July</option>
                    <option value="08">August</option>
                    <option value="09">September</option>
                    <option value="10">October</option>
                    <option value="11">November</option>
                    <option value="12">December</option>
                    </select>
                </div>
                <div className="form-group mr-3">
                <label>Select Year:</label>
                <select 
                    value={selectedYear2} 
                    onChange={(e) => setSelectedYear2(e.target.value)}
                    className=" "
                >
                    {years.map((year) => (
                    <option key={year} value={year}>{year}</option>
                    ))}
                </select>
                </div>
                <div className="form-group mr-3">
                    <label>Invoice Number:</label>
                    <input type="text" placeholder="Search invoice..." className="mb-3" style={{borderRadius: '5px', width: '100%'}} value={searchItem} onChange={(e) => setSearchItem(e.target.value)}/>
                </div>
                <div style={{marginTop: '33px'}}>
                <button className='b-sum'>Get Sales</button>
                </div>
                <div style={{marginTop: '33px'}} className='ml-lg-3 ml-0'>
                    <button className='b-sum2' onClick={switchTable}>Reset</button>
                </div>
            </div>
            </form>
              <div className="table-content mt-5">
                <div className="table-container">
                    <table className="my-table">
                        <thead>
                            <tr>
                                <th><div className='d-flex justify-content-between'><p>S/N</p><div><img src={Fil} alt="" /></div></div></th>
                                <th><div className='d-flex justify-content-between'><p>Invoice</p><div><img src={Fil} alt="" /></div></div></th>
                                <th style={{width: '15%'}}><div className='d-flex justify-content-between'><p>Customer</p><div><img src={Fil} alt="" /></div></div></th>
                                <th style={{width: '12%'}}><div className='d-flex justify-content-between'><p>Date</p><div><img src={Fil} alt="" /></div></div></th>
                                <th style={{width: '17%'}}><div className='d-flex justify-content-between'><p>Payment Method</p><div><img src={Fil} alt="" /></div></div></th>
                                <th style={{width: '15%'}}><div className='d-flex justify-content-between'><p>Total Amount</p><div><img src={Fil} alt="" /></div></div></th>
                                <th style={{width: '15%'}}><div className='d-flex justify-content-between'><p>Payment Status</p><div><img src={Fil} alt="" /></div></div></th>
                                <th style={{width: '17%'}}><div className='d-flex justify-content-between'><p>Created By</p><div><img src={Fil} alt="" /></div></div></th>
                            </tr>
                        </thead>
                        <tbody>
                            {active ? (
                                <>
                                  {sales?.length > 0 ? (
                                        sales?.map((item, index) => (
                                        <tr key={index} onClick={() => showDetails(item.invoice_number)} style={{cursor: 'pointer'}}>
                                            <td>{index + 1}</td>
                                            <td>{item.invoice_number}</td>
                                            <td>{item.customer_info.name}</td>
                                            <td>{item.date}</td>
                                            <td>{item.payment_method}</td>
                                            <td>₦{Number(item.total_amount).toLocaleString()}</td>
                                            <td><button className={item.payment_status}>{item.payment_status}</button></td>
                                            <td>{item.created_by}</td>
                                        </tr>
                                        ))
                                    ) : (
                                        <tr>
                                        <td colSpan="8">No sales summary available</td>
                                        </tr>
                                    )}
                                </>
                            ) : (
                            <>
                              {sValue?.length > 0 ? (
                                    sValue?.map((item, index) => (
                                    <tr key={index} onClick={() => showDetails(item.invoice_number)} style={{cursor: 'pointer'}}>
                                        <td>{index + 1}</td>
                                        <td>{item.invoice_number}</td>
                                        <td>{item.customer_info.name}</td>
                                        <td>{item.date}</td>
                                        <td>{item.payment_method}</td>
                                        <td>₦{Number(item.total_amount).toLocaleString()}</td>
                                        <td><button className={item.payment_status}>{item.payment_status}</button></td>
                                        <td>{item.created_by}</td>
                                    </tr>
                                    ))
                                ) : (
                                    <tr>
                                    <td colSpan="8">No sales summary available</td>
                                    </tr>
                                )}
                            </>
                          )}
                        </tbody>

                    </table>
                </div>
                <div className="sticky-pagination">
                    <Pagination
                        currentPage={active ? salesCurrentPage : sCurrentPage}
                        totalPages={active ? salesTotalPages : sTotalPages}
                        perPage={active ? salesPerPage : sPerPage}
                        total={active ? salesTotal : sTotal}
                        onPageChange={(newPage) => {
                            if (active) {
                                dispatch(getSales({ token, shop_id, month, year, page: newPage, per_page: salesPerPage }));
                            } else {
                                dispatch(getSearchValueData({ token, shop_id, month, year, search_value, page: newPage, per_page: sPerPage }));
                            }
                        }}
                    />
                </div>

              </div>
            </>
        )}

        {mode ? (
            <>
              <div className="modal-overlay">
                <div className="modal-content2">
                    <div className="head-mode">
                        <h6 style={{color: '#7A0091'}}>Sales Details</h6>
                        <button className="modal-close" onClick={hideModal}>
                        &times;
                        </button>
                   </div>
                   <div className="modal-body">
                        {details ? 
                        (
                        <>
                            <div>

                                <div className='d-lg-flex d-block justify-content-between'>
                                    <div>
                                        <img src={Inv} alt="img" className='mb-3'/>
                                    </div>
                                    <div>
                                        <div className='d-flex justify-content-between'>
                                            <p className='mr-3'>Date: </p>
                                            <p style={{color: '#271F29', fontWeight: '900'}} className='m-0 p-0'>{details.date}</p>
                                        </div>
                                        <div className='d-flex justify-content-between'>
                                            <p className='mr-3'>Payment Method: </p>
                                            <p style={{color: '#271F29', fontWeight: '900'}} className='m-0 p-0'>{details.payment_method}</p>
                                        </div>
                                        <div className='d-flex justify-content-between'>
                                            <p className='mr-3'>Payment Status: </p>
                                            <p className={details.payment_status} style={{width: '50px', padding: '0px'}}>{details.payment_status}</p>
                                        </div>
                                        <div className='d-flex justify-content-between'>
                                            <p className='mr-3'>Total Amount: </p>
                                            <p style={{color: '#271F29', fontWeight: '900'}} className='m-0 p-0'>₦{Number(details.total_amount).toLocaleString()}</p>
                                        </div>
                                    </div>

                                </div>
                                <hr />
                                <div className="row">
                                    <div className="col-sm-12 col-md-12 col-lg-6">
                                        <div className='d-flex'>
                                            <p className='mr-3'>Invoice Number: </p>
                                            <p style={{color: '#271F29', fontWeight: '900'}} className='m-0 p-0'>{details.invoice_number}</p>
                                            </div>
                                            <div className='d-flex'>
                                            <p className='mr-3'>Created By: </p>
                                            <p style={{color: '#271F29', fontWeight: '900'}} className='m-0 p-0'>{details.created_by}</p>
                                            </div>
                                            <div className='d-flex'>
                                            <p className='mr-3'>Discount Name: </p>
                                            <p style={{color: '#271F29', fontWeight: '900'}} className='m-0 p-0'>{details.discount_name || "none"}</p>
                                        </div>
                                    </div>
                                    <div className="col-sm-12 col-md-12 offset-lg-1 col-lg-5">
                                        <div className='d-flex'>
                                            <p className='mr-3'>Customer Name: </p>
                                            <p style={{color: '#271F29', fontWeight: '900'}} className='m-0 p-0'>{details.customer_info.name}</p>
                                            </div>
                                            <div className='d-flex'>
                                            <p className='mr-3'>Customer Email: </p>
                                            <p className='m-0 p-0' style={{color: '#271F29', fontWeight: '900'}}>{details.customer_info.email}</p>
                                            </div>
                                            <div className='d-flex'>
                                            <p className='mr-3'>Customer Phone Number: </p>
                                            <p style={{color: '#271F29', fontWeight: '900'}} className='m-0 p-0'>{(details.customer_info.phone_number)}</p>
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
                                        {details.products_ordered.map((product, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{product.product_name} - {product.inches} inches</td>
                                                <td>₦{Number(product.product_price).toLocaleString()}</td>
                                                <td>{product.quantity}</td>
                                                <td>₦{product.product_price * product.quantity}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                        </table>
                                    </div>
                                </div>

                            </div>
                        </>
                        ): ('')}
                    </div>
                </div>
              </div>
            </>
        ) : ('')}
    </>
  )
}

export default Sales
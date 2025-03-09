import React, {useState, useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getStockSummary, summaryData, clearSummary } from '../features/reportSlice';
import { Fil} from '../assets/images';
import Pagination from './support/Pagination';
import Swal from 'sweetalert2';


const Report = () => {
  const dispatch = useDispatch();
  let token = localStorage.getItem("token");
  const getId = localStorage.getItem("sid");
  const {error, loading, card, stockSummary, summaryItem, currentPage, per_page, total, total_pages, summaryCurrentPage, summaryPerPage, summaryTotal, summaryTotalPages} = useSelector((state) => state.report);

  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(month);
  const [change, setChange] = useState(true);

  useEffect(() => {
    if (token) {
      dispatch(getStockSummary({token, shop_id: getId, month: month, year: year, page: currentPage, per_page: per_page}))
    }
  }, [dispatch, token, currentPage, per_page])

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const cardItems = [
      {
        id: 0,
        cvalue: card.totalitemsinstock,
        content: "Total Items In Stock"
      },
      {
        id: 1,
        cvalue: card.totalitemsin,
        content: "Total Items In",
      },
      {
        id: 2,
        cvalue: card.totalitemsout,
        content: "Total Items Out",
      },
      {
        id: 3,
        cvalue: card.totalclosingStock,
        content: "Total Closing Stock",
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
          <h5>{Number(item.cvalue || 0).toLocaleString()}</h5>
          <p className={item.sub === '4.06%' ? 're' : ''}>{item.sub}</p>
        </div>
      </div>
  ));

  

  const handleSummaryFilter = (e) => {
    e.preventDefault();
  
    dispatch(getStockSummary({ token, shop_id: getId, month: selectedMonth, year: selectedYear, page: currentPage, per_page: per_page }))
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
  };

  const showDetails = (id) => {
    setChange(false)

    if (token) {
      dispatch(summaryData({token, summary_id: id, page: currentPage, per_page: per_page}))
    }
  }
  

  return (
    <>
      {change ? (
        <>
          <div className="dash-cards mt-5">
            { reportItem }
          </div>

          <form onSubmit={handleSummaryFilter} className='mt-5'>
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
                  <button className='b-sum'>Get Summary</button>
                </div>
            </div>
          </form>
          <div className="table-content">
            <div className="table-container mt-3">
                <table className="my-table">
                    <thead>
                      <tr>
                          <th><div className='d-flex justify-content-between'><p>S/N</p><div><img src={Fil} alt="" /></div></div></th>
                          <th><div className='d-flex justify-content-between'><p>Product Name</p><div><img src={Fil} alt="" /></div></div></th>
                          <th><div className='d-flex justify-content-between'><p>Inches</p><div><img src={Fil} alt="" /></div></div></th>
                          <th style={{width: '15%'}}><div className='d-flex justify-content-between'><p>Opening Stock</p><div><img src={Fil} alt="" /></div></div></th>
                          <th style={{width: '12%'}}><div className='d-flex justify-content-between'><p>Month</p><div><img src={Fil} alt="" /></div></div></th>
                          <th style={{width: '12%'}}><div className='d-flex justify-content-between'><p>Year</p><div><img src={Fil} alt="" /></div></div></th>
                          <th style={{width: '12%'}}><div className='d-flex justify-content-between'><p>Closing Stock</p><div><img src={Fil} alt="" /></div></div></th>
                      </tr>
                    </thead>
                    <tbody>
                      {stockSummary.length > 0 ? (
                        stockSummary.map((item, index) => {
                          const monthIndex = parseInt(item.month, 10) - 1; 
                          const monthName = monthNames[monthIndex] || item.month;

                          return (
                            <tr key={item.summary_id} onClick={() => showDetails(item.summary_id)} style={{cursor: 'pointer'}}>
                              <td>{index + 1}</td>
                              <td>{item.product_name}</td>
                              <td>{item.inch}</td>
                              <td>{item.opening_stock}</td>
                              <td>{monthName}</td>
                              <td>{item.year}</td>
                              <td>{item.closing_stock}</td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan="7">No summary available</td>
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
                        if (newPage < 1 || newPage > total_pages) return;
                        dispatch(getStockSummary({ token, shop_id: getId, month: month, year: year, page: newPage, per_page: per_page }));
                    }}
                    onPerPageChange={(newPerPage) => {
                        if (newPerPage < 1) return; 
                        dispatch(getStockSummary({ token, shop_id: getId, month: month, year: year, page: 1, per_page: newPerPage })); 
                    }}
                />
              </div>
          </div>
        </>
      ) : (
      <>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>Error: {error?.message || 'Something went wrong'}</div>
        ) : (
          <>
            <div className="text-right mt-5">
              <button className='btn mr-3' style={{background: '#fff', color: '#7A0091'}} onClick={() => setChange(true)}>Back</button>
            </div>
            <div className="table-content mt-5">
              <div className="table-container">
                <table className="my-table">
                  <thead>
                    <tr>
                      <th><div className='d-flex justify-content-between'><p>S/N</p><div><img src={Fil} alt="" /></div></div></th>
                      <th><div className='d-flex justify-content-between'><p>Product Name</p><div><img src={Fil} alt="" /></div></div></th>
                      <th><div className='d-flex justify-content-between'><p>Inches</p><div><img src={Fil} alt="" /></div></div></th>
                      <th style={{width: '15%'}}><div className='d-flex justify-content-between'><p>Movement type</p><div><img src={Fil} alt="" /></div></div></th>
                      <th style={{width: '12%'}}><div className='d-flex justify-content-between'><p>Movement reason</p><div><img src={Fil} alt="" /></div></div></th>
                      <th style={{width: '12%'}}><div className='d-flex justify-content-between'><p>Quantity</p><div><img src={Fil} alt="" /></div></div></th>
                      <th style={{width: '12%'}}><div className='d-flex justify-content-between'><p>Balance</p><div><img src={Fil} alt="" /></div></div></th>
                      <th style={{width: '12%'}}><div className='d-flex justify-content-between'><p>Date</p><div><img src={Fil} alt="" /></div></div></th>
                    </tr>
                  </thead>
                  <tbody>
                    {summaryItem.length > 0 ? (
                      summaryItem.map((item, index) => (
                        <tr key={item.id}>
                          <td>{index + 1}</td>
                          <td>{item.product_name}</td>
                          <td>{item.inch}</td>
                          <td>{item.movement_type}</td>
                          <td>{item.movement_reason}</td>
                          <td>{item.quantity}</td>
                          <td>{item.balance}</td>
                          <td>{item.movement_date}</td>
                        </tr>
                      ))
                    ) : (
                      <>
                        <tr>
                          <td colSpan="7">No summary available</td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="sticky-pagination">
                <Pagination
                    currentPage={summaryCurrentPage}
                    totalPages={summaryTotalPages}
                    perPage={summaryPerPage}
                    total={summaryTotal}
                    onPageChange={(newPage) => {
                        if (newPage < 1 || newPage > summaryTotalPages) return;
                        dispatch(summaryData({ token, summary_id: id, page: newPage, per_page: summaryPerPage }));
                    }}
                    onPerPageChange={(newPerPage) => {
                        if (newPerPage < 1) return; 
                        dispatch(summaryData({ token, summary_id: id, page: 1, per_page: newPerPage })); 
                    }}
                  />

              </div>
            </div>
          </>
        )}
      </>
    )}
    </>
  )
}

export default Report

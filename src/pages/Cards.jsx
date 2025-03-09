import React, {useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getDashData, getLatestItems } from '../features/dashboardSlice';
import { MixedChart } from './support/Chart';
import { Ts, Tcus, Tsold, Torder, Br, dr, Fp, Hair, Sh } from '../assets/images';

const Cards = () => {
  const dispatch = useDispatch();
  let token = localStorage.getItem("token");
  const getId = localStorage.getItem("sid");
  const {error, loading, item, payments} = useSelector((state) => state.dashboard);

  useEffect(() => {
    if (token) {
      dispatch(getDashData({token, shop_id: getId}))
      dispatch(getLatestItems({token, shop_id: getId}))
    }
  }, [dispatch, token])

  const cardItems = [
    {
      id: 0,
      icon: Ts,
      content: "TOTAL SALES",
      cvalue: `₦${Number(item.totalSales).toLocaleString()}`,
      grp: "406%"
    },
    {
      id: 1,
      icon: Tsold,
      content: "ITEM SOLD",
      cvalue: item.totalItemsSold,
      grp: "0.02%",
    },
    {
      id: 2,
      icon: Torder,
      content: "TOTAL ORDERS",
      cvalue: item.totalOrders,
      grp: "1.04%"
    },
    {
      id: 3,
      icon: Tcus,
      content: "TOTAL CUSTOMERS",
      cvalue: item.totalCustomers,
      grp: "4.06%"
    }
  ]

    const showItem = cardItems.map((item) =>
      <div className="card-single px-4 py-3" key={item.id}>
          <div className="d-flex justify-content-between mb-5">
              <small style={{color: '#7A0091'}}>{item.content}</small>
              <img src={item.icon} alt="" />
          </div>
          <div className="d-flex justify-content-between">
              <h5>{item.cvalue || 0}</h5>
              <small className={item.grp === '0.02%' ? 'df' : 'ft'}>{item.grp}</small>
          </div>
      </div> 
    )

    const topSell = item.bestSellingProducts?.map((item) => 
      <div className="d-flex justify-content-between mt-3 py-2" key={item.product_id}>
        <div className="d-flex">
            <div className='mr-3'>
              <img src={Hair} alt="" />
            </div>
            <p>{item.product_name}</p>
        </div>
        <p style={{color: '#2A803E'}}>{item.totalSold}</p>
    </div>
    )

    const recentTrans = payments.latestPayments?.map((item) => 
      <div className="d-flex justify-content-between mt-3 p-3">
          <div className="d-flex">
            <div className='mr-3'>
              <img src={Fp} alt="" />
            </div>
            <div>
              <p>Invoice: {item.invoice_number}<br/></p>
              <p>{item.date}</p>
            </div>
          </div>
        <p style={{color: '#2A803E'}}>₦{Number(item.total_amount).toLocaleString()}</p>
      </div>
    )
  return (
    <>
      <div className="dash-cards mt-5">
        { showItem }
      </div>

      <div className="row mt-5 box2">
          <div className="col-sm-12 col-md-12 col-lg-7">
              <div className="chart-item p-3">
                <MixedChart />
              </div>

              <div className="table-container mt-5">
                <table className="my-table">
                    <thead>
                        <tr>
                            <th>S/N</th>
                            <th>Invoice Number</th>
                            <th>Amount</th>
                            <th>Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                          <tr><td colSpan="9">Loading...</td></tr>
                        ) : (payments.latestInvoices)?.length > 0 ? (
                            (payments.latestInvoices)?.map((item, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item.invoice_number}</td>
                                <td>₦{Number(item.total_amount).toLocaleString()}</td>
                                <td>{item.date}</td>
                                <td><button className={item.status}>{item.status}</button></td>
                              </tr>
                            ))
                        ) : (
                          <tr>
                            <td colSpan="9">No latest Payments Available</td>
                          </tr>
                        )}
                    </tbody>
                </table>
              </div>
              
          </div>
          <div className="col-sm-12 col-md-12 col-lg-5">
              <div className="p-4">
                <h5 className='mb-3'>Top Selling Products</h5>
                  {topSell}
              </div>
              <div className="p-0 p-lg-3 recent-order" style={{marginTop: "126px"}}>
                  <div className='d-flex justify-content-between'>
                    <h5>Recent Transaction</h5>
                    <h6>See All</h6>
                  </div>
                  {recentTrans}
              </div>
          </div>
      </div>
    </>
  )
}

export default Cards

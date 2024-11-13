import React from 'react'
import Chart from './support/Chart';
import { Ts, Tcus, Tsold, Torder, Br, dr, Fp, Hair, Sh } from '../assets/images';

const Cards = () => {
    const cardItems = [
        {
          id: 0,
          icon: Ts,
          content: "TOTAL SALES",
          cvalue: "₦890,790,812",
          grp: "406%"
        },
        {
          id: 1,
          icon: Tsold,
          content: "ITEM SOLD",
          cvalue: "8,627",
          grp: "0.02%",
        },
        {
          id: 2,
          icon: Torder,
          content: "TOTAL ORDERS",
          cvalue: "2,825",
          grp: "1.04%"
        },
        {
          id: 3,
          icon: Tcus,
          content: "TOTAL CUSTOMERS",
          cvalue: "320",
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
              <h5>{item.cvalue}</h5>
              <small className={item.grp === '0.02%' ? 'df' : 'ft'}>{item.grp}</small>
          </div>
      </div> 
    )
  return (
    <>
      <div className="dash-cards mt-5">
        { showItem }
      </div>

      <div className="row mt-5">
          <div className="col-sm-12 col-md-12 col-lg-7">
              <div className="chart-item p-4">
                <Chart />
              </div>

              <div className="table-content">
                <div className="table-container mt-5">
                    <table className="my-table">
                        <thead>
                            <tr>
                                <th>Invoice Number</th>
                                <th>Customer Name</th>
                                <th>Date</th>
                                <th>Amount</th>
                                <th>Created by</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>#27654387265</td>
                                <td>Craig Westervelt</td>
                                <td>08-08-2024</td>
                                <td>10,000</td>
                                <td>Nolan Lipshutz</td>
                            </tr>
                            <tr>
                                <td>#27654387265</td>
                                <td>Craig Westervelt</td>
                                <td>08-08-2024</td>
                                <td>10,000</td>
                                <td>Nolan Lipshutz</td>
                            </tr>
                            <tr>
                                <td>#27654387265</td>
                                <td>Craig Westervelt</td>
                                <td>08-08-2024</td>
                                <td>10,000</td>
                                <td>Nolan Lipshutz</td>
                            </tr>
                            <tr>
                                <td>#27654387265</td>
                                <td>Craig Westervelt</td>
                                <td>08-08-2024</td>
                                <td>10,000</td>
                                <td>Nolan Lipshutz</td>
                            </tr>
                            <tr>
                                <td>#27654387265</td>
                                <td>Craig Westervelt</td>
                                <td>08-08-2024</td>
                                <td>10,000</td>
                                <td>Nolan Lipshutz</td>
                            </tr>
                            <tr>
                                <td>#27654387265</td>
                                <td>Craig Westervelt</td>
                                <td>08-08-2024</td>
                                <td>10,000</td>
                                <td>Nolan Lipshutz</td>
                            </tr>
                            <tr>
                                <td>#27654387265</td>
                                <td>Craig Westervelt</td>
                                <td>08-08-2024</td>
                                <td>10,000</td>
                                <td>Nolan Lipshutz</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
              </div>
              
          </div>
          <div className="col-sm-12 col-md-12 col-lg-5">
              <div className="box p-3">
                  <h5>Top Selling Products</h5>
                  <div className="d-flex justify-content-between mt-3 py-2">
                      <div className="d-flex">
                          <div className='mr-3'>
                            <img src={Hair} alt="" />
                          </div>
                          <p>Lush Bone Straight Wig</p>
                      </div>
                      <p style={{color: '#2A803E'}}>₦350,000</p>
                  </div>
                  <div className="d-flex justify-content-between py-2">
                      <div className="d-flex">
                          <div className='mr-3'>
                            <img src={dr} alt="" />
                          </div>
                          <p>Mini Hair Dryer</p>
                      </div>
                      <p style={{color: '#2A803E'}}>₦20,000</p>
                  </div>
                  <div className="d-flex justify-content-between py-3">
                      <div className="d-flex">
                           <div className='mr-3'>
                            <img src={Br} alt="" />
                          </div>
                          <p>Hand Brush</p>
                      </div>
                      <p style={{color: '#2A803E'}}>₦4,500</p>
                  </div>
                  <div className="d-flex justify-content-between">
                      <div className="d-flex">
                          <div className='mr-3'>
                            <img src={Sh} alt="" />
                          </div>
                          <p>Shampoo</p>
                      </div>
                      <p style={{color: '#2A803E'}}>₦6,000</p>
                  </div>
              </div>
              <div className="box p-3 mt-5">
                  <div className='d-flex justify-content-between'>
                    <h5>Recent Transaction</h5>
                    <h6>See All</h6>
                  </div>
                  <div className="d-flex justify-content-between mt-3 py-2">
                      <div className="d-flex">
                          <div className='mr-3'>
                            <img src={Fp} alt="" />
                          </div>
                          <p>Invoice<br/>20 Oct, 2024 04:12:29</p>
                      </div>
                      <p style={{color: '#2A803E'}}>₦20,000</p>
                  </div>
                  <div className="d-flex justify-content-between mt-2 py-2">
                      <div className="d-flex">
                          <div className='mr-3'>
                            <img src={Fp} alt="" />
                          </div>
                          <p>Invoice<br/>20 Oct, 2024 04:12:29</p>
                      </div>
                      <p style={{color: '#2A803E'}}>₦20,000</p>
                  </div>
                  <div className="d-flex justify-content-between mt-2 py-2">
                      <div className="d-flex">
                          <div className='mr-3'>
                            <img src={Fp} alt="" />
                          </div>
                          <p>Invoice<br/>20 Oct, 2024 04:12:29</p>
                      </div>
                      <p style={{color: '#2A803E'}}>₦20,000</p>
                  </div>
                  <div className="d-flex justify-content-between mt-2 py-2">
                      <div className="d-flex">
                          <div className='mr-3'>
                            <img src={Fp} alt="" />
                          </div>
                          <p>Invoice<br/>20 Oct, 2024 04:12:29</p>
                      </div>
                      <p style={{color: '#2A803E'}}>₦20,000</p>
                  </div>
                  
              </div>
          </div>
      </div>
    </>
  )
}

export default Cards

import React from 'react'
import { LineChart } from './support/Chart';
import Progress from './support/Progress'

const Report = () => {
    const cardItems = [
        {
          id: 0,
          content: "Total Sales Value",
          cvalue: "₦2,580,987.00",
        },
        {
          id: 1,
          content: "Total Profit Made",
          cvalue: "₦650,120.00",
          sub: "4.06%"
        },
        {
          id: 2,
          content: "No. of Sold Products",
          cvalue: "1,320",
        },
        {
          id: 3,
          content: "Total Orders",
          cvalue: "98",
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
          <h5 className="mb-4">{item.cvalue}</h5>
          <div className="d-flex justify-content-between">
            <p>{item.content}</p>
            <p className={item.sub === '4.06%' ? 're' : ''}>{item.sub}</p>
          </div>
        </div>
    ));
    

  return (
    <>
      <div className="dash-cards mt-5">
        { reportItem }
      </div>

      <div className="chart-item p-4">
            <LineChart />
       </div>

       <div className="pro-item">
           <Progress />
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
                        <th>Payment Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>#27654387265</td>
                        <td>Craig Westervelt</td>
                        <td>08-08-2024</td>
                        <td>10,000</td>
                        <td>Nolan Lipshutz</td>
                        <td><button className='p-btn'>Paid</button></td>
                    </tr>
                    <tr>
                        <td>#27654387265</td>
                        <td>Craig Westervelt</td>
                        <td>08-08-2024</td>
                        <td>10,000</td>
                        <td>Nolan Lipshutz</td>
                        <td><button className='u-btn'>Unpaid</button></td>
                    </tr>
                    <tr>
                        <td>#27654387265</td>
                        <td>Craig Westervelt</td>
                        <td>08-08-2024</td>
                        <td>10,000</td>
                        <td>Nolan Lipshutz</td>
                        <td><button className='u-btn'>Unpaid</button></td>
                    </tr>
                    <tr>
                        <td>#27654387265</td>
                        <td>Craig Westervelt</td>
                        <td>08-08-2024</td>
                        <td>10,000</td>
                        <td>Nolan Lipshutz</td>
                        <td><button className='u-btn'>Unpaid</button></td>
                    </tr>
                    <tr>
                        <td>#27654387265</td>
                        <td>Craig Westervelt</td>
                        <td>08-08-2024</td>
                        <td>10,000</td>
                        <td>Nolan Lipshutz</td>
                        <td><button className='u-btn'>Unpaid</button></td>
                    </tr>
                    <tr>
                        <td>#27654387265</td>
                        <td>Craig Westervelt</td>
                        <td>08-08-2024</td>
                        <td>10,000</td>
                        <td>Nolan Lipshutz</td>
                        <td><button className='u-btn'>Unpaid</button></td>
                    </tr>
                    <tr>
                        <td>#27654387265</td>
                        <td>Craig Westervelt</td>
                        <td>08-08-2024</td>
                        <td>10,000</td>
                        <td>Nolan Lipshutz</td>
                        <td><button className='p-btn'>Paid</button></td>
                    </tr>
                </tbody>
            </table>
        </div>
      </div>
    </>
  )
}

export default Report

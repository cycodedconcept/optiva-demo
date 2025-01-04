import React from 'react'
import { Pi, Up, Ca, Torder } from '../assets/images'

const Invoice = () => {
    const cardItems = [
        {
          id: 0,
          icon: Torder,
          content: "TOTAL INVOICE VALUE",
          cvalue: "₦890,790,812",
          grp: "14",
          sub: "Sent Invoices"
        },
        {
          id: 1,
          icon: Pi,
          content: "PAID INVOICES",
          cvalue: "₦120,000.81",
          grp: "6",
          sub: "Paid by customers"
        },
        {
          id: 2,
          icon: Up,
          content: "UNPAID INVOICES",
          cvalue: "₦700,400.12",
          grp: "15",
          sub: "Unpaid by customers"
        },
        {
          id: 3,
          icon: Ca,
          content: "CANCELED INVOICES",
          cvalue: "₦70,050.15",
          grp: "3",
          sub: 'Cancelled by customers'
        }
    ]

    const showCard = cardItems.map((card) => 
       <div className="card-single px-4 py-3" key={card.id}>
           <div className="d-flex justify-content-between mb-4">
               <div>
                   <h5 className='m-0 p-0'>{card.cvalue}</h5>
                   <small style={{color: '#95799B'}}>{card.content}</small>
               </div>
               <div>
                  <img src={card.icon} alt="" />
               </div>
           </div>
           <div className="d-flex">
               <small className={
                        card.content === 'TOTAL INVOICE VALUE'
                        ? 'ti mr-2'
                        : card.content === 'PAID INVOICES'
                        ? 'pi mr-2'
                        : card.content === 'UNPAID INVOICES'
                        ? 'up mr-2'
                        : 'can mr-2'
                    } style={{}}>{card.grp}</small>
               <small>{card.sub}</small>
           </div>
       </div>
    )
  return (
    <>
      <div className='text-right mt-5 mt-lg-4'>
          <button className='in-btn'>+ Create Invoice</button>
      </div>
      <div className="dash-cards mt-4">
        { showCard }
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

export default Invoice

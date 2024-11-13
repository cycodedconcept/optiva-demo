import React, { useState } from 'react';

const Payment = () => {
  const filterArray = ["All", "Paid", "Pending", "Cancelled", "Refunded"];
  const [activeFilter, setActiveFilter] = useState("All");

  const handleClick = (item) => {
    setActiveFilter(item);
  };

  const myArray = filterArray.map((item, index) => (
    <p
      key={index}
      className="p-3"
      onClick={() => handleClick(item)}
      style={{
        cursor: 'pointer',
        borderBottom: activeFilter === item ? '2px solid #7A0091' : 'none',
        color: activeFilter === item ? '#7A0091' : '#222',
      }}
    >
      {item}
    </p>
  ));

  return (
    <>
      <div className="d-block d-lg-flex mt-4">
        {myArray}
      </div>

      <div className="table-content">
        <div className="table-container mt-5">
            <table className="my-table">
                <thead>
                    <tr>
                        <th>Customer Name</th>
                        <th>Transaction ID</th>
                        <th>Date</th>
                        <th>Payment Type</th>
                        <th>Amount</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Wale Johnson</td>
                        <td>78889900781008</td>
                        <td>10-14-2024</td>
                        <td>Cash</td>
                        <td>30,000</td>
                        <td><button className='p-btn'>Paid</button></td>
                    </tr>
                    <tr>
                        <td>Abraham Daniels</td>
                        <td>78889900781008</td>
                        <td>10-14-2024</td>
                        <td>Transfer</td>
                        <td>100,500</td>
                        <td><button className='u-btn'>Unpaid</button></td>
                    </tr>
                    <tr>
                        <td>Wale Johnson</td>
                        <td>78889900781008</td>
                        <td>10-14-2024</td>
                        <td>Cash</td>
                        <td>30,000</td>
                        <td><button className='p-btn'>Paid</button></td>
                    </tr>
                    <tr>
                        <td>Abraham Daniels</td>
                        <td>78889900781008</td>
                        <td>10-14-2024</td>
                        <td>Transfer</td>
                        <td>100,500</td>
                        <td><button className='u-btn'>Unpaid</button></td>
                    </tr>
                    <tr>
                        <td>Wale Johnson</td>
                        <td>78889900781008</td>
                        <td>10-14-2024</td>
                        <td>Cash</td>
                        <td>30,000</td>
                        <td><button className='p-btn'>Paid</button></td>
                    </tr>
                    <tr>
                        <td>Abraham Daniels</td>
                        <td>78889900781008</td>
                        <td>10-14-2024</td>
                        <td>Transfer</td>
                        <td>100,500</td>
                        <td><button className='u-btn'>Unpaid</button></td>
                    </tr>
                    <tr>
                        <td>Wale Johnson</td>
                        <td>78889900781008</td>
                        <td>10-14-2024</td>
                        <td>Cash</td>
                        <td>30,000</td>
                        <td><button className='p-btn'>Paid</button></td>
                    </tr>
                    <tr>
                        <td>Abraham Daniels</td>
                        <td>78889900781008</td>
                        <td>10-14-2024</td>
                        <td>Transfer</td>
                        <td>100,500</td>
                        <td><button className='u-btn'>Unpaid</button></td>
                    </tr>
                </tbody>
            </table>
        </div>
      </div>
    </>
  );
};

export default Payment;

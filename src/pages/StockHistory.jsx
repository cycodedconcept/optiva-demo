import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';

const StockHistory = () => {
    const cardItems = [
        {
          id: 0,
          content: "Total Items in Stock",
          cvalue: "15,300",
        },
        {
          id: 1,
          content: "Items In",
          cvalue: "700",
        },
        {
          id: 2,
          content: "items out",
          cvalue: "3,300",
        },
        {
          id: 3,
          content: "Closing Stock",
          cvalue: "11,300",
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
          </div>
        </div>
    ));
  return (
    <>
        <div className='d-flex gap-2 mt-5 mt-lg-4'>
            <h5 style={{fontWeight: '600', cursor: 'pointer'}}>Report</h5>
            <p style={{color: '#6E7079'}}><FontAwesomeIcon icon={faChevronRight} style={{color: '#C2C6CE', fontWeight: '600'}} className="mx-2"/> Stock History</p>
        </div>
        <p>Stock Overview for the month of <span style={{color: '#8E18AC'}}>August, 2024</span></p>

        <div className="dash-cards mt-5">
          { reportItem }
        </div>

        <div className="table-content">
        <div className="table-container mt-5">
            <table className="my-table">
                <thead>
                    <tr> 
                        <th>S/N</th>
                        <th>Product Name</th>
                        <th>Opening Stock</th>
                        <th>Items In</th>
                        <th>Items Out</th>
                        <th>Closing Stock</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td>Wig and Attachment</td>
                        <td>120</td>
                        <td>4</td>
                        <td>0</td>
                        <td>204</td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>Wig and Attachment</td>
                        <td>180</td>
                        <td>3</td>
                        <td>0</td>
                        <td>214</td>
                    </tr>
                    <tr>
                        <td>3</td>
                        <td>Wig and Attachment</td>
                        <td>100</td>
                        <td>4</td>
                        <td>0</td>
                        <td>203</td>
                    </tr>
                    <tr>
                        <td>4</td>
                        <td>Wig and Attachment</td>
                        <td>120</td>
                        <td>4</td>
                        <td>0</td>
                        <td>204</td>
                    </tr>
                    <tr>
                        <td>5</td>
                        <td>Wig and Attachment</td>
                        <td>120</td>
                        <td>4</td>
                        <td>0</td>
                        <td>204</td>
                    </tr>
                    <tr>
                        <td>6</td>
                        <td>Wig and Attachment</td>
                        <td>120</td>
                        <td>4</td>
                        <td>0</td>
                        <td>204</td>
                    </tr>
                    <tr>
                        <td>7</td>
                        <td>Wig and Attachment</td>
                        <td>120</td>
                        <td>4</td>
                        <td>0</td>
                        <td>204</td>
                    </tr>
                    <tr>
                        <td>8</td>
                        <td>Wig and Attachment</td>
                        <td>120</td>
                        <td>4</td>
                        <td>0</td>
                        <td>204</td>
                    </tr>
                </tbody>
            </table>
        </div>
      </div>
    </>
  )
}

export default StockHistory

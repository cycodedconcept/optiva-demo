import React, {useState, useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Pi, Up, Ca, Torder, Fil } from '../assets/images';
import { getInvoice, clearSearch } from '../features/invoiceSlice';
import Pagination from './support/Pagination';
import Swal from 'sweetalert2';

const Invoice = () => {
  const dispatch = useDispatch();
  let token = localStorage.getItem("token");
  const getId = localStorage.getItem("sid");
  const {error, loading, invoice, card, currentPage, per_page, total, total_pages} = useSelector((state) => state.invoice);

  useEffect(() => {
    if (token) {
        dispatch(getInvoice({token, shop_id: getId, page: currentPage, per_page: per_page}))
    }
  }, [dispatch, token, currentPage, per_page])

    const cardItems = [
        {
        id: 0,
        icon: Torder,
        content: "TOTAL INVOICE VALUE",
        cvalue: `₦${Number(card?.data?.totalinvoice?.total_invoice_value || 0).toLocaleString()}`,
        grp: card?.data?.totalinvoice?.total_invoice_count || 0,
        sub: "Sent Invoices"
        },
        {
        id: 1,
        icon: Pi,
        content: "PAID INVOICES",
        cvalue: `₦${Number(card?.data?.totalpaidinvoice?.total_paid_value || 0).toLocaleString()}`,
        grp: card?.data?.totalpaidinvoice?.total_paid_count || 0,
        sub: "Paid by customers"
        },
        {
        id: 2,
        icon: Up,
        content: "UNPAID INVOICES",
        cvalue: `₦${Number(card?.data?.totalunpaidinvoice?.total_unpaid_value || 0).toLocaleString()}`,
        grp: card?.data?.totalunpaidinvoice?.total_unpaid_count || 0,
        sub: "Unpaid by customers"
        },
        {
        id: 3,
        icon: Ca,
        content: "CANCELED INVOICES",
        cvalue: `₦${Number(card?.data?.totalcancelinvoice?.total_cancel_value || 0).toLocaleString()}`,
        grp: card?.data?.totalcancelinvoice?.total_cancel_count || 0,
        sub: "Cancelled by customers"
        }
    ];


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
          <button className='in-btn'>+ Create Discount</button>
      </div>
      <div className="dash-cards mt-5">
        { showCard }
      </div>

      <div className="table-content">
        <div className="table-container mt-5">
            <table className="my-table w-100">
                <thead>
                    <tr>
                        <th style={{width: '5%'}}><div className='d-flex justify-content-between'><p>S/N</p><div><img src={Fil} alt="" /></div></div></th>
                        <th style={{width: '15%'}}><div className='d-flex justify-content-between'><p>Invoice Number</p><div><img src={Fil} alt="" /></div></div></th>
                        <th style={{width: '15%'}}><div className='d-flex justify-content-between'><p>Customer Name</p><div><img src={Fil} alt="" /></div></div></th>
                        <th style={{width: '15%'}}><div className='d-flex justify-content-between'><p>Date</p><div><img src={Fil} alt="" /></div></div></th>
                        <th style={{width: '13%'}}><div className='d-flex justify-content-between'><p>Payment Method</p><div><img src={Fil} alt="" /></div></div></th>
                        <th style={{width: '13%'}}><div className='d-flex justify-content-between'><p>Total Amount</p><div><img src={Fil} alt="" /></div></div></th>
                        <th style={{width: '10%'}}><div className='d-flex justify-content-between'><p>Created By</p><div><img src={Fil} alt="" /></div></div></th>
                        <th style={{width: '25%'}}><div className='d-flex justify-content-between'><p>Payment Status</p><div><img src={Fil} alt="" /></div></div></th>

                    </tr>
                </thead>
                <tbody>
                    {invoice?.length > 0 ? (
                        invoice.map((item, index) => (
                            <tr key={item.invoice_number}>
                                <td>{index + 1}</td>
                                <td>{item.invoice_number}</td>
                                <td>{item.customer_name.name}</td>
                                <td>{item.date}</td>
                                <td>{item.payment_method}</td>
                                <td>₦{Number(item.total_amount).toLocaleString()}</td>
                                <td>{item.created_by}</td>
                                <td><button className={item.payment_status}>{item.payment_status}</button></td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7">No invoice available</td>
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
        if (newPage < 1 || newPage > total_pages) return; // Prevent invalid pages
        dispatch(getInvoice({ token, shop_id: getId, page: newPage, per_page: per_page }));
    }}
    onPerPageChange={(newPerPage) => {
        if (newPerPage < 1) return; // Prevent invalid per_page values
        dispatch(getInvoice({ token, shop_id: getId, page: 1, per_page: newPerPage })); // Reset to first page
    }}
/>




            </div>
      </div>
    </>
  )
}

export default Invoice

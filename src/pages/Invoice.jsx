import React, {useState, useEffect, useRef} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Pi, Up, Ca, Torder, Fil, Inv } from '../assets/images';
import { getInvoice, clearSearch, getProduct, getDiscount, updateInvoice, validatePin, invoicePaymentStatus, cancelValidatePin } from '../features/invoiceSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faPrint, faEye } from '@fortawesome/free-solid-svg-icons';
import Pagination from './support/Pagination';
import { Plus, Minus, Search, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';
import { useReactToPrint } from "react-to-print";


const Invoice = () => {
  const invoiceRef = useRef(null);
  const dispatch = useDispatch();
  let token = localStorage.getItem("token");
  const getId = localStorage.getItem("sid");
  const {error, loading, invoice, card, currentPage, per_page, total, total_pages, products, discountItem} = useSelector((state) => state.invoice);
  const [mode, setMode] = useState(false);
  const [searchTerms, setSearchTerms] = useState({});
  const [items, setItems] = useState([]);
  const [spro, setSpro] = useState(true);
  const [discount, setDiscount] = useState({ name: '', value: 0 });
  const [invoiceNumber, setInvoiceNumber] = useState();
  const [paymentMethod, setPaymentMethod] = useState('');
  const [inDetails, setInDetails] = useState(true);
  const [dataItem, setDataItem] = useState(null);
  const [all, setAll] = useState(false);
  const [initem, setInItem] = useState(null);
  const [statusInv, setStatusInv] = useState(false);
  const [dvalue, setDvalue] = useState('');
  const [second, setSecond] = useState(false);

  useEffect(() => {
    if (token) {
        dispatch(getInvoice({token, shop_id: getId, page: currentPage, per_page: per_page}))
        dispatch(getProduct({token, shop_id: getId, page: 'All'}))
        dispatch(getDiscount({token}))
    }
  }, [dispatch, token, currentPage, per_page])

  const hideModal = () => {
    setMode(false);
    setAll(false);
    setStatusInv(false);
    setSecond(false);
  }

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

    const getUpModal = (inumber) => {
        setMode(true);
        const gInvoice = localStorage.getItem("invoice");
        const gI = JSON.parse(gInvoice);
    
        const selectedInvoice = gI.data.find((item) => item.invoice_number === inumber);
        console.log(selectedInvoice)
    
        if (selectedInvoice) {
            setInvoiceNumber(selectedInvoice.invoice_number || '');
            setPaymentMethod(selectedInvoice.payment_method || '');
    
            // Handle discount
            const matchingDiscount = discountItem.find(
                item => item.discount_name === selectedInvoice.discount_name
            );
    
            setDiscount({
                name: selectedInvoice.discount_name || '',
                value: matchingDiscount ? parseFloat(matchingDiscount.discount_value) : 0
            });
    
            // Handle products
            if (selectedInvoice.products_ordered && selectedInvoice.products_ordered.length > 0) {
                const prefillItems = selectedInvoice.products_ordered.map(product => ({
                    productId: product.product_id,
                    productName: product.product_name,
                    sellingPrice: product.product_price,
                    quantity: parseInt(product.quantity),
                    inches: product.inches || '',
                    amount: (parseInt(product.product_price) * parseInt(product.quantity)).toString()
                }));
    
                setItems(prefillItems);
                setSpro(false);
    
                // Initialize search terms
                const initialSearchTerms = {};
                prefillItems.forEach((_, index) => {
                    initialSearchTerms[index] = '';
                });
                setSearchTerms(initialSearchTerms);
            }
        }
    };

    const getFilteredProducts = (searchTerm) => {
        return Array.isArray(products) 
          ? products.filter(product => 
              product.product_name.toLowerCase().includes((searchTerm || '').toLowerCase())
            )
          : [];
        };
    
      const addNewItem = (e) => {
        e.preventDefault();
        setSpro(false);
        setItems([...items, {
          productId: '',
          sellingPrice: '',
          quantity: 1,
          inches: '',
          amount: ''
        }]);
      };
    

    const getInitialPrice = (product) => {
        if (!product) return '0';
        
        if (product.inches && product.inches.length > 0) {
          return product.inches[0].selling_price;
        }
        
        const priceString = product.total_selling_price;
        if (priceString.includes('=')) {
          return priceString.split('=').pop().trim().replace('₦', '').replace(',', '');
        }
        return priceString.replace('₦', '').replace(',', '');
    };

    useEffect(() => {
        items.forEach((item, index) => {
          if (item.productId) {
            const product = products.find(p => p.id === parseInt(item.productId));
            if (product && item.inches) {
              handleInchChange(index, item.inches, product);
            }
          }
        });
      }, []);
    
      const handleInchChange = (index, value, product) => {
        const selectedInch = product.inches.find(i => i.inche.toString() === value.toString());
        if (selectedInch) {
          const newItems = [...items];
          newItems[index].inches = value;
          newItems[index].sellingPrice = selectedInch.selling_price;
          newItems[index].amount = (parseInt(selectedInch.selling_price) * parseInt(newItems[index].quantity || 1)).toString();
          setItems(newItems);
        }
      };
    
    //   const updateItem = (index, field, value) => {
    //     const newItems = [...items];
    //     newItems[index][field] = value;
    
    //     if (field === 'productId') {
    //       const product = products.find(p => p.id === parseInt(value));
    //       if (product) {
    //         const defaultPrice = getInitialPrice(product);
    //         newItems[index].sellingPrice = defaultPrice;
    //         newItems[index].amount = (parseInt(defaultPrice) * newItems[index].quantity).toString();
    //         newItems[index].inches = '';
    
    //         if (product.inches && product.inches.length > 0) {
    //             const defaultInch = product.inches[0].inche;
    //             newItems[index].inches = defaultInch;
    //             // Update price based on the default inch
    //             handleInchChange(index, defaultInch, product);
    //             return; // Return here since handleInchChange will call setItems
    //         }
    //       }
    //     }
    
    //     if (field === 'quantity') {
    //       newItems[index].amount = (
    //         parseInt(newItems[index].sellingPrice || 0) * parseInt(value || 0)
    //       ).toString();
    //     }
    
    //     setItems(newItems);
    //   };
    
    const updateItem = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = value;
    
        if (field === 'productId') {
          const product = products.find(p => p.id === parseInt(value));
          if (product) {
            const defaultPrice = getInitialPrice(product);
            newItems[index].sellingPrice = defaultPrice;
            newItems[index].amount = (parseInt(defaultPrice) * newItems[index].quantity).toString();
            newItems[index].inches = '';
    
            if (product.inches && product.inches.length > 0) {
              const defaultInch = product.inches[0].inche;
              newItems[index].inches = defaultInch;
              handleInchChange(index, defaultInch, product);
              return;
            }
          }
        }
    
        if (field === 'quantity') {
          const amount = parseInt(newItems[index].sellingPrice || 0) * parseInt(value || 0);
          newItems[index].amount = amount.toString();
        }
    
        setItems(newItems);
      };
      
    //   new
    
    
    const handleSearch = (index, searchTerm) => {
        setSearchTerms(prev => ({
          ...prev,
          [index]: searchTerm
        }));
      };
    
      const removeItem = (index) => {
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
        
        const newSearchTerms = { ...searchTerms };
        delete newSearchTerms[index];
        setSearchTerms(newSearchTerms);
    
        if (newItems.length === 0) {
            setSpro(true);
        }
    };
    
    // Calculate subtotal from all items
    const calculateSubTotal = () => {
        return items.reduce((sum, item) => sum + (parseInt(item.amount) || 0), 0);
    };
    
    const handleDiscountChange = (e) => {
        const selectedValue = e.target.value;
        const selectedDiscount = discountItem.find(item => item.discount_value.toString() === selectedValue);
        
        setDiscount({
            name: selectedDiscount ? selectedDiscount.discount_name : '',
            value: selectedDiscount ? parseFloat(selectedDiscount.discount_value) : 0
        });
    };
    
    const calculateTotal = () => {
        const subTotal = calculateSubTotal();
        const discountAmount = subTotal * discount.value;
        return subTotal - discountAmount;
    };

    const handleUpdateInvoice = async (e) => {
       e.preventDefault();

       if (!paymentMethod || !invoiceNumber || items.length === 0) {
            return Swal.fire({
                icon: "warning",
                title: "All fields are required",
                text: "You need to log in before creating invoice.",
            });
        }

        const products_ordered_array = items.map(item => {
            const product = products.find(p => p.id === parseInt(item.productId));
            return {
                product_id: item.productId,
                product_name: product?.product_name || '',
                product_price: item.sellingPrice,
                quantity: item.quantity.toString(),
                inches: item.inches || ''
            };
        });

        Swal.fire({
            icon: "success",
            title: "Valid Input!",
            text: "Invoice is being updated...",
            timer: 1500,
            showConfirmButton: false,
        });

        try {
            Swal.fire({
                title: "Updating Invoice...",
                text: "Please wait while we process your request.",
                allowOutsideClick: false,
                showConfirmButton: false,
                didOpen: () => {
                  Swal.showLoading();
                },
            });

            const data = {
                invoice_number: invoiceNumber,
                payment_method: paymentMethod,
                total_amount: calculateTotal().toString(),
                discount_name: discount.name,
                products_ordered_array
            }
            console.log(data)
            const response = await dispatch(updateInvoice({token, updateData: data})).unwrap();

            if (response.message === "Invoice updated") {
                Swal.fire({
                    icon: "success",
                    title: "updating invoice",
                    text: `${response.message}`,
                });
    
                setItems([]);
                setSearchTerms({});
                setPaymentMethod('');
                setDiscount({ name: '', value: 0 }); 
                
                hideModal();
                dispatch(getInvoice({token, shop_id: getId, page: currentPage, per_page: per_page}))
            }
            else {
                Swal.fire({
                  icon: "info",
                  title: "updating invoice",
                  text: `${response.message}`,
                });
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error Occurred",
                text: error.message || "Something went wrong while updating invoice. Please try again.",
            });
        }
    }

    const showInvoiceDetails = (inNumber) => {
        setInDetails(false);
        const getDetails = localStorage.getItem("invoice");
        const det = JSON.parse(getDetails);

        const selectedInvoice = det.data.find((item) => item.invoice_number === inNumber);

        if (selectedInvoice) {
            setDataItem(selectedInvoice)
        }
    }

    const showDetails = (vNumber) => {
        setAll(true);

        const getDetails = localStorage.getItem("invoice");
        const deta = JSON.parse(getDetails);

        const detailItem = deta.data.find((item) => item.invoice_number === vNumber);
        console.log(detailItem)

        if (detailItem) {
            setInItem(detailItem)
        }
    }

    const handlePrint = useReactToPrint({
        contentRef: invoiceRef,
        onAfterPrint: () => console.log("Invoice printed successfully!"),
    });

    const changeStatus = (payment, inum) => {
        if (payment === "Paid" || payment === "paid") {
          setStatusInv(false)
        }else {
          setStatusInv(true)
          localStorage.setItem("ivv", inum)
        }
    }

    const handlePinChange = async (e) => {
        e.preventDefault();
        const getIn = localStorage.getItem("ivv");

        if (dvalue === "") {
            Swal.fire({
                icon: "info",
                title: "updating product",
                text: 'All these fields are required!',
                confirmButtonColor: '#7A0091'
            })
            return;
        }
        try {
            Swal.fire({
                title: "Validating Pin...",
                text: "Please wait while we process your request.",
                allowOutsideClick: false,
                showConfirmButton: false,
                didOpen: () => {
                    Swal.showLoading();
                },
            });

            const response = await dispatch(validatePin({token, invoice_number: getIn, pin: dvalue})).unwrap();

            Swal.close();

            if (response.message === "success") {
                hideModal();
                setDvalue('');
                setSecond(true);
            }
            else {
                Swal.fire({
                    icon: "info",
                    title: "Validating Pin",
                    text: `${response.message}`,
                });
            }
        } 
        catch (error) {
            Swal.close();
            Swal.fire({
                icon: "error",
                title: "Error Occurred",
                text: error.message || "Something went wrong while validating Pin. Please try again.",
            });
        }
    }

    const handlePaid = async (e) => {
        e.preventDefault();
        const getIn = localStorage.getItem("ivv");

        try {
            Swal.fire({
                title: "Validating Payment Status...",
                text: "Please wait while we process your request.",
                allowOutsideClick: false,
                showConfirmButton: false,
                didOpen: () => {
                    Swal.showLoading();
                },
            });

            const response = await dispatch(invoicePaymentStatus({token, invoice_number: getIn, shop_id: getId, status: 'Paid'})).unwrap();

            if (response.message === "Invoice updated") {
                Swal.fire({
                    icon: "success",
                    title: "updating payment status",
                    text: `${response.message}`,
                });

                hideModal();
                dispatch(getInvoice({token, shop_id: getId, page: currentPage, per_page: per_page}))
            }
            else {
                Swal.fire({
                  icon: "info",
                  title: "updating payment status",
                  text: `${response.message}`,
                });
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error Occurred",
                text: error.message || "Something went wrong while updating invoice payment status. Please try again.",
            });
        }

    }

    const handleCancle = async (e) => {
        e.preventDefault();
        const getIn = localStorage.getItem("ivv");

        try {
            Swal.fire({
                title: "canceling Payment Status...",
                text: "Please wait while we process your request.",
                allowOutsideClick: false,
                showConfirmButton: false,
                didOpen: () => {
                    Swal.showLoading();
                },
            });

            const response = await dispatch(cancelValidatePin({token, invoice_number: getIn})).unwrap();

            if (response.message === "success") {
                Swal.fire({
                    icon: "success",
                    title: "canceling payment status",
                    text: `${response.message}`,
                });

                hideModal();
                dispatch(getInvoice({token, shop_id: getId, page: currentPage, per_page: per_page}))
            }
            else {
                Swal.fire({
                  icon: "info",
                  title: "canceling payment status",
                  text: `${response.message}`,
                });
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error Occurred",
                text: error.message || "Something went wrong while canceling invoice payment status. Please try again.",
            });
        }
    }

  return (
    <>
        {inDetails ? (
            <>
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
                                    <th style={{width: '16%'}}><div className='d-flex justify-content-between'><p>Payment Method</p><div><img src={Fil} alt="" /></div></div></th>
                                    <th style={{width: '13%'}}><div className='d-flex justify-content-between'><p>Total Amount</p><div><img src={Fil} alt="" /></div></div></th>
                                    <th style={{width: '25%'}}><div className='d-flex justify-content-between'><p>Payment Status</p><div><img src={Fil} alt="" /></div></div></th>
                                    <th><div className='d-flex justify-content-between'><p>Actions</p><div><img src={Fil} alt="" /></div></div></th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoice?.length > 0 ? (
                                    invoice.map((item, index) => (
                                        <tr key={item.invoice_number} style={{cursor: 'pointer'}} onClick={() => showDetails(item.invoice_number)}>
                                            <td>{index + 1}</td>
                                            <td>{item.invoice_number}</td>
                                            <td>{item.customer_info.name}</td>
                                            <td>{item.date}</td>
                                            <td>{item.payment_method}</td>
                                            <td>₦{Number(item.total_amount).toLocaleString()}</td>
                                            <td><button className={item.payment_status} onClick={(e) => {changeStatus(item.payment_status, item.invoice_number); e.stopPropagation();}}>{item.payment_status}</button></td>
                                            <td>
                                                <div className="d-flex">
                                                    <div className="d-flex gap-5">
                                                        <FontAwesomeIcon icon={faEye} style={{color: '#379042', fontSize: '16px', marginRight: '20px'}} onClick={(e) => { showInvoiceDetails(item.invoice_number); e.stopPropagation();}} title='update discount'/>
                                                    </div>
                                                    <div className="d-flex gap-5">
                                                        <FontAwesomeIcon icon={faEdit} style={{color: '#379042', fontSize: '16px', marginRight: '20px'}} onClick={(e) => { getUpModal(item.invoice_number); e.stopPropagation();}} title='update discount'/>
                                                    </div>
                                                </div>
                                            </td>
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

                {mode ? (
                    <>
                    <div className="modal-overlay">
                        <div className="modal-content2">
                            <div className="head-mode">
                                <h6 style={{color: '#7A0091'}}>Update Invoice</h6>
                                <button className="modal-close" onClick={hideModal}>&times;</button>
                            </div>
                            <div className="modal-body">
                                <div className='mt-lg-5 mt-3 in-bg py-2'>
                                    <form onSubmit={handleUpdateInvoice}>
                                        <div className="row">
                                            <div className="col-sm-12 col-md-12 col-lg-6">
                                                <div className="form-group mb-4">
                                                    <label htmlFor="exampleInputEmail1">Invoice Number <span style={{color: '#7A0091'}}>*</span></label>
                                                    <input type="text" placeholder='Enter Invoice Number' value={invoiceNumber} readOnly onChange={(e) => setInvoiceNumber(e.target.value)}/>
                                                </div>
                                            </div>
                                            <div className="col-sm-12 col-md-12 col-lg-6">
                                                <div className="form-group mb-4">
                                                    <label htmlFor="exampleInputEmail1">Payment Method <span style={{color: '#7A0091'}}>*</span></label>
                                                    <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                                                        <option>--select payment type--</option>
                                                        <option value="Cash">Cash</option>
                                                        <option value="Transfer">Transfer</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="py-4">
                                            <div className="row p-3" style={{background: '#FCF2FF'}}>
                                                <div className="col-sm-12 col-md-12 col-lg-4"><p style={{color: '#2E2F41'}}><b>Product Name</b></p></div>
                                                <div className="col-md-2"><p style={{color: '#2E2F41'}}><b>Selling Price</b></p></div>
                                                <div className="col-md-2"><p style={{color: '#2E2F41'}}><b>Quantity</b></p></div>
                                                <div className="col-md-2"><p style={{color: '#2E2F41'}}><b>Inches</b></p></div>
                                                <div className="col-md-2"><p style={{color: '#2E2F41'}}><b>Amount</b></p></div>
                                            </div>

                                            <div style={{background: '#FEFBFF'}} className='py-5'>
                                                {items.map((item, index) => {
                                                    const filteredProducts = getFilteredProducts(searchTerms[index]);
                                                        
                                                    return (
                                                    <div key={index} className="card-in mb-4 py-1">
                                                        <div className="row">
                                                            <div className="col-sm-12 col-md-12 col-lg-3">
                                                                <div className="input-group mb-2">
                                                                    <span className="input-group-text">
                                                                        <Search size={20} />
                                                                    </span>
                                                                    <input
                                                                        type="text"
                                                                        placeholder="Search products..."
                                                                        className="form-control"
                                                                        value={searchTerms[index] || ''}
                                                                        onChange={(e) => handleSearch(index, e.target.value)}
                                                                    />
                                                                </div>
                                                                <select
                                                                    value={item.productId}
                                                                    onChange={(e) => updateItem(index, 'productId', e.target.value)}
                                                                    className="form-select"
                                                                >
                                                                    <option value="">Select a product</option>
                                                                    {filteredProducts.map(product => (
                                                                        <option key={product.id} value={product.id}>
                                                                            {product.product_name}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            </div>

                                                            <div className="col-sm-12 col-md-12 col-lg-2">
                                                                <label className="form-label">Selling Price</label>
                                                                <input
                                                                    type="number"
                                                                    value={item.sellingPrice}
                                                                    readOnly
                                                                />
                                                            </div>

                                                            <div className="col-sm-12 col-md-12 col-lg-3">
                                                                <label className="form-label">Quantity</label>
                                                                <div className="input-group">
                                                                    <button
                                                                        onClick={() => updateItem(index, 'quantity', Math.max(1, item.quantity - 1))}
                                                                        className="btn qb bb"
                                                                        type="button"
                                                                    >
                                                                        <Minus size={16} />
                                                                    </button>
                                                                    <input
                                                                        type="number"
                                                                        value={item.quantity}
                                                                        onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                                                                        min="1"
                                                                        style={{ width: '70px' }}
                                                                        className='qb-input'
                                                                    />
                                                                    <button
                                                                        onClick={() => updateItem(index, 'quantity', item.quantity + 1)}
                                                                        className="btn qb cc"
                                                                        type="button"
                                                                    >
                                                                        <Plus size={16} />
                                                                    </button>
                                                                </div>
                                                            </div>

                                                            {item.productId && products.find(p => p.id === parseInt(item.productId))?.inches.length > 0 && (
                                                                <div className="col-sm-12 col-md-12 col-lg-2">
                                                                    <label className="form-label">Inches</label>
                                                                    <select
                                                                        value={item.inches}
                                                                        onChange={(e) => {
                                                                            const product = products.find(p => p.id === parseInt(item.productId));
                                                                            handleInchChange(index, e.target.value, product);
                                                                        }}
                                                                        className="form-select"
                                                                    >
                                                                        <option value="">Select inches</option>
                                                                        {products
                                                                            .find(p => p.id === parseInt(item.productId))
                                                                            ?.inches.map(inch => (
                                                                                <option key={inch.inche} value={inch.inche}>
                                                                                    {inch.inche}"
                                                                                </option>
                                                                            ))}
                                                                    </select>
                                                                </div>
                                                            )}

                                                            <div className="col-md-2 d-flex">
                                                                <div className="flex-grow-1">
                                                                    <label className="form-label">Amount</label>
                                                                    <input
                                                                        type="number"
                                                                        value={item.amount}
                                                                        readOnly
                                                                    />
                                                                </div>
                                                                <button
                                                                    onClick={() => removeItem(index)}
                                                                    className="btn p-1 align-self-center ms-2"
                                                                    type="button"
                                                                    style={{ 
                                                                        minWidth: 'auto',
                                                                        backgroundColor: 'transparent',
                                                                        border: 'none'
                                                                    }}
                                                                >
                                                                    <Trash2 size={18} className="text-danger" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    );
                                                })}
                                            </div>

                                            <button 
                                                onClick={addNewItem}
                                                className="btn add-btn ml-3"
                                            >
                                                + Add Item
                                            </button>
                                        </div>

                                        <div className="row mt-5 p-3">
                                            <div className="col-sm-12 col-md-12 col-lg-6"></div>
                                            <div className="col-sm-12 col-md-12 offset-lg-1 col-lg-5">
                                                <div className="total-section text-right">
                                                    <div className='d-flex justify-content-between'>
                                                        <p>Sub Total:</p>
                                                        <p><b>₦{calculateSubTotal().toLocaleString()}</b></p>
                                                    </div>
                                                    <div className='d-flex justify-content-between'>
                                                        <p className='mt-3'>Add Discount (%):</p>
                                                        <div className="form-group">

                                                        <select 
                                                            value={discount.value} 
                                                            onChange={handleDiscountChange}
                                                            className="form-control"
                                                        >
                                                            <option value="">--select discount--</option>
                                                            {discountItem.map((item, index) => 
                                                                <option 
                                                                    key={index} 
                                                                    value={item.discount_value} 
                                                                    disabled={item.status === "inactive"}
                                                                >
                                                                    {item.discount_name}
                                                                </option>
                                                            )}
                                                        </select>
                                                        </div>
                                                    </div>
                                                    <div className='d-flex justify-content-between'>
                                                        <p>Total:</p>
                                                        <p><b>₦{calculateTotal().toLocaleString()}</b></p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <button className='in-btn p-2'>
                                                {loading ? (
                                                        <>
                                                        <div className="spinner-border spinner-border-sm text-light" role="status">
                                                            <span className="sr-only"></span>
                                                        </div>
                                                        <span>Creating Invoice... </span>
                                                        </>
                                                    ) : (
                                                        'Save and Continue'
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </>) : ('')}
            </>
        ) : (
        <>
          <div className='mt-5'>
            <div className="text-right mb-4">
                <button className='btn mr-3' style={{background: '#fff', color: '#7A0091'}} onClick={() => setInDetails(true)}>Back</button>
                <button 
                        className='btn px-3 no-print' 
                        style={{background: '#7A0091', color: '#F8F6F8'}}
                        onClick={handlePrint}
                    >
                        <FontAwesomeIcon icon={faPrint} className='mr-4'/>
                        Print
                    </button>
            </div>

            {dataItem ? (
                <>
                    <div ref={invoiceRef} style={{background: '#fff'}} className='p-4'>
                        <div className="top-section d-flex justify-content-between">
                        <div>
                            <img src={Inv} alt="img" className='mb-3'/>
                            <p className='m-0 p-0' style={{color: '#4C3B4F', fontWeight: '800'}}>Invoice To</p>
                            <h5 style={{color: '#271F29', fontWeight: '900'}} className='m-0 p-0'>{dataItem.customer_info.name}</h5>
                            <p style={{color: '#95799B'}}>Professional in hair making business</p>
                        </div>
                        <div className='text-right'>
                            <h4 style={{color: '#7A0091', fontWeight: '900'}}>INVOICE</h4>
                            <p style={{color: '#4C3B4F'}} className='m-0 p-0'>Payment Status</p>
                            <div className='text-right mb-5'>
                                <button style={{fontSize: '12px', width: '70px'}} className={dataItem.payment_status}>{dataItem.payment_status}</button>
                            </div>

                            <div className="d-flex">
                                <small className='d-block mr-3' style={{color: '#95799B'}}>Invoice No: </small>
                                <small style={{color: '#271F29'}}>{dataItem.invoice_number}</small>
                            </div>
                            <div className="d-flex">
                                <small className='d-block mr-3' style={{color: '#95799B'}}>Issued Date: </small>
                                <small style={{color: '#271F29'}}>{dataItem.date}</small>
                            </div>
                            <div className="d-flex">
                                <small className='d-block mr-3' style={{color: '#95799B'}}>Date Due: </small>
                                <small style={{color: '#271F29'}}>{dataItem.date}</small>
                            </div>
                        </div>
                        </div>
                        <hr />
                        <div className="d-flex justify-content-between">
                            <div>
                                <small className='d-block' style={{color: '#4C3B4F'}}>Contact person</small>
                                <div className="d-flex">
                                    <small className='d-block mr-3' style={{color: '#95799B'}}>Phone No: </small>
                                    <small style={{color: '#271F29'}}>{dataItem.customer_info.phone_number}</small>
                                    </div>
                                    <div className="d-flex">
                                    <small className='d-block mr-3' style={{color: '#95799B'}}>Email: </small>
                                    <small style={{color: '#271F29'}}>{dataItem.customer_info.email}</small>
                                    </div>
                                    <div className="d-flex">
                                    <small className='d-block mr-3' style={{color: '#95799B'}}>Payment Method: </small>
                                    <small style={{color: '#271F29'}}>{dataItem.payment_method}</small>
                                </div>
                            </div>
                            <div>
                                <small className='d-block' style={{color: '#4C3B4F'}}>Total Amount</small> 
                                <h5 style={{color: '#7A0091', fontWeight: '900'}}>₦{Number(dataItem.total_amount).toLocaleString()}</h5>
                                <small className='d-block' style={{color: '#4C3B4F'}}>Discount</small> 
                                <small style={{color: '#7A0091', fontWeight: '900'}}>{dataItem.discount_name}</small>
                            </div>
                        </div>
                        <hr />
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
                            {dataItem.products_ordered.map((product, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{product.product_name} - {product.inches} inches</td>
                                    <td>₦{Number(product.product_price).toLocaleString()}</td>
                                    <td>{product.quantity}</td>
                                    <td>₦{Number(product.product_price * product.quantity).toLocaleString()}</td>
                                </tr>
                            ))}
                            </tbody>
                            <tfoot>
                            <tr className="text-right">
                                <td colSpan="4" className="p-2 font-semibold">Subtotal:</td>
                                <td className="p-2 font-semibold">₦{Number(dataItem.total_amount).toLocaleString()}</td>
                            </tr>
                            <tr className="text-right">
                                <td colSpan="4" className="p-2 font-semibold w-50">Total:</td>
                                <td className="p-2 font-semibold">₦{Number(dataItem.total_amount).toLocaleString()}</td>
                            </tr>
                            </tfoot>
                        </table>
                    </div>
                </>
            ) : (
               <p>Loading invoice...</p>
            )}
          </div>
        </>
        )
        }

        {all ? (
            <>
                <div className="modal-overlay">
                    <div className="modal-content2">
                        <div className="head-mode">
                            <h6 style={{color: '#7A0091'}}>Invoice Details</h6>
                            <button className="modal-close" onClick={hideModal}>&times;</button>
                        </div>
                        <div className="modal-body">
                            {initem ? 
                            (
                            <>
                                <div>

                                    <div className='d-flex justify-content-between'>
                                        <div>
                                          <img src={Inv} alt="img" className='mb-3'/>
                                        </div>
                                        <div>
                                            <div className='d-flex'>
                                              <p className='mr-3'>Date: </p>
                                              <p style={{color: '#271F29', fontWeight: '900'}} className='m-0 p-0'>{initem.date}</p>
                                            </div>
                                            <div className='d-flex'>
                                              <p className='mr-3'>Payment Method: </p>
                                              <p style={{color: '#271F29', fontWeight: '900'}} className='m-0 p-0'>{initem.payment_method}</p>
                                            </div>
                                            <div className='d-flex'>
                                              <p className='mr-3'>Payment Status: </p>
                                              <p className={initem.payment_status} style={{width: '0px', padding: '0px'}}>{initem.payment_status}</p>
                                            </div>
                                            <div className='d-flex'>
                                              <p className='mr-3'>Total Amount: </p>
                                              <p style={{color: '#271F29', fontWeight: '900'}} className='m-0 p-0'>₦{Number(initem.total_amount).toLocaleString()}</p>
                                            </div>
                                      </div>

                                    </div>
                                    <hr />
                                    <div className="row">
                                        <div className="col-sm-12 col-md-12 col-lg-6">
                                            <div className='d-flex'>
                                                <p className='mr-3'>Invoice Number: </p>
                                                <p style={{color: '#271F29', fontWeight: '900'}} className='m-0 p-0'>{initem.invoice_number}</p>
                                                </div>
                                                <div className='d-flex'>
                                                <p className='mr-3'>Created By: </p>
                                                <p style={{color: '#271F29', fontWeight: '900'}} className='m-0 p-0'>{initem.created_by}</p>
                                                </div>
                                                <div className='d-flex'>
                                                <p className='mr-3'>Discount Name: </p>
                                                <p style={{color: '#271F29', fontWeight: '900'}} className='m-0 p-0'>{initem.discount_name || "none"}</p>
                                            </div>
                                        </div>
                                        <div className="col-sm-12 col-md-12 offset-lg-1 col-lg-5">
                                            <div className='d-flex'>
                                                <p className='mr-3'>Customer Name: </p>
                                                <p style={{color: '#271F29', fontWeight: '900'}} className='m-0 p-0'>{initem.customer_info.name}</p>
                                                </div>
                                                <div className='d-flex'>
                                                <p className='mr-3'>Customer Email: </p>
                                                <p className='m-0 p-0' style={{color: '#271F29', fontWeight: '900'}}>{initem.customer_info.email}</p>
                                                </div>
                                                <div className='d-flex'>
                                                <p className='mr-3'>Customer Phone Number: </p>
                                                <p style={{color: '#271F29', fontWeight: '900'}} className='m-0 p-0'>{(initem.customer_info.phone_number)}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <hr />
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
                                        {initem.products_ordered.map((product, index) => (
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
                            </>
                            ): ('')}
                        </div>
                    </div>
                </div>
            </>
        ) : ('')}

        {statusInv ? (
            <>

              <div className="modal-overlay">
                <div className="modal-content2">
                    <div className="head-mode">
                       <h6 style={{color: '#7A0091'}}>Update Invoice Payment Pin</h6>
                       <button className="modal-close" onClick={hideModal}>&times;</button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handlePinChange}>
                            <div className="form-group mb-4">
                                <label htmlFor="exampleInputEmail1">Invoice Pin <span style={{color: '#7A0091'}}>*</span></label>
                                <input type="text" placeholder='Enter Pin' value={dvalue} onChange={(e) => setDvalue(e.target.value)}/>
                            </div>
                            <button className='in-btn'>
                                {loading ? (
                                        <>
                                        <div className="spinner-border spinner-border-sm text-light" role="status">
                                            <span className="sr-only"></span>
                                        </div>
                                        <span>Validating Pin... </span>
                                        </>
                                    ) : (
                                        'Validate Pin'
                                )}
                            </button>
                        </form>
                    </div>
                </div>
              </div>
            </>
        ) : ('')}

        {second ? (
            <>
              <div className="modal-overlay">
                <div className="modal-content2" style={{width: '35%'}}>
                    <div className="head-mode">
                      <h6 style={{color: '#7A0091'}}>Update Invoice Status</h6>
                      <button className="modal-close" onClick={hideModal}>&times;</button>
                    </div>
                    <div className="modal-body text-center d-flex justify-content-between">
                        <button className='in-btn w-50 mr-3' onClick={handlePaid}>Paid</button>
                        <button className='in-btn c-btn w-50' onClick={handleCancle}>Cancel</button>
                    </div>
                </div>
              </div>
            </>
        ) : ('')}
    </>
  )
}

export default Invoice

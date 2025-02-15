import React, {useState, useEffect, useRef} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCustomers, addCustomers } from '../features/customerSlice';
import { getProduct, createInvoice } from '../features/invoiceSlice';
import { Plus, Minus, Search, Trash2 } from 'lucide-react';
import { Def } from '../assets/images';
import Swal from 'sweetalert2';

const CreateInvoice = () => {
    function generateUniqueId() {
        const prefix = "HP";
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let result = prefix;
      
        for (let i = 0; i < 7; i++) {
          const randomIndex = Math.floor(Math.random() * characters.length);
          result += characters[randomIndex];
        }
      
        return result;
    }
     
    const uniqueIdRef = useRef(generateUniqueId());
    console.log(uniqueIdRef.current)

  const [cmodal, setCmodal] = useState(false)  
  const {customers, error, loading } = useSelector((item) => item.customer);
  const {products} = useSelector((item) => item.invoice);
  const [items, setItems] = useState([]);
  const [searchTerms, setSearchTerms] = useState({});
  const [spro, setSpro] = useState(true)

  const [invoiceNumber, setInvoiceNumber] = useState(uniqueIdRef.current);
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [customerId, setCustomerId] = useState('');

  const dispatch = useDispatch();
  let token = localStorage.getItem("token");
  const getId = localStorage.getItem("sid");

  const [cData, setCdata] = useState({
    customer_name: '',
    customer_phone_number: '',
    customer_email: ''
  })
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCdata({
      ...cData,
      [name]: value,
    });
  }

  useEffect(() => {
    if (token) {
      dispatch(getCustomers({token}))
      dispatch(getProduct({token, shop_id: getId, page: 'All'}))
    }
  }, [dispatch, token])

  const hideModal = () => {
    setCmodal(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const customerData = {
      ...cData,
    };

    if (!customerData.customer_name || !customerData.customer_email || !customerData.customer_phone_number) {
      Swal.fire({
        icon: "info",
        title: "creating customer",
        text: 'All these fields are required!',
        confirmButtonColor: '#7A0091'
      })
      return;
    }
    Swal.fire({
      icon: "success",
      title: "Valid Input!",
      text: "customer is being created...",
      timer: 1500,
      showConfirmButton: false,
    });

    try {
      Swal.fire({
        title: "Creating Customer...",
        text: "Please wait while we process your request.",
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const response = await dispatch(addCustomers({token, cData: customerData})).unwrap();

      if (response.message === "Customer info  added") {
        Swal.fire({
          icon: "success",
          title: "creating Customer",
          text: `${response.message}`,
        });

        setCdata({
          customer_email: '',
          customer_phone_number: '',
          customer_name: ''
        });
        hideModal();
        dispatch(getCustomers({token}));

      }
      else {
        Swal.fire({
          icon: "info",
          title: "creating customer",
          text: `${response.message}`,
        });
      }
    } catch (error) {
      console.error("Customer creation failed:", error);

      Swal.fire({
        icon: "error",
        title: "Error Occurred",
        text: error.message || "Something went wrong while creating the customer. Please try again.",
      });
    }
  }

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
    } else {
      const priceString = product.total_selling_price;
      if (priceString.includes('=')) {
        return priceString.split('=').pop().trim().replace('₦', '').replace(',', '');
      } else {
        return priceString.replace('₦', '').replace(',', '');
      }
    }
  };

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
      }
    }

    if (field === 'quantity') {
      newItems[index].amount = (
        parseInt(newItems[index].sellingPrice || 0) * parseInt(value || 0)
      ).toString();
    }

    setItems(newItems);
  };

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

// Handle discount change
const handleDiscountChange = (e) => {
    const value = e.target.value;
    setDiscount(value ? parseFloat(value) : 0);
};

// Calculate final total after discount
const calculateTotal = () => {
    const subTotal = calculateSubTotal();
    const discountAmount = (subTotal * discount) / 100;
    return subTotal - discountAmount;
};
  

  return (
    <>

        <div className="mt-lg-5 mt-3 in-bg py-5">
            <form>
                <div className="row">
                    <div className="col-sm-12 col-md-12 col-lg-6">
                        <div className="form-group mb-4">
                            <label htmlFor="exampleInputEmail1">Invoice Number <span style={{color: '#7A0091'}}>*</span></label>
                            <input type="text" placeholder='Enter Invoice Number' value={invoiceNumber} readOnly/>
                        </div>
                    </div>
                    <div className="col-sm-12 col-md-12 col-lg-6">
                        <div className="form-group mb-4">
                            <label htmlFor="exampleInputEmail1">Payment Method <span style={{color: '#7A0091'}}>*</span></label>
                            <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                                <option>--select payment type--</option>
                                <option value="cash">Cash</option>
                                <option value="transfer">Transfer</option>
                            </select>
                        </div>
                    </div>
                    <div className="col-sm-12 col-md-12 col-lg-6">
                        <div className="form-group mb-4">
                            <label htmlFor="exampleInputEmail1">Select Customer <span style={{color: '#7A0091'}}>*</span></label>
                            <select value={customerId} onChange={(e) => setCustomerId(e.target.value)}>
                                <option>--select customer--</option>
                                {customers.map((item) =>
                                  <option key={item.id} value={item.id}>{item.name}</option> 
                                )}
                            </select>
                        </div>
                    </div>
                    <div className="col-sm-12 col-md-12 col-lg-3 ">
                        <button className='btn add-btn' onClick={(e) => {e.preventDefault();
                            setCmodal(true)
                            }}>+ Add New</button>
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
                        {spro ? (
                            <>
                                <div className="p-sec text-center">
                                    <img src={Def} alt="" />
                                    <p>You have no product selected for invoice<br></br> creation</p>
                                </div>
                            </>
                        ) : (
                        <>
                          {items.map((item, index) => {
                            const filteredProducts = getFilteredProducts(searchTerms[index]);
                            
                            return (
                            <div key={index} className="card-in mb-4 py-3">
                                <div className="row">
                                    <div className="col-sm-12 col-md-12 col-lg-4">
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

                                    <div className="col-md-2">
                                        <label className="form-label">Selling Price</label>
                                        <input
                                            type="number"
                                            value={item.sellingPrice}
                                            readOnly
                                        />
                                    </div>

                                    <div className="col-md-2">
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
                                        <div className="col-md-2">
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
                        </>
                        )}
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
                    <div className="col-sm-12 col-md-12 offset-lg-2 col-lg-4">
                        <div className="total-section text-right">
                            <div className='d-flex justify-content-between'>
                                <p>Sub Total:</p>
                                <p><b>₦{calculateSubTotal().toLocaleString()}</b></p>
                            </div>
                            <div className='d-flex justify-content-between'>
                                <p>Add Discount (%):</p>
                                <div className="form-group mb-4">
                                    <input 
                                        type="number" 
                                        placeholder='Enter Discount' 
                                        value={discount}
                                        onChange={handleDiscountChange}
                                        min="0"
                                        max="100"
                                        className="form-control"
                                    />
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
                    <button className='in-btn'>
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

        {cmodal ? (
            <>
                <div className="modal-overlay">
                    <div className="modal-content2">
                    <div className="head-mode">
                        <h6 style={{color: '#7A0091'}}>Add Customer Info</h6>
                        <button className="modal-close" onClick={hideModal}>&times;</button>
                    </div>
                    <div className="modal-body">
                        <form className='mt-5' onSubmit={handleSubmit}>
                        <div className="form-group mb-3">
                            <label htmlFor="exampleInputEmail1" className='mb-2'>Customer Name <span style={{color: '#ED4343'}}>*</span></label>
                            <input type="text" className=" lo-input" name='customer_name' value={cData.customer_name} onChange={handleChange}/>
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="exampleInputEmail1" className='mb-2'>Email <span style={{color: '#ED4343'}}>*</span></label>
                            <input type="email" className="lo-input" name='customer_email' value={cData.customer_email} onChange={handleChange}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="exampleInputPassword1" className='mb-2'>Phone Number <span style={{color: '#ED4343'}}>*</span></label>
                            <input type="text" className="lo-input" name='customer_phone_number' value={cData.customer_phone_number} onChange={handleChange}/>
                        </div>
                        <div className="text-right">
                            <button className='d-btn mr-2' onClick={hideModal}>Discard</button>
                            <button type="submit" className='in-btn'>
                            {loading ? (
                                <>
                                <div className="spinner-border spinner-border-sm text-light" role="status">
                                    <span className="sr-only"></span>
                                </div>
                                <span>Adding Info... </span>
                                </>
                            ) : (
                                'Add Info'
                            )}
                            </button>
                        </div>
                        </form>
                    </div>
                    </div>
                </div>
            </>
        ) : ('')}
      
    </>
  )
}

export default CreateInvoice
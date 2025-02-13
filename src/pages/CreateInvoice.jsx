import React, {useState, useEffect, useRef} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCustomers, addCustomers } from '../features/customerSlice';
import { getProduct } from '../features/invoiceSlice';
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

  const [invoiceNumber, setInvoiceNumber] = useState(uniqueIdRef.current)

  const dispatch = useDispatch();
  let token = localStorage.getItem("token");

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

  

  return (
    <>

        <div className="mt-lg-5 mt-3">
            <form onSubmit={handleSubmit}>
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
                            <select>
                                <option>--select payment type--</option>
                                <option value="cash">Cash</option>
                                <option value="transfer">Transfer</option>
                            </select>
                        </div>
                    </div>
                    <div className="col-sm-12 col-md-12 col-lg-6">
                        <div className="form-group mb-4">
                            <label htmlFor="exampleInputEmail1">Select Customer <span style={{color: '#7A0091'}}>*</span></label>
                            <select>
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

                <div className="text-right">
                    <button className='d-btn mr-2'>Discard</button>
                    <button className='in-btn'>
                        {/* {loading ? (
                                <>
                                <div className="spinner-border spinner-border-sm text-light" role="status">
                                    <span className="sr-only"></span>
                                </div>
                                <span>Creating Invoice... </span>
                                </>
                            ) : (
                                'Save and Continue'
                        )} */}
                        Save and Continue
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
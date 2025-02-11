import React, {useState, useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getCustomers, addCustomers, searchCustomer } from '../features/customerSlice';
import { Fil} from '../assets/images';
import Swal from 'sweetalert2';


const Customer = () => {
  const {loading, success, error, customers, custom} = useSelector((item) => item.customer);
  const [modalVisible, setModalVisible] = useState(false);

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

  const dispatch = useDispatch();
  let token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      dispatch(getCustomers({token}))
    }
  }, [dispatch, token])

  const hideModal = () => {
    setModalVisible(false)
  }

  const addCustomer = () => {
    setModalVisible(true)
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
      <div className="mt-5 mb-5 mt-lg-5 text-right">
        <button className='pro-btn' onClick={addCustomer}><span style={{fontSize: '20px'}}>+</span> Add Customer Info</button>
      </div>

      {loading ? (
         <div>Loading...</div>
      ) : error ? (
        <div>Error: {error?.message || 'Something went erong'}</div>
      ) : (
        <>
          <div className="lp px-0 py-0 px-lg-5 py-lg-1">
            <div className="search-container text-right mt-3">
              <input type="text" placeholder="Search Supplier..." className="search-input mb-3" style={{borderRadius: '5px',}}/>
              <span className="search-icon" style={{position: "absolute",
                right: "10px",
                top: "8px",
                fontSize: "20px",
                color: "#222",
                cursor: "pointer"}}>&#128269;</span>
            </div>
            <div className="table-content">
              <div className="table-container">
                <table className="my-table w-100">
                  <thead>
                      <tr>
                          <th style={{width: '25%'}}><div className='d-flex justify-content-between'><p>S/N</p><div><img src={Fil} alt="" /></div></div></th>
                          <th style={{width: '25%'}}><div className='d-flex justify-content-between'><p>Customer Name</p><div><img src={Fil} alt="" /></div></div></th>
                          <th style={{width: '25%'}}><div className='d-flex justify-content-between'><p>Customer Email</p><div><img src={Fil} alt="" /></div></div></th>
                          <th style={{width: '25%'}}><div className='d-flex justify-content-between'><p>Customer Phone Number</p><div><img src={Fil} alt="" /></div></div></th>
                      </tr>
                  </thead>
                  <tbody>
                      {
                        customers && customers.length > 0 ? (
                          customers.map((item, index) => (
                            <tr key={item.id} onClick={() => supDetails(item.id)} style={{cursor: 'pointer'}}>
                              <td>{index + 1}</td>
                              <td>{item.name}</td>
                              <td>{item.email}</td>
                              <td>{item.phone_number}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="7">No Customer available</td>
                          </tr>
                        )
                      }
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}

      {modalVisible ? (
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

export default Customer

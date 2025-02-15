import React, {useState, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDiscount, createDiscount, updateDiscount } from '../features/invoiceSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { Fil } from '../assets/images';
import Swal from 'sweetalert2';



const Discount = () => {
  const {error, loading, discountItem} = useSelector((state) => state.invoice);
  const dispatch = useDispatch();
  let token = localStorage.getItem("token");

  const [upmodal, setUpmodal] = useState(false)

  const [disModal, setDisModal] = useState(false);
  const [disName, setDisName] = useState('');
  const [disValue, setDisValue] = useState('');
  const [disDate, setDisDate] = useState('');
  const [disStatus, setDisStatus] = useState('');

  const [updisName, setUpDisName] = useState('');
  const [updisValue, setUpDisValue] = useState('');
  const [updisDate, setUpDisDate] = useState('');
  const [updisStatus, setUpDisStatus] = useState('');

  useEffect(() => {
    if (token) {
        dispatch(getDiscount({token}))
    }
  }, [dispatch, token])

  const hideModal = () => {
    setDisModal(false);
    setUpmodal(false);
  }


  const getUpModal = (id) => {
    localStorage.setItem("did", id)
    setUpmodal(true);

    const getDiscountItem = localStorage.getItem("dis");
    const getDis = JSON.parse(getDiscountItem);
    const selectedDiscount = getDis.find((item) => item.id === id);

    if (selectedDiscount) {
        setUpDisName(selectedDiscount.discount_name || '');
        setUpDisValue(selectedDiscount.discount_value * 100 || '');
        setUpDisDate(selectedDiscount.expiration_date || '');
        setUpDisStatus(selectedDiscount.status || '')
    }
  }
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (disName === "" || disValue === "" || disDate === "" || disStatus === "") {
        return Swal.fire({
            icon: "warning",
            title: "All fields are required",
            text: "You need to log in before adding a supplier.",
        });
    }

    const dItem = disValue / 100;

    Swal.fire({
        icon: "success",
        title: "Valid Input!",
        text: "Discount is being created...",
        timer: 1500,
        showConfirmButton: false,
    });

    try {
        Swal.fire({
            title: "Creating Discount...",
            text: "Please wait while we process your request.",
            allowOutsideClick: false,
            showConfirmButton: false,
            didOpen: () => {
              Swal.showLoading();
            },
        });

        const data = JSON.stringify({
            discount_name: disName,
            discount_value: dItem,
            expiration_date: disDate,
            status: disStatus
        })

        const response = await dispatch(createDiscount({token, discountData: data})).unwrap();

        if (response.message === "Discount created") {
            Swal.fire({
                icon: "success",
                title: "creating discount",
                text: `${response.message}`,
            });

            setDisName('');
            setDisValue('');
            setDisDate('');
            setDisStatus('');

            hideModal();
            dispatch(getDiscount({token}))
        }
        else {
            Swal.fire({
              icon: "info",
              title: "creating discount",
              text: `${response.message}`,
            });
        }

    } catch (error) {
       console.error("Discount creation failed:", error);
       Swal.fire({
        icon: "error",
        title: "Error Occurred",
        text: error.message || "Something went wrong while creating discount. Please try again.",
      });
    }
  }
  
  const handleSubmitUpdate = async (e) => {
    const getId = localStorage.getItem("did")
    e.preventDefault();
    if (updisName === "" || updisValue === "" || updisDate === "" || updisStatus === "") {
        return Swal.fire({
            icon: "warning",
            title: "All fields are required",
            text: "You need to log in before adding a supplier.",
        });
    }

    const dItem = updisValue / 100;

    Swal.fire({
        icon: "success",
        title: "Valid Input!",
        text: "Discount is being updated...",
        timer: 1500,
        showConfirmButton: false,
    });

    try {
        Swal.fire({
            title: "Updating Discount...",
            text: "Please wait while we process your request.",
            allowOutsideClick: false,
            showConfirmButton: false,
            didOpen: () => {
              Swal.showLoading();
            },
        });

        const data = JSON.stringify({
            discount_id: getId,
            discount_name: updisName,
            discount_value: dItem,
            expiration_date: updisDate,
            status: updisStatus
        })

        const response = await dispatch(updateDiscount({token, updateData: data})).unwrap();

        if (response.message === "discount updated") {
            Swal.fire({
                icon: "success",
                title: "updating discount",
                text: `${response.message}`,
            });

            setUpDisName('');
            setUpDisValue('');
            setUpDisDate('');
            setUpDisStatus('');

            hideModal();
            dispatch(getDiscount({token}))
        }

        else {
            Swal.fire({
              icon: "info",
              title: "updating discount",
              text: `${response.message}`,
            });
        }
    } catch (error) {
       console.error("Discount update failed:", error);
       Swal.fire({
        icon: "error",
        title: "Error Occurred",
        text: error.message || "Something went wrong while updating discount. Please try again.",
      });
    }

  }
  return (
    <>
      <div className='text-right mt-5 mt-lg-4'>
          <button className='in-btn' onClick={() => setDisModal(true)}>+ Create Discount</button>
      </div>

      <div className="table-content mt-5">
            <div className="table-container">
                <table className="my-table">
                <thead>
                    <tr>
                        <th><div className='d-flex justify-content-between'><p>S/N</p><div><img src={Fil} alt="" /></div></div></th>
                        <th><div className='d-flex justify-content-between'><p>Discount Name</p><div><img src={Fil} alt="" /></div></div></th>
                        <th><div className='d-flex justify-content-between'><p>Discount Value</p><div><img src={Fil} alt="" /></div></div></th>
                        <th><div className='d-flex justify-content-between'><p>Expiration Date</p><div><img src={Fil} alt="" /></div></div></th>
                        <th><div className='d-flex justify-content-between'><p>Status</p><div><img src={Fil} alt="" /></div></div></th>
                        <th><div className='d-flex justify-content-between'><p>Actions</p><div><img src={Fil} alt="" /></div></div></th>
                    </tr>
                </thead>
                <tbody>
                    {discountItem && discountItem.length > 0 ? (
                        discountItem.map((discount, index) => (
                        <tr key={discount.id} onClick={() => userDetails(user.id)} style={{cursor: 'pointer'}}>
                            <td>{index + 1}</td>
                            <td>{discount.discount_name}</td>
                            <td>{discount.discount_value}</td>
                            <td>{discount.expiration_date}</td>
                            <td><button className={discount.status}>{discount.status}</button></td>
                            <td>
                            <div className="d-flex gap-5">
                                <FontAwesomeIcon icon={faEdit} style={{color: '#7A0091', fontSize: '16px', marginRight: '20px'}} onClick={(e) => { getUpModal(discount.id); e.stopPropagation();}} title='update discount'/>
                            </div>
                            </td>
                        </tr>
                        ))
                    ) : (
                        <tr>
                        <td colSpan="7">No user available</td>
                        </tr>
                    )}
                </tbody>
                </table>
            </div>
      </div>

      {disModal ? (
        <>
          <div className="modal-overlay">
            <div className="modal-content2">
              <div className="head-mode">
                  <h6 style={{color: '#7A0091'}}>Add Discount</h6>
                  <button className="modal-close" onClick={hideModal}>
                  &times;
                  </button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-sm-12 col-md-12 col-lg-6">
                        <div className="form-group mb-4">
                          <label htmlFor="exampleInputEmail1">Discount Name <span style={{color: '#7A0091'}}>*</span></label>
                          <input type="text" placeholder='Enter Name' value={disName} onChange={(e) => setDisName(e.target.value)}/>
                        </div>
                    </div>
                    <div className="col-sm-12 col-md-12 col-lg-6">
                        <div className="form-group mb-4">
                          <label htmlFor="exampleInputEmail1">Discount value<span style={{color: '#7A0091'}}>*</span></label>
                          <input type="text" placeholder='Enter value' value={disValue} onChange={(e) => setDisValue(e.target.value)}/>
                        </div>
                    </div>
                    
                    <div className="col-sm-12 col-md-12 col-lg-6">
                        <div className="form-group mb-4">
                          <label htmlFor="exampleInputEmail1">Expiration Date <span style={{color: '#7A0091'}}>*</span></label>
                          <input type="date" placeholder='Enter Phone number' value={disDate} onChange={(e) => setDisDate(e.target.value)}/>
                        </div>
                    </div>
                    <div className="col-sm-12 col-md-12 col-lg-6">
                        <div className="form-group mb-4">
                          <label htmlFor="exampleInputEmail1">Status <span style={{color: '#7A0091'}}>*</span></label>
                          <select value={disStatus} onChange={(e) => setDisStatus(e.target.value)}>
                            <option>--select status--</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                          </select>
                        </div>
                    </div>
                    
                  </div> 
                  <div className="text-right">
                    <button className='d-btn mr-2' onClick={hideModal}>Discard</button>
                    <button className='in-btn'>
                      {
                          loading ?(
                              <>
                              <div className="spinner-border spinner-border-sm text-light" role="status">
                                  <span className="sr-only"></span>
                              </div>
                              <span>Creating Discount... </span>
                              </>
                              
                          ): (
                              'Create Discount'
                          )
                      }
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      ) : ('')}

      {upmodal ? (
        <>
          <div className="modal-overlay">
            <div className="modal-content2">
              <div className="head-mode">
                  <h6 style={{color: '#7A0091'}}>Update Discount</h6>
                  <button className="modal-close" onClick={hideModal}>
                  &times;
                  </button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmitUpdate}>
                  <div className="row">
                    <div className="col-sm-12 col-md-12 col-lg-6">
                        <div className="form-group mb-4">
                          <label htmlFor="exampleInputEmail1">Discount Name <span style={{color: '#7A0091'}}>*</span></label>
                          <input type="text" placeholder='Enter Name' value={updisName} onChange={(e) => setUpDisName(e.target.value)}/>
                        </div>
                    </div>
                    <div className="col-sm-12 col-md-12 col-lg-6">
                        <div className="form-group mb-4">
                          <label htmlFor="exampleInputEmail1">Discount value<span style={{color: '#7A0091'}}>*</span></label>
                          <input type="text" placeholder='Enter value' value={updisValue} onChange={(e) => setUpDisValue(e.target.value)}/>
                        </div>
                    </div>
                    
                    <div className="col-sm-12 col-md-12 col-lg-6">
                        <div className="form-group mb-4">
                          <label htmlFor="exampleInputEmail1">Expiration Date <span style={{color: '#7A0091'}}>*</span></label>
                          <input type="date" placeholder='Enter Phone number' value={updisDate} onChange={(e) => setUpDisDate(e.target.value)}/>
                        </div>
                    </div>
                    <div className="col-sm-12 col-md-12 col-lg-6">
                        <div className="form-group mb-4">
                          <label htmlFor="exampleInputEmail1">Status <span style={{color: '#7A0091'}}>*</span></label>
                          <select value={updisStatus} onChange={(e) => setUpDisStatus(e.target.value)}>
                            <option>--select status--</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                          </select>
                        </div>
                    </div>
                    
                  </div> 
                  <div className="text-right">
                    <button className='d-btn mr-2' onClick={hideModal}>Discard</button>
                    <button className='in-btn'>
                      {
                          loading ?(
                              <>
                              <div className="spinner-border spinner-border-sm text-light" role="status">
                                  <span className="sr-only"></span>
                              </div>
                              <span>Updating Discount... </span>
                              </>
                              
                          ): (
                              'Update Discount'
                          )
                      }
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

export default Discount
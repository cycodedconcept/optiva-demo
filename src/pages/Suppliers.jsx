import React, {useState, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllSuppliers, getCountries, createSupplier, resetSupplierState, updateSupplier, deleteSupplier } from '../features/supplierSlice';
import { getShop } from '../features/userSlice';
import ShopSelector from './support/ShopSelector';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { Fil, F1, F2 } from '../assets/images';


const Suppliers = () => {
  const dispatch = useDispatch();
  let token = localStorage.getItem("token");
  const getId = localStorage.getItem("sid");
  const [suMode, setSuMode] = useState(false);
  const [mode, setMode] = useState(false);
  const [selectUser, setSelectUser] = useState(null);
  const [details, setDetails] = useState(false);
  const [formData, setFormData] = useState({
    supplier_name: '',
    supplier_email: '',
    supplier_phonenumber: '',
    country: '',
    state: '',
    shop_id: [],
    st: [] 
  });

  const [upData, setUpData] = useState({
    supplier_name: '',
    supplier_email: '',
    supplier_phonenumber: '',
    country: '',
    state: '',
    shop_id: [],
    st: [] 
  });

  const { loading, error, success, supplier, countryData } = useSelector((state) => state.supplier);
  const { shops } = useSelector((state) => state.user);

  useEffect(() => {
    if (token) {
      dispatch(getAllSuppliers({token, id: getId}))
      dispatch(getShop({token}));
    }
  },[token, dispatch])

  const hideModal = () => {
    setSuMode(false);
    setMode(false)
    setFormData({
      supplier_name: "",
      supplier_email: "",
      supplier_phonenumber: "",
      shop_id: [],
      country: "",
      state: "",
      st:[]
    });
    setUpData({
      supplier_name: "",
      supplier_email: "",
      supplier_phonenumber: "",
      shop_id: [],
      country: "",
      state: "",
      st: []
  });
  }

  const hideDetails = () => {
    setDetails(false)
  }

  const showSupplier = () => {
    setSuMode(true);
  }

  useEffect(() => {
    dispatch(getCountries());
  }, [dispatch]);
  

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    setFormData((prevData) => {
      let updatedData = { ...prevData, [name]: value };
  
      if (name === 'country') {
        const countries = JSON.parse(localStorage.getItem("fetchedData")) || [];
        const selectedCountry = countries.find(country => country.name === value);
  
        updatedData.st = selectedCountry ? selectedCountry.states || [] : [];
        updatedData.state = ''; 
      }
  
      return updatedData;
    });
  };

  // const handleChange2 = (e) => {
  //   const { name, value } = e.target;
  
  //   setUpData((prevData) => {
  //     let updatedSupData = { ...prevData, [name]: value };
  
  //     if (name === 'country') {
  //       const countries = JSON.parse(localStorage.getItem("fetchedData")) || [];
  //       const selectedCountry = countries.find(country => country.name === value);
  
  //       updatedSupData.st = selectedCountry ? selectedCountry.states || [] : [];
  //       updatedSupData.state = ''; 
  //     }
  
  //     return updatedSupData;
  //   });
  // };

  const handleChange2 = (e) => {
    const { name, value } = e.target;
  
    if (name === "country") {
      const countries = JSON.parse(localStorage.getItem("fetchedData")) || [];
      const selectedCountry = countries.find(country => country.name === value);
      const states = selectedCountry ? selectedCountry.states : [];
  
      setUpData(prevData => ({
        ...prevData,
        country: value,
        state: '',       // Reset state when changing country
        st: states,
      }));
    } else {
      setUpData(prevData => ({
        ...prevData,
        [name]: value,
      }));
    }
  };
  
  

  const handleShopSelectionChange = (selectedShops) => {
    setFormData((prevData) => ({
      ...prevData,
      shop_id: selectedShops,
    }));
    console.log("Selected Shops:", selectedShops);
  };

  const handleShopSelectionChange2 = (selectedShops) => {
    setUpData((prevData) => ({
      ...prevData,
      shop_id: selectedShops,
    }));
    console.log("Selected Shops:", selectedShops);
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!token) {
    return Swal.fire({
      icon: "warning",
      title: "Authentication Required",
      text: "You need to log in before adding a supplier.",
    });
  }

  // Validation checks
  if (!formData.supplier_name.trim()) {
    return Swal.fire({
      icon: "error",
      title: "Validation Error",
      text: "Supplier Name is required.",
    });
  }

  if (!formData.supplier_email.trim()) {
    return Swal.fire({
      icon: "error",
      title: "Validation Error",
      text: "Supplier Email is required.",
    });
  }

  if (!/\S+@\S+\.\S+/.test(formData.supplier_email)) {
    return Swal.fire({
      icon: "error",
      title: "Validation Error",
      text: "Please enter a valid email address.",
    });
  }

  if (!formData.supplier_phonenumber.trim()) {
    return Swal.fire({
      icon: "error",
      title: "Validation Error",
      text: "Supplier Phone Number is required.",
    });
  }

  if (!/^\d{10,15}$/.test(formData.supplier_phonenumber)) {
    return Swal.fire({
      icon: "error",
      title: "Validation Error",
      text: "Phone number must be between 10 to 15 digits.",
    });
  }

  if (!formData.country) {
    return Swal.fire({
      icon: "error",
      title: "Validation Error",
      text: "Please select a country.",
    });
  }

  if (!formData.state) {
    return Swal.fire({
      icon: "error",
      title: "Validation Error",
      text: "Please select a state.",
    });
  }

  if (!formData.shop_id.length === 0) {
    return Swal.fire({
      icon: "error",
      title: "Validation Error",
      text: "Please select at least one shop.",
    });
  }

  // Show success message before dispatching
  Swal.fire({
    icon: "success",
    title: "Valid Input!",
    text: "Supplier is being created...",
    timer: 1500,
    showConfirmButton: false,
  });

  try {
    // Show loading alert
    Swal.fire({
      title: "Creating Supplier...",
      text: "Please wait while we process your request.",
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const response = await dispatch(createSupplier({ token, ...formData })).unwrap();

    if (response.message === "Supplier created") {
      Swal.fire({
        icon: "success",
        title: "creating supplier",
        text: `${response.message}`,
      });

      setFormData({
        supplier_name: "",
        supplier_email: "",
        supplier_phonenumber: "",
        shop_id: [],
        country: "",
        state: ""
    });
    dispatch(resetSupplierState());

      hideModal()
      dispatch(getAllSuppliers({token, id: getId}))

    }
    else {
      Swal.fire({
        icon: "info",
        title: "creating supplier",
        text: `${response.message}`,
      });
    }

    

  } catch (error) {
    console.error("Supplier creation failed:", error);

    Swal.fire({
      icon: "error",
      title: "Error Occurred",
      text: error.message || "Something went wrong while creating the supplier. Please try again.",
    });
  }
};

const updateSubmit = async (e) => {
  e.preventDefault();
  const sId = localStorage.getItem("su_id");

  if (!token) {
    return Swal.fire({
      icon: "warning",
      title: "Authentication Required",
      text: "You need to log in before adding a supplier.",
    });
  }

  // Validation checks
  if (!upData.supplier_name.trim()) {
    return Swal.fire({
      icon: "error",
      title: "Validation Error",
      text: "Supplier Name is required.",
    });
  }

  if (!upData.supplier_email.trim()) {
    return Swal.fire({
      icon: "error",
      title: "Validation Error",
      text: "Supplier Email is required.",
    });
  }

  if (!/\S+@\S+\.\S+/.test(upData.supplier_email)) {
    return Swal.fire({
      icon: "error",
      title: "Validation Error",
      text: "Please enter a valid email address.",
    });
  }

  if (!upData.supplier_phonenumber.trim()) {
    return Swal.fire({
      icon: "error",
      title: "Validation Error",
      text: "Supplier Phone Number is required.",
    });
  }

  if (!/^\d{10,15}$/.test(upData.supplier_phonenumber)) {
    return Swal.fire({
      icon: "error",
      title: "Validation Error",
      text: "Phone number must be between 10 to 15 digits.",
    });
  }

  if (!upData.country) {
    return Swal.fire({
      icon: "error",
      title: "Validation Error",
      text: "Please select a country.",
    });
  }

  if (!upData.state) {
    return Swal.fire({
      icon: "error",
      title: "Validation Error",
      text: "Please select a state.",
    });
  }

  if (!upData.shop_id.length === 0) {
    return Swal.fire({
      icon: "error",
      title: "Validation Error",
      text: "Please select at least one shop.",
    });
  }

  // Show success message before dispatching
  Swal.fire({
    icon: "success",
    title: "Valid Input!",
    text: "Supplier is being updated...",
    timer: 1500,
    showConfirmButton: false,
  });

  try {
    Swal.fire({
      title: "Creating Supplier...",
      text: "Please wait while we process your request.",
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const response = await dispatch(updateSupplier({ token, supplier_id: sId, ...upData })).unwrap();

    if (response.message === "Supplier updated") {
      Swal.fire({
        icon: "success",
        title: "updating supplier",
        text: `${response.message}`,
      });

      setUpData({
        supplier_name: "",
        supplier_email: "",
        supplier_phonenumber: "",
        shop_id: [],
        country: "",
        state: ""
    });
    dispatch(resetSupplierState());

      hideModal()
      dispatch(getAllSuppliers({token, id: getId}))

    }
    else {
      Swal.fire({
        icon: "info",
        title: "updating supplier",
        text: `${response.message}`,
      });
    }

  } catch (error) {
    console.error("Supplier update failed:", error);

    Swal.fire({
      icon: "error",
      title: "Error Occurred",
      text: error.message || "Something went wrong while updating the supplier. Please try again.",
    });
  }
}

const getUpmode = (id) => {
  setMode(true);
  localStorage.setItem("su_id", id);

  const theSupplier = localStorage.getItem("allSuppliers");
  const suppliers = JSON.parse(theSupplier);
  const selectedSupplier = suppliers.find((item) => item.supplier_id === id);
  console.log(selectedSupplier)

  if (selectedSupplier) {
    const countries = JSON.parse(localStorage.getItem("fetchedData")) || [];
    const selectedCountry = countries.find(country => country.name === selectedSupplier.country);
    const states = selectedCountry ? selectedCountry.states : [];

    setUpData({
      supplier_name: selectedSupplier.supplier_name || '',
      supplier_email: selectedSupplier.supplier_email || '',
      supplier_phonenumber: selectedSupplier.supplier_phonenumber || '',
      country: selectedSupplier.country || '',
      state: selectedSupplier.state || '',
      shop_id: selectedSupplier.assigned_shops.map(shop => shop.shop_id) || [],
      st: states,
    });
  }
};




const supDetails = (id) => {
  const theSupplier = localStorage.getItem("allSuppliers");
  const supply = JSON.parse(theSupplier);

  const selectedUser = supply.find((item) => item.supplier_id === id);
  console.log(selectedUser)

  if (selectedUser) {
    setSelectUser(selectedUser);
    setDetails(true);
  }
}
  

const deleteMode = (id) => {
  Swal.fire({
    title: 'Are you sure?',
    text: 'You won’t be able to revert this!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#7A0091',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!',
  }).then((result) => {
    if (result.isConfirmed) {
      dispatch(
        deleteSupplier({
          supplier_id: id,
          shop_id: getId,
          token,
        })
      ).then((response) => {
        if (response.meta.requestStatus === 'fulfilled') {
          Swal.fire('Deleted!', 'Supplier deleted successfully!', 'success');
          dispatch(getAllSuppliers({token, id: getId}))
        } else {
          Swal.fire('Error!', 'Failed to delete supplier!', 'error');
        }
      });
    }
  });
}

  return (
    <>
      <div className="mt-5 mb-5 mt-lg-5 text-right">
        <button className='pro-btn' onClick={showSupplier}><span style={{fontSize: '20px'}}>+</span> Add Suppliers</button>
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
                <table className="my-table">
                  <thead>
                      <tr>
                          <th><div className='d-flex justify-content-between'><p>S/N</p><div><img src={Fil} alt="" /></div></div></th>
                          <th><div className='d-flex justify-content-between'><p>Supplier Name</p><div><img src={Fil} alt="" /></div></div></th>
                          <th><div className='d-flex justify-content-between'><p>Supplier Email</p><div><img src={Fil} alt="" /></div></div></th>
                          <th><div className='d-flex justify-content-between'><p>Supplier Phone Number</p><div><img src={Fil} alt="" /></div></div></th>
                          <th><div className='d-flex justify-content-between'><p>Country</p><div><img src={Fil} alt="" /></div></div></th>
                          <th><div className='d-flex justify-content-between'><p>State</p><div><img src={Fil} alt="" /></div></div></th>
                          <th><div className='d-flex justify-content-between' style={{width: '93px'}}><p>Created By</p><div><img src={Fil} alt="" /></div></div></th>
                          <th><div className='d-flex justify-content-between'><p>Actions</p><div><img src={Fil} alt="" /></div></div></th>
                      </tr>
                  </thead>
                  <tbody>
                      {
                        supplier && supplier.length > 0 ? (
                          supplier.map((item, index) => (
                            <tr key={item.supplier_id} onClick={() => supDetails(item.supplier_id)} style={{cursor: 'pointer'}}>
                              <td>{index + 1}</td>
                              <td>{item.supplier_name}</td>
                              <td>{item.supplier_email}</td>
                              <td>{item.supplier_phonenumber}</td>
                              <td>{item.country}</td>
                              <td>{item.state}</td>
                              <td>{item.created_by}</td>
                              <td>
                                <div className="d-flex gap-5">
                                  <FontAwesomeIcon icon={faEdit} style={{color: '#379042', fontSize: '16px', marginRight: '20px', backgroundColor: '#E6FEE8', padding: '5px'}} onClick={(e) => {getUpmode(item.supplier_id); e.stopPropagation()}} title='update supplier'/>
                                  <FontAwesomeIcon icon={faTrash} style={{color: '#DB6454', fontSize: '16px', backgroundColor: '#F4E3E3', padding: '5px'}} onClick={(e) => {deleteMode(item.supplier_id); e.stopPropagation()}} title='delete supplier'/>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="7">No supplier available</td>
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

      {suMode ? (
        <>
          <div className="modal-overlay">
            <div className="modal-content2">
              <div className="head-mode">
                <h6 style={{color: '#7A0091'}}>Create Supplier</h6>
                <button className="modal-close" onClick={hideModal}>&times;</button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-sm-12 col-md-12 col-lg-6">
                      <div className="form-group mb-4">
                        <label htmlFor="user_name">Supplier Name <span style={{color: '#7A0091'}}>*</span></label>
                        <input 
                          type="text" 
                          placeholder='Enter Name'
                          name='supplier_name'
                          value={formData.supplier_name}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="col-sm-12 col-md-12 col-lg-6">
                      <div className="form-group mb-4">
                        <label htmlFor="email">Supplier Email <span style={{color: '#7A0091'}}>*</span></label>
                        <input 
                          type="email" 
                          name="supplier_email"
                          placeholder='Enter Email'
                          value={formData.supplier_email}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="col-sm-12 col-md-12 col-lg-6">
                      <div className="form-group mb-4">
                        <label htmlFor="role">Supplier Phone Number <span style={{color: '#7A0091'}}>*</span></label>
                        <input 
                          type="text" 
                          name="supplier_phonenumber"
                          placeholder='Enter Email'
                          value={formData.supplier_phonenumber}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="col-sm-12 col-md-12 col-lg-6">
                      <div className="form-group mb-4">
                       <label htmlFor="shops">Shops <span style={{color: '#7A0091'}}>*</span></label>
                       <ShopSelector shops={shops} onShopSelectionChange={handleShopSelectionChange}/>
                      </div>
                    </div>
                    <div className="col-sm-12 col-md-12 col-lg-6">
                      <div className="form-group mb-4">
                        <label htmlFor="shops">Country <span style={{color: '#7A0091'}}>*</span></label>
                        <select name="country" value={formData.country} onChange={handleChange}>
                          <option>--choose country--</option>
                          {countryData.data.map((country, index) => 
                            <option key={index} value={country.name}>{country.name}</option>
                          )}
                        </select>
                      </div>
                    </div>
                    <div className="col-sm-12 col-md-12 col-lg-6">
                    <div className="form-group">
                      <label htmlFor="customer">State</label>
                      <select name="state" value={formData.state} onChange={handleChange}>
                        <option>--choose state--</option>
                        {formData.st.map((item, index) => {
                          const formattedName = item.name.replace(/state/i, '').trim();
                          return <option key={index} value={formattedName}>{formattedName}</option>;
                        })}
                      </select>
                    </div>
                  </div>
                  </div>
                  <div className="text-right">
                    <button className='d-btn mr-2' onClick={hideModal}>Discard</button>
                    <button type="submit" className='in-btn'>
                      {loading ? (
                        <>
                          <div className="spinner-border spinner-border-sm text-light" role="status">
                            <span className="sr-only"></span>
                          </div>
                          <span>Creating Supplier... </span>
                        </>
                      ) : (
                        'Add Supplier'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      ) : ('')}

      {mode ? (
        <>
          <div className="modal-overlay">
            <div className="modal-content2">
              <div className="head-mode">
                <h6 style={{color: '#7A0091'}}>Update Supplier</h6>
                <button className="modal-close" onClick={hideModal}>&times;</button>
              </div>
              <div className="modal-body">
                <form onSubmit={updateSubmit}>
                  <div className="row">
                    <div className="col-sm-12 col-md-12 col-lg-6">
                      <div className="form-group mb-4">
                        <label htmlFor="user_name">Supplier Name <span style={{color: '#7A0091'}}>*</span></label>
                        <input 
                          type="text" 
                          placeholder='Enter Name'
                          name='supplier_name'
                          value={upData.supplier_name}
                          onChange={handleChange2}
                        />
                      </div>
                    </div>
                    <div className="col-sm-12 col-md-12 col-lg-6">
                      <div className="form-group mb-4">
                        <label htmlFor="email">Supplier Email <span style={{color: '#7A0091'}}>*</span></label>
                        <input 
                          type="email" 
                          name="supplier_email"
                          placeholder='Enter Email'
                          value={upData.supplier_email}
                          onChange={handleChange2}
                        />
                      </div>
                    </div>
                    <div className="col-sm-12 col-md-12 col-lg-6">
                      <div className="form-group mb-4">
                        <label htmlFor="role">Supplier Phone Number <span style={{color: '#7A0091'}}>*</span></label>
                        <input 
                          type="text" 
                          name="supplier_phonenumber"
                          placeholder='Enter Email'
                          value={upData.supplier_phonenumber}
                          onChange={handleChange2}
                        />
                      </div>
                    </div>
                    <div className="col-sm-12 col-md-12 col-lg-6">
                      <div className="form-group mb-4">
                       <label htmlFor="shops">Shops <span style={{color: '#7A0091'}}>*</span></label>
                       <ShopSelector shops={shops} onShopSelectionChange={handleShopSelectionChange2} selectedShops={upData.shop_id}/>
                      </div>
                    </div>
                    <div className="col-sm-12 col-md-12 col-lg-6">
                      <div className="form-group mb-4">
                        <label htmlFor="shops">Country <span style={{color: '#7A0091'}}>*</span></label>
                        <select name="country" value={upData.country} onChange={handleChange2}>
                          <option>--choose country--</option>
                          {countryData.data.map((country, index) => 
                            <option key={index} value={country.name}>{country.name}</option>
                          )}
                        </select>
                      </div>
                    </div>
                    <div className="col-sm-12 col-md-12 col-lg-6">
                    <div className="form-group">
                      <label htmlFor="customer">State</label>
                      <select name="state" value={upData.state} onChange={handleChange2}>
                        <option>--choose state--</option>
                        {upData.st?.map((item, index) => {
                          const formattedName = item.name.replace(/state/i, '').trim();
                          return <option key={index} value={formattedName}>{formattedName}</option>;
                        })}
                      </select>
                    </div>
                  </div>
                  </div>
                  <div className="text-right">
                    <button className='d-btn mr-2' onClick={hideModal}>Discard</button>
                    <button type="submit" className='in-btn'>
                      {loading ? (
                        <>
                          <div className="spinner-border spinner-border-sm text-light" role="status">
                            <span className="sr-only"></span>
                          </div>
                          <span>Updating Supplier... </span>
                        </>
                      ) : (
                        'Update Supplier'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      ) : ('')}

      {details ? (
        <>
          <div className="modal-overlay">
            <div className="modal-content2">
              <div className="head-mode">
                <h6 style={{color: '#222'}}>Supplier Details</h6>
                <button className="modal-close" onClick={hideDetails}>
                &times;
                </button>
              </div>
              <div className="modal-body">
                <div className="d-img">
                  <img src={F1} alt="" className='w-100'/>

                  <div className="sub-img">
                    <img src={F2} alt="" />
                  </div>
                </div>
                <div className='mt-5'>
                  <h5 className='mb-3'>Supplier Information</h5>
                {selectUser && (
                    <div className="">
                      <div className='user-details'>
                        <p><strong>Name:</strong></p>
                        <p>{selectUser.supplier_name}</p>
                      </div>
                      <div className='user-details'>
                        <p><strong>Email:</strong></p>
                        <p>{selectUser.supplier_email}</p>
                      </div>
                      <div className='user-details'>
                        <p><strong>Phone:</strong></p>
                        <p>{selectUser.supplier_phonenumber}</p>
                      </div>
                      <div className='user-details'>
                        <p><strong>Country:</strong></p>
                        <p>{selectUser.country}</p>
                      </div>
                      <div className='user-details'>
                        <p><strong>State:</strong></p>
                        <p>{selectUser.state}</p>
                      </div>
                      <div className='user-details'>
                        <p><strong>Created By:</strong></p>
                        <p>{selectUser.created_by}</p>
                      </div>

                      <p><strong>Assigned Shop:</strong><span style={{marginLeft: '90px'}}>{selectUser.assigned_shops.map((item) => item.shop_name).join(", ")}</span></p>

                    </div>
                  )}
                </div>
                
              </div>
              <div className="modal-foot text-right">
                <button className='d-btn mr-2' onClick={hideDetails} style={{color: '#222'}}>Close</button>
              </div>
            </div>
          </div>
        </>
      ) : ('')}
    </>
  )
}

export default Suppliers
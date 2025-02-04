import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers, getUserRole, getShop, createUsers, deleteUser, updatePassword, updateUsers } from '../features/userSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faKey } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import Priviledge from './support/Priviledge';
import ShopSelector from './support/ShopSelector';
import { Fil, F1, F2 } from '../assets/images';

const Users = () => {
  const shop = localStorage.getItem('sid');
  const [details, setDetails] = useState(false);
  const [selectUser, setSelectUser] = useState(null); 
  const [userMode, setUserMode] = useState(false);
  const [cpassword, setcPassword] = useState('')
  const [upMode, setUpmode] = useState(false);
  const [passMode, setPassMode] = useState(false);
  const [userData, setUserData] = useState({
    email: '',
    phone_number: '',
    user_name: '',
    password: '',
    role_type_id: null,
    role_priviledge_ids: [],
    shop_id: [],
  });

  const [upUserData, setUpUserData] = useState({
    email: '',
    phone_number: '',
    user_name: '',
    password: '',
    role_type_id: null,
    role_priviledge_ids: [],
    shop_id: [], 
  })

  const handleShopSelectionChange = (selectedShops) => {
    setUserData((prevState) => ({
        ...prevState,
        shop_id: selectedShops,
    }));
    console.log("Selected Shops:", selectedShops);
};

  const dispatch = useDispatch();
  const { loading, error, success, allUsers, userRole, shops, message } = useSelector((state) => state.user);
  let token = localStorage.getItem("token");
  const getId = localStorage.getItem("sid");

  useEffect(() => { 
    if (token) {
      dispatch(getAllUsers({token, id: getId}));
      dispatch(getUserRole({token}));
      dispatch(getShop({token}));
    }
  }, [token, dispatch]);


  const hideModal = () => {
    setUserMode(false);
    setUpmode(false)
  }

  const hideDetails = () => {
    setDetails(false);
  }

  const hideModal2 = () => {
    setPassMode(false);
  }

  const showModal = () => {
    setUserMode(true)
  }

  const getUpmode = (id) => {
    setUpmode(true);
    localStorage.setItem("dtid", id)
    const theUsers = localStorage.getItem("allUsers");
    const user = JSON.parse(theUsers);

    const selectedUser = user.find((item) => item.id === id);
    
    if (selectedUser) {
      setUpUserData({
        email: selectedUser.email || '',
        phone_number: selectedUser.phone_number || '',
        user_name: selectedUser.user_name || '',
        password: '',
        role_type_id: selectedUser.role_type_id || null,
        role_priviledge_ids: selectedUser.role_priviledge_ids || [],
        shop_id: selectedUser.shop_id || [],
      });
    }
  }

  const userDetails = (id) => {
    localStorage.setItem("dtid", id)
    const theUsers = localStorage.getItem("allUsers");
    const user = JSON.parse(theUsers);

    const selectedUser = user.find((item) => item.id === id);
    console.log(selectedUser)

    if (selectedUser) {
      setSelectUser(selectedUser);
      setDetails(true);
    }
  }

  const upass = (id) => {
    setPassMode(true);
    localStorage.setItem("upid", id);
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
          deleteUser({
            user_id: id,
            shop_id: shop,
            token,
          })
        ).then((response) => {
          if (response.meta.requestStatus === 'fulfilled') {
            Swal.fire('Deleted!', 'User deleted successfully!', 'success');
            dispatch(getAllUsers({token, id: getId}));
          } else {
            Swal.fire('Error!', 'Failed to delete user!', 'error');
          }
        });
      }
    });
  }
 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const cpasschange = (e) => {
    setcPassword(e.target.value);
  }
  
 const changePassword = (e) => {
  e.preventDefault();
  const guid = localStorage.getItem("upid");

  if (!cpassword) {
    Swal.fire({
      title: 'Error',
      text: 'Password field is required!',
      icon: 'error',
      confirmButtonText: 'OK',
    });
    return;
  }

  Swal.fire({
    title: 'Are you sure?',
    text: 'You won’t be able to revert this!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#7A0091',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, update it!',
  }).then((result) => {
    if (result.isConfirmed) {
      dispatch(updatePassword({token, id: guid, password: cpassword}))
      .then((response) => {
        if (response.meta.requestStatus === 'fulfilled') {
          Swal.fire('Updated!', 'Password Updated successfully!', 'success');
          setPassMode(false);
          dispatch(getAllUsers({token, id: getId}));
        } else {
          Swal.fire('Error!', 'Failed to update password!', 'error');
        }
      });
    }
  });
 };



  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validations = [
        {
            field: 'email',
            value: userData.email.trim(),
            isValid: (value) => {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(value);
            },
            message: 'Please enter a valid email address'
        },
        {
            field: 'phone_number',
            value: userData.phone_number.trim(),
            isValid: (value) => {
                const phoneRegex = /^\d{10,}$/;
                return phoneRegex.test(value);
            },
            message: 'Please enter a valid phone number'
        },
        {
            field: 'user_name',
            value: userData.user_name.trim(),
            isValid: (value) => value.length >= 3,
            message: 'Username must be at least 3 characters long'
        },
        {
            field: 'password',
            value: userData.password.trim(),
            isValid: (value) => value.length >= 6,
            message: 'Password must be at least 6 characters long'
        },
        {
            field: 'role_type_id',
            value: userData.role_type_id,
            isValid: (value) => value !== null,
            message: 'Please select a role type'
        },
        {
            field: 'role_priviledge_ids',
            value: userData.role_priviledge_ids,
            isValid: (value) => Array.isArray(value) && value.length > 0,
            message: 'Please select at least one role privilege'
        },
        {
            field: 'shop_id',
            value: userData.shop_id,
            isValid: (value) => Array.isArray(value) && value.length > 0,
            message: 'Please select at least one shop'
        }
    ];

    // Check all validations
    for (const validation of validations) {
        if (!validation.isValid(validation.value)) {
            Swal.fire({
                title: 'Validation Error',
                text: validation.message,
                icon: 'error'
            });
            return;
        }
    }

    try {
        const result = await dispatch(createUsers(userData)).unwrap();
        
        if (result) {
            Swal.fire({
                title: 'Success',
                text: 'User created successfully!',
                icon: 'success',
                confirmButtonText: 'OK',
            });

            // Reset form
            setUserData({
                email: '',
                phone_number: '',
                user_name: '',
                password: '',
                role_type_id: null,
                role_priviledge_ids: [],
                shop_id: [],
            });
            setUserMode(false);

            // Refresh user list
            const token = localStorage.getItem('token');
            dispatch(getAllUsers({ token, id: getId }));
        }
    } catch (err) {
        console.error('Full Error:', err);
        Swal.fire({
            title: 'Error',
            text: err.message || 'User creation failed',
            icon: 'error'
        });
    }
  };

  const handleUpdateUsers = async (e) => {
      e.preventDefault();

      const validations = [
        {
            field: 'email',
            value: upUserData.email.trim(),
            isValid: (value) => {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(value);
            },
            message: 'Please enter a valid email address'
        },
        {
            field: 'phone_number',
            value: upUserData.phone_number.trim(),
            isValid: (value) => {
                const phoneRegex = /^\d{10,}$/;
                return phoneRegex.test(value);
            },
            message: 'Please enter a valid phone number'
        },
        {
            field: 'user_name',
            value: upUserData.user_name.trim(),
            isValid: (value) => value.length >= 3,
            message: 'Username must be at least 3 characters long'
        },
        {
            field: 'password',
            value: upUserData.password.trim(),
            isValid: (value) => value.length >= 6,
            message: 'Password must be at least 6 characters long'
        },
        {
            field: 'role_type_id',
            value: upUserData.role_type_id,
            isValid: (value) => value !== null,
            message: 'Please select a role type'
        },
        {
            field: 'role_priviledge_ids',
            value: upUserData.role_priviledge_ids,
            isValid: (value) => Array.isArray(value) && value.length > 0,
            message: 'Please select at least one role privilege'
        },
        {
            field: 'shop_id',
            value: upUserData.shop_id,
            isValid: (value) => Array.isArray(value) && value.length > 0,
            message: 'Please select at least one shop'
        }
      ];

    for (const validation of validations) {
      if (!validation.isValid(validation.value)) {
          Swal.fire({
              title: 'Validation Error',
              text: validation.message,
              icon: 'error'
          });
          return;
      }
    }

    console.log('upUserData:', upUserData);


    try {
      const result = await dispatch(updateUsers(upUserData)).unwrap();
      
      if (result) {
          Swal.fire({
              title: 'Success',
              text: 'User updated successfully!',
              icon: 'success',
              confirmButtonText: 'OK',
          });

          // Reset form
          setUpUserData({
              email: '',
              phone_number: '',
              user_name: '',
              password: '',
              role_type_id: null,
              role_priviledge_ids: [],
              shop_id: [],
          });
          setUpmode(false);

          // Refresh user list
          const token = localStorage.getItem('token');
          dispatch(getAllUsers({ token, id: getId }));
      }
    } catch (err) {
        console.error('Full Error:', err);
        Swal.fire({
            title: 'Error',
            text: err.message || 'User update failed',
            icon: 'error'
        });
    }

  }

  return (
    <>
      <div className="mt-5 mb-5 mt-lg-5 text-right">
        <button className='pro-btn' onClick={showModal}><span style={{fontSize: '20px'}}>+</span> Add Users</button>
      </div>

      {loading ? (
         <div>Loading...</div>
      ) : error ? (
          <div>Error: {error?.message || 'Something went erong'}</div>
      ) : (
        <>
        <div className="lp px-0 py-0 px-lg-5 py-lg-1">
          <div className="search-container text-right mt-3">
            <input type="text" placeholder="Search Users..." className="search-input mb-3" style={{borderRadius: '5px',}}/>
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
                        <th><div className='d-flex justify-content-between'><p>User Name</p><div><img src={Fil} alt="" /></div></div></th>
                        <th><div className='d-flex justify-content-between'><p>Email</p><div><img src={Fil} alt="" /></div></div></th>
                        <th><div className='d-flex justify-content-between'><p>Phone Number</p><div><img src={Fil} alt="" /></div></div></th>
                        <th><div className='d-flex justify-content-between'><p>Role</p><div><img src={Fil} alt="" /></div></div></th>
                        <th><div className='d-flex justify-content-between'><p>Actions</p><div><img src={Fil} alt="" /></div></div></th>
                    </tr>
                </thead>
                <tbody>
                    {allUsers && allUsers.length > 0 ? (
                      allUsers.map((user, index) => (
                        <tr key={user.id} onClick={() => userDetails(user.id)} style={{cursor: 'pointer'}}>
                          <td>{index + 1}</td>
                          <td>{user.user_name}</td>
                          <td>{user.email}</td>
                          <td>{user.phone_number}</td>
                          <td><button style={{color: '#C84FB7', backgroundColor: '#FAEDFF', padding: '5px', border: 'none' }}>{user.role_type.role}</button></td>
                          <td>
                            <div className="d-flex gap-5">
                              <FontAwesomeIcon icon={faEdit} style={{color: '#379042', fontSize: '16px', marginRight: '20px', backgroundColor: '#E6FEE8', padding: '5px'}} onClick={(e) => {getUpmode(user.id); e.stopPropagation()}} title='update user'/>
                              <FontAwesomeIcon icon={faKey} style={{color: '#7A0091', fontSize: '16px', marginRight: '20px'}} onClick={(e) => {upass(user.id); e.stopPropagation();}} title='update user password'/>
                              <FontAwesomeIcon icon={faTrash} style={{color: '#DB6454', fontSize: '16px', backgroundColor: '#F4E3E3', padding: '5px'}} onClick={(e) => {deleteMode(user.id); e.stopPropagation();}} title='delete user'/>
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
        </div>
            
        </>
      )}

      {userMode ? (
        <>
          <div className="modal-overlay">
            <div className="modal-content2">
              <div className="head-mode">
                  <h6 style={{color: '#7A0091'}}>Add New User</h6>
                  <button className="modal-close" onClick={hideModal}>
                  &times;
                  </button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-sm-12 col-md-12 col-lg-6">
                        <div className="form-group mb-4">
                          <label htmlFor="exampleInputEmail1">Full Name <span style={{color: '#7A0091'}}>*</span></label>
                          <input type="text" placeholder='Enter Name' value={userData.user_name} name='user_name' onChange={handleChange}/>
                        </div>
                    </div>
                    <div className="col-sm-12 col-md-12 col-lg-6">
                        <div className="form-group mb-4">
                          <label htmlFor="exampleInputEmail1">Email <span style={{color: '#7A0091'}}>*</span></label>
                          <input type="email" placeholder='Enter Email' value={userData.email} name='email' onChange={handleChange}/>
                        </div>
                    </div>
                    <div className="col-sm-12 col-md-12 col-lg-6">
                        <div className="form-group mb-4">
                          <label htmlFor="exampleInputEmail1">Role <span style={{color: '#7A0091'}}>*</span></label>
                          <Priviledge data={userRole} onChange={({ role_type_id, role_priviledge_ids }) => {
                            setUserData(prev => ({
                              ...prev,
                              role_type_id,
                              role_priviledge_ids
                            }));
                          }}/>
                        </div>
                    </div>
                    <div className="col-sm-12 col-md-12 col-lg-6">
                        <div className="form-group mb-4">
                          <label htmlFor="exampleInputEmail1">Phone Number <span style={{color: '#7A0091'}}>*</span></label>
                          <input type="text" placeholder='Enter Phone number' value={userData.phone_number} name='phone_number' onChange={handleChange}/>
                        </div>
                    </div>
                    <div className="col-sm-12 col-md-12 col-lg-6">
                        <div className="form-group mb-4">
                          <label htmlFor="exampleInputEmail1">Password <span style={{color: '#7A0091'}}>*</span></label>
                          <input type="password" placeholder='Enter password' value={userData.password} name='password' onChange={handleChange}/>
                        </div>
                    </div>
                    <div className="col-sm-12 col-md-12 col-lg-6">
                        <div className="form-group mb-4">
                          <label htmlFor="exampleInputEmail1">Shops <span style={{color: '#7A0091'}}>*</span></label>
                          <ShopSelector shops={shops} onShopSelectionChange={handleShopSelectionChange}/>
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
                              <span>Creating User... </span>
                              </>
                              
                          ): (
                              'Create User'
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

      {upMode ? (
        <>
          <div className="modal-overlay">
            <div className="modal-content2">
              <div className="head-mode">
                <h6 style={{color: '#7A0091'}}>Update User</h6>
                <button className="modal-close" onClick={hideModal}>&times;</button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleUpdateUsers}>
                  <div className="row">
                    <div className="col-sm-12 col-md-12 col-lg-6">
                      <div className="form-group mb-4">
                        <label htmlFor="user_name">Full Name <span style={{color: '#7A0091'}}>*</span></label>
                        <input 
                          type="text" 
                          id="user_name"
                          placeholder='Enter Name' 
                          value={upUserData.user_name}
                          onChange={(e) => setUpUserData({
                            ...upUserData,
                            user_name: e.target.value
                          })}
                        />
                      </div>
                    </div>
                    <div className="col-sm-12 col-md-12 col-lg-6">
                      <div className="form-group mb-4">
                        <label htmlFor="email">Email <span style={{color: '#7A0091'}}>*</span></label>
                        <input 
                          type="email" 
                          id="email"
                          placeholder='Enter Email' 
                          value={upUserData.email}
                          onChange={(e) => setUpUserData({
                            ...upUserData,
                            email: e.target.value
                          })}
                        />
                      </div>
                    </div>
                    <div className="col-sm-12 col-md-12 col-lg-6">
                      <div className="form-group mb-4">
                        <label htmlFor="role">Role <span style={{color: '#7A0091'}}>*</span></label>
                        <Priviledge 
                            data={userRole} 
                            onChange={(values) => {
                                setUpUserData(prev => ({
                                    ...prev,
                                    role_type_id: values.role_type_id,
                                    role_priviledge_ids: values.role_priviledge_ids
                                }));
                            }}
                            initialRoleId={upUserData.role_type_id}
                            initialPrivileges={upUserData.role_priviledge_ids}
                        />
                      </div>
                    </div>
                    <div className="col-sm-12 col-md-12 col-lg-6">
                      <div className="form-group mb-4">
                        <label htmlFor="phone_number">Phone Number <span style={{color: '#7A0091'}}>*</span></label>
                        <input 
                          type="text" 
                          id="phone_number"
                          placeholder='Enter Phone number' 
                          value={upUserData.phone_number}
                          onChange={(e) => setUpUserData({
                            ...upUserData,
                            phone_number: e.target.value
                          })}
                        />
                      </div>
                    </div>
                    <div className="col-sm-12 col-md-12 col-lg-6">
                      <div className="form-group mb-4">
                        <label htmlFor="password">Password <span style={{color: '#7A0091'}}>*</span></label>
                        <input 
                          type="password" 
                          id="password"
                          placeholder='Enter password' 
                          value={upUserData.password}
                          onChange={(e) => setUpUserData({
                            ...upUserData,
                            password: e.target.value
                          })}
                        />
                      </div>
                    </div>
                    <div className="col-sm-12 col-md-12 col-lg-6">
                      <div className="form-group mb-4">
                        <label htmlFor="shops">Shops <span style={{color: '#7A0091'}}>*</span></label>
                        <ShopSelector 
                            shops={shops} 
                            onShopSelectionChange={(selectedShops) => {
                                setUpUserData(prev => ({
                                    ...prev,
                                    shop_id: selectedShops
                                }));
                            }}
                            initialSelectedShops={upUserData.shop_id}
                        />
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
                          <span>Updating User... </span>
                        </>
                      ) : (
                        'Update User'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      ) : ('')}
      

      {passMode ? (
        <>
          <div className="modal-overlay">
            <div className="modal-content2">
              <div className="head-mode">
                <h6 style={{color: '#7A0091'}}>Update User Password</h6>
                <button className="modal-close" onClick={hideModal2}>
                &times;
                </button>
              </div>
              <div className="modal-body">
                <form onSubmit={changePassword}>
                  <div className="form-group mb-4">
                    <label htmlFor="exampleInputEmail1">Password <span style={{color: '#7A0091'}}>*</span></label>
                    <input type="password" placeholder='Enter Password' value={cpassword} onChange={cpasschange}/>
                  </div>
                  <div className="text-right">
                    <button className='d-btn mr-2' onClick={hideModal2}>Discard</button>
                    <button className='in-btn'>
                      {
                        loading ?(
                            <>
                            <div className="spinner-border spinner-border-sm text-light" role="status">
                                <span className="sr-only"></span>
                            </div>
                            <span>Updating Password... </span>
                            </>
                            
                        ): (
                            'Update Password'
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

      {details ? (
        <>
          <div className="modal-overlay">
            <div className="modal-content2">
              <div className="head-mode">
                <h6 style={{color: '#222'}}>User Details</h6>
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
                  <h5 className='mb-3'>User Information</h5>
                {selectUser && (
                    <div className="">
                      <div className='user-details'>
                        <p><strong>Name:</strong></p>
                        <p>{selectUser.user_name}</p>
                      </div>
                      <div className='user-details'>
                        <p><strong>Email:</strong></p>
                        <p>{selectUser.email}</p>
                      </div>
                      <div className='user-details'>
                        <p><strong>Phone:</strong></p>
                        <p>{selectUser.phone_number}</p>
                      </div>
                      <div className='user-details'>
                        <p><strong>Role:</strong></p>
                        <p>{selectUser.role_type.role}</p>
                      </div>

                      <p><strong>Privileges:</strong> <span style={{marginLeft: '126px'}}>{selectUser.privileges.map((item) => item.privileges).join(", ")}</span></p>
                      <p><strong>Assigned Shop:</strong><span style={{marginLeft: '90px'}}>{selectUser.assigned_shop.map((item) => item.shop_name).join(", ")}</span></p>

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

export default Users
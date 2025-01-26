import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers, getUserRole, getShop, createUsers, deleteUser } from '../features/userSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import Priviledge from './support/Priviledge';
import ShopSelector from './support/ShopSelector';

const Users = () => {
  const [user, setUser] = useState("");
  const [shop, setShop] = useState(localStorage.getItem('sid') || '');
  const [userMode, setUserMode] = useState(false);
  const [upMode, setUpmode] = useState(false);
  const [delmode, setDelmode] = useState(false);
  const [userData, setUserData] = useState({
    email: '',
    phone_number: '',
    user_name: '',
    password: '',
    role_type_id: null,
    role_priviledge_ids: [],
    shop_id: [],
  });

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

  useEffect(() => {
    const userId = localStorage.getItem('uid');
    if (userId) {
        setUser(userId);
    }
}, []);


  const hideModal = () => {
    setUserMode(false);
    setUpmode(false)
  }

  const hideModal2 = () => {
    setDelmode(false)
  }

  const showModal = () => {
    setUserMode(true)
  }

  const getUpmode = () => {
    setUpmode(true)
  }

  const deleteMode = (id) => {
    localStorage.setItem("uid", id)
    setDelmode(true);
    setUser(id)
  }
 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const delUser = (e) => {
    e.preventDefault();
  
    if (!user || !shop) {
      Swal.fire({
        title: 'Error',
        text: 'User ID and Shop ID are required!',
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
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(
          deleteUser({
            user_id: user,
            shop_id: shop,
            token,
          })
        ).then((response) => {
          if (response.meta.requestStatus === 'fulfilled') {
            Swal.fire('Deleted!', 'User deleted successfully!', 'success');
            setDelmode(false);
            dispatch(getAllUsers({token, id: getId}));
          } else {
            Swal.fire('Error!', 'Failed to delete user!', 'error');
          }
        });
      }
    });
  };
  
 

  const handleSubmit = async (e) => {
    e.preventDefault();
    // const tok = localStorage.getItem("token");
    console.log(token)
    const { email, phone_number, user_name, password, role_type_id, role_priviledge_ids, shop_id } = userData;
  
    // Validation checks
    if (!email.trim()) {
      Swal.fire({ title: 'Error', text: 'Email is required', icon: 'error' });
      return;
    }
    if (!phone_number.trim()) {
      Swal.fire({ title: 'Error', text: 'Phone number is required', icon: 'error' });
      return;
    }
    if (!user_name.trim()) {
      Swal.fire({ title: 'Error', text: 'User name is required', icon: 'error' });
      return;
    }
    if (!password.trim()) {
      Swal.fire({ title: 'Error', text: 'Password is required', icon: 'error' });
      return;
    }
    if (!role_type_id) {
      Swal.fire({ title: 'Error', text: 'Role type is required', icon: 'error' });
      return;
    }
    if (!role_priviledge_ids || role_priviledge_ids.length === 0) {
      Swal.fire({ title: 'Error', text: 'Role privileges are required', icon: 'error' });
      return;
    }
    if (!shop_id || shop_id.length === 0) {
      Swal.fire({ title: 'Error', text: 'At least one shop must be selected', icon: 'error' });
      return;
    }

  
    try {
      await dispatch(createUsers({ ...userData, token })).unwrap();
  
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
        role_type_id: '',
        role_priviledge_ids: [],
        shop_id: [],
      });
      setUserMode(false);
  
      // Refresh user list
      dispatch(getAllUsers({ token, id: getId }));
    } catch (err) {
      console.error('Full Error:', err);
      Swal.fire({
        title: 'Error',
        text: err.response?.data?.message || err.message || 'User creation failed',
        icon: 'error',
      });
    }
  };
  

  return (
    <>
      <div className="mt-5 mt-lg-4 text-right">
        <button className='pro-btn' onClick={showModal}><span style={{fontSize: '20px'}}>+</span> Add Users</button>
      </div>

      {loading ? (
         <div>Loading...</div>
      ) : error ? (
          <div>Error: {error?.message || 'Something went erong'}</div>
      ) : (
        <>
          <div className="table-content">
            <div className="table-container mt-5">
              <table className="my-table">
                <thead>
                    <tr>
                        <th>User Name</th>
                        <th>Email</th>
                        <th>Phone Number</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {allUsers && allUsers.length > 0 ? (
                      allUsers.map((user) => (
                        <tr key={user.id}>
                          <td>{user.user_name}</td>
                          <td>{user.email}</td>
                          <td>{user.phone_number}</td>
                          <td>{user.role_type.role}</td>
                          <td>
                            <div className="d-flex justify-content-between">
                              <FontAwesomeIcon icon={faEdit} style={{color: '#7A0091'}} onClick={getUpmode}/>
                              <FontAwesomeIcon icon={faTrash} style={{color: '#7A0091'}} onClick={() => deleteMode(user.id)}/>
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
                    {/* <button className='d-btn mr-2'>Discard</button> */}
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
                <button className="modal-close" onClick={hideModal}>
                &times;
                </button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="row">
                    <div className="col-sm-12 col-md-12 col-lg-6">
                      <div className="form-group mb-4">
                        <label htmlFor="exampleInputEmail1">Full Name <span style={{color: '#7A0091'}}>*</span></label>
                        <input type="text" placeholder='Enter Name' />
                      </div>
                    </div>
                    <div className="col-sm-12 col-md-12 col-lg-6">
                        <div className="form-group mb-4">
                          <label htmlFor="exampleInputEmail1">Email <span style={{color: '#7A0091'}}>*</span></label>
                          <input type="email" placeholder='Enter Email'/>
                        </div>
                    </div>
                    <div className="col-sm-12 col-md-12 col-lg-6">
                        <div className="form-group mb-4">
                          <label htmlFor="exampleInputEmail1">Role <span style={{color: '#7A0091'}}>*</span></label>
                          <Priviledge data={userRole} />
                        </div>
                    </div>
                    <div className="col-sm-12 col-md-12 col-lg-6">
                        <div className="form-group mb-4">
                          <label htmlFor="exampleInputEmail1">Phone Number <span style={{color: '#7A0091'}}>*</span></label>
                          <input type="text" placeholder='Enter Phone number' />
                        </div>
                    </div>
                    <div className="col-sm-12 col-md-12 col-lg-6">
                        <div className="form-group mb-4">
                          <label htmlFor="exampleInputEmail1">Password <span style={{color: '#7A0091'}}>*</span></label>
                          <input type="password" placeholder='Enter password' />
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
                    {/* <button className='d-btn mr-2'>Discard</button> */}
                    <button className='in-btn'>
                      {
                          loading ?(
                              <>
                              <div className="spinner-border spinner-border-sm text-light" role="status">
                                  <span className="sr-only"></span>
                              </div>
                              <span>Updating User... </span>
                              </>
                              
                          ): (
                              'Update User'
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
      
      {delmode ? (
        <>
          <div className="modal-overlay">
            <div className="modal-content2">
              <div className="head-mode">
                <h6 style={{color: '#7A0091'}}>Delete User</h6>
                <button className="modal-close" onClick={hideModal2}>
                &times;
                </button>
              </div>
              <div className="modal-body">
                <form onSubmit={delUser}>
                  <div className="form-group">
                    <label htmlFor="exampleInputPassword1" className='mb-2'>User ID <span style={{color: '#ED4343'}}>*</span></label>
                    <input type="text" placeholder='Enter Name' disabled value={user}/>
                  </div>
                  <div className="form-group">
                    <label htmlFor="exampleInputPassword1" className='mb-2'>Shop ID <span style={{color: '#ED4343'}}>*</span></label>
                    <input type="text" placeholder='Enter Name' disabled value={shop}/>
                  </div>
                  <button type="submit" className="log-btn mt-3">
                      { loading ? (
                          <>
                          <div className="spinner-border spinner-border-sm text-light" role="status">
                          <span className="sr-only"></span>
                          </div>
                          <span>Deleting... </span>
                          </>
                      ) : ('Delete User')}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </>
      ) : ('')}
    </>
  )
}

export default Users
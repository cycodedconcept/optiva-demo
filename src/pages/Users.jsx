import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers, getUserRole, getShop, createUsers } from '../features/userSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import Priviledge from './support/Priviledge';
import ShopSelector from './support/ShopSelector';

const Users = () => {

  const [userMode, setUserMode] = useState(false);

  const dispatch = useDispatch();
  const { loading, error, success, allUsers, userRole, shops } = useSelector((state) => state.user);
  let token = localStorage.getItem("token");
  const getId =localStorage.getItem("sid");

  useEffect(() => {
    if (token) {
      dispatch(getAllUsers({token, id: getId}));
      dispatch(getUserRole({token}));
      dispatch(getShop({token}));
    }
  }, [dispatch, token]);


  const hideModal = () => {
    setUserMode(false)
  }

  const showModal = () => {
    setUserMode(true)
  }


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
                              <FontAwesomeIcon icon={faEdit} style={{color: '#7A0091'}}/>
                              <FontAwesomeIcon icon={faTrash} style={{color: '#7A0091'}}/>
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
                          <input type="email" placeholder='Enter Email' />
                        </div>
                    </div>
                    <div className="col-sm-12 col-md-12 col-lg-6">
                        <div className="form-group mb-4">
                          <label htmlFor="exampleInputEmail1">Role <span style={{color: '#7A0091'}}>*</span></label>
                          <Priviledge data={userRole}/>
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
                          <ShopSelector shops={shops}/>
                        </div>
                    </div>
                  </div> 
                  <div className="text-right">
                    <button className='d-btn mr-2'>Discard</button>
                    <button className='in-btn'>Create User</button>
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

export default Users
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { shopUser, setSelectedShop } from '../features/userSlice';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Logo } from '../assets/images'

const Shop = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, success, shopItem} = useSelector((state) => state.user)
  const [getShop, setGetShop] = useState('');

  let token = localStorage.getItem("token");
  const shopp = localStorage.getItem('user');
  const shops = JSON.parse(shopp);
  const shop = shops.shops;

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("sid", getShop);

    if (!getShop) {
        Swal.fire({
            icon: 'error',
            title: 'Missing Information',
            text: 'Please fill select a shop',
            confirmButtonColor: '#7A0091'
        });
        return;
    }
    else {
        dispatch(shopUser({ token, shop_id: getShop }));
        dispatch(setSelectedShop(getShop));
        navigate('/dashboard');
    }
    

  }

  useEffect(() => {
    if (error) {
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: error.message || 'An error occurred during login. Please try again.',
        confirmButtonColor: '#7A0091'
      });
    }
  }, [error]);

//   useEffect(() => {
//     if (success) {
//       navigate('/dashboard', { replace: true });
//     }
//   }, [success, navigate]);

  return (
    <>
        <div className="row justify-content-center rounded-pill">
            <div className="col-md-4">
                <div className="lo-sec mt-5">
                    <div className="lo-img text-center">
                        <img src={Logo} alt="" />
                    </div>
                    <div className="log-head text-center my-5">
                    </div>
                    <div className="tron">
                      <div className="lo-body text-center mt-3">
                          <p>Kindly select shop you will like to access.</p>
                      </div>
                      <form className='mt-5' onSubmit={handleSubmit}>
                          <div className="form-group">
                              <label htmlFor="exampleInputPassword1" className='mb-2'>Select Shop <span style={{color: '#ED4343'}}>*</span></label>
                              <select className="lo-input" value={getShop} onChange={(e) => setGetShop(e.target.value)}>
                                  <option value="">--Select Shop--</option>
                                  {shop.map((item, index) => 
                                    <option key={index} value={item.id}>{item.shop_name}</option>
                                  )}
                              </select>
                          </div>
                          <button type="submit" className="log-btn mt-3">
                              { loading ? (
                                  <>
                                  <div className="spinner-border spinner-border-sm text-light" role="status">
                                  <span className="sr-only"></span>
                                  </div>
                                  <span>Loading... </span>
                                  </>
                              ) : ('Continue')}
                          </button>
                      </form>
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}

export default Shop
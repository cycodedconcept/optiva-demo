import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { loginForm } from '../features/userSlice';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Logo, Log } from '../assets/images'
import '../style.css'

const Login = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, success } = useSelector((state) => state.user);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!login || !password) {
        Swal.fire({
          icon: 'error',
          title: 'Missing Information',
          text: 'Please fill in both your email and password.',
          confirmButtonColor: '#7A0091'
        });
        return;
    }
    dispatch(loginForm({ login, password }));
    // navigate('/shop');
  };

  useEffect(() => {
    if (error) {
      console.error("Login Failed:", error);
          
        let errorMessage = "Something went wrong";
    
        if (error && typeof error === "object") {
            if (Array.isArray(error)) {
                errorMessage = error.map(item => item.message).join(", ");
            } else if (error.message) {
                errorMessage = error.message;
            } else if (error.response && error.response.data) {
                errorMessage = Array.isArray(error.response.data) 
                    ? error.response.data.map(item => item.message).join(", ") 
                    : error.response.data.message || JSON.stringify(error.response.data);
            }
        }
    
        Swal.fire({
            icon: "error",
            title: "Error Occurred",
            text: errorMessage,
        });
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      navigate('/shop');
    }
  }, [success, navigate]);

  return (
    <>
      <div className="row">
          <div className="col-sm-12 col-md-12 col-lg-6 specta" style={{
                backgroundImage: `url(${Log})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                backgroundPosition: 'top',
                minHeight: '100vh',
               }}>
              <div className="box">
                   <div className="box-item">
                       <h4>"Feel confident as a woman"</h4>
                       <p>Vestibulum auctor orci in risus iaculis consequat<br/> suscipit felis rutrum aliquet iaculis augue.  </p>
                   </div>
               </div>
          </div>
          <div className="col-sm-12 col-md-12 col-lg-6">
              <div className="lo-sec mt-5">
                  <div className="lo-img text-center">
                      <img src={Logo} alt="" />
                  </div>
                  <div className="log-head text-center my-5">
                      <h3>Inventory Management System</h3>
                  </div>
                  <div className="tron">
                    <div className="lo-body text-center mt-3">
                        <h5>Welcome Back !</h5>
                        <p>Sign in to continue to Hair Planet.</p>
                    </div>
                    <form className='mt-5' onSubmit={handleSubmit}>
                        <div className="form-group mb-3">
                            <label htmlFor="exampleInputEmail1" className='mb-2'>Email <span style={{color: '#ED4343'}}>*</span></label>
                            <input type="email" className=" lo-input" value={login} onChange={(e) => setLogin(e.target.value)}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="exampleInputPassword1" className='mb-2'>Password <span style={{color: '#ED4343'}}>*</span></label>
                            <input type="password" className="lo-input" value={password} onChange={(e) => setPassword(e.target.value)}/>
                        </div>
                        <button className="log-btn mt-3">
                            {
                                loading ?(
                                    <>
                                    <div className="spinner-border spinner-border-sm text-light" role="status">
                                        <span className="sr-only"></span>
                                    </div>
                                    <span>Logging in... </span>
                                    </>
                                    
                                ): (
                                    'Log In'
                                )
                            }
                        </button>
                    </form>
                  </div>
              </div>
          </div>
      </div>


    </>
  )
}

export default Login




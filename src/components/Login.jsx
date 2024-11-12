import React from 'react'
import { Logo, Log } from '../assets/images'
import '../style.css'

const Login = () => {
  return (
    <>
      <div className="row">
          <div className="col-sm-12 col-md-12 col-lg-6 specta" style={{
                backgroundImage: `url(${Log})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                backgroundPosition: 'top',
                minHeight: '100vh',
                // width: '100%',
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
                        <p>Sign in to continue to Hair Planeth.</p>
                    </div>
                    <form className='mt-5'>
                        <div className="form-group mb-3">
                            <label for="exampleInputEmail1" className='mb-2'>Email <span style={{color: '#ED4343'}}>*</span></label>
                            <input type="email" className=" lo-input" id="exampleInputEmail1" aria-describedby="emailHelp"/>
                        </div>
                        <div className="form-group">
                            <label for="exampleInputPassword1" className='mb-2'>Password <span style={{color: '#ED4343'}}>*</span></label>
                            <input type="password" className="lo-input " id="exampleInputPassword1"/>
                        </div>
                        <button className="log-btn mt-3">Log In</button>
                    </form>
                  </div>
              </div>
          </div>
      </div>
    </>
  )
}

export default Login

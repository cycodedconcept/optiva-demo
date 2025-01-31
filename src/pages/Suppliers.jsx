import React, {useState, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllSuppliers, getCountries } from '../features/supplierSlice';
import Swal from 'sweetalert2';

import { Fil } from '../assets/images';


const Suppliers = () => {
  const dispatch = useDispatch();
  let token = localStorage.getItem("token");
  const getId = localStorage.getItem("sid");
  const [suMode, setSuMode] = useState(false);
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [shop, setShop] = useState([]);
  const [st, setSt] = useState([])

  const { loading, error, success, supplier, countryData } = useSelector((state) => state.supplier);

  useEffect(() => {
    if (token) {
      dispatch(getAllSuppliers({token, id: getId}))
    }
  },[])

  const hideModal = () => {
    setSuMode(false)
  }

  const showSupplier = () => {
    setSuMode(true);
  }

  useEffect(() => {
    dispatch(getCountries());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    switch (name) {
      case 'name':
        setName(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'phone':
        setPhone(value);
        break;
      case 'country':
        setCountry(value);
        const countries = JSON.parse(localStorage.getItem("fetchedData"));
        if (countries) {
          const selectedCountry = countries.find(country => country.name === value);
  
          if (selectedCountry) {
            setSt(selectedCountry.states || []);
            console.log('States for selected country:', selectedCountry.states);
          } else {
            setSt([]);
            console.log('No states found for selected country.');
          }
        }
        break;
      case 'state':
        setState(value);
        break;
      default:
        break;
    }
  }

  return (
    <>
      <div className="mt-5 mb-5 mt-lg-5 text-right">
        <button className='pro-btn' onClick={showSupplier}><span style={{fontSize: '20px'}}>+</span> Add Suppliers</button>
      </div>

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
                    </tr>
                </thead>
                <tbody>
                    {
                      supplier && supplier.length > 0 ? (
                        supplier.map((item, index) => (
                          <tr key={item.id}>
                            <td>{index + 1}</td>
                            <td>{item.supplier_name}</td>
                            <td>{item.supplier_email}</td>
                            <td>{item.supplier_phonenumber}</td>
                            <td>{item.country}</td>
                            <td>{item.state}</td>
                            <td>{item.created_by}</td>
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

      {suMode ? (
        <>
          <div className="modal-overlay">
            <div className="modal-content2">
              <div className="head-mode">
                <h6 style={{color: '#7A0091'}}>Create Supplier</h6>
                <button className="modal-close" onClick={hideModal}>&times;</button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="row">
                    <div className="col-sm-12 col-md-12 col-lg-6">
                      <div className="form-group mb-4">
                        <label htmlFor="user_name">Supplier Name <span style={{color: '#7A0091'}}>*</span></label>
                        <input 
                          type="text" 
                          placeholder='Enter Name'
                          name='name'
                          value={name}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="col-sm-12 col-md-12 col-lg-6">
                      <div className="form-group mb-4">
                        <label htmlFor="email">Supplier Email <span style={{color: '#7A0091'}}>*</span></label>
                        <input 
                          type="email" 
                          name="email"
                          placeholder='Enter Email'
                          value={email}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="col-sm-12 col-md-12 col-lg-6">
                      <div className="form-group mb-4">
                        <label htmlFor="role">Supplier Phone Number <span style={{color: '#7A0091'}}>*</span></label>
                        <input 
                          type="text" 
                          name="phone"
                          placeholder='Enter Email'
                          value={phone}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="col-sm-12 col-md-12 col-lg-6">
                      <div className="form-group mb-4">
                       <label htmlFor="shops">Shops <span style={{color: '#7A0091'}}>*</span></label>
                        
                      </div>
                    </div>
                    <div className="col-sm-12 col-md-12 col-lg-6">
                      <div className="form-group mb-4">
                        <label htmlFor="shops">Country <span style={{color: '#7A0091'}}>*</span></label>
                        <select name="country" value={country} onChange={handleChange}>
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
                      <select name="state" id="" value={state} onChange={handleChange}>
                        <option>--choose state--</option>
                        {st.map((item, index) => {
                          const formattedName = item.name.replace(/state/i, '').trim();
                          const displayName = formattedName.charAt(0).toLowerCase() + formattedName.slice(1);
                          
                          return (
                            <option key={index} value={displayName}>{displayName}</option>
                          );
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
    </>
  )
}

export default Suppliers
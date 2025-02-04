import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getProduct } from '../features/productSlice';
import { getAllSuppliers } from '../features/supplierSlice';
import { Prod, Fil} from '../assets/images'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTimes } from '@fortawesome/free-solid-svg-icons';
import Pagination from './support/Pagination';

const Products = () => {
    const dispatch = useDispatch();
    const { products, error, success, loading, currentPage, per_page, total, total_pages } = useSelector((state) => state.product);
    const { supplier } = useSelector((state) => state.supplier);
    let token = localStorage.getItem("token");
    const getId = localStorage.getItem("sid");


    const [modalVisible, setModalVisible] = useState(false);
    const [upModal, setUpModal] = useState(false);

    const hideModal = () => {
        setModalVisible(false);
        setUpModal(false);
    }

    const sModal = () => {
        setModalVisible(true)
    }
    const dmodal = () => {
        setUpModal(true)
    }

    const [inputGroups, setInputGroups] = useState([
        { input1: '', input2: '', input3: '', input4: '' },
    ]);
    
    const handleAddInputGroup = (e) => {
        e.preventDefault();
        setInputGroups([...inputGroups, { inche: '', price: '', discount: '', quantity: '' }]);
    };
      
    
    const handleRemoveInputGroup = (index) => {
        const newInputGroups = [...inputGroups];
        newInputGroups.splice(index, 1);
        setInputGroups(newInputGroups);
    };

    useEffect(() => {
        if (token) {
          dispatch(getProduct({token, shop_id: getId, page: currentPage, per_page: per_page}))
        }
      },[token, dispatch, currentPage, per_page])

  return (
    <>
    <div className="mt-5 mt-lg-4 d-block text-right">
        <button className='pro-btn' onClick={sModal}><span style={{fontSize: '20px'}}>+</span> Add Product</button>
    </div>

    {loading ? (
         <div>Loading...</div>
    ) : error ? (
        <div>Error: {error?.message || 'Something went erong'}</div>
    ) : (
        <>
           <div className="lp px-0 py-0 px-lg-5 py-lg-1">
            <div className="search-container text-right">
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
                                    <th><div className='d-flex justify-content-between'><p>Product Name</p><div><img src={Fil} alt="" /></div></div></th>
                                    <th><div className='d-flex justify-content-between'><p>Category</p><div><img src={Fil} alt="" /></div></div></th>
                                    <th><div className='d-flex justify-content-between'><p>Supplier Name</p><div><img src={Fil} alt="" /></div></div></th>
                                    <th><div className='d-flex justify-content-between'><p>Buying Price</p><div><img src={Fil} alt="" /></div></div></th>
                                    <th><div className='d-flex justify-content-between'><p>Selling Price</p><div><img src={Fil} alt="" /></div></div></th>
                                    <th><div className='d-flex justify-content-between'><p>Unit</p><div><img src={Fil} alt="" /></div></div></th>
                                    <th><div className='d-flex justify-content-between'><p>Color</p><div><img src={Fil} alt="" /></div></div></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    products && products.length > 0 ? (
                                        products.map((item, index) => (
                                            <tr key={item.id} onClick={() => proDetails(item.id)} style={{cursor: 'pointer'}}>
                                            <td>{index + 1}</td>
                                            <td> 
                                                <img
                                                src={typeof item.images[0]?.filename === 'string' ? item.images[0]?.filename : 'default_image.png'}
                                                width={60} className="img-thumbnail" alt="Thumbnail" style={{boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px'}}
                                                />
                                                <span className='ml-5'>{item.product_name}</span>
                                            </td>
                                            <td>{item.product_category || '----'}</td>
                                            <td>{item.supplier_name.supplier_name}</td>
                                            <td>₦{Number(item.total_buying_price).toLocaleString()}</td>
                                            <td>₦{Number(item.total_selling_price).toLocaleString()}</td>
                                            <td>{item.unit}</td>
                                            <td>{item.color}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7">No Product available</td>
                                        </tr>
                                    )
                                }
                            </tbody>
                        </table>
                        <Pagination
                            currentPage={currentPage}
                            totalPages={total_pages}
                            perPage={per_page}
                            total={total}
                            onPageChange={(newPage) => dispatch(getProduct({
                            token, 
                            shop_id: getId,
                            page: newPage,
                            per_page: per_page
                            }))}
                            onPerPageChange={(newPerPage) => dispatch(getProduct({
                            token, 
                            shop_id: getId,
                            page: 1,
                            per_page: newPerPage
                            }))}
                        />
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
                        <h6 style={{color: '#7A0091'}}>Add New Product</h6>
                        <button className="modal-close" onClick={hideModal}>
                        &times;
                        </button>
                    </div>

                    <div className="modal-body">
                        <form>
                            <div className="row">
                                <div className="col-sm-12 col-md-12 col-lg-6">
                                    <div className="form-group mb-4">
                                        <label htmlFor="exampleInputEmail1">Product Name <span style={{color: '#7A0091'}}>*</span></label>
                                        <input type="text" placeholder='Enter Name' />
                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-12 col-lg-6">
                                    <div className="form-group mb-4">
                                        <label htmlFor="exampleInputEmail1">Shops <span style={{color: '#7A0091'}}>*</span></label>
                                        <select>
                                            <option>select</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-12 col-lg-6">
                                    <div className="form-group mb-4">
                                        <label htmlFor="exampleInputEmail1">Product Category <span style={{color: '#7A0091'}}>*</span></label>
                                        <select>
                                            <option>--select category--</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-12 col-lg-3">
                                    <div className="form-group mb-4">
                                        <label htmlFor="exampleInputEmail1">Color <span style={{color: '#7A0091'}}>*</span></label>
                                        <input type="text" placeholder='Enter Name' />
                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-12 col-lg-3">
                                    <div className="form-group mb-4">
                                        <label htmlFor="exampleInputEmail1">Unit <span style={{color: '#7A0091'}}>*</span></label>
                                        <input type="text" placeholder='Enter Name' />
                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-12 col-lg-4">
                                    <div className="form-group mb-4">
                                        <label htmlFor="exampleInputEmail1">Buying Price <span style={{color: '#7A0091'}}>*</span></label>
                                        <input type="text" placeholder='Enter value' />
                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-12 col-lg-4">
                                    <div className="form-group mb-4">
                                        <label htmlFor="exampleInputEmail1">selling Price <span style={{color: '#7A0091'}}>*</span></label>
                                        <input type="text" placeholder='Enter value' />
                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-12 col-lg-4">
                                    <div className="form-group mb-4">
                                        <label htmlFor="exampleInputEmail1">Supplier <span style={{color: '#7A0091'}}>*</span></label>
                                        <select>
                                            <option>select</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-12 col-lg-6">
                                    <div className="form-group mb-4">
                                        <label htmlFor="exampleInputEmail1">Product Thumbnail Image <span style={{color: '#7A0091'}}>*</span></label>
                                        <input type="file" placeholder='Enter value' />
                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-12 col-lg-6">
                                    <div className="form-group mb-4">
                                        <label htmlFor="exampleInputEmail1">Product Sub Images <span style={{color: '#7A0091'}}>*</span></label>
                                        <input type="file" placeholder='Enter value' />
                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-12 col-lg-6">
                                    <div className="form-group mb-4">
                                        <label htmlFor="exampleInputEmail1">Total Stock Value <span style={{color: '#7A0091'}}>*</span></label>
                                        <input type="text" placeholder='Enter Name' />
                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-12 col-lg-6">
                                    <div className="form-group mb-4">
                                        <label htmlFor="exampleInputEmail1">Total Product Stock <span style={{color: '#7A0091'}}>*</span></label>
                                        <input type="text" placeholder='Enter value' />
                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-12 col-lg-12">
                                    <div className="form-group mb-4">
                                        <div className="d-flex justify-content-between mb-3">
                                            <label htmlFor="exampleInputPassword1">Inches</label>
                                            <button
                                            onClick={handleAddInputGroup}
                                            style={{
                                                outline: 'none',
                                                background: 'none',
                                                color: '#7A0091',
                                                fontSize: '25px',
                                                padding: '0',
                                                border: '0',
                                                fontWeight: 'bolder'
                                            }}
                                            >
                                            +
                                            </button>
                                        </div>

                                        {inputGroups.map((group, index) => (
                                            <div key={index} style={{ marginBottom: '20px' }} className="d-flex">
                                            <input
                                                type="text"
                                                name="input1"
                                                value={group.inche || ''}
                                                onChange={(e) => {
                                                const newInputGroups = [...inputGroups];
                                                newInputGroups[index] = { ...group, inche: e.target.value };
                                                setInputGroups(newInputGroups);
                                                }}
                                                placeholder="Inches"
                                                className="mx-2"
                                            />
                                            <input
                                                type="text"
                                                name="input2"
                                                value={group.price || ''}
                                                onChange={(e) => {
                                                const newInputGroups = [...inputGroups];
                                                newInputGroups[index] = { ...group, price: e.target.value };
                                                setInputGroups(newInputGroups);
                                                }}
                                                placeholder="Price"
                                                className="mx-2"
                                            />
                                            <input
                                                type="text"
                                                name="input3"
                                                value={group.discount || ''}
                                                onChange={(e) => {
                                                const newInputGroups = [...inputGroups];
                                                newInputGroups[index] = { ...group, discount: e.target.value };
                                                setInputGroups(newInputGroups);
                                                }}
                                                placeholder="Discount"
                                                className="mx-2"
                                            />
                                            <input
                                                type="text"
                                                name="input4"
                                                value={group.quantity || ''}
                                                onChange={(e) => {
                                                const newInputGroups = [...inputGroups];
                                                newInputGroups[index] = { ...group, discount: e.target.value };
                                                setInputGroups(newInputGroups);
                                                }}
                                                placeholder="Quantity"
                                                className="mx-2"
                                            />
                                            <FontAwesomeIcon
                                                icon={faTimes}
                                                onClick={() => handleRemoveInputGroup(index)}
                                                style={{ color: '#7A0091', cursor: 'pointer', fontWeight: 'bolder' }}
                                            />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-12 col-lg-12">
                                    <div className="form-group mb-4">
                                        <label htmlFor="exampleInputEmail1">Product Description <span style={{color: '#7A0091'}}>*</span></label>
                                        <textarea name="" id="" cols="30" rows="10" placeholder='Enter description'></textarea>
                                    </div>
                                </div>
                            </div>

                            <div className="text-right">
                                <button className='d-btn mr-2'>Discard</button>
                                <button className='in-btn'>Create Product</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
          </>
      ) : ''}

      {upModal ? (
          <>
            <div className="modal-overlay">
                <div className="modal-content2">
                    <div className="head-mode">
                        <h6 style={{color: '#7A0091'}}>Update Product</h6>
                        <button className="modal-close" onClick={hideModal}>
                        &times;
                        </button>
                    </div>

                    <div className="modal-body">
                        <form>
                            <div className="row">
                                <div className="col-sm-12 col-md-12 col-lg-6">
                                    <div className="form-group mb-4">
                                        <label htmlFor="exampleInputEmail1">Product Name <span style={{color: '#7A0091'}}>*</span></label>
                                        <input type="text" placeholder='Enter Name' />
                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-12 col-lg-6">
                                    <div className="form-group mb-4">
                                        <label htmlFor="exampleInputEmail1">Product Brand <span style={{color: '#7A0091'}}>*</span></label>
                                        <select>
                                            <option>--select brand--</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-12 col-lg-6">
                                    <div className="form-group mb-4">
                                        <label htmlFor="exampleInputEmail1">Product Category <span style={{color: '#7A0091'}}>*</span></label>
                                        <select>
                                            <option>--select category--</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-12 col-lg-3">
                                    <div className="form-group mb-4">
                                        <label htmlFor="exampleInputEmail1">Color <span style={{color: '#7A0091'}}>*</span></label>
                                        <select>
                                            <option>select</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-12 col-lg-3">
                                    <div className="form-group mb-4">
                                        <label htmlFor="exampleInputEmail1">Unit <span style={{color: '#7A0091'}}>*</span></label>
                                        <select>
                                            <option>select</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-12 col-lg-3">
                                    <div className="form-group mb-4">
                                        <label htmlFor="exampleInputEmail1">Buying Price <span style={{color: '#7A0091'}}>*</span></label>
                                        <input type="text" placeholder='Enter value' />
                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-12 col-lg-3">
                                    <div className="form-group mb-4">
                                        <label htmlFor="exampleInputEmail1">selling Price <span style={{color: '#7A0091'}}>*</span></label>
                                        <input type="text" placeholder='Enter value' />
                                    </div>
                                </div>
                                
                                <div className="col-sm-12 col-md-12 col-lg-3">
                                    <div className="form-group mb-4">
                                        <label htmlFor="exampleInputEmail1">Total Quantity <span style={{color: '#7A0091'}}>*</span></label>
                                        <input type="text" placeholder='Enter value' />
                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-12 col-lg-6">
                                    <div className="form-group mb-4">
                                        <label htmlFor="exampleInputEmail1">Product Thumbnail Image <span style={{color: '#7A0091'}}>*</span></label>
                                        <input type="file" placeholder='Enter value' />
                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-12 col-lg-6">
                                    <div className="form-group mb-4">
                                        <label htmlFor="exampleInputEmail1">Product Sub Images <span style={{color: '#7A0091'}}>*</span></label>
                                        <input type="file" placeholder='Enter value' />
                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-12 col-lg-12">
                                    <div className="form-group mb-4">
                                        <label htmlFor="exampleInputEmail1">Product Description <span style={{color: '#7A0091'}}>*</span></label>
                                        <textarea name="" id="" cols="30" rows="10" placeholder='Enter description'></textarea>
                                    </div>
                                </div>
                            </div>

                            <div className="text-right">
                                <button className='d-btn mr-2'>Discard</button>
                                <button className='in-btn'>Update Product</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
          </>
      ) : ''}
      
    </>
  )
}

export default Products

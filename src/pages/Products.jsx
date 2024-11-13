import React, { useState } from 'react'
import { Prod, Prods} from '../assets/images'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

const Products = () => {
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

  return (
    <>
    <div className="mt-5 mt-lg-4 d-block d-lg-flex justify-content-between">
        <div className="search-container">
          <input type="text" placeholder="Search Order..." className="search-input" />
          <span className="search-icon">&#128269;</span>
        </div>
        <button className='pro-btn' onClick={sModal}><span style={{fontSize: '20px'}}>+</span> Add Product</button>
    </div>
    <div className="table-content">
        <div className="table-container mt-5">
            <table className="my-table">
                <thead>
                    <tr>
                        <th>Product Name</th>
                        <th>Brand Name</th>
                        <th>Category</th>
                        <th>Created Date</th>
                        <th>Unit Price</th>
                        <th>Stock</th>
                        <th>Edit</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><img src={Prod} alt="Thumbnail" className='img-thumbnail'/> <span className='ml-2'>Bone Straight Wig</span></td>
                        <td>Lush Hair</td>
                        <td>Wig and Attachment</td>
                        <td>10-14-2024</td>
                        <td>30,000</td>
                        <td>300</td>
                        <td><FontAwesomeIcon icon={faEdit} className="mr-2" onClick={dmodal}/> Edit</td>
                    </tr>
                    <tr>
                        <td><img src={Prods} alt="Thumbnail" className='img-thumbnail'/> <span className='ml-2'>Bone Straight Wig</span></td>
                        <td>Experience</td>
                        <td>Wig and Attachment</td>
                        <td>10-14-2024</td>
                        <td>5,000</td>
                        <td>120</td>
                        <td><FontAwesomeIcon icon={faEdit} className="mr-2" onClick={dmodal}/> Edit</td>
                    </tr>
                    <tr>
                        <td><img src={Prod} alt="Thumbnail" className='img-thumbnail'/> <span className='ml-2'>Bone Straight Wig</span></td>
                        <td>Lush Hair</td>
                        <td>Wig and Attachment</td>
                        <td>10-14-2024</td>
                        <td>30,000</td>
                        <td>300</td>
                        <td><FontAwesomeIcon icon={faEdit} className="mr-2" onClick={dmodal}/> Edit</td>
                    </tr>
                    <tr>
                        <td><img src={Prods} alt="Thumbnail" className='img-thumbnail'/> <span className='ml-2'>Bone Straight Wig</span></td>
                        <td>Experience</td>
                        <td>Wig and Attachment</td>
                        <td>10-14-2024</td>
                        <td>5,000</td>
                        <td>120</td>
                        <td><FontAwesomeIcon icon={faEdit} className="mr-2" onClick={dmodal}/> Edit</td>
                    </tr>
                    <tr>
                        <td><img src={Prod} alt="Thumbnail" className='img-thumbnail'/> <span className='ml-2'>Bone Straight Wig</span></td>
                        <td>Lush Hair</td>
                        <td>Wig and Attachment</td>
                        <td>10-14-2024</td>
                        <td>30,000</td>
                        <td>300</td>
                        <td><FontAwesomeIcon icon={faEdit} className="mr-2" onClick={dmodal}/> Edit</td>
                    </tr>
                    <tr>
                        <td><img src={Prods} alt="Thumbnail" className='img-thumbnail'/> <span className='ml-2'>Bone Straight Wig</span></td>
                        <td>Experience</td>
                        <td>Wig and Attachment</td>
                        <td>10-14-2024</td>
                        <td>5,000</td>
                        <td>120</td>
                        <td><FontAwesomeIcon icon={faEdit} className="mr-2" onClick={dmodal}/> Edit</td>
                    </tr>
                    <tr>
                        <td><img src={Prod} alt="Thumbnail" className='img-thumbnail'/> <span className='ml-2'>Bone Straight Wig</span></td>
                        <td>Lush Hair</td>
                        <td>Wig and Attachment</td>
                        <td>10-14-2024</td>
                        <td>30,000</td>
                        <td>300</td>
                        <td><FontAwesomeIcon icon={faEdit} className="mr-2" onClick={dmodal}/> Edit</td>
                    </tr>
                    <tr>
                        <td><img src={Prods} alt="Thumbnail" className='img-thumbnail'/> <span className='ml-2'>Bone Straight Wig</span></td>
                        <td>Experience</td>
                        <td>Wig and Attachment</td>
                        <td>10-14-2024</td>
                        <td>5,000</td>
                        <td>120</td>
                        <td><FontAwesomeIcon icon={faEdit} className="mr-2" onClick={dmodal}/> Edit</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
      
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
                                        <label htmlFor="exampleInputEmail1">Discounted Price(Optional) <span style={{color: '#7A0091'}}>*</span></label>
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
                                        <label htmlFor="exampleInputEmail1">Discounted Price(Optional) <span style={{color: '#7A0091'}}>*</span></label>
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

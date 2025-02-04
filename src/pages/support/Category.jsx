import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../features/categorySlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Fil } from '../../assets/images';
import Swal from 'sweetalert2';

const Category = () => {
  const { loading, error, success, categories } = useSelector((state) => state.category);
  const [mode, setMode] = useState(false);
  const [upMode, setUpMode] = useState(false);
  const [formData, setFormData] = useState({
    category_name: ''
  })

  const [upData, setUpData] = useState({
    category_name: ''
  })

  const dispatch = useDispatch();
  let token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      dispatch(getCategories({token}))
    }
  },[token, dispatch])

  const hideModal = () => {
    setMode(false)
    setUpMode(false)

  }

  const showModal = () => {
    setMode(true)
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

  };

  const handleChange2 = (e) => {
    const { name, value } = e.target;
    setUpData({
      ...upData,
      [name]: value
    });

  };

  const handleCategory = async (e) => {
    e.preventDefault();

    const validations = [
      {
        field: 'category_name',
        value: formData.category_name.trim(),
        isValid: (value) => value.length >= 3,
        message: 'Username must be at least 3 characters long'
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

    Swal.fire({
      icon: "success",
      title: "Valid Input!",
      text: "Category is being created...",
      timer: 1500,
      showConfirmButton: false,
    });

    try {
      Swal.fire({
        title: "Creating Category...",
        text: "Please wait while we process your request.",
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const result = await dispatch(createCategory({token, ...formData})).unwrap();

      if (result.message === "category created") {
        Swal.fire({
          icon: "success",
          title: "creating category",
          text: `${result.message}`,
        });

        setFormData({
          category_name: ""
        });

        hideModal()
        dispatch(getCategories({token}))
      }
      else {
        Swal.fire({
          icon: "info",
          title: "creating category",
          text: `${result.message}`,
        });
      }
    } catch (error) {
      console.error("Category creation failed:", error);

      Swal.fire({
        icon: "error",
        title: "Error Occurred",
        text: error.message || "Something went wrong while creating the supplier. Please try again.",
      });
    }
  }

  const getUpmode = (id) => {
    setUpMode(true);
    localStorage.setItem("cid", id);
    const theCategory = localStorage.getItem("allCategories");
    const category = JSON.parse(theCategory);

    const selectedCategory = category.message.find((item) => item.id === id);

    if (selectedCategory) {
      setUpData({
        category_name: selectedCategory.category_name || ''
      })
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault();
    const getId = localStorage.getItem("cid");

    const validations = [
      {
        field: 'category_name',
        value: upData.category_name.trim(),
        isValid: (value) => value.length >= 3,
        message: 'Username must be at least 3 characters long'
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

    Swal.fire({
      icon: "success",
      title: "Valid Input!",
      text: "Category is being updated...",
      timer: 1500,
      showConfirmButton: false,
    });

    try {
      Swal.fire({
        title: "Updating Category...",
        text: "Please wait while we process your request.",
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const result = await dispatch(updateCategory({token, cat_id: getId, ...upData})).unwrap();
      
      if (result.message === "category updated") {
        Swal.fire({
          icon: "success",
          title: "updating category",
          text: `${result.message}`,
        });

        setUpData({
          category_name: ""
        })

        hideModal()
        dispatch(getCategories({token}))
      }
      else {
        Swal.fire({
          icon: "info",
          title: "creating category",
          text: `${result.message}`,
        });
      }

    } catch (error) {
      console.error("Category update failed:", error);

      Swal.fire({
        icon: "error",
        title: "Error Occurred",
        text: error.message || "Something went wrong while updating the category. Please try again.",
      });
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
          deleteCategory({
            cat_id: id,
            token,
          })
        ).then((response) => {
          if (response.meta.requestStatus === 'fulfilled') {
            Swal.fire('Deleted!', 'Category deleted successfully!', 'success');
            dispatch(getCategories({token}))
          } else {
            Swal.fire('Error!', 'Failed to delete category!', 'error');
          }
        });
      }
    });
  }

  return (
    <>
      <div className="mt-5 mb-5 mt-lg-5 text-right">
        <button className='pro-btn' onClick={showModal}><span style={{fontSize: '20px'}}>+</span> Add Categories</button>
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
                          <th><div className='d-flex justify-content-between'><p>Category Name</p><div><img src={Fil} alt="" /></div></div></th>
                          <th><div className='d-flex justify-content-between'><p>Created By</p><div><img src={Fil} alt="" /></div></div></th>
                          <th><div className='d-flex justify-content-between'><p>Date</p><div><img src={Fil} alt="" /></div></div></th>
                          <th><div className='d-flex justify-content-between'><p>Actions</p><div><img src={Fil} alt="" /></div></div></th>
                      </tr>
                  </thead>
                  <tbody>
                      {
                        categories.message && categories.message.length > 0 ? (
                          categories.message.map((item, index) => (
                            <tr key={item.id}>
                              <td>{index + 1}</td>
                              <td>{item.category_name}</td>
                              <td>{item.created_by}</td>
                              <td>{item.date}</td>
                              <td>
                                <div className="d-flex gap-5">
                                  <FontAwesomeIcon icon={faEdit} style={{color: '#379042', fontSize: '16px', marginRight: '20px', backgroundColor: '#E6FEE8', padding: '5px'}} onClick={(e) => {getUpmode(item.id); e.stopPropagation()}} title='update category'/>
                                  <FontAwesomeIcon icon={faTrash} style={{color: '#DB6454', fontSize: '16px', backgroundColor: '#F4E3E3', padding: '5px'}} onClick={(e) => {deleteMode(item.id); e.stopPropagation();}} title='delete category'/>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                          <td colSpan="7">No category available</td>
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

      {mode ? (
        <>
        <div className="modal-overlay">
          <div className="modal-content2">
            <div className="head-mode">
              <h6 style={{color: '#7A0091'}}>Create Category</h6>
              <button className="modal-close" onClick={hideModal}>&times;</button>
            </div>
            <div className="modal-body">
            <form onSubmit={handleCategory}>
                  <div className="row">
                    <div className="col-sm-12 col-md-12 col-lg-12">
                      <div className="form-group mb-4">
                        <label htmlFor="user_name">Category Name <span style={{color: '#7A0091'}}>*</span></label>
                        <input 
                          type="text" 
                          placeholder='Enter Name'
                          name='category_name'
                          value={formData.category_name}
                          onChange={handleChange}
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
                          <span>Creating Categories... </span>
                        </>
                      ) : (
                        'Create Category'
                      )}
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
              <h6 style={{color: '#7A0091'}}>Update Category</h6>
              <button className="modal-close" onClick={hideModal}>&times;</button>
            </div>
            <div className="modal-body">
            <form onSubmit={handleUpdate}>
                  <div className="row">
                    <div className="col-sm-12 col-md-12 col-lg-12">
                      <div className="form-group mb-4">
                        <label htmlFor="user_name">Category Name <span style={{color: '#7A0091'}}>*</span></label>
                        <input 
                          type="text" 
                          placeholder='Enter Name'
                          name='category_name'
                          value={upData.category_name}
                          onChange={handleChange2}
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
                          <span>Updating Categories... </span>
                        </>
                      ) : (
                        'Update Category'
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

export default Category
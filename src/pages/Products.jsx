// import React, { useState, useEffect } from 'react'
// import { useDispatch, useSelector } from 'react-redux';
// import { getProduct, createProduct } from '../features/productSlice';
// import { getAllSuppliers } from '../features/supplierSlice';
// import { getCategories } from '../features/categorySlice';
// import { getShop } from '../features/userSlice';
// import ShopSelector from './support/ShopSelector';
// import { Prod, Fil} from '../assets/images'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faEdit, faTimes } from '@fortawesome/free-solid-svg-icons';
// import Pagination from './support/Pagination';

// const Products = () => {
//     const dispatch = useDispatch();
//     const { products, error, success, loading, currentPage, per_page, total, total_pages } = useSelector((state) => state.product);
//     const { supplier } = useSelector((state) => state.supplier);
//     const { categories } = useSelector((state) => state.category);
//     const { shops } = useSelector((state) => state.user);

//     let token = localStorage.getItem("token");
//     const getId = localStorage.getItem("sid");

//     const [modalVisible, setModalVisible] = useState(false);
//     const [upModal, setUpModal] = useState(false);
//     const [productData, setProductData] = useState({
//         product_name: '',
//         color: '',
//         unit: '',
//         total_selling_price: '',
//         product_category: '',
//         product_description: '',
//         total_product_stock: '',
//         total_buying_price: '',
//         total_stock_value: '',
//         supplier_id: '',
//         shop_id: [],
//         images: []
//     })

//     const hideModal = () => {
//         setModalVisible(false);
//         setUpModal(false);
//     }

//     const sModal = () => {
//         setModalVisible(true)
//     }
//     const dmodal = () => {
//         setUpModal(true)
//     }

//     const [inputGroups, setInputGroups] = useState([
//         { input1: '', input2: '', input3: '', input4: '' },
//     ]);
    
//     const handleAddInputGroup = (e) => {
//         e.preventDefault();
//         setInputGroups([...inputGroups, { inche: '', buying_price: '', selling_price: '', stock: '' }]);
//     };
      
    
//     const handleRemoveInputGroup = (index) => {
//         const newInputGroups = [...inputGroups];
//         newInputGroups.splice(index, 1);
//         setInputGroups(newInputGroups);
//     };

//     const handleShopSelectionChange = (selectedShops) => {
//         setProductData((prevData) => ({
//           ...prevData,
//           shop_id: selectedShops,
//         }));
//         console.log("Selected Shops:", selectedShops);
//     };

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setProductData((prev) => ({ ...prev, [name]: value }));
//     };
    
//     const handleFileChange = (e) => {
//         setProductData((prev) => ({
//             ...prev,
//             images: [...e.target.files],
//         }));
//     };

//     useEffect(() => {
//         if (token) {
//           dispatch(getProduct({token, shop_id: getId, page: currentPage, per_page: per_page}))
//           dispatch(getAllSuppliers({token, id: getId}))
//           dispatch(getCategories({token}));
//           dispatch(getShop({token}));
//         }
//       },[token, dispatch, currentPage, per_page])

//   return (
//     <>
//     <div className="mt-5 mt-lg-4 d-block text-right">
//         <button className='pro-btn' onClick={sModal}><span style={{fontSize: '20px'}}>+</span> Add Product</button>
//     </div>

//     {loading ? (
//          <div>Loading...</div>
//     ) : error ? (
//         <div>Error: {error?.message || 'Something went erong'}</div>
//     ) : (
//         <>
//            <div className="lp px-0 py-0 px-lg-5 py-lg-1">
//             <div className="search-container text-right">
//                 <input type="text" placeholder="Search Supplier..." className="search-input mb-3" style={{borderRadius: '5px',}}/>
//                 <span className="search-icon" style={{position: "absolute",
//                     right: "10px",
//                     top: "8px",
//                     fontSize: "20px",
//                     color: "#222",
//                     cursor: "pointer"}}>&#128269;</span>
//                 </div>
//                 <div className="table-content">
//                     <div className="table-container">
//                         <table className="my-table">
//                             <thead>
//                                 <tr>
//                                     <th><div className='d-flex justify-content-between'><p>S/N</p><div><img src={Fil} alt="" /></div></div></th>
//                                     <th><div className='d-flex justify-content-between'><p>Product Name</p><div><img src={Fil} alt="" /></div></div></th>
//                                     <th><div className='d-flex justify-content-between'><p>Category</p><div><img src={Fil} alt="" /></div></div></th>
//                                     <th><div className='d-flex justify-content-between'><p>Supplier Name</p><div><img src={Fil} alt="" /></div></div></th>
//                                     <th><div className='d-flex justify-content-between'><p>Buying Price</p><div><img src={Fil} alt="" /></div></div></th>
//                                     <th><div className='d-flex justify-content-between'><p>Selling Price</p><div><img src={Fil} alt="" /></div></div></th>
//                                     <th><div className='d-flex justify-content-between'><p>Unit</p><div><img src={Fil} alt="" /></div></div></th>
//                                     <th><div className='d-flex justify-content-between'><p>Color</p><div><img src={Fil} alt="" /></div></div></th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {
//                                     products && products.length > 0 ? (
//                                         products.map((item, index) => (
//                                             <tr key={item.id} onClick={() => proDetails(item.id)} style={{cursor: 'pointer'}}>
//                                             <td>{index + 1}</td>
//                                             <td> 
//                                                 <img
//                                                 src={typeof item.images[0]?.filename === 'string' ? item.images[0]?.filename : 'default_image.png'}
//                                                 width={60} className="img-thumbnail" alt="Thumbnail" style={{boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px'}}
//                                                 />
//                                                 <span className='ml-5'>{item.product_name}</span>
//                                             </td>
//                                             <td>{item.product_category || '----'}</td>
//                                             <td>{item.supplier_name.supplier_name}</td>
//                                             <td>₦{Number(item.total_buying_price).toLocaleString()}</td>
//                                             <td>₦{Number(item.total_selling_price).toLocaleString()}</td>
//                                             <td>{item.unit}</td>
//                                             <td>{item.color}</td>
//                                             </tr>
//                                         ))
//                                     ) : (
//                                         <tr>
//                                             <td colSpan="7">No Product available</td>
//                                         </tr>
//                                     )
//                                 }
//                             </tbody>
//                         </table>
//                         <Pagination
//                             currentPage={currentPage}
//                             totalPages={total_pages}
//                             perPage={per_page}
//                             total={total}
//                             onPageChange={(newPage) => dispatch(getProduct({
//                             token, 
//                             shop_id: getId,
//                             page: newPage,
//                             per_page: per_page
//                             }))}
//                             onPerPageChange={(newPerPage) => dispatch(getProduct({
//                             token, 
//                             shop_id: getId,
//                             page: 1,
//                             per_page: newPerPage
//                             }))}
//                         />
//                     </div>
//                 </div>
//            </div>
//         </>
//     )}
    
      
//       {modalVisible ? (
//           <>
//             <div className="modal-overlay">
//                 <div className="modal-content2">
//                     <div className="head-mode">
//                         <h6 style={{color: '#7A0091'}}>Add New Product</h6>
//                         <button className="modal-close" onClick={hideModal}>
//                         &times;
//                         </button>
//                     </div>

//                     <div className="modal-body">
//                         <form>
//                             <div className="row">
//                                 <div className="col-sm-12 col-md-12 col-lg-6">
//                                     <div className="form-group mb-4">
//                                         <label htmlFor="exampleInputEmail1">Product Name <span style={{color: '#7A0091'}}>*</span></label>
//                                         <input type="text" placeholder='Enter Name' name='product_name' value={productData.product_name} onChange={handleChange }/>
//                                     </div>
//                                 </div>
//                                 <div className="col-sm-12 col-md-12 col-lg-6">
//                                     <div className="form-group mb-4">
//                                         <label htmlFor="exampleInputEmail1">Shops <span style={{color: '#7A0091'}}>*</span></label>
//                                         <ShopSelector shops={shops} onShopSelectionChange={handleShopSelectionChange}/>
//                                     </div>
//                                 </div>
//                                 <div className="col-sm-12 col-md-12 col-lg-6">
//                                     <div className="form-group mb-4">
//                                         <label htmlFor="exampleInputEmail1">Product Category <span style={{color: '#7A0091'}}>*</span></label>
//                                         <select name='product_category' value={productData.product_category} onChange={handleChange}>
//                                             <option>--select category--</option>
//                                             {categories.message.map((item) => 
//                                               <option key={item.id} value={item.category_name}>{item.category_name}</option>
//                                             )}
//                                         </select>
//                                     </div>
//                                 </div>
//                                 <div className="col-sm-12 col-md-12 col-lg-3">
//                                     <div className="form-group mb-4">
//                                         <label htmlFor="exampleInputEmail1">Color <span style={{color: '#7A0091'}}>*</span></label>
//                                         <input type="text" placeholder='Enter Color' name='color' value={productData.color} onChange={handleChange}/>
//                                     </div>
//                                 </div>
//                                 <div className="col-sm-12 col-md-12 col-lg-3">
//                                     <div className="form-group mb-4">
//                                         <label htmlFor="exampleInputEmail1">Unit <span style={{color: '#7A0091'}}>*</span></label>
//                                         <input type="text" placeholder='Enter Unit' name='unit' value={productData.unit} onChange={handleChange}/>
//                                     </div>
//                                 </div>
//                                 <div className="col-sm-12 col-md-12 col-lg-6">
//                                     <div className="form-group mb-4">
//                                         <label htmlFor="exampleInputEmail1">Buying Price <span style={{color: '#7A0091'}}>*</span></label>
//                                         <input type="text" placeholder='Enter Buying Price' name='total_buying_price' value={productData.total_buying_price} />
//                                     </div>
//                                 </div>
//                                 <div className="col-sm-12 col-md-12 col-lg-6">
//                                     <div className="form-group mb-4">
//                                         <label htmlFor="exampleInputEmail1">selling Price <span style={{color: '#7A0091'}}>*</span></label>
//                                         <input type="text" placeholder='Enter Selling Price' value={productData.total_selling_price} onChange={handleChange}/>
//                                     </div>
//                                 </div>
//                                 <div className="col-sm-12 col-md-12 col-lg-6">
//                                     <div className="form-group mb-4">
//                                         <label htmlFor="exampleInputEmail1">Supplier <span style={{color: '#7A0091'}}>*</span></label>
//                                         <select name='supplier_id' value={productData.supplier_id} onChange={handleChange}>
//                                             <option>--select supplier--</option>
//                                             {supplier.map((item) =>
//                                               <option key={item.supplier_id} value={item.supplier_id}>{item.supplier_name}</option> 
//                                             )}
//                                         </select>
//                                     </div>
//                                 </div>
//                                 <div className="col-sm-12 col-md-12 col-lg-6">
//                                     <div className="form-group mb-4">
//                                         <label htmlFor="exampleInputEmail1">Product Image <span style={{color: '#7A0091'}}>*</span></label>
//                                         <input type="file" multiple placeholder='Enter value' onChange={handleFileChange}/>
//                                     </div>
//                                 </div>
//                                 <div className="col-sm-12 col-md-12 col-lg-6">
//                                     <div className="form-group mb-4">
//                                         <label htmlFor="exampleInputEmail1">Total Stock Value <span style={{color: '#7A0091'}}>*</span></label>
//                                         <input type="text" placeholder='Enter Stock Value' name='total_stock_value' value={productData.total_stock_value} onChange={handleChange}/>
//                                     </div>
//                                 </div>
//                                 <div className="col-sm-12 col-md-12 col-lg-6">
//                                     <div className="form-group mb-4">
//                                         <label htmlFor="exampleInputEmail1">Total Product Stock <span style={{color: '#7A0091'}}>*</span></label>
//                                         <input type="text" placeholder='Enter Product Stock' name='total_product_stock' value={productData.total_product_stock} onChange={handleChange}/>
//                                     </div>
//                                 </div>
//                                 <div className="col-sm-12 col-md-12 col-lg-12">
//                                     <div className="form-group mb-4">
//                                         <div className="d-flex justify-content-between mb-3">
//                                             <label htmlFor="exampleInputPassword1">Inches</label>
//                                             <button
//                                             onClick={handleAddInputGroup}
//                                             style={{
//                                                 outline: 'none',
//                                                 background: 'none',
//                                                 color: '#7A0091',
//                                                 fontSize: '25px',
//                                                 padding: '0',
//                                                 border: '0',
//                                                 fontWeight: 'bolder'
//                                             }}
//                                             >
//                                             +
//                                             </button>
//                                         </div>

//                                         {inputGroups.map((group, index) => (
//                                             <div key={index} style={{ marginBottom: '20px' }} className="d-flex">
//                                             <input
//                                                 type="text"
//                                                 name="input1"
//                                                 value={group.inche || ''}
//                                                 onChange={(e) => {
//                                                 const newInputGroups = [...inputGroups];
//                                                 newInputGroups[index] = { ...group, inche: e.target.value };
//                                                 setInputGroups(newInputGroups);
//                                                 }}
//                                                 placeholder="Inches"
//                                                 className="mx-2"
//                                             />
//                                             <input
//                                                 type="text"
//                                                 name="input2"
//                                                 value={group.buying_price || ''}
//                                                 onChange={(e) => {
//                                                 const newInputGroups = [...inputGroups];
//                                                 newInputGroups[index] = { ...group, buying_price: e.target.value };
//                                                 setInputGroups(newInputGroups);
//                                                 }}
//                                                 placeholder="Buying Price"
//                                                 className="mx-2"
//                                             />
//                                             <input
//                                                 type="text"
//                                                 name="input3"
//                                                 value={group.selling_price || ''}
//                                                 onChange={(e) => {
//                                                 const newInputGroups = [...inputGroups];
//                                                 newInputGroups[index] = { ...group, selling_price: e.target.value };
//                                                 setInputGroups(newInputGroups);
//                                                 }}
//                                                 placeholder="Selling Price"
//                                                 className="mx-2"
//                                             />
//                                             <input
//                                                 type="text"
//                                                 name="input4"
//                                                 value={group.stock || ''}
//                                                 onChange={(e) => {
//                                                 const newInputGroups = [...inputGroups];
//                                                 newInputGroups[index] = { ...group, stock: e.target.value };
//                                                 setInputGroups(newInputGroups);
//                                                 }}
//                                                 placeholder="Stock"
//                                                 className="mx-2"
//                                             />
//                                             <FontAwesomeIcon
//                                                 icon={faTimes}
//                                                 onClick={() => handleRemoveInputGroup(index)}
//                                                 style={{ color: '#7A0091', cursor: 'pointer', fontWeight: 'bolder' }}
//                                             />
//                                             </div>
//                                         ))}
//                                     </div>
//                                 </div>
//                                 <div className="col-sm-12 col-md-12 col-lg-12">
//                                     <div className="form-group mb-4">
//                                         <label htmlFor="exampleInputEmail1">Product Description <span style={{color: '#7A0091'}}>*</span></label>
//                                         <textarea cols="30" rows="10" placeholder='Enter description' name='product_description' value={productData.product_description} onChange={handleChange}></textarea>
//                                     </div>
//                                 </div>
//                             </div>

//                             <div className="text-right">
//                                 <button className='d-btn mr-2'>Discard</button>
//                                 <button className='in-btn'>Create Product</button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             </div>
//           </>
//       ) : ''}

//       {upModal ? (
//           <>
//             <div className="modal-overlay">
//                 <div className="modal-content2">
//                     <div className="head-mode">
//                         <h6 style={{color: '#7A0091'}}>Update Product</h6>
//                         <button className="modal-close" onClick={hideModal}>
//                         &times;
//                         </button>
//                     </div>

//                     <div className="modal-body">
//                         <form>
//                             <div className="row">
//                                 <div className="col-sm-12 col-md-12 col-lg-6">
//                                     <div className="form-group mb-4">
//                                         <label htmlFor="exampleInputEmail1">Product Name <span style={{color: '#7A0091'}}>*</span></label>
//                                         <input type="text" placeholder='Enter Name' />
//                                     </div>
//                                 </div>
//                                 <div className="col-sm-12 col-md-12 col-lg-6">
//                                     <div className="form-group mb-4">
//                                         <label htmlFor="exampleInputEmail1">Product Brand <span style={{color: '#7A0091'}}>*</span></label>
//                                         <select>
//                                             <option>--select brand--</option>
//                                         </select>
//                                     </div>
//                                 </div>
//                                 <div className="col-sm-12 col-md-12 col-lg-6">
//                                     <div className="form-group mb-4">
//                                         <label htmlFor="exampleInputEmail1">Product Category <span style={{color: '#7A0091'}}>*</span></label>
//                                         <select>
//                                             <option>--select category--</option>
//                                         </select>
//                                     </div>
//                                 </div>
//                                 <div className="col-sm-12 col-md-12 col-lg-3">
//                                     <div className="form-group mb-4">
//                                         <label htmlFor="exampleInputEmail1">Color <span style={{color: '#7A0091'}}>*</span></label>
//                                         <select>
//                                             <option>select</option>
//                                         </select>
//                                     </div>
//                                 </div>
//                                 <div className="col-sm-12 col-md-12 col-lg-3">
//                                     <div className="form-group mb-4">
//                                         <label htmlFor="exampleInputEmail1">Unit <span style={{color: '#7A0091'}}>*</span></label>
//                                         <select>
//                                             <option>select</option>
//                                         </select>
//                                     </div>
//                                 </div>
//                                 <div className="col-sm-12 col-md-12 col-lg-3">
//                                     <div className="form-group mb-4">
//                                         <label htmlFor="exampleInputEmail1">Buying Price <span style={{color: '#7A0091'}}>*</span></label>
//                                         <input type="text" placeholder='Enter value' />
//                                     </div>
//                                 </div>
//                                 <div className="col-sm-12 col-md-12 col-lg-3">
//                                     <div className="form-group mb-4">
//                                         <label htmlFor="exampleInputEmail1">selling Price <span style={{color: '#7A0091'}}>*</span></label>
//                                         <input type="text" placeholder='Enter value' />
//                                     </div>
//                                 </div>
                                
//                                 <div className="col-sm-12 col-md-12 col-lg-3">
//                                     <div className="form-group mb-4">
//                                         <label htmlFor="exampleInputEmail1">Total Quantity <span style={{color: '#7A0091'}}>*</span></label>
//                                         <input type="text" placeholder='Enter value' />
//                                     </div>
//                                 </div>
//                                 <div className="col-sm-12 col-md-12 col-lg-6">
//                                     <div className="form-group mb-4">
//                                         <label htmlFor="exampleInputEmail1">Product Thumbnail Image <span style={{color: '#7A0091'}}>*</span></label>
//                                         <input type="file" placeholder='Enter value' />
//                                     </div>
//                                 </div>
//                                 <div className="col-sm-12 col-md-12 col-lg-6">
//                                     <div className="form-group mb-4">
//                                         <label htmlFor="exampleInputEmail1">Product Sub Images <span style={{color: '#7A0091'}}>*</span></label>
//                                         <input type="file" placeholder='Enter value' />
//                                     </div>
//                                 </div>
//                                 <div className="col-sm-12 col-md-12 col-lg-12">
//                                     <div className="form-group mb-4">
//                                         <label htmlFor="exampleInputEmail1">Product Description <span style={{color: '#7A0091'}}>*</span></label>
//                                         <textarea name="" id="" cols="30" rows="10" placeholder='Enter description'></textarea>
//                                     </div>
//                                 </div>
//                             </div>

//                             <div className="text-right">
//                                 <button className='d-btn mr-2'>Discard</button>
//                                 <button className='in-btn'>Update Product</button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             </div>
//           </>
//       ) : ''}
      
//     </>
//   )
// }

// export default Products


import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getProduct, createProduct } from '../features/productSlice';
import { getAllSuppliers } from '../features/supplierSlice';
import { getCategories } from '../features/categorySlice';
import { getShop } from '../features/userSlice';
import ShopSelector from './support/ShopSelector';
import { Prod, Fil} from '../assets/images'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTimes } from '@fortawesome/free-solid-svg-icons';
import Pagination from './support/Pagination';
import Swal from 'sweetalert2';


const Products = () => {
    const dispatch = useDispatch();
    const { products, error, success, loading, currentPage, per_page, total, total_pages } = useSelector((state) => state.product);
    const { supplier } = useSelector((state) => state.supplier);
    const { categories } = useSelector((state) => state.category);
    const { shops } = useSelector((state) => state.user);

    let token = localStorage.getItem("token");
    const getId = localStorage.getItem("sid");

    const [modalVisible, setModalVisible] = useState(false);
    const [upModal, setUpModal] = useState(false);
    const [productData, setProductData] = useState({
        product_name: '',
        color: '',
        unit: '',
        total_selling_price: '',
        product_category: '',
        product_description: '',
        total_product_stock: '',
        total_buying_price: '',
        total_stock_value: '',
        supplier_id: '',
        shop_id: [],
        images: []
    })

    const [hasInches, setHasInches] = useState(false);
    const [isMainStockEditable, setIsMainStockEditable] = useState(true);

    

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

    useEffect(() => {
        const hasNonZeroStock = inputGroups.some((inch) => Number(inch.stock) > 0);
        setIsMainStockEditable(!hasNonZeroStock);
        
    }, [inputGroups]);
    
    const handleAddInputGroup = (e) => {
        e.preventDefault();
        setInputGroups([...inputGroups, { inche: '', buying_price: '', selling_price: '', stock: '' }]);
    };
      

    const handleShopSelectionChange = (selectedShops) => {
        setProductData((prevData) => ({
          ...prevData,
          shop_id: selectedShops,
        }));
        console.log("Selected Shops:", selectedShops);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData(prev => {
            const newData = { ...prev, [name]: value };
            
            // Calculate total stock value only if not using inches
            if (!hasInches && (name === 'total_buying_price' || name === 'total_product_stock')) {
                const buyingPrice = parseFloat(name === 'total_buying_price' ? value : prev.total_buying_price) || 0;
                const stockQuantity = parseFloat(name === 'total_product_stock' ? value : prev.total_product_stock) || 0;
                newData.total_stock_value = (buyingPrice * stockQuantity).toString();
            }
            
            return newData;
        });
    };


    const handleInchesChange = (index, field, value) => {
        const newInputGroups = [...inputGroups];
        newInputGroups[index] = { ...newInputGroups[index], [field]: value };
        setInputGroups(newInputGroups);

        // Calculate totals when any inch field changes
        if (field === 'selling_price' || field === 'stock') {
            // Calculate total stock value from inches (selling price * stock)
            const totalStockValue = newInputGroups.reduce((sum, group) => {
                const sellingPrice = parseFloat(group.selling_price) || 0;
                const stock = parseFloat(group.stock) || 0;
                return sum + (sellingPrice * stock);
            }, 0);

            // Calculate total stock from all inches
            const totalStock = newInputGroups.reduce((sum, group) => {
                const stock = parseFloat(group.stock) || 0;
                return sum + stock;
            }, 0);

            setProductData(prev => ({
                ...prev,
                total_stock_value: totalStockValue.toString(),
                total_product_stock: totalStock.toString()
            }));
        }
    };

    const handleRemoveInputGroup = (index) => {
        const newInputGroups = [...inputGroups];
        newInputGroups.splice(index, 1);
        setInputGroups(newInputGroups);

        // Recalculate totals after removing an inch
        const totalStockValue = newInputGroups.reduce((sum, group) => {
            const sellingPrice = parseFloat(group.selling_price) || 0;
            const stock = parseFloat(group.stock) || 0;
            return sum + (sellingPrice * stock);
        }, 0);

        const totalStock = newInputGroups.reduce((sum, group) => {
            const stock = parseFloat(group.stock) || 0;
            return sum + stock;
        }, 0);

        setProductData(prev => ({
            ...prev,
            total_stock_value: totalStockValue.toString(),
            total_product_stock: totalStock.toString()
        }));
    };

    const toggleInches = () => {
        setHasInches(prev => !prev);
        // Reset all values when switching to inches mode
        setProductData(prev => ({
            ...prev,
            total_buying_price: '' || 0,
            total_selling_price: '' || 0,
            total_stock_value: '',
            total_product_stock: ''
        }));
        // Reset inches input groups
        setInputGroups([{ inche: '', buying_price: '', selling_price: '', stock: '' }]);
    };
    
    const handleFileChange = (e) => {
        setProductData((prev) => ({
            ...prev,
            images: [...e.target.files],
        }));
    };

    useEffect(() => {
        if (token) {
          dispatch(getProduct({token, shop_id: getId, page: currentPage, per_page: per_page}))
          dispatch(getAllSuppliers({token, id: getId}))
          dispatch(getCategories({token}));
          dispatch(getShop({token}));
        }
      },[token, dispatch, currentPage, per_page])



    const handleAddProduct = async (e) => {
        e.preventDefault();

        if (!productData.product_name || !productData.color || !productData.unit || !productData.product_category || !productData.total_product_stock || !productData.supplier_id || productData.shop_id.length === 0) {
            Swal.fire({
                icon: "info",
                title: "creating product",
                text: 'All these fields are required!',
                confirmButtonColor: '#7A0091'
            })
            return;
        } 

        if (hasInches) {
            const incompleteInches = inputGroups.some(
                (group) =>
                    !(group.inche || '').trim() ||
                    !(group.buying_price || '').trim() ||
                    !(group.selling_price || '').trim() ||
                    !(group.stock || '').trim()
            );
        
            if (incompleteInches) {
                Swal.fire({
                    icon: "info",
                    title: "Creating Product",
                    text: "Please fill in all inch details.",
                    confirmButtonColor: "#7A0091",
                });
                return;
            }
        
            productData.total_buying_price = '';
            productData.total_selling_price = '';
        }        
        else {
            if (!productData.total_buying_price || !productData.total_selling_price) {
                Swal.fire({
                    icon: "info",
                    title: "creating product",
                    text: 'Please provide both total buying and total selling prices..!',
                    confirmButtonColor: '#7A0091'
                })
                return;
            }
        }

        const formData = new FormData();
        formData.append('product_name', productData.product_name);
        formData.append('color', productData.color);
        formData.append('unit', productData.unit);
        formData.append('product_category', productData.product_category);
        formData.append('product_description', productData.product_description);
        formData.append('total_product_stock', productData.total_product_stock);
        formData.append('total_buying_price', productData.total_buying_price || '');
        formData.append('total_selling_price', productData.total_selling_price || '');
        formData.append('total_stock_value', productData.total_stock_value);
        formData.append('supplier_id', productData.supplier_id);

        const filteredInputGroups = inputGroups.filter(group => 
            Object.values(group).some(value => value !== '')
        );
        
        formData.append('inches', filteredInputGroups.length ? JSON.stringify(filteredInputGroups) : JSON.stringify([]));
        

        // Handle shop_id (array)
        formData.append('shop_id', JSON.stringify(productData.shop_id));
        

        // Handle images (files)
        productData.images.forEach((image) => {
            formData.append('images', image);
        });


        for (let pair of formData.entries()) {
            console.log(`${pair[0]}: ${pair[1]}`);
        }
        
        Swal.fire({
            icon: "success",
            title: "Valid Input!",
            text: "Product is being created...",
            timer: 1500,
            showConfirmButton: false,
        });

        try {
            Swal.fire({
                title: "Creating Product...",
                text: "Please wait while we process your request.",
                allowOutsideClick: false,
                showConfirmButton: false,
                didOpen: () => {
                    Swal.showLoading();
                },
            });
        
            // Add 'await' here
            const response = await dispatch(createProduct({ formData, token })).unwrap();
        
            if (response.message === "product created") {
                Swal.fire({
                    icon: "success",
                    title: "Product Created!",
                    text: `${response.message}`,
                });
        
                // Reset form fields
                setProductData({
                    product_name: '',
                    color: '',
                    unit: '',
                    total_selling_price: '',
                    product_category: '',
                    product_description: '',
                    total_product_stock: '',
                    total_buying_price: '',
                    total_stock_value: '',
                    supplier_id: '',
                    shop_id: [],
                    images: []
                });
                setInputGroups([{ inche: "", buying_price: "", selling_price: "", stock: "" }]);
                setHasInches(false);
        
                // Close modal
                hideModal();
        
                // Refresh product list
                dispatch(getProduct({ token, shop_id: getId, page: currentPage, per_page: per_page }));
            } else {
                Swal.fire({
                    icon: "info",
                    title: "Product Creation",
                    text: `${response.message}`,
                });
            }
        } catch (error) {
            console.error("Product creation failed:", error);
        
            Swal.fire({
                icon: "error",
                title: "Error Occurred",
                text: error.message || "Something went wrong while creating the product. Please try again.",
            });
        }
        
    }

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
                                            <td>{item.total_buying_price}</td>
                                            <td>{item.total_selling_price}</td>
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
                        <form onSubmit={handleAddProduct}>
                            <div className="row">
                                <div className="col-sm-12 col-md-12 col-lg-6">
                                    <div className="form-group mb-4">
                                        <label htmlFor="exampleInputEmail1">Product Name <span style={{color: '#7A0091'}}>*</span></label>
                                        <input type="text" placeholder='Enter Name' name='product_name' value={productData.product_name} onChange={handleChange }/>
                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-12 col-lg-6">
                                    <div className="form-group mb-4">
                                        <label htmlFor="exampleInputEmail1">Shops <span style={{color: '#7A0091'}}>*</span></label>
                                        <ShopSelector shops={shops} onShopSelectionChange={handleShopSelectionChange}/>
                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-12 col-lg-6">
                                    <div className="form-group mb-4">
                                        <label htmlFor="exampleInputEmail1">Product Category <span style={{color: '#7A0091'}}>*</span></label>
                                        <select name='product_category' value={productData.product_category} onChange={handleChange}>
                                            <option>--select category--</option>
                                            {categories?.message?.map((item) => 
                                              <option key={item.id} value={item.category_name}>{item.category_name}</option>
                                            )}
                                        </select>
                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-12 col-lg-3">
                                    <div className="form-group mb-4">
                                        <label htmlFor="exampleInputEmail1">Color <span style={{color: '#7A0091'}}>*</span></label>
                                        <input type="text" placeholder='Enter Color' name='color' value={productData.color} onChange={handleChange}/>
                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-12 col-lg-3">
                                    <div className="form-group mb-4">
                                        <label htmlFor="exampleInputEmail1">Unit <span style={{color: '#7A0091'}}>*</span></label>
                                        <input type="text" placeholder='Enter Unit' name='unit' value={productData.unit} onChange={handleChange}/>
                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-12 col-lg-6">
                                    <div className="form-group mb-4">
                                        <label htmlFor="exampleInputEmail1">Buying Price <span style={{color: '#7A0091'}}>*</span></label>
                                        <input type="text" placeholder='Enter Buying Price' name='total_buying_price' value={productData.total_buying_price} onChange={handleChange}/>
                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-12 col-lg-6">
                                    <div className="form-group mb-4">
                                        <label htmlFor="exampleInputEmail1">selling Price <span style={{color: '#7A0091'}}>*</span></label>
                                        <input type="text" placeholder='Enter Selling Price' name='total_selling_price' value={productData.total_selling_price} onChange={handleChange}/>
                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-12 col-lg-6">
                                    <div className="form-group mb-4">
                                        <label htmlFor="exampleInputEmail1">Supplier <span style={{color: '#7A0091'}}>*</span></label>
                                        <select name='supplier_id' value={productData.supplier_id} onChange={handleChange}>
                                            <option>--select supplier--</option>
                                            {supplier.map((item) =>
                                              <option key={item.supplier_id} value={item.supplier_id}>{item.supplier_name}</option> 
                                            )}
                                        </select>
                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-12 col-lg-6">
                                    <div className="form-group mb-4">
                                        <label htmlFor="exampleInputEmail1">Product Image <span style={{color: '#7A0091'}}>*</span></label>
                                        <input type="file" multiple placeholder='Enter value' onChange={handleFileChange}/>
                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-12 col-lg-6">
                                    <div className="form-group mb-4">
                                        <label htmlFor="exampleInputEmail1">Total Stock Value <span style={{color: '#7A0091'}}>*</span></label>
                                        <input type="text" placeholder='Enter Stock Value' name='total_stock_value' value={productData.total_stock_value} onChange={handleChange} readOnly/>
                                        {/* <small className="form-text text-muted">
                                            {hasInches 
                                                ? "Calculated from sum of (selling price × stock) for each inch"
                                                : "Calculated from total buying price × total product stock"}
                                        </small> */}
                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-12 col-lg-6">
                                    <div className="form-group mb-4">
                                        <label htmlFor="exampleInputEmail1">Total Product Stock <span style={{color: '#7A0091'}}>*</span></label>
                                        <input type="text" placeholder='Enter Product Stock' name='total_product_stock' value={productData.total_product_stock} onChange={handleChange} disabled={!isMainStockEditable}/>
                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-12 col-lg-12">
                                    <div className="form-group mb-4">
                                        <div className="d-flex justify-content-between mb-3">
                                            <div className='d-flex'>
                                                <div>
                                                <label htmlFor="exampleInputPassword1">click on checkbox to add Inches</label>

                                                </div>
                                                <div>
                                                <input
                                                    type="checkbox"
                                                    checked={hasInches}
                                                    onChange={toggleInches}
                                                    className="ml-5"
                                                />
                                                </div>
                                                
                                            </div>
                                            {hasInches && (
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
                                            )}
                                        </div>

                                        {hasInches && inputGroups.map((group, index) => (
                                            <div key={index} style={{ marginBottom: '20px' }} className="d-flex">
                                                <input
                                                    type="text"
                                                    value={group.inche || ''}
                                                    onChange={(e) => handleInchesChange(index, 'inche', e.target.value)}
                                                    placeholder="Inches"
                                                    className="mx-2"
                                                />
                                                <input
                                                    type="text"
                                                    value={group.buying_price || ''}
                                                    onChange={(e) => handleInchesChange(index, 'buying_price', e.target.value)}
                                                    placeholder="Buying Price"
                                                    className="mx-2"
                                                />
                                                <input
                                                    type="text"
                                                    value={group.selling_price || ''}
                                                    onChange={(e) => handleInchesChange(index, 'selling_price', e.target.value)}
                                                    placeholder="Selling Price"
                                                    className="mx-2"
                                                />
                                                <input
                                                    type="text"
                                                    value={group.stock || ''}
                                                    onChange={(e) => handleInchesChange(index, 'stock', e.target.value)}
                                                    placeholder="Stock"
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
                                        <textarea cols="30" rows="10" placeholder='Enter description' name='product_description' value={productData.product_description} onChange={handleChange}></textarea>
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


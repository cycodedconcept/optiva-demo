import React, {useState, useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getPurchase, createPurchase, updatePurchase } from '../features/purchaseSlice';
import { getProduct } from '../features/invoiceSlice';
import { getAllSuppliers } from '../features/supplierSlice';
import { Fil} from '../assets/images';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import Pagination from './support/Pagination';
import Swal from 'sweetalert2';



const Purchase = () => {
  const dispatch = useDispatch();
  let token = localStorage.getItem("token");
  const getId = localStorage.getItem("sid");
  const {error, loading, purchase, currentPage, per_page, total, total_pages} = useSelector((state) => state.purchase);
  const {products} = useSelector((state) => state.invoice);
  const {supplier} = useSelector((state) => state.supplier)
  const [ mod, setMod ] = useState(false);
  const [inch, setInch] = useState(false);
  const [pro, setPro] = useState('');
  const [sup, setSup] = useState('');
  const [qty, setQty] = useState('');
  const [ins, setIns] = useState('');
  const [showIn, setShowIn] = useState(null);
  const [showIn2, setShowIn2] = useState(null);
  const [upurchase, setUpurchase] = useState(false);
  const [pro2, setPro2] = useState('');
  const [sup2, setSup2] = useState('');
  const [qty2, setQty2] = useState('');
  const [ins2, setIns2] = useState('');
  const [inch2, setInch2] = useState(false);
  const [selectedPurchaseData, setSelectedPurchaseData] = useState(null);

  const productItem = (e) => {
    setPro(e.target.value)
    const selectedProduct = products.find((item) => item.id === parseInt(e.target.value));

    console.log(selectedProduct)

    if (selectedProduct && selectedProduct.inches && selectedProduct.inches.length > 0) {
        setShowIn(selectedProduct.inches)
        setInch(true)
    }
    else {
        setInch(false)
    }
  }

  useEffect(() => {
    if (token) {
        dispatch(getPurchase({token, shop_id: getId, page: currentPage, per_page: per_page}));
        dispatch(getAllSuppliers({token, id: getId}));
        dispatch(getProduct({token, shop_id: getId, page: 'All'}))
    }
  }, [dispatch, token, currentPage, per_page])

  const hideModal = () => {
    setMod(false);
    setUpurchase(false)
  }

  const createPurchaseItem = () => {
    setMod(true)
  }

  const handlePurchase = async (e) => {
    e.preventDefault()

    if (!pro || !sup || !qty) {
        Swal.fire({
            icon: "info",
            title: "creating purchase",
            text: 'All these fields are required!',
            confirmButtonColor: '#7A0091'
        })
        return;
    }

    try {
        Swal.fire({
            title: "Creating purchase...",
            text: "Please wait while we process your request.",
            allowOutsideClick: false,
            showConfirmButton: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });

        const data = {
            product_id: pro,
            product_quantity: qty,
            supplier: sup,
            inches: ins,
            shop_id: getId
        }

        const response = await dispatch(createPurchase({token, pData: data})).unwrap();

        if (response.message === "purchase recorded") {
            Swal.fire({
                icon: "success",
                title: "create purchase",
                text: `${response.message}`,
            });

            hideModal();
            dispatch(getPurchase({token, shop_id: getId, page: currentPage, per_page: per_page}));
        }
        else {
            Swal.fire({
                icon: "info",
                title: "creating purchase",
                text: `${response.message}`,
            });
        }
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Error Occurred",
            text: error.message || "Something went wrong while creating purchase. Please try again.",
        });
    }
  }

  const getUpmode = (iname) => {
    setUpurchase(true);
    console.log("Clicked Product Name:", iname);

    const getPur = localStorage.getItem("pur");
    if (!getPur) return;

    const purItem = JSON.parse(getPur);
    const selectedPurchase = purItem.find((item) => item.product_name === iname);

    if (selectedPurchase) {
        console.log("Selected Purchase:", selectedPurchase);
        
        // Store the selected purchase for later use in useEffect
        setSelectedPurchaseData(selectedPurchase);

        // Find the product and update the product ID
        const matchedProduct = products.find((p) => p.product_name === selectedPurchase.product_name);
        if (matchedProduct) {
            setPro2(matchedProduct.id);

            // Fetch and set available inches for the selected product
            if (matchedProduct.inches) {
                setShowIn2(matchedProduct.inches);
            } else {
                setShowIn2([]); // Reset if no inches are available
            }
        }

        // Find and update supplier
        const matchedSupplier = supplier.find((s) => s.supplier_name === selectedPurchase.supplier);
        setSup2(matchedSupplier ? matchedSupplier.supplier_id : "");

        setQty2(selectedPurchase.product_quantity || "");
        
        // We'll handle setting ins2 in the useEffect below
    } else {
        console.log("No matching purchase found");
    }
  };

    useEffect(() => {
        if (showIn2 && selectedPurchaseData) {
            const matchedInches = showIn2.find(item => item.inche === selectedPurchaseData.inches);
            if (matchedInches) {
                setIns2(matchedInches.inche);
            }
        }
    }, [showIn2, selectedPurchaseData]);

    const handleUpPurchase = (e) => {
        e.preventDefault();

        if (!pro || !sup || !qty) {
            Swal.fire({
                icon: "info",
                title: "updating purchase",
                text: 'All these fields are required!',
                confirmButtonColor: '#7A0091'
            })
            return;
        }

        try {
            Swal.fire({
                title: "Updating purchase...",
                text: "Please wait while we process your request.",
                allowOutsideClick: false,
                showConfirmButton: false,
                didOpen: () => {
                    Swal.showLoading();
                },
            });

            const data = {
                
            }
        } catch (error) {
            
        }
    }



  return (
    <>
      <div className="mt-5 mb-5 mt-lg-5 text-right">
        <button className='pro-btn' onClick={createPurchaseItem}><span style={{fontSize: '20px'}}>+</span> Add Purchase</button>
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
                            <th style={{width: '5%'}}><div className='d-flex justify-content-between'><p>S/N</p><div><img src={Fil} alt="" /></div></div></th>
                            <th style={{width: '25%'}}><div className='d-flex justify-content-between'><p>Product Name</p><div><img src={Fil} alt="" /></div></div></th>
                            <th style={{width: '15%'}}><div className='d-flex justify-content-between'><p>Quantity</p><div><img src={Fil} alt="" /></div></div></th>
                            <th style={{width: '10%'}}><div className='d-flex justify-content-between'><p>Inches</p><div><img src={Fil} alt="" /></div></div></th>
                            <th style={{width: '18%'}}><div className='d-flex justify-content-between'><p>Supplier</p><div><img src={Fil} alt="" /></div></div></th>
                            <th style={{width: '15%'}}><div className='d-flex justify-content-between'><p>Date</p><div><img src={Fil} alt="" /></div></div></th>
                            <th style={{width: '20%'}}><div className='d-flex justify-content-between'><p>Created By</p><div><img src={Fil} alt="" /></div></div></th>
                            <th style={{width: '5%'}}><div className='d-flex justify-content-between'><p>Actions</p><div><img src={Fil} alt="" /></div></div></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            purchase.data && purchase.data.length > 0 ? (
                                purchase.data.map((item, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{item.product_name}</td>
                                        <td>{item.product_quantity}</td>
                                        <td>{item.inches}</td>
                                        <td>{item.supplier}</td>
                                        <td>{item.date}</td>
                                        <td>{item.created_by}</td>
                                        <td>
                                          <FontAwesomeIcon icon={faEdit} style={{color: '#379042', fontSize: '16px', marginRight: '20px', backgroundColor: '#E6FEE8', padding: '5px'}} onClick={(e) => {getUpmode(item.product_name); e.stopPropagation()}} title='update purchase'/>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7">No purchase available</td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
            </div>
            <div className="sticky-pagination">
                <Pagination
                    currentPage={currentPage}
                    totalPages={total_pages}
                    perPage={per_page}
                    total={total}
                    onPageChange={(newPage) => {
                        if (newPage < 1 || newPage > total_pages) return; // Prevent invalid pages
                        dispatch(getPurchase({ token, shop_id: getId, page: newPage, per_page: per_page }));
                    }}
                    onPerPageChange={(newPerPage) => {
                        if (newPerPage < 1) return; // Prevent invalid per_page values
                        dispatch(getPurchase({ token, shop_id: getId, page: 1, per_page: newPerPage })); // Reset to first page
                    }}
                />
            </div>
        </div>
        </>
    )}

    {mod ? (
        <>
          <div className="modal-overlay">
            <div className="modal-content2">
               <div className="head-mode">
                  <h6 style={{color: '#7A0091'}}>Create Purchase</h6>
                  <button className="modal-close" onClick={hideModal}>&times;</button>
              </div>
              <div className="modal-body">
                <form onSubmit={handlePurchase}>
                    <div className="row">
                        <div className="col-sm-12 col-md-12 col-lg-6">
                            <div className="form-group mb-4">
                                <label htmlFor="exampleInputEmail1">Product Name <span style={{color: '#7A0091'}}>*</span></label>
                                <select value={pro} onChange={productItem}>
                                    <option>--select product--</option>
                                    {products.map((item) => 
                                        <option key={item.id} value={item.id}>{item.product_name}</option>
                                    )}
                                </select>
                           </div>
                        </div>
                        <div className="col-sm-12 col-md-12 col-lg-6">
                            <div className="form-group mb-4">
                                <label htmlFor="exampleInputEmail1">Supplier Name <span style={{color: '#7A0091'}}>*</span></label>
                                <select value={sup} onChange={(e) => setSup(e.target.value)}>
                                    <option>--select supplier--</option>
                                    {supplier.map((item) => 
                                        <option key={item.supplier_id} value={item.supplier_id}>{item.supplier_name}</option>
                                    )}
                                </select>
                           </div>
                        </div>
                        {inch ? (
                            <>
                                <div className="col-sm-12 col-md-12 col-lg-6">
                                    <div className="form-group mb-4">
                                        <label htmlFor="exampleInputEmail1">Product Inches <span style={{color: '#7A0091'}}>*</span></label>
                                        <select value={ins} onChange={(e) => setIns(e.target.value)}>
                                            <option>--select supplier--</option>
                                            {showIn.map((item, index) => 
                                                <option key={index} value={item.inche}>{item.inche}</option>
                                            )}
                                        </select>
                                    </div>
                                </div>
                            </>
                        ) : ('')}

                        <div className="col-sm-12 col-md-12 col-lg-6">
                            <div className="form-group mb-4">
                                <label htmlFor="exampleInputEmail1">Quantity <span style={{color: '#7A0091'}}>*</span></label>
                                <input type="text" placeholder='Enter quantity' value={qty} onChange={(e) => setQty(e.target.value)}/>
                            </div>
                        </div>
                    </div>

                        <div className="text-right">
                        <button className='in-btn p-2'>
                            {loading ? (
                                    <>
                                    <div className="spinner-border spinner-border-sm text-light" role="status">
                                        <span className="sr-only"></span>
                                    </div>
                                    <span>Creating Purchase... </span>
                                    </>
                                ) : (
                                    'Create Purchase'
                            )}
                        </button>
                    </div>
                </form>
              </div>
            </div>
          </div>
        </>
    ) : ('')}

    {upurchase ? (
        <>
          <div className="modal-overlay">
            <div className="modal-content2">
               <div className="head-mode">
                  <h6 style={{color: '#7A0091'}}>Update Purchase</h6>
                  <button className="modal-close" onClick={hideModal}>&times;</button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleUpPurchase}>
                    <div className="row">
                        <div className="col-sm-12 col-md-12 col-lg-6">
                            <div className="form-group mb-4">
                                <label htmlFor="exampleInputEmail1">Product Name <span style={{color: '#7A0091'}}>*</span></label>
                                <select value={pro2} onChange={(e) => setPro2(e.target.value)}>
                                    <option>--select product--</option>
                                    {products.map((item) => 
                                        <option key={item.id} value={item.id}>{item.product_name}</option>
                                    )}
                                </select>
                           </div>
                        </div>
                        <div className="col-sm-12 col-md-12 col-lg-6">
                            <div className="form-group mb-4">
                                <label htmlFor="exampleInputEmail1">Supplier Name <span style={{color: '#7A0091'}}>*</span></label>
                                <select value={sup2} onChange={(e) => setSup2(e.target.value)}>
                                    <option>--select supplier--</option>
                                    {supplier.map((item) => 
                                        <option key={item.supplier_id} value={item.supplier_id}>{item.supplier_name}</option>
                                    )}
                                </select>
                           </div>
                        </div>
                        <div className="col-sm-12 col-md-12 col-lg-6">
                            <div className="form-group mb-4">
                                <label htmlFor="exampleInputEmail1">Product Inches <span style={{color: '#7A0091'}}>*</span></label>
                                <select value={ins2} onChange={(e) => setIns2(e.target.value)}>
                                    <option>--select supplier--</option>
                                    {showIn2?.map((item, index) => 
                                        <option key={index} value={item.inche}>{item.inche}</option>
                                    )}
                                </select>
                            </div>
                        </div>

                        <div className="col-sm-12 col-md-12 col-lg-6">
                            <div className="form-group mb-4">
                                <label htmlFor="exampleInputEmail1">Quantity <span style={{color: '#7A0091'}}>*</span></label>
                                <input type="text" placeholder='Enter quantity' value={qty2} onChange={(e) => setQty2(e.target.value)}/>
                            </div>
                        </div>
                    </div>

                        <div className="text-right">
                        <button className='in-btn p-2'>
                            {loading ? (
                                    <>
                                    <div className="spinner-border spinner-border-sm text-light" role="status">
                                        <span className="sr-only"></span>
                                    </div>
                                    <span>Updating Purchase... </span>
                                    </>
                                ) : (
                                    'Update Purchase'
                            )}
                        </button>
                    </div>
                </form>
              </div>
            </div>
          </div>
        </>
    ): ('')}
      
    </>
  )
}

export default Purchase

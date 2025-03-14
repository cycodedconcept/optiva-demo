import React, {useState, useEffect, useRef} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCustomers, addCustomers } from '../features/customerSlice';
import { getProduct, createInvoice, getDiscount } from '../features/invoiceSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEyeSlash, faFilePdf, faPrint } from '@fortawesome/free-solid-svg-icons';
import { Plus, Minus, Search, Trash2 } from 'lucide-react';
import { Def, Inv } from '../assets/images';
import Swal from 'sweetalert2';
import { useReactToPrint } from "react-to-print";
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable'

const CreateInvoice = () => {
    const invoiceRef = useRef(null);
    function generateUniqueId() {
        const prefix = "HP";
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let result = prefix;
      
        for (let i = 0; i < 7; i++) {
          const randomIndex = Math.floor(Math.random() * characters.length);
          result += characters[randomIndex];
        }
      
        return result;
    }
     
  const uniqueIdRef = useRef(generateUniqueId());

  const [cmodal, setCmodal] = useState(false)  
  const {customers, error, loading } = useSelector((item) => item.customer);
  const {products, discountItem} = useSelector((item) => item.invoice);
  const [items, setItems] = useState([]);
  const [searchTerms, setSearchTerms] = useState({});
  const [spro, setSpro] = useState(true);

  const [invoiceNumber, setInvoiceNumber] = useState(uniqueIdRef.current);
  const [discount, setDiscount] = useState({ name: '', value: 0 });
  const [paymentMethod, setPaymentMethod] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [inDetails, setInDetails] = useState(false);
  const [ivDetails, setIvDetails] = useState(null);
  const [view, setView] = useState(true);
  const [shad, setShad] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCustomers = customers.filter((item) => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const dispatch = useDispatch();
  let token = localStorage.getItem("token");
  const getId = localStorage.getItem("sid");

  const [cData, setCdata] = useState({
    customer_name: '',
    customer_phone_number: '',
    customer_email: ''
  })
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCdata({
      ...cData,
      [name]: value,
    });
  }

  useEffect(() => {
    if (token) {
      dispatch(getCustomers({token}))
      dispatch(getProduct({token, shop_id: getId, page: 'All'}))
      dispatch(getDiscount({token}))
    }
  }, [dispatch, token])

  const hideModal = () => {
    setCmodal(false);
    setInDetails(false);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const customerData = {
      ...cData,
    };

    if (!customerData.customer_name || !customerData.customer_email || !customerData.customer_phone_number) {
      Swal.fire({
        icon: "info",
        title: "creating customer",
        text: 'All these fields are required!',
        confirmButtonColor: '#7A0091'
      })
      return;
    }
    Swal.fire({
      icon: "success",
      title: "Valid Input!",
      text: "customer is being created...",
      timer: 1500,
      showConfirmButton: false,
    });

    try {
      Swal.fire({
        title: "Creating Customer...",
        text: "Please wait while we process your request.",
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const response = await dispatch(addCustomers({token, cData: customerData})).unwrap();

      if (response.message === "Customer info  added") {
        Swal.fire({
          icon: "success",
          title: "creating Customer",
          text: `${response.message}`,
        });

        setCdata({
          customer_email: '',
          customer_phone_number: '',
          customer_name: ''
        });
        hideModal();
        dispatch(getCustomers({token}));

      }
      else {
        Swal.fire({
          icon: "info",
          title: "creating customer",
          text: `${response.message}`,
        });
      }
    } catch (error) {
      console.error("Customer creation failed:", error);

      Swal.fire({
        icon: "error",
        title: "Error Occurred",
        text: error.message || "Something went wrong while creating the customer. Please try again.",
      });
    }
  }

  const getFilteredProducts = (searchTerm) => {
    return Array.isArray(products) 
      ? products.filter(product => 
          product.product_name.toLowerCase().includes((searchTerm || '').toLowerCase())
        )
      : [];
    };

  const addNewItem = (e) => {
    e.preventDefault();
    setSpro(false);
    setItems([...items, {
      productId: '',
      sellingPrice: '',
      color: '',
      quantity: 1,
      inches: '',
      amount: '',
      stock: ''
    }]);
  };

  
  
  const getInitialPrice = (product) => {
    if (!product) return '0';
    
    if (product.inches && product.inches.length > 0) {
      return product.inches[0].selling_price;
    } else {
      const priceString = product.total_selling_price;
      if (priceString.includes('=')) {
        return priceString.split('=').pop().trim().replace('₦', '').replace(',', '');
      } else {
        return priceString.replace('₦', '').replace(',', '');
      }
    }
  };


const handleInchChange = (index, inchValue, product) => {
    const newItems = [...items];
    newItems[index].inches = inchValue;
    
    // Find the selected inch data
    if (product && product.inches && product.inches.length > 0) {
        const inchData = product.inches.find(inch => inch.inche === inchValue);
        
        if (inchData) {
            // Update price based on the selected inch
            newItems[index].sellingPrice = inchData.selling_price || getInitialPrice(product, inchValue);
            
            // Update color if available in the inch data
            if (inchData.color) {
                newItems[index].color = inchData.color;
            }
            
            // Update stock from inch data if available, otherwise use main stock
            if (inchData.stock !== undefined) {
                newItems[index].stock = inchData.stock;
            } else {
                newItems[index].stock = product.total_product_stock;
            }
            
            // Recalculate amount
            newItems[index].amount = (
                parseInt(newItems[index].sellingPrice || 0) * parseInt(newItems[index].quantity || 0)
            ).toString();
        }
    }
    
    setItems(newItems);
};

//   const updateItem = (index, field, value) => {
//     const newItems = [...items];
//     newItems[index][field] = value;

//     if (field === 'productId') {
//       const product = products.find(p => p.id === parseInt(value));
//       console.log(product)
//       if (product) {
//         const defaultPrice = getInitialPrice(product);
//         newItems[index].sellingPrice = defaultPrice;
//         newItems[index].color = product.color;
//         newItems[index].amount = (parseInt(defaultPrice) * newItems[index].quantity).toString();
//         newItems[index].inches = '';
//         newItems[index].stock = product.total_product_stock;

//         if (product.inches && product.inches.length > 0) {
//             const defaultInch = product.inches[0].inche;
//             newItems[index].inches = defaultInch;
//             newItems[index].color = product.inches[0].color || product.color;
//             handleInchChange(index, defaultInch, product);
//             return;
//         }
//       }
//     }

//     if (field === 'quantity') {
//       newItems[index].amount = (
//         parseInt(newItems[index].sellingPrice || 0) * parseInt(value || 0)
//       ).toString();
//     }

//     setItems(newItems);
//   };


const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;

    if (field === 'productId') {
      const product = products.find(p => p.id === parseInt(value));
      console.log(product);
      
      if (product) {
        const defaultPrice = getInitialPrice(product);
        newItems[index].sellingPrice = defaultPrice;
        newItems[index].color = product.color;
        newItems[index].amount = (parseInt(defaultPrice) * newItems[index].quantity).toString();
        
        // Default stock is the main product stock
        newItems[index].stock = product.total_product_stock;

        // If the product has inches data
        if (product.inches && product.inches.length > 0) {
            const defaultInch = product.inches[0].inche;
            newItems[index].inches = defaultInch;
            newItems[index].color = product.inches[0].color || product.color;
            
            // Get stock from inches if available
            const inchData = product.inches.find(inch => inch.inche === defaultInch);
            if (inchData && inchData.stock !== undefined) {
                newItems[index].stock = inchData.stock;
            }
            
            handleInchChange(index, defaultInch, product);
            return;
        }
      }
    }

    if (field === 'quantity') {
      newItems[index].amount = (
        parseInt(newItems[index].sellingPrice || 0) * parseInt(value || 0)
      ).toString();
    }

    setItems(newItems);
};


  const handleSearch = (index, searchTerm) => {
    setSearchTerms(prev => ({
      ...prev,
      [index]: searchTerm
    }));
  };

  const removeItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    
    const newSearchTerms = { ...searchTerms };
    delete newSearchTerms[index];
    setSearchTerms(newSearchTerms);

    if (newItems.length === 0) {
        setSpro(true);
    }
};

const calculateSubTotal = () => {
    return items.reduce((sum, item) => sum + (parseInt(item.amount) || 0), 0);
};

const handleDiscountChange = (e) => {
    const selectedValue = e.target.value;
    const selectedDiscount = discountItem.find(item => item.discount_value.toString() === selectedValue);
    
    setDiscount({
        name: selectedDiscount ? selectedDiscount.discount_name : '',
        value: selectedDiscount ? parseFloat(selectedDiscount.discount_value) : 0
    });
};

const calculateTotal = () => {
    const subTotal = calculateSubTotal();
    const discountAmount = subTotal * discount.value;
    return subTotal - discountAmount;
};

const handleInvoice = async (e) => {
    e.preventDefault();
    const getId = localStorage.getItem("sid");

    if (!paymentMethod || !customerId || items.length === 0) {
        return Swal.fire({
            icon: "warning",
            title: "All fields are required",
            text: "You need to log in before creating invoice.",
        });
    }

    const products_ordered_array = items.map(item => {
        const product = products.find(p => p.id === parseInt(item.productId));
        return {
            product_id: item.productId,
            product_name: product?.product_name || '',
            product_price: item.sellingPrice,
            quantity: item.quantity.toString(),
            inches: item.inches || '',
            color: item.color || ''
        };
    });

    Swal.fire({
        icon: "success",
        title: "Valid Input!",
        text: "Invoice is being created...",
        timer: 1500,
        showConfirmButton: false,
    });

    try {
        Swal.fire({
            title: "Creating Invoice...",
            text: "Please wait while we process your request.",
            allowOutsideClick: false,
            showConfirmButton: false,
            didOpen: () => {
              Swal.showLoading();
            },
        });

        const data = {
            invoice_number: invoiceNumber,
            payment_method: paymentMethod,
            total_amount: calculateTotal().toString(),
            customer_id: customerId,
            discount_name: discount.name,
            shop_id: getId,
            products_ordered_array,
        };

        const response = await dispatch(createInvoice({token, invoiceData: data})).unwrap();

        if (response.hasOwnProperty("date")) {
            Swal.fire({
                icon: "success",
                title: "creating invoice",
                text: 'Invoice Created',
            });

            setItems([]);
            setSearchTerms({});
            setPaymentMethod('');
            setCustomerId('');
            setDiscount({ name: '', value: 0 });
            setSpro(true);
            setInvoiceNumber(uniqueIdRef.current);
            setView(false);
            dlinvoice();

        }
        else {
            Swal.fire({
                icon: "info",
                title: "Creating Invoice",
                text: Array.isArray(response) ? response.map(item => item.message).join(", ") : response.message,
            });
        }        
    }
    catch (error) {
        console.error("Invoice Creation Failed:", error);
    
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
    

}

const previewInvoince = (e) => {
    e.preventDefault()
    setInDetails(true)
    const getDetails = localStorage.getItem("info");
    setIvDetails(JSON.parse(getDetails));
}

const dlinvoice = () => {
    const getDetails = localStorage.getItem("info");
    setShad(JSON.parse(getDetails));
}

const handlePrint = useReactToPrint({
    contentRef: invoiceRef,
    onAfterPrint: () => console.log("Invoice printed successfully!"),
    documentTitle: shad ? `Invoice-${shad.invoice_number}` : 'Invoice',
    
});


const handleDownload = async () => {
    const metaViewport = document.querySelector('meta[name="viewport"]');
    
    // Backup the original content
    const originalContent = metaViewport?.getAttribute('content');
    
    // Update the content to disable responsiveness
    if (metaViewport) {
        metaViewport.setAttribute('content', 'width=1000');
    }
    
    if (!invoiceRef.current) return;
    
    // Show loading alert
    Swal.fire({
        title: 'Generating PDF',
        html: 'Please wait while we prepare your invoice...',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });
    
    try {
        // Detect iOS
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        
        // Get device pixel ratio (important for iOS)
        const dpr = window.devicePixelRatio || 1;
        
        // Calculate optimal dimensions (A4 proportions)
        const printWidth = 210; // A4 width in mm
        const invoiceElement = invoiceRef.current;
        const originalWidth = invoiceElement.offsetWidth;
        const originalHeight = invoiceElement.offsetHeight;
        const aspectRatio = originalHeight / originalWidth;
        const printHeight = printWidth * aspectRatio;
        
        // Prepare the element for iOS
        if (isIOS) {
            // Force any custom fonts to load completely
            document.fonts && document.fonts.ready && await document.fonts.ready;
            
            // Add a small delay for iOS to ensure rendering is complete
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        // Create canvas with settings optimized for both Android and iOS
        const canvas = await html2canvas(invoiceElement, {
            scale: isIOS ? 2 : 3, // Lower scale for iOS to prevent memory issues
            useCORS: true,
            logging: false,
            allowTaint: true,
            backgroundColor: '#ffffff',
            letterRendering: isIOS,
            width: originalWidth,
            height: originalHeight,
            // Improve text rendering
            onclone: (clonedDoc) => {
                // Check if invoiceElement has an ID first
                if (isIOS && invoiceElement) {
                    // Instead of trying to query by ID, we can use a different approach
                    // to enhance text rendering in the cloned document
                    const textElements = clonedDoc.querySelectorAll('p, span, h1, h2, h3, h4, h5, td, th');
                    textElements.forEach(el => {
                        el.style.webkitFontSmoothing = 'antialiased';
                        el.style.textRendering = 'optimizeLegibility';
                    });
                }
            },
        });
        
        const imgData = canvas.toDataURL('image/jpeg', isIOS ? 0.8 : 0.95); // Lower quality for iOS to reduce file size
        
        const pdf = new jsPDF({
            orientation: printHeight > printWidth ? 'portrait' : 'landscape',
            unit: 'mm',
            format: 'a4',
        });
        
        // Add image to PDF with proper scaling
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        
        // For iOS, use a slightly different approach
        if (isIOS) {
            // Calculate margins to center content if needed
            const margin = 0; // or calculate based on content
            pdf.addImage(imgData, 'JPEG', margin, margin, pdfWidth - (margin * 2), pdfHeight - (margin * 2));
        } else {
            pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
        }
        
        // Ensure invoice number is safe for filenames
        const safeInvoiceNumber = shad.invoice_number.toString().replace(/[^\w-]/g, '');
        
        // Save the PDF with a filename that works on iOS
        pdf.save(`Invoice-${safeInvoiceNumber}.pdf`);
        
        // Success message
        Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Your invoice has been downloaded successfully.',
            confirmButtonColor: '#7A0091'
        });
    } catch (error) {
        console.error("Error generating PDF:", error);
        
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Failed to download the invoice. Please try again.',
            confirmButtonColor: '#7A0091'
        });
    } finally {
        // Always reset the viewport, using a timeout to ensure rendering is complete
        setTimeout(() => {
            if (metaViewport) {
                metaViewport.setAttribute('content', originalContent || 'width=device-width, initial-scale=1.0');
            }
        }, 1000);
    }
};
  

  return (
    <>

    {view ? (
        <>
           <div className="mt-lg-5 mt-3 in-bg py-5">
            <form onSubmit={handleInvoice}>
                <div className="row">
                    <div className="col-sm-12 col-md-12 col-lg-6">
                        <div className="form-group mb-4">
                            <label htmlFor="exampleInputEmail1">Invoice Number <span style={{color: '#7A0091'}}>*</span></label>
                            <input type="text" placeholder='Enter Invoice Number' value={invoiceNumber} readOnly/>
                        </div>
                    </div>
                    <div className="col-sm-12 col-md-12 col-lg-6">
                        <div className="form-group mb-4">
                            <label htmlFor="exampleInputEmail1">Payment Method <span style={{color: '#7A0091'}}>*</span></label>
                            <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                                <option>--select payment type--</option>
                                <option value="Cash">Cash</option>
                                <option value="Transfer">Transfer</option>
                            </select>
                        </div>
                    </div>
                    <div className="col-sm-12 col-md-12 col-lg-6">
                        <div className="form-group">
                          <label htmlFor="exampleInputEmail1">Search Customer <span style={{color: '#7A0091'}}>*</span></label>
                          <input type="text" placeholder='Search customers' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
                        </div>
                        <div className="form-group mb-4">
                            <label htmlFor="exampleInputEmail1">Select Customer <span style={{color: '#7A0091'}}>*</span></label>
                            <select value={customerId} onChange={(e) => setCustomerId(e.target.value)}>
                                <option>--select customer--</option>
                                {filteredCustomers.map((item) =>
                                  <option key={item.id} value={item.id}>{item.name}</option> 
                                )}
                            </select>
                        </div>
                    </div>
                    <div className="col-sm-12 col-md-12 col-lg-3 ">
                        <button className='btn add-btn' onClick={(e) => {e.preventDefault();
                            setCmodal(true)
                            }}>+ Add New</button>
                    </div>
                </div>
                <div className="py-4">
                    <div className="d-none d-lg-flex p-3 justify-content-between" style={{background: '#FCF2FF'}}>
                        <div><p style={{color: '#2E2F41'}}><b>Product Name</b></p></div>
                        <div><p style={{color: '#2E2F41'}}><b>Selling Price</b></p></div>
                        <div><p style={{color: '#2E2F41'}}><b>Color</b></p></div>
                        <div><p style={{color: '#2E2F41'}}><b>Quantity</b></p></div>
                        <div><p style={{color: '#2E2F41'}}><b>Inches</b></p></div>
                        <div><p style={{color: '#2E2F41'}}><b>Amount</b></p></div>
                    </div>

                    <div style={{background: '#FCF2FF'}} className='text-center d-md-none p-2'>
                        <p className='m-0'><b>Add product section below</b></p>
                    </div>

                    <div style={{background: '#FEFBFF'}} className='py-5'>
                        {spro ? (
                            <>
                                <div className="p-sec text-center">
                                    <img src={Def} alt="" />
                                    <p>You have no product selected for invoice<br></br> creation</p>
                                </div>
                            </>
                        ) : (
                        <>
                          {items.map((item, index) => {
                            const filteredProducts = getFilteredProducts(searchTerms[index]);
                            const selectedProduct = item.productId ? products.find(p => p.id === parseInt(item.productId)) : null;
                            const hasInches = selectedProduct?.inches.length > 0;
                            
                            return (
                            <div key={index} className="card-in mb-4 py-3">
                                <div className="row">
                                    <div className="col-sm-12 col-md-12 col-lg-2">
                                        <div className="input-group mb-2">
                                            <span className="input-group-text">
                                                <Search size={20} />
                                            </span>
                                            <input
                                                type="text"
                                                placeholder="Search products..."
                                                className="form-control"
                                                value={searchTerms[index] || ''}
                                                onChange={(e) => handleSearch(index, e.target.value)}
                                            />
                                        </div>
                                        <select
                                            value={item.productId}
                                            onChange={(e) => updateItem(index, 'productId', e.target.value)}
                                            className="form-select"
                                        >
                                            <option value="">Select a product</option>
                                            {filteredProducts.map(product => (
                                                <option key={product.id} value={product.id}>
                                                    {product.product_name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="col-md-2">
                                        <label className="form-label">Selling Price</label>
                                        <input
                                            type="number"
                                            value={item.sellingPrice}
                                            readOnly
                                        />
                                    </div>
                                    

                                    {item.productId && !hasInches && (
                                        <div className="col-md-2">
                                            <label>Color</label>
                                            <input
                                                type="text"
                                                className=""
                                                value={item.color || ''}
                                                readOnly
                                            />
                                        </div>
                                    )}

                                    {/* Display color from inches data if available */}
                                    {hasInches && item.inches && (
                                        <div className="col-md-2">
                                            <label>Color</label>
                                            <input
                                                type="text"
                                                className=""
                                                value={selectedProduct.inches.find(i => i.inche === item.inches)?.color || ''}
                                                readOnly
                                            />
                                        </div>
                                    )}

                                    <div className="col-md-2">
                                        <label className="form-label">Quantity:<span className='ml-3'>{item.stock}</span></label>
                                        <div className="input-group">
                                            <button
                                                onClick={() => updateItem(index, 'quantity', Math.max(1, item.quantity - 1))}
                                                className="btn qb bb"
                                                type="button"
                                            >
                                                <Minus size={16} />
                                            </button>
                                            <input
                                                type="number"
                                                value={item.quantity}
                                                onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                                                min="1"
                                                style={{ width: '70px' }}
                                                className='qb-input'
                                            />
                                            <button
                                                onClick={() => updateItem(index, 'quantity', item.quantity + 1)}
                                                className="btn qb cc"
                                                type="button"
                                            >
                                                <Plus size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    {hasInches && (
                                        <div className="col-md-2">
                                            <label className="form-label">Inches</label>
                                            <select
                                                value={item.inches}
                                                onChange={(e) => {
                                                    const product = products.find(p => p.id === parseInt(item.productId));
                                                    handleInchChange(index, e.target.value, product);
                                                }}
                                                className="form-select"
                                            >
                                                <option value="">Select inches</option>
                                                {selectedProduct.inches.map(inch => (
                                                    <option key={inch.inche} value={inch.inche}>
                                                        {inch.inche}"
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}

                                    <div className="col-md-2 d-flex">
                                        <div className="flex-grow-1">
                                            <label className="form-label">Amount</label>
                                            <input
                                                type="number"
                                                value={item.amount}
                                                readOnly
                                            />
                                        </div>
                                        <button
                                            onClick={() => removeItem(index)}
                                            className="btn p-1 align-self-center ms-2"
                                            type="button"
                                            style={{ 
                                                minWidth: 'auto',
                                                backgroundColor: 'transparent',
                                                border: 'none'
                                            }}
                                        >
                                            <Trash2 size={18} className="text-danger" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            );
                        })};
                        </>
                        )}
                    </div>

                    <button 
                        onClick={addNewItem}
                        className="btn add-btn ml-3"
                    >
                        + Add Item
                    </button>
                </div>

                <div className="row mt-5 p-3">
                    <div className="col-sm-12 col-md-12 col-lg-6"></div>
                    <div className="col-sm-12 col-md-12 offset-lg-2 col-lg-4">
                        <div className="total-section text-right">
                            <div className='d-flex justify-content-between'>
                                <p>Sub Total:</p>
                                <p><b>₦{calculateSubTotal().toLocaleString()}</b></p>
                            </div>
                            <div className='d-flex justify-content-between'>
                                <p className='mt-3'>Add Discount (%):</p>
                                <div className="form-group">

                                <select 
                                    value={discount.value} 
                                    onChange={handleDiscountChange}
                                    className="form-control"
                                >
                                    <option value="">--select discount--</option>
                                    {discountItem.map((item, index) => 
                                        <option 
                                            key={index} 
                                            value={item.discount_value} 
                                            disabled={item.status === "inactive"}
                                        >
                                            {item.discount_name}
                                        </option>
                                    )}
                                </select>
                                </div>
                            </div>
                            <div className='d-flex justify-content-between'>
                                <p>Total:</p>
                                <p><b>₦{calculateTotal().toLocaleString()}</b></p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-right">
                    <button className='btn' onClick={previewInvoince}><FontAwesomeIcon icon={faEyeSlash} style={{color: '#7A0091', backgroundColor: '#F1EDF2', padding: '18px', marginTop: '10px'}}/></button>
                    <button className='in-btn'>
                        {loading ? (
                                <>
                                <div className="spinner-border spinner-border-sm text-light" role="status">
                                    <span className="sr-only"></span>
                                </div>
                                <span>Creating Invoice... </span>
                                </>
                            ) : (
                                'Save and Continue'
                        )}
                    </button>
                </div>
            </form>
           </div>

            {cmodal ? (
                <>
                    <div className="modal-overlay">
                        <div className="modal-content2">
                        <div className="head-mode">
                            <h6 style={{color: '#7A0091'}}>Add Customer Info</h6>
                            <button className="modal-close" onClick={hideModal}>&times;</button>
                        </div>
                        <div className="modal-body">
                            <form className='mt-5' onSubmit={handleSubmit}>
                            <div className="form-group mb-3">
                                <label htmlFor="exampleInputEmail1" className='mb-2'>Customer Name <span style={{color: '#ED4343'}}>*</span></label>
                                <input type="text" className=" lo-input" name='customer_name' value={cData.customer_name} onChange={handleChange}/>
                            </div>
                            <div className="form-group mb-3">
                                <label htmlFor="exampleInputEmail1" className='mb-2'>Email <span style={{color: '#ED4343'}}>*</span></label>
                                <input type="email" className="lo-input" name='customer_email' value={cData.customer_email} onChange={handleChange}/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="exampleInputPassword1" className='mb-2'>Phone Number <span style={{color: '#ED4343'}}>*</span></label>
                                <input type="text" className="lo-input" name='customer_phone_number' value={cData.customer_phone_number} onChange={handleChange}/>
                            </div>
                            <div className="text-right">
                                <button className='d-btn mr-2' onClick={hideModal}>Discard</button>
                                <button type="submit" className='in-btn'>
                                {loading ? (
                                    <>
                                    <div className="spinner-border spinner-border-sm text-light" role="status">
                                        <span className="sr-only"></span>
                                    </div>
                                    <span>Adding Info... </span>
                                    </>
                                ) : (
                                    'Add Info'
                                )}
                                </button>
                            </div>
                            </form>
                        </div>
                        </div>
                    </div>
                </>
            ) : ('')}

            {inDetails ? (
                <>
                <div className="modal-overlay">
                    <div className="modal-content2">
                        <div className="head-mode">
                            <h6 style={{color: '#7A0091'}}>Preview Invoice</h6>
                            <button className="modal-close" onClick={hideModal}>&times;</button>
                        </div>
                        <div className="modal-body">
                            {ivDetails ? (
                                <>
                                <div style={{background: '#fff'}} className='p-4'>
                                        <div className="top-section d-lg-flex d-block justify-content-between">
                                        <div>
                                            <img src={Inv} alt="img" className='mb-3'/>
                                            <p className='m-0 p-0' style={{color: '#4C3B4F', fontWeight: '800'}}>Invoice To</p>
                                            <h5 style={{color: '#271F29', fontWeight: '900'}} className='m-0 p-0'>{ivDetails.customer_info ? ivDetails.customer_info.name : "N/A"}</h5>
                                            <p style={{color: '#95799B'}}>Professional in hair making business</p>
                                        </div>
                                        <div className='text-right'>
                                            <h4 style={{color: '#7A0091', fontWeight: '900'}}>INVOICE</h4>
                                            <p style={{color: '#4C3B4F'}} className='m-0 p-0'>Payment Status</p>
                                            <div className='text-right mb-5'>
                                                <button style={{fontSize: '12px', width: '70px'}} className={ivDetails.payment_status}>{ivDetails.payment_status}</button>
                                            </div>

                                            <div className="d-flex">
                                                <small className='d-block mr-3' style={{color: '#95799B'}}>Invoice No: </small>
                                                <small style={{color: '#271F29'}}>{ivDetails.invoice_number}</small>
                                            </div>
                                            <div className="d-flex">
                                                <small className='d-block mr-3' style={{color: '#95799B'}}>Issued Date: </small>
                                                <small style={{color: '#271F29'}}>{ivDetails.date}</small>
                                            </div>
                                            <div className="d-flex">
                                                <small className='d-block mr-3' style={{color: '#95799B'}}>Date Due: </small>
                                                <small style={{color: '#271F29'}}>{ivDetails.date}</small>
                                            </div>
                                        </div>
                                        </div>
                                        <hr />
                                        <div className="d-flex justify-content-between">
                                            <div>
                                                <small className='d-block' style={{color: '#4C3B4F'}}>Contact person</small>
                                                <div className="d-flex">
                                                    <small className='d-block mr-3' style={{color: '#95799B'}}>Phone No: </small>
                                                    <small style={{color: '#271F29'}}>{ivDetails.customer_info ? ivDetails.customer_info.phone_number : "N/A"}</small>
                                                    </div>
                                                    <div className="d-flex">
                                                    <small className='d-block mr-3' style={{color: '#95799B'}}>Email: </small>
                                                    <small style={{color: '#271F29'}}>{ivDetails.customer_info ? ivDetails.customer_info.email : "N/A"}</small>
                                                    </div>
                                                    <div className="d-flex">
                                                    <small className='d-block mr-3' style={{color: '#95799B'}}>Payment Method: </small>
                                                    <small style={{color: '#271F29'}}>{ivDetails.payment_method}</small>
                                                </div>
                                            </div>
                                            <div>
                                                <small className='d-block' style={{color: '#4C3B4F'}}>Total Amount</small> 
                                                <h5 style={{color: '#7A0091', fontWeight: '900'}}>₦{Number(ivDetails.total_amount).toLocaleString()}</h5>
                                                <small className='d-block' style={{color: '#4C3B4F'}}>Discount</small> 
                                                <small style={{color: '#7A0091', fontWeight: '900'}}>{ivDetails.discount_name}</small>
                                            </div>
                                        </div>
                                        <hr />
                                        <div className="table-content">
                                            <div className="table-container">
                                                <table className="w-100 bin">
                                                    <thead className='th-d'>
                                                    <tr className='m-0'>
                                                        <th className="p-2 text-light w-25">Sr. No</th>
                                                        <th className="p-2 text-light w-50">Product Name </th>
                                                        <th className="p-2 text-light">Price</th>
                                                        <th className="p-2 text-light">Quantity</th>
                                                        <th className="p-2 text-light">Inches</th>
                                                        <th className="p-2 text-light">Color</th>
                                                        <th className="p-2 text-light w-25">Amount</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {ivDetails.products_ordered.map((product, index) => (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td>{product.product_name}</td>
                                                            <td>₦{Number(product.product_price).toLocaleString()}</td>
                                                            <td>{product.quantity}</td>
                                                            <td>{product.inches}</td>
                                                            <td>{product.color}</td>
                                                            <td>₦{product.product_price * product.quantity}</td>
                                                        </tr>
                                                    ))}
                                                    </tbody>
                                                    <tfoot>
                                                    <tr className="text-right">
                                                        <td colSpan="5"></td>
                                                        <td className="p-2 font-semibold">Subtotal:</td>
                                                        <td className="p-2 font-semibold">₦{Number(ivDetails.total_amount).toLocaleString()}</td>
                                                    </tr>
                                                    <tr className="text-right">
                                                        <td colSpan="5"></td>
                                                        <td className="p-2 font-semibold w-50">Total:</td>
                                                        <td className="p-2 font-semibold">₦{Number(ivDetails.total_amount).toLocaleString()}</td>
                                                    </tr>
                                                    </tfoot>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </>
                                ) : (
                                <p>Loading Invoice...</p>
                            )}
                        </div>
                    </div>
                </div>
                </>
            ) : ('')}
        </>
    ) : (
        <>
            <div className="d-flex justify-content-end mt-5">
                <div className='mb-3 mb-lg-0'>
                <button className='btn ml-lg-3 ml-0 no-print' style={{background: '#7A0091', color: '#F8F6F8'}} onClick={handleDownload}><FontAwesomeIcon icon={faFilePdf} className='mr-2'/>Download as Pdf</button>
                </div>
                <div className="mb-4">
                    <button className='btn mr-lg-3 mr-0' style={{background: '#fff', color: '#7A0091'}} onClick={() => setView(true)}>Back</button>
                </div>
                <div>
                    <button 
                        className='btn px-3 no-print' 
                        style={{background: '#7A0091', color: '#F8F6F8'}}
                        onClick={handlePrint}
                    >
                        <FontAwesomeIcon icon={faPrint} className='mr-4'/>
                        Print
                    </button>
                </div>
            </div>

            {shad ? (
                <>
                    <div ref={invoiceRef} style={{background: '#fff'}} className='p-4'>
                        <div className="top-section d-lg-flex d-block justify-content-between">
                        <div>
                            <img src={Inv} alt="img" className='mb-3'/>
                            <p className='m-0 p-0' style={{color: '#4C3B4F', fontWeight: '800'}}>Invoice To</p>
                            <h5 style={{color: '#271F29', fontWeight: '900'}} className='m-0 p-0'>{shad.customer_info ? shad.customer_info.email : "N/A"}</h5>
                            <p style={{color: '#95799B'}}>Professional in hair making business</p>
                        </div>
                        <div className='text-right'>
                            <h4 style={{color: '#7A0091', fontWeight: '900'}}>INVOICE</h4>
                            <p style={{color: '#4C3B4F'}} className='m-0 p-0'>Payment Status</p>
                            <div className='text-right mb-5'>
                                <button style={{fontSize: '12px', width: '70px'}} className={shad.payment_status}>{shad.payment_status}</button>
                            </div>

                            <div className="d-flex">
                                <small className='d-block mr-3' style={{color: '#95799B'}}>Invoice No: </small>
                                <small style={{color: '#271F29'}}>{shad.invoice_number}</small>
                            </div>
                            <div className="d-flex">
                                <small className='d-block mr-3' style={{color: '#95799B'}}>Issued Date: </small>
                                <small style={{color: '#271F29'}}>{shad.date}</small>
                            </div>
                            <div className="d-flex">
                                <small className='d-block mr-3' style={{color: '#95799B'}}>Date Due: </small>
                                <small style={{color: '#271F29'}}>{shad.date}</small>
                            </div>
                        </div>
                        </div>
                        <hr />
                        <div className="d-flex justify-content-between">
                            <div>
                                <small className='d-block' style={{color: '#4C3B4F'}}>Contact person</small>
                                <div className="d-flex">
                                    <small className='d-block mr-3' style={{color: '#95799B'}}>Phone No: </small>
                                    <small style={{color: '#271F29'}}>{shad.customer_info ? shad.customer_info.phone_number : "N/A"}</small>
                                    </div>
                                    <div className="d-flex">
                                    <small className='d-block mr-3' style={{color: '#95799B'}}>Email: </small>
                                    <small style={{color: '#271F29'}}>{shad.customer_info ? shad.customer_info.email : "N/A"}</small>
                                    </div>
                                    <div className="d-flex">
                                    <small className='d-block mr-3' style={{color: '#95799B'}}>Payment Method: </small>
                                    <small style={{color: '#271F29'}}>{shad.payment_method}</small>
                                </div>
                            </div>
                            <div>
                                <small className='d-block' style={{color: '#4C3B4F'}}>Total Amount</small> 
                                <h5 style={{color: '#7A0091', fontWeight: '900'}}>₦{Number(shad.total_amount).toLocaleString()}</h5>
                                <small className='d-block' style={{color: '#4C3B4F'}}>Discount</small> 
                                <small style={{color: '#7A0091', fontWeight: '900'}}>{shad.discount_name}</small>
                            </div>
                        </div>
                        <hr />
                        <div className="table-content">
                            <div className="table-container">
                                <table className="w-100 bin">
                                    <thead className='th-d'>
                                    <tr className='m-0'>
                                        <th className="p-2 text-light w-25">Sr. No</th>
                                        <th className="p-2 text-light w-50">Product Name </th>
                                        <th className="p-2 text-light">Price</th>
                                        <th className="p-2 text-light">Quantity</th>
                                        <th className="p-2 text-light">Inches</th>
                                        <th className="p-2 text-light">Color</th>
                                        <th className="p-2 text-light w-25">Amount</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {shad.products_ordered.map((product, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{product.product_name}</td>
                                            <td>₦{Number(product.product_price).toLocaleString()}</td>
                                            <td>{product.quantity}</td>
                                            <td>{product.inches}</td>
                                            <td>{product.color}</td>
                                            <td>₦{product.product_price * product.quantity}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                    <tfoot>
                                    <tr className="text-right">
                                        <td colSpan="5"></td>
                                        <td className="p-2 font-semibold">Subtotal:</td>
                                        <td className="p-2 font-semibold">₦{Number(shad.total_amount).toLocaleString()}</td>
                                    </tr>
                                    <tr className="text-right">
                                        <td colSpan="5"></td>
                                        <td className="p-2 font-semibold w-50">Total:</td>
                                        <td className="p-2 font-semibold">₦{Number(shad.total_amount).toLocaleString()}</td>
                                    </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                    </div>
                </>
                ) : (
                <p>Loading Invoice...</p>
            )}
        </>
    )}
    </>
  )
}

export default CreateInvoice
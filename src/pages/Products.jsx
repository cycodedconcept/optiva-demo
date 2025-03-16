import React, { useState, useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getProduct, createProduct, updateProduct, deleteProduct, searchProduct, clearSearch } from '../features/productSlice';
import { getAllSuppliers } from '../features/supplierSlice';
import { getCategories } from '../features/categorySlice';
import { getShop } from '../features/userSlice';
import ShopSelector from './support/ShopSelector';
import { Fil, Thmb} from '../assets/images'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';
import Pagination from './support/Pagination';
import Swal from 'sweetalert2';
import { Carousel } from 'react-bootstrap';
import { debounce }  from 'lodash';



const Products = () => {
    const dispatch = useDispatch();
    const { products, error, isSearching, loading, currentPage, per_page, total, total_pages, search } = useSelector((state) => state.product);
    const { supplier } = useSelector((state) => state.supplier);
    const { categories } = useSelector((state) => state.category);
    const { shops } = useSelector((state) => state.user);

    let token = localStorage.getItem("token");
    const getId = localStorage.getItem("sid");
    const [productDetails, setProductDetails] = useState(null);
    const [vm, setVm] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [fieldsDisabled, setFieldsDisabled] = useState(false);
    const [fieldsDisabled2, setFieldsDisabled2] = useState(false);


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

    const [upProductData, setUpProductData] = useState({
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
    const [hasInches2, setHasInches2] = useState(false);

    const [isMainStockEditable, setIsMainStockEditable] = useState(true);
    const [isMainStockEditable2, setIsMainStockEditable2] = useState(true);


    

    const hideModal = () => {
        setModalVisible(false);
        setUpModal(false);
        setVm(false)
        setHasInches(false);
        setHasInches2(false);
        setProductData({
            product_name: '',
            product_category: '',
            color: '',
            unit: '',
            total_buying_price: '',
            total_selling_price: '',
            supplier_id: '',
            total_stock_value: '',
            total_product_stock: '',
            product_description: ''
          });
    }

    const sModal = () => {
        setModalVisible(true)
    }
    const dmodal = () => {
        setUpModal(true)
    }

    const [inputGroups, setInputGroups] = useState([
        { inche: '', buying_price: '', selling_price: '', color: '', stock: '', total: '' },
    ]);

    const [inputGroups2, setInputGroups2] = useState([
        { inche: '', buying_price: '', selling_price: '', color: '', stock: '', total: '' },
    ]);

    const images = productDetails?.images || [];
    const [selectedImage, setSelectedImage] = useState(Thmb);

    useEffect(() => {
        if (images.length > 0) {
            setSelectedImage(images[0].filename);
        } else {
            setSelectedImage(Thmb);
        }
    }, [productDetails]);;

    // useEffect(() => {
    //     const hasNonZeroStock = inputGroups.some((inch) => Number(inch.stock) > 0);
    //     setIsMainStockEditable(!hasNonZeroStock);
        
    // }, [inputGroups]);

    // useEffect(() => {
    //     const hasNonZeroStock2 = inputGroups2.some((inch) => Number(inch.stock) > 0);
    //     setIsMainStockEditable2(!hasNonZeroStock2);
        
    // }, [inputGroups2]);
    
    const handleAddInputGroup = (e) => {
        e.preventDefault();
        setInputGroups([...inputGroups, { inche: '', buying_price: '', selling_price: '', color: '', stock: '' }]);
    };

    const handleAddInputGroup2 = (e) => {
        e.preventDefault();
        setInputGroups2([...inputGroups2, { inche: '', buying_price: '', selling_price: '', color: '', stock: '' }]);
    };
      

    // for create product
    const handleShopSelectionChange = (selectedShops) => {
        setProductData((prevData) => ({
          ...prevData,
          shop_id: selectedShops,
        }));
        console.log("Selected Shops:", selectedShops);
    };

    // for update product
    const handleShopSelectionChange2 = (selectedShops) => {
        setUpProductData((prevData) => ({
          ...prevData,
          shop_id: selectedShops,
        }));
        console.log("Selected Shops:", selectedShops);
    };

    
    // for create product
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

    // for update product
    const handleChange2 = (e) => {
        const { name, value } = e.target;
        setUpProductData(prev => {
            const newData = { ...prev, [name]: value };
            
            // Calculate total stock value only if not using inches
            if (!hasInches2 && (name === 'total_buying_price' || name === 'total_product_stock')) {
                const buyingPrice = parseFloat(name === 'total_buying_price' ? value : prev.total_buying_price) || 0;
                const stockQuantity = parseFloat(name === 'total_product_stock' ? value : prev.total_product_stock) || 0;
                newData.total_stock_value = (buyingPrice * stockQuantity).toString();
            }
            
            return newData;
        });
    };


    // for create product
    const handleInchesChange = (index, field, value) => {
        const newInputGroups = [...inputGroups];
        newInputGroups[index] = { ...newInputGroups[index], [field]: value };
    
        // Calculate row total if buying_price or stock changes
        if (field === 'buying_price' || field === 'stock') {
            const buyingPrice = parseFloat(newInputGroups[index].buying_price) || 0;
            const stock = parseFloat(newInputGroups[index].stock) || 0;
            newInputGroups[index].total = (buyingPrice * stock).toString();
        }
    
        setInputGroups(newInputGroups);
    
        // Calculate totals when any inch field changes
        if (field === 'buying_price' || field === 'stock') {
            // Calculate total stock value from inches (selling price * stock)
            const totalStockValue = newInputGroups.reduce((sum, group) => {
                const buyingPrice = parseFloat(group.buying_price) || 0;
                const stock = parseFloat(group.stock) || 0;
                return sum + (buyingPrice * stock);
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
            const buyingPrice = parseFloat(group.buying_price) || 0;
            const stock = parseFloat(group.stock) || 0;
            return sum + (buyingPrice * stock);
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

    // const toggleInches = () => {
    //     setHasInches(prev => !prev);
    //     // Reset all values when switching to inches mode
    //     setProductData(prev => ({
    //         ...prev,
    //         total_buying_price: '' || 0,
    //         total_selling_price: '' || 0,
    //         total_stock_value: '',
    //         total_product_stock: '',
    //         color: ''
    //     }));
    //     // Reset inches input groups
    //     setInputGroups([{ inche: '', buying_price: '', selling_price: '', color: '', stock: '', total: '' }]);
    // };

    const toggleInches = () => {
        // Toggle inches mode first
        setHasInches(prev => !prev);
        
        // Check the NEW state (after toggle) to determine what to do
        const newHasInches = !hasInches;
        
        if (newHasInches) {
            // If inches mode is being turned ON
            setFieldsDisabled(true);
            setProductData(prev => ({
                ...prev,
                total_buying_price: '0',
                total_selling_price: '0',
                total_product_stock: '0',
                color: ''
            }));
            
            // Initialize inches input groups
            setInputGroups([{ inche: '', buying_price: '', selling_price: '', color: '', stock: '', total: '' }]);
        } else {
            // If inches mode is being turned OFF
            setFieldsDisabled(false);
            
            // Clear the values set when inches was enabled
            setProductData(prev => ({
                ...prev,
                total_buying_price: '',
                total_selling_price: '',
                total_product_stock: ''
            }));
            
            // Clear inches data
            setInputGroups([]);
        }
    };

    // for update product
    const handleInchesChange2 = (index, field, value) => {
        const newInputGroups = [...inputGroups2];
        newInputGroups[index] = { ...newInputGroups[index], [field]: value };
    
        // Calculate row total if buying_price or stock changes
        if (field === 'buying_price' || field === 'stock') {
            const buyingPrice = parseFloat(newInputGroups[index].buying_price) || 0;
            const stock = parseFloat(newInputGroups[index].stock) || 0;
            newInputGroups[index].total = (buyingPrice * stock).toString();
        }
    
        setInputGroups2(newInputGroups);
    
        // Calculate totals when any inch field changes
        if (field === 'buying_price' || field === 'stock') {
            // Calculate total stock value from inches (selling price * stock)
            const totalStockValue = newInputGroups.reduce((sum, group) => {
                const buyingPrice = parseFloat(group.buying_price) || 0;
                const stock = parseFloat(group.stock) || 0;
                return sum + (buyingPrice * stock);
            }, 0);
    
            // Calculate total stock from all inches
            const totalStock = newInputGroups.reduce((sum, group) => {
                const stock = parseFloat(group.stock) || 0;
                return sum + stock;
            }, 0);
    
            setUpProductData(prev => ({
                ...prev,
                total_stock_value: totalStockValue.toString(),
                total_product_stock: totalStock.toString()
            }));
        }
    };

    const handleRemoveInputGroup2 = (index) => {
        const newInputGroups = [...inputGroups2];
        newInputGroups.splice(index, 1);
        setInputGroups2(newInputGroups);

        // Recalculate totals after removing an inch
        const totalStockValue = newInputGroups.reduce((sum, group) => {
            const buyingPrice = parseFloat(group.buying_price) || 0;
            const stock = parseFloat(group.stock) || 0;
            return sum + (buyingPrice * stock);
        }, 0);

        const totalStock = newInputGroups.reduce((sum, group) => {
            const stock = parseFloat(group.stock) || 0;
            return sum + stock;
        }, 0);

        setUpProductData(prev => ({
            ...prev,
            total_stock_value: totalStockValue.toString(),
            total_product_stock: totalStock.toString()
        }));
    };

    

    const toggleInches2 = () => {
        setHasInches2(prev => !prev);
        
        // Toggle the disabled state for the fields
        setFieldsDisabled2(prev => !prev);
        
        // If we're enabling inches mode (checkbox just got checked)
        if (!hasInches2) {
            // Set field values to zero when enabling inches
            setUpProductData(prev => ({
                ...prev,
                total_buying_price: '0',
                total_selling_price: '0',
                // You can still clear these other fields if needed
                total_stock_value: '',
                total_product_stock: '',
                color: ''
            }));
            
            // Initialize or reset inches input groups
            if (inputGroups2.length === 0 || (inputGroups2.length === 1 && !inputGroups2[0].inche)) {
                setInputGroups2([{ inche: '', buying_price: '', selling_price: '', color: '', stock: '', total: '' }]);
            }
        } else {
            // If disabling inches mode, clear the inches data
            setInputGroups2([{ inche: '', buying_price: '', selling_price: '', color: '', stock: '', total: '' }]);
        }
    };
    
    // for create product
    const handleFileChange = (e) => {
        setProductData((prev) => ({
            ...prev,
            images: [...e.target.files],
        }));
    };

    // for update product
    const handleFileChange2 = (e) => {
        setUpProductData((prev) => ({
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

        if (!productData.product_name || !productData.unit || !productData.product_category || !productData.total_product_stock || !productData.supplier_id || !productData.product_description || productData.shop_id.length === 0) {
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
                    !(group.color || '').trim() ||
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
        
            const response = await dispatch(createProduct({ formData, token })).unwrap();
        
            if (response.message === "product created") {
                Swal.fire({
                    icon: "success",
                    title: "Product Created!",
                    text: `${response.message}`,
                });
        
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
                setInputGroups([{ inche: "", buying_price: "", selling_price: "", color: "", stock: "" }]);
                setHasInches(false);
        
                hideModal();
        
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

    const updateHandle = async (e) => {
        e.preventDefault();
        const getUpId = localStorage.getItem("prid");

        if (!upProductData.product_name || !upProductData.unit || !upProductData.product_category || !upProductData.total_product_stock || !upProductData.supplier_id || !upProductData.product_description || upProductData.shop_id.length === 0) {
            Swal.fire({
                icon: "info",
                title: "updating product",
                text: 'All these fields are required!',
                confirmButtonColor: '#7A0091'
            })
            return;
        } 
        if (hasInches2) {
            const incompleteInches = inputGroups2.some(
                (group) =>
                    !(group.inche || '') ||
                    !(group.buying_price || '') ||
                    !(group.selling_price || '') ||
                    !(group.color || '') ||
                    !(group.stock || '')
            );
        
            if (incompleteInches) {
                Swal.fire({
                    icon: "info",
                    title: "Updating Product",
                    text: "Please fill in all inch details.",
                    confirmButtonColor: "#7A0091",
                });
                return;
            }
        
            productData.total_buying_price = '';
            productData.total_selling_price = '';
        }
        else {
            if (!upProductData.total_buying_price || !upProductData.total_selling_price) {
                Swal.fire({
                    icon: "info",
                    title: "updating product",
                    text: 'Please provide both total buying and total selling prices..!',
                    confirmButtonColor: '#7A0091'
                })
                return;
            }
        }

        const formData = new FormData();
        formData.append('product_id', getUpId);
        formData.append('product_name', upProductData.product_name);
        formData.append('color', upProductData.color);
        formData.append('unit', upProductData.unit);
        formData.append('product_category', upProductData.product_category);
        formData.append('product_description', upProductData.product_description);
        formData.append('total_product_stock', upProductData.total_product_stock);
        formData.append('total_buying_price', upProductData.total_buying_price || '');
        formData.append('total_selling_price', upProductData.total_selling_price || '');
        formData.append('total_stock_value', upProductData.total_stock_value);
        formData.append('supplier_id', upProductData.supplier_id);

        const filteredInputGroups = inputGroups2.filter(group => 
            Object.values(group).some(value => value !== '')
        );

        formData.append('inches', filteredInputGroups.length ? JSON.stringify(filteredInputGroups) : JSON.stringify([]));
        formData.append('shop_id', JSON.stringify(upProductData.shop_id));

        if (upProductData.images && Array.isArray(upProductData.images)) {
            upProductData.images.forEach((image) => {
                formData.append('images', image);
            });
        }
        

        for (let pair of formData.entries()) {
            console.log(`${pair[0]}: ${pair[1]}`);
        }
        
        Swal.fire({
            icon: "success",
            title: "Valid Input!",
            text: "Product is being updated...",
            timer: 1500,
            showConfirmButton: false,
        });

        try {
            Swal.fire({
                title: "Updating Product...",
                text: "Please wait while we process your request.",
                allowOutsideClick: false,
                showConfirmButton: false,
                didOpen: () => {
                    Swal.showLoading();
                },
            });

            const response = await dispatch(updateProduct({token, formData})).unwrap();

            if (response.message === "product updated") {
                Swal.fire({
                    icon: "success",
                    title: "Product Updated!",
                    text: `${response.message}`,
                });

                setUpProductData({
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
                setInputGroups2([{ inche: "", buying_price: "", selling_price: "", color: "", stock: "" }]);
                setHasInches2(false);

                hideModal();
                dispatch(getProduct({ token, shop_id: getId, page: currentPage, per_page: per_page }));
            }
            else {
                Swal.fire({
                    icon: "info",
                    title: "Product Update",
                    text: `${response.message}`,
                });
            }
        } catch (error) {
            console.error("Product Update failed:", error);
        
            Swal.fire({
                icon: "error",
                title: "Error Occurred",
                text: error.message || "Something went wrong while creating the product. Please try again.",
            });
        }


    }

    // const getUpmode = (id) => {
    //     setUpModal(true);
    //     const getProduct = localStorage.getItem("product");
    //     localStorage.setItem("prid", id)
    //     const vProduct = JSON.parse(getProduct);
    //     const selectedProduct = vProduct.find((item) => item.id === id);
    //     console.log(selectedProduct);
    
    //     let totalStockValue = selectedProduct.total_stock_value || 0;
    
    //     if (selectedProduct.inches && selectedProduct.inches.length > 0) {
    //         setHasInches2(true);
    //         setUpProductData({
    //             color: ''
    //         })
    
    //         // Calculate total_stock_value based on inches
    //         totalStockValue = selectedProduct.inches.reduce((total, inch) => {
    //             const buyingPrice = parseFloat(inch.buying_price) || 0;
    //             const stock = parseInt(inch.stock) || 0;
    //             return total + (buyingPrice * stock);
    //         }, 0);
    
    //         setInputGroups2(
    //             selectedProduct.inches.map((inch) => {
    //                 // Calculate total for each inch row
    //                 const buyingPrice = parseFloat(inch.buying_price) || 0;
    //                 const stock = parseInt(inch.stock) || 0;
    //                 const rowTotal = (buyingPrice * stock).toLocaleString('en-US', {
    //                     minimumFractionDigits: 2,
    //                     maximumFractionDigits: 2
    //                 });
    
    //                 return {
    //                     inche: inch.inche || '', 
    //                     buying_price: inch.buying_price || '',
    //                     selling_price: inch.selling_price || '',
    //                     color: inch.color || '',
    //                     stock: inch.stock || '',
    //                     total: rowTotal 
    //                 };
    //             })
    //         );
    //     }
    
    //     if (selectedProduct) {
    //         setUpProductData({
    //             product_name: selectedProduct.product_name || '',
    //             color: selectedProduct.color || '',
    //             unit: selectedProduct.unit || '',
    //             product_category: selectedProduct.product_category || '',
    //             product_description: selectedProduct.product_description || '',
    //             total_product_stock: selectedProduct.total_product_stock || '',
    //             supplier_id: selectedProduct.supplier_name?.id || '',
    //             shop_id: selectedProduct.assigned_shops.map(shop => shop.shop_id) || [],
    
    //             total_buying_price: (selectedProduct.inches && selectedProduct.inches.length > 0) 
    //                                 ? '' 
    //                                 : selectedProduct.total_buying_price || '',
    
    //             total_selling_price: (selectedProduct.inches && selectedProduct.inches.length > 0) 
    //                                 ? '' 
    //                                 : selectedProduct.total_selling_price || '',
    
    //             total_stock_value: totalStockValue,
    //         });
    //     }
    // };
    
    const getUpmode = (id) => {
        setUpModal(true);
        const getProduct = localStorage.getItem("product");
        localStorage.setItem("prid", id);
        const vProduct = JSON.parse(getProduct);
        const selectedProduct = vProduct.find((item) => item.id === id);
        console.log(selectedProduct);
    
        const shopIds = selectedProduct.assigned_shops.map(shop => shop.id);
        console.log("Extracted Shop IDs:", shopIds);
    
        let totalStockValue = selectedProduct.total_stock_value || 0;
        let productDataToSet = {
            product_name: selectedProduct.product_name || '',
            unit: selectedProduct.unit || '',
            product_category: selectedProduct.product_category || '',
            product_description: selectedProduct.product_description || '',
            total_product_stock: selectedProduct.total_product_stock || '',
            supplier_id: selectedProduct.supplier_name?.id || '',
            shop_id: shopIds
        };
    
        if (selectedProduct.inches && selectedProduct.inches.length > 0) {
            // For products with inches, set the inches checkbox to true
            setHasInches2(true);
            
            // Also set the fields to disabled
            setFieldsDisabled2(true);
            
            // For products with inches, set color to empty string
            productDataToSet.color = '';
            
            // Calculate total_stock_value based on inches
            totalStockValue = selectedProduct.inches.reduce((total, inch) => {
                const buyingPrice = parseFloat(inch.buying_price) || 0;
                const stock = parseInt(inch.stock) || 0;
                return total + (buyingPrice * stock);
            }, 0);
    
            // Set buying and selling price to zero for products with inches
            productDataToSet.total_buying_price = '0';
            productDataToSet.total_selling_price = '0';
    
            setInputGroups2(
                selectedProduct.inches.map((inch) => {
                    // Calculate total for each inch row
                    const buyingPrice = parseFloat(inch.buying_price) || 0;
                    const stock = parseInt(inch.stock) || 0;
                    const rowTotal = (buyingPrice * stock).toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    });
    
                    return {
                        inche: inch.inche || '', 
                        buying_price: inch.buying_price || '',
                        selling_price: inch.selling_price || '',
                        color: inch.color || '',
                        stock: inch.stock || '',
                        total: rowTotal 
                    };
                })
            );
        } else {
            // For products without inches, use the product's color
            productDataToSet.color = selectedProduct.color || '';
            productDataToSet.total_buying_price = selectedProduct.total_buying_price || '';
            productDataToSet.total_selling_price = selectedProduct.total_selling_price || '';
            setHasInches2(false);
            
            // Make sure fields are enabled for products without inches
            setFieldsDisabled2(false);
        }
    
        // Set the total stock value after it's calculated
        productDataToSet.total_stock_value = totalStockValue;
        
        // Finally set the product data
        setUpProductData(productDataToSet);
    };

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
                deleteProduct({
                  product_id: id,
                  shop_id: getId,
                  token,
                })
              ).then((response) => {
                if (response.meta.requestStatus === 'fulfilled') {
                  Swal.fire('Deleted!', 'Product deleted successfully!', 'success');
                  dispatch(getProduct({ token, shop_id: getId, page: currentPage, per_page: per_page }));
                } else {
                  Swal.fire('Error!', 'Failed to delete product!', 'error');
                }
              });
            }
        });
    }


    const proDetails = (id) => {
        const getProduct = localStorage.getItem("product");
        const vProduct = JSON.parse(getProduct);
    
        const product = vProduct.find((item) => item.id === id);
        console.log(product);
        
        if (product) {
            // Calculate totals for each inch row before setting state
            const productWithTotals = {
                ...product,
                inches: product.inches.map(inch => ({
                    ...inch,
                    total: (parseFloat(inch.buying_price) || 0) * (parseInt(inch.stock) || 0)
                }))
            };
            
            setProductDetails(productWithTotals);
            setVm(true);
        }
    };


    const debouncedSearch = useCallback(
        debounce((value) => {
            if (value.trim() === "") {
                dispatch(clearSearch());
                dispatch(getProduct({ 
                    token, 
                    shop_id: getId, 
                    page: 1, 
                    per_page: per_page 
                }));
            } else {
                dispatch(searchProduct({ 
                    token, 
                    shop_id: getId, 
                    search_value: value, 
                    page: 1, 
                    per_page: per_page 
                }));
            }
        }, 300),
        [dispatch, token, getId, per_page]
    );

    // Update your handleSearch function
    const handleSearch = (e) => {
        const value = e.target.value;
        setInputValue(value);
        debouncedSearch(value);
    };

    // Clean up the debounced function when component unmounts
    useEffect(() => {
        return () => {
            debouncedSearch.cancel();
        };
    }, [debouncedSearch]);


    const displayData = isSearching ? search : products;
    

  return (
    <>
    <div className="mt-5 mt-lg-4 d-block text-right">
        <button className='pro-btn' onClick={sModal}><span style={{fontSize: '20px'}}>+</span> Add Product</button>
        <div className="search-container text-right">
            <input type="text" placeholder="Search product..." className="search-input mb-3" style={{borderRadius: '5px',}} value={inputValue} onChange={handleSearch}/>
            <span className="search-icon" style={{position: "absolute",
                right: "10px",
                top: "20px",
                fontSize: "20px",
                color: "#222",
                cursor: "pointer"}}>&#128269;</span>
        </div>
    </div>

    {loading ? (
         <div>Loading...</div>
    ) : error ? (
        <div>Error: {error?.message || 'Something went erong'}</div>
    ) : (
        <>
           <div className="lp px-0 py-0 px-lg-3 py-lg-5">
                <div className="table-content">
                    <div className="table-container">
                        <table className="my-table" data={displayData}>
                            <thead>
                                <tr>
                                    <th><div className='d-flex justify-content-between'><p>S/N</p><div><img src={Fil} alt="" /></div></div></th>
                                    <th><div className='d-flex justify-content-between'><p>Image</p><div><img src={Fil} alt="" /></div></div></th>
                                    <th><div className='d-flex justify-content-between'><p>Product Name</p><div><img src={Fil} alt="" /></div></div></th>
                                    <th><div className='d-flex justify-content-between'><p>Category</p><div><img src={Fil} alt="" /></div></div></th>
                                    <th><div className='d-flex justify-content-between'><p>Supplier Name</p><div><img src={Fil} alt="" /></div></div></th>
                                    <th><div className='d-flex justify-content-between'><p>Buying Price</p><div><img src={Fil} alt="" /></div></div></th>
                                    <th><div className='d-flex justify-content-between'><p>Selling Price</p><div><img src={Fil} alt="" /></div></div></th>
                                    <th><div className='d-flex justify-content-between'><p>Unit</p><div><img src={Fil} alt="" /></div></div></th>
                                    <th><div className='d-flex justify-content-between'><p>Color</p><div><img src={Fil} alt="" /></div></div></th>
                                    <th><div className='d-flex justify-content-between'><p>Actions</p><div><img src={Fil} alt="" /></div></div></th>
                                </tr>
                            </thead>

                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan="9">Loading...</td></tr>
                                    ) : (isSearching ? search : products).length > 0 ? (
                                        (isSearching ? search : products).map((item, index) => (
                                            <tr key={item.id} onClick={() => proDetails(item.id)} style={{ cursor: 'pointer' }}>
                                                <td>{index + 1}</td>
                                                <td>
                                                    <img
                                                        src={typeof item.images[0]?.filename === 'string' ? item.images[0]?.filename : `${Thmb}`}
                                                        width={60} className="img-thumbnail" alt="Thumbnail"
                                                        style={{ boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px' }}
                                                    />
                                                </td>
                                                <td>{item.product_name}</td>
                                                <td>{item.product_category || '----'}</td>
                                                <td>{item.supplier_name?.supplier_name}</td>
                                                <td>{item.total_buying_price}</td>
                                                <td>{item.total_selling_price}</td>
                                                <td>{item.unit}</td>
                                                <td>{item.color}</td>
                                                <td>
                                                    <div className="d-flex gap-5">
                                                        <FontAwesomeIcon icon={faEdit} 
                                                            style={{ color: '#379042', fontSize: '16px', marginRight: '20px', backgroundColor: '#E6FEE8', padding: '5px' }} 
                                                            onClick={(e) => { getUpmode(item.id); e.stopPropagation(); }} title='update product' 
                                                        />
                                                        <FontAwesomeIcon icon={faTrash} 
                                                            style={{ color: '#DB6454', fontSize: '16px', backgroundColor: '#F4E3E3', padding: '5px' }} 
                                                            onClick={(e) => { deleteMode(item.id); e.stopPropagation(); }} title='delete product' 
                                                        />
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="9">No Products Available</td>
                                        </tr>
                                    )}
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
                            if (isSearching) {
                                dispatch(searchProduct({
                                    token,
                                    shop_id: getId,
                                    search_value: inputValue,
                                    page: newPage,
                                    per_page: per_page
                                }));
                            } else {
                                dispatch(getProduct({
                                    token,
                                    shop_id: getId,
                                    page: newPage,
                                    per_page: per_page
                                }));
                            }
                        }}
                        onPerPageChange={(newPerPage) => {
                            if (isSearching) {
                                dispatch(searchProduct({
                                    token,
                                    shop_id: getId,
                                    search_value: inputValue,
                                    page: 1,
                                    per_page: newPerPage
                                }));
                            } else {
                                dispatch(getProduct({
                                    token,
                                    shop_id: getId,
                                    page: 1,
                                    per_page: newPerPage
                                }));
                            }
                        }}
                    />

                    </div>
                </div>
           </div>
        </>
    )}
    
      
      {modalVisible ? (
          <>
            <div className="modal-overlay">
                <div className="modal-content2 mt-lg-0 mt-5">
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
                                        <input type="text" placeholder='Enter Color' name='color' value={productData.color} onChange={handleChange} disabled={fieldsDisabled}/>
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
                                        <input type="number" placeholder='Enter Buying Price' name='total_buying_price' value={productData.total_buying_price} onChange={handleChange} disabled={fieldsDisabled} onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')}
                                        onKeyPress={(e) => {
                                            if (!/[0-9]/.test(e.key)) {
                                            e.preventDefault();
                                            }
                                        }}
                                        onPaste={(e) => {
                                            const paste = e.clipboardData.getData('text');
                                            if (!/^\d+$/.test(paste)) {
                                            e.preventDefault();
                                            }
                                        }}/>
                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-12 col-lg-6">
                                    <div className="form-group mb-4">
                                        <label htmlFor="exampleInputEmail1">selling Price <span style={{color: '#7A0091'}}>*</span></label>
                                        <input type="number" placeholder='Enter Selling Price' name='total_selling_price' value={productData.total_selling_price} onChange={handleChange} disabled={fieldsDisabled} onKeyPress={(e) => {
                                            if (!/[0-9]/.test(e.key)) {
                                            e.preventDefault();
                                            }
                                        }}
                                        onPaste={(e) => {
                                            const paste = e.clipboardData.getData('text');
                                            if (!/^\d+$/.test(paste)) {
                                            e.preventDefault();
                                            }
                                        }}/>
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
                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-12 col-lg-6">
                                    <div className="form-group mb-4">
                                        <label htmlFor="exampleInputEmail1">Total Product Stock <span style={{color: '#7A0091'}}>*</span></label>
                                        <input type="number" placeholder='Enter Product Stock' name='total_product_stock' value={productData.total_product_stock} onChange={handleChange} disabled={fieldsDisabled} onKeyPress={(e) => {
                                            if (!/[0-9]/.test(e.key)) {
                                            e.preventDefault();
                                            }
                                        }}
                                        onPaste={(e) => {
                                            const paste = e.clipboardData.getData('text');
                                            if (!/^\d+$/.test(paste)) {
                                            e.preventDefault();
                                            }
                                        }}/>
                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-12 col-lg-12">
                                    <div className="form-group mb-4">
                                        <div className="d-flex justify-content-between mb-3">
                                            <div className='d-lg-flex d-block'>
                                                <div>
                                                <label htmlFor="exampleInputPassword1">add Inches</label>

                                                </div>
                                                <div>
                                                <input
                                                    type="checkbox"
                                                    checked={hasInches}
                                                    onChange={toggleInches}
                                                    className="ml-lg-5 ml-0"
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
                                            <div key={index} style={{ marginBottom: '20px' }} className="d-lg-flex d-block">
                                                <input
                                                    type="number"
                                                    value={group.inche || ''}
                                                    onChange={(e) => handleInchesChange(index, 'inche', e.target.value)}
                                                    placeholder="Inches"
                                                    className="mx-2 my-g-0 my-3"
                                                    onKeyPress={(e) => {
                                                        if (!/[0-9]/.test(e.key)) {
                                                        e.preventDefault();
                                                        }
                                                    }}
                                                    onPaste={(e) => {
                                                        const paste = e.clipboardData.getData('text');
                                                        if (!/^\d+$/.test(paste)) {
                                                        e.preventDefault();
                                                        }
                                                    }}
                                                />
                                                <input
                                                    type="number"
                                                    value={group.buying_price || ''}
                                                    onChange={(e) => handleInchesChange(index, 'buying_price', e.target.value)}
                                                    placeholder="Buying Price"
                                                    className="mx-2 my-g-0 my-3"
                                                    onKeyPress={(e) => {
                                                        if (!/[0-9]/.test(e.key)) {
                                                        e.preventDefault();
                                                        }
                                                    }}
                                                    onPaste={(e) => {
                                                        const paste = e.clipboardData.getData('text');
                                                        if (!/^\d+$/.test(paste)) {
                                                        e.preventDefault();
                                                        }
                                                    }}
                                                />
                                                <input
                                                    type="number"
                                                    value={group.selling_price || ''}
                                                    onChange={(e) => handleInchesChange(index, 'selling_price', e.target.value)}
                                                    placeholder="Selling Price"
                                                    className="mx-2 my-g-0 my-3"
                                                    onKeyPress={(e) => {
                                                        if (!/[0-9]/.test(e.key)) {
                                                        e.preventDefault();
                                                        }
                                                    }}
                                                    onPaste={(e) => {
                                                        const paste = e.clipboardData.getData('text');
                                                        if (!/^\d+$/.test(paste)) {
                                                        e.preventDefault();
                                                        }
                                                    }}
                                                />
                                                <input
                                                    type="text"
                                                    value={group.color || ''}
                                                    onChange={(e) => handleInchesChange(index, 'color', e.target.value)}
                                                    placeholder="Color"
                                                    className="mx-2 my-g-0 my-3"
                                                />
                                                <input
                                                    type="number"
                                                    value={group.stock || ''}
                                                    onChange={(e) => handleInchesChange(index, 'stock', e.target.value)}
                                                    placeholder="Stock"
                                                    className="mx-2 my-g-0 my-3"
                                                    onKeyPress={(e) => {
                                                        if (!/[0-9]/.test(e.key)) {
                                                        e.preventDefault();
                                                        }
                                                    }}
                                                    onPaste={(e) => {
                                                        const paste = e.clipboardData.getData('text');
                                                        if (!/^\d+$/.test(paste)) {
                                                        e.preventDefault();
                                                        }
                                                    }}
                                                />
                                                <input
                                                    type="text"
                                                    value={group.total || ''}
                                                    readOnly
                                                    placeholder="Total"
                                                    className="mx-2 my-g-0 my-3"
                                                    style={{ backgroundColor: '#f5f5f5' }}
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
                                <button className='in-btn'>
                                    {loading ? (
                                            <>
                                            <div className="spinner-border spinner-border-sm text-light" role="status">
                                                <span className="sr-only"></span>
                                            </div>
                                            <span>Creating Product... </span>
                                            </>
                                        ) : (
                                            'Create Product'
                                    )}
                                </button>
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
                <div className="modal-content2 mt-lg-0 mt-5">
                    <div className="head-mode">
                        <h6 style={{color: '#7A0091'}}>Update Product</h6>
                        <button className="modal-close" onClick={hideModal}>
                        &times;
                        </button>
                    </div>

                    <div className="modal-body">
                        <form onSubmit={updateHandle}>
                            <div className="row">
                                <div className="col-sm-12 col-md-12 col-lg-6">
                                    <div className="form-group mb-4">
                                        <label htmlFor="exampleInputEmail1">Product Name <span style={{color: '#7A0091'}}>*</span></label>
                                        <input type="text" placeholder='Enter Name' name='product_name' value={upProductData.product_name} onChange={handleChange2}/>
                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-12 col-lg-6">
                                    <div className="form-group mb-4">
                                        <label htmlFor="exampleInputEmail1">Shops <span style={{color: '#7A0091'}}>*</span></label>
                                        <ShopSelector shops={shops} onShopSelectionChange={handleShopSelectionChange2} initialSelectedShops={upProductData.shop_id}/>
                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-12 col-lg-6">
                                    <div className="form-group mb-4">
                                        <label htmlFor="exampleInputEmail1">Product Category <span style={{color: '#7A0091'}}>*</span></label>
                                        <select name='product_category' value={upProductData.product_category} onChange={handleChange2}>
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
                                        <input type="text" placeholder='Enter Color' name='color' value={upProductData.color} onChange={handleChange2} disabled={fieldsDisabled2}/>
                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-12 col-lg-3">
                                    <div className="form-group mb-4">
                                        <label htmlFor="exampleInputEmail1">Unit <span style={{color: '#7A0091'}}>*</span></label>
                                        <input type="text" placeholder='Enter Unit' name='unit' value={upProductData.unit} onChange={handleChange2}/>
                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-12 col-lg-6">
                                    <div className="form-group mb-4">
                                        <label htmlFor="exampleInputEmail1">Buying Price <span style={{color: '#7A0091'}}>*</span></label>
                                        <input type="number" placeholder='Enter Buying Price' name='total_buying_price' value={upProductData.total_buying_price} onChange={handleChange2} disabled={fieldsDisabled2} onKeyPress={(e) => {
                                            if (!/[0-9]/.test(e.key)) {
                                            e.preventDefault();
                                            }
                                        }}
                                        onPaste={(e) => {
                                            const paste = e.clipboardData.getData('text');
                                            if (!/^\d+$/.test(paste)) {
                                            e.preventDefault();
                                            }
                                        }}/>
                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-12 col-lg-6">
                                    <div className="form-group mb-4">
                                        <label htmlFor="exampleInputEmail1">selling Price <span style={{color: '#7A0091'}}>*</span></label>
                                        <input type="number" placeholder='Enter Selling Price' name='total_selling_price' value={upProductData.total_selling_price} onChange={handleChange2} disabled={fieldsDisabled2} onKeyPress={(e) => {
                                            if (!/[0-9]/.test(e.key)) {
                                            e.preventDefault();
                                            }
                                        }}
                                        onPaste={(e) => {
                                            const paste = e.clipboardData.getData('text');
                                            if (!/^\d+$/.test(paste)) {
                                            e.preventDefault();
                                            }
                                        }}/>
                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-12 col-lg-6">
                                    <div className="form-group mb-4">
                                        <label htmlFor="exampleInputEmail1">Supplier <span style={{color: '#7A0091'}}>*</span></label>
                                        <select name="supplier_id" value={upProductData.supplier_id} onChange={handleChange2}>
                                            <option value="">--select supplier--</option>
                                            {supplier.map((item) => (
                                                <option key={item.supplier_id} value={item.supplier_id}>
                                                    {item.supplier_name}
                                                </option>
                                            ))}
                                        </select>

                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-12 col-lg-6">
                                    <div className="form-group mb-4">
                                        <label htmlFor="exampleInputEmail1">Product Image <span style={{color: '#7A0091'}}>*</span></label>
                                        <input type="file" multiple placeholder='Enter value' onChange={handleFileChange2}/>
                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-12 col-lg-6">
                                    <div className="form-group mb-4">
                                        <label htmlFor="exampleInputEmail1">Total Stock Value <span style={{color: '#7A0091'}}>*</span></label>
                                        <input type="text" placeholder='Enter Stock Value' name='total_stock_value' value={upProductData.total_stock_value} onChange={handleChange2} readOnly/>
                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-12 col-lg-6">
                                    <div className="form-group mb-4">
                                        <label htmlFor="exampleInputEmail1">Total Product Stock <span style={{color: '#7A0091'}}>*</span></label>
                                        <input type="number" placeholder='Enter Product Stock' name='total_product_stock' value={upProductData.total_product_stock} onChange={handleChange2} disabled={fieldsDisabled2} onKeyPress={(e) => {
                                            if (!/[0-9]/.test(e.key)) {
                                            e.preventDefault();
                                            }
                                        }}
                                        onPaste={(e) => {
                                            const paste = e.clipboardData.getData('text');
                                            if (!/^\d+$/.test(paste)) {
                                            e.preventDefault();
                                            }
                                        }}/>
                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-12 col-lg-12">
                                    <div className="form-group mb-4">
                                        <div className="d-flex justify-content-between mb-3">
                                            <div className='d-lg-flex d-block'>
                                                <div>
                                                <label htmlFor="exampleInputPassword1">add Inches</label>

                                                </div>
                                                <div>
                                                <input
                                                    type="checkbox"
                                                    checked={hasInches2}
                                                    onChange={toggleInches2}
                                                    className="ml-lg-5 ml-0"
                                                />
                                                </div>
                                                
                                            </div>
                                            {hasInches2 && (
                                                <button
                                                    onClick={handleAddInputGroup2}
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

                                        {hasInches2 && inputGroups2.map((group, index) => (
                                            <div key={index} style={{ marginBottom: '20px' }} className="d-lg-flex d-block">
                                                <input
                                                    type="number"
                                                    value={group.inche || ''}
                                                    onChange={(e) => handleInchesChange2(index, 'inche', e.target.value)}
                                                    placeholder="Inches"
                                                    className="mx-2 my-g-0 my-3"
                                                    onKeyPress={(e) => {
                                                        if (!/[0-9]/.test(e.key)) {
                                                        e.preventDefault();
                                                        }
                                                    }}
                                                    onPaste={(e) => {
                                                        const paste = e.clipboardData.getData('text');
                                                        if (!/^\d+$/.test(paste)) {
                                                        e.preventDefault();
                                                        }
                                                    }}
                                                />
                                                <input
                                                    type="number"
                                                    value={group.buying_price || ''}
                                                    onChange={(e) => handleInchesChange2(index, 'buying_price', e.target.value)}
                                                    placeholder="Buying Price"
                                                    className="mx-2 my-g-0 my-3"
                                                    onKeyPress={(e) => {
                                                        if (!/[0-9]/.test(e.key)) {
                                                        e.preventDefault();
                                                        }
                                                    }}
                                                    onPaste={(e) => {
                                                        const paste = e.clipboardData.getData('text');
                                                        if (!/^\d+$/.test(paste)) {
                                                        e.preventDefault();
                                                        }
                                                    }}
                                                />
                                                <input
                                                    type="number"
                                                    value={group.selling_price || ''}
                                                    onChange={(e) => handleInchesChange2(index, 'selling_price', e.target.value)}
                                                    placeholder="Selling Price"
                                                    className="mx-2 my-g-0 my-3"
                                                    onKeyPress={(e) => {
                                                        if (!/[0-9]/.test(e.key)) {
                                                        e.preventDefault();
                                                        }
                                                    }}
                                                    onPaste={(e) => {
                                                        const paste = e.clipboardData.getData('text');
                                                        if (!/^\d+$/.test(paste)) {
                                                        e.preventDefault();
                                                        }
                                                    }}
                                                />
                                                <input
                                                    type="text"
                                                    value={group.color || ''}
                                                    onChange={(e) => handleInchesChange2(index, 'color', e.target.value)}
                                                    placeholder="Color"
                                                    className="mx-2 my-g-0 my-3"
                                                />
                                                <input
                                                    type="number"
                                                    value={group.stock || ''}
                                                    onChange={(e) => handleInchesChange2(index, 'stock', e.target.value)}
                                                    placeholder="Stock"
                                                    className="mx-2 my-g-0 my-3" 
                                                    onKeyPress={(e) => {
                                                        if (!/[0-9]/.test(e.key)) {
                                                        e.preventDefault();
                                                        }
                                                    }}
                                                    onPaste={(e) => {
                                                        const paste = e.clipboardData.getData('text');
                                                        if (!/^\d+$/.test(paste)) {
                                                        e.preventDefault();
                                                        }
                                                    }}
                                                />
                                                <input
                                                    type="text"
                                                    value={group.total || ''}
                                                    readOnly
                                                    placeholder="Total"
                                                    className="mx-2 my-g-0 my-3"
                                                    style={{ backgroundColor: '#f5f5f5' }}
                                                />
                                                <FontAwesomeIcon
                                                    icon={faTimes}
                                                    onClick={() => handleRemoveInputGroup2(index)}
                                                    style={{ color: '#7A0091', cursor: 'pointer', fontWeight: 'bolder' }}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-12 col-lg-12">
                                    <div className="form-group mb-4">
                                        <label htmlFor="exampleInputEmail1">Product Description <span style={{color: '#7A0091'}}>*</span></label>
                                        <textarea cols="30" rows="10" placeholder='Enter description' name='product_description' value={upProductData.product_description} onChange={handleChange2}></textarea>
                                    </div>
                                </div>
                            </div>

                            <div className="text-right">
                                <button className='d-btn mr-2'>Discard</button>
                                <button className='in-btn'>
                                    {loading ? (
                                            <>
                                            <div className="spinner-border spinner-border-sm text-light" role="status">
                                                <span className="sr-only"></span>
                                            </div>
                                            <span>Updating Product... </span>
                                            </>
                                        ) : (
                                            'Update Product'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
          </>
      ) : ''}

      {vm ? (
        <>
          <div className="modal-overlay">
            <div className="modal-content2">
                <div className="head-mode">
                    <h6 style={{color: '#222'}}>Product Details</h6>
                    <button className="modal-close" onClick={hideModal}>
                    &times;
                    </button>
                </div>
                <div className="modal-body">
                    <div className="row">
                        <div className="col-sm-12 col-md-12 col-lg-6">
                            <div
                                className="box mb-3"
                                style={{
                                    backgroundImage: `url(${selectedImage})`,
                                    backgroundRepeat: "no-repeat",
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                    width: "100%",
                                    height: "400px",
                                    borderRadius: "8px",
                                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                                    transition: "background-image 0.3s ease-in-out",
                                    border: '1px solid #F3B8FF'
                                }}
                            ></div>

                            {/* Image Carousel */}
                            <Carousel indicators={false} interval={5000} controls={false}>
                                {images.length > 0 ? (
                                    images.map((image, index) => (
                                        <Carousel.Item key={index}>
                                            <img
                                                src={image.filename}
                                                width={100}
                                                height={100}
                                                className="img-thumbnail"
                                                alt={`Product ${index + 1}`}
                                                style={{
                                                    boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
                                                    cursor: "pointer",
                                                }}
                                                onClick={() => setSelectedImage(image.filename)}
                                            />
                                        </Carousel.Item>
                                    ))
                                ) : (
                                    <Carousel.Item>
                                        <img
                                            src={Thmb}
                                            width={100}
                                            height={100}
                                            className="img-thumbnail"
                                            alt="Default Image"
                                        />
                                    </Carousel.Item>
                                )}
                            </Carousel>
                        </div>
                        <div className="col-sm-12 col-md-12 col-lg-6">
                            <h4 className='my-lg-0 my-4'>Basic Information</h4>
                            <div className="d-flex justify-content-between">
                                <p>Product Name:</p>
                                <p>{productDetails.product_name}</p>
                            </div>
                            <div className="d-flex justify-content-between">
                                <p>Product Color:</p>
                                <p>{productDetails.color || 'none'}</p>
                            </div>
                            <div className="d-flex justify-content-between">
                                <p>Unit:</p>
                                <p>{productDetails.unit}</p>
                            </div>
                            <div className="d-flex justify-content-between">
                                <p>Category:</p>
                                <p>{productDetails.product_category}</p>
                            </div>
                            {(!productDetails.inches || productDetails.inches.length === 0) && (
                                <>
                                    <div className="d-flex justify-content-between">
                                        <p>Buying Price:</p>
                                        <p>{productDetails.total_buying_price}</p>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <p>Selling Price:</p>
                                        <p>{productDetails.total_selling_price}</p>
                                    </div>
                                </>
                            )}
                            <div className="d-flex justify-content-between">
                                <p>Product Stock:</p>
                                <p>{productDetails.total_product_stock}</p>
                            </div>
                            <div className="d-flex justify-content-between">
                                <p>Total Stock Value:</p>
                                <p>{productDetails.total_stock_value}</p>
                            </div>
                            <div className="d-flex justify-content-between">
                                <p>Supplier Name:</p>
                                <p>{productDetails.supplier_name.supplier_name}</p>
                            </div>
                            <div className="d-lg-flex d-block justify-content-between">
                                <p>Assigned Shop:</p>
                                <p>{productDetails.assigned_shops.map((item) => item.shop_name).join(',')}</p>
                            </div>

                            
                        </div>
                    </div>
                    {productDetails.inches && productDetails.inches.length > 0 && (
                        <div className="table-content">
                            <p className='my-3'>Inches Section</p>
                            <div className="table-container">
                                <table className="my-table w-100">
                                    <thead>
                                        <tr>
                                            <th>Inches</th>
                                            <th>Buying Price</th>
                                            <th>Selling Price</th>
                                            <th>Color</th>
                                            <th>Stock</th>
                                            <th style={{width: '20%'}}>Total Stock Value</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {productDetails.inches.map((item, index) => {
                                            const buyingPrice = parseFloat(item.buying_price) || 0;
                                            const stock = parseInt(item.stock) || 0;
                                            const rowTotal = (buyingPrice * stock).toLocaleString('en-US', {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2
                                            });

                                            return (
                                                <tr key={index}>
                                                    <td>{item.inche}</td>
                                                    <td>{item.buying_price}</td>
                                                    <td>{item.selling_price}</td>
                                                    <td>{item.color || '--------'}</td>
                                                    <td>{item.stock}</td>
                                                    <td>{rowTotal}</td>
                                                </tr>
                                            );
                                        })}
                                        <tr>
                                            <td colSpan="5" style={{ textAlign: 'right', fontWeight: 'bold' }}>Grand Total:</td>
                                            <td style={{ fontWeight: 'bold' }}>
                                                {productDetails.inches.reduce((total, item) => {
                                                    const buyingPrice = parseFloat(item.buying_price) || 0;
                                                    const stock = parseInt(item.stock) || 0;
                                                    return total + (buyingPrice * stock);
                                                }, 0).toLocaleString('en-US', {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2
                                                })}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
          </div>
        </>
    ) : ('')}
      
    </>
  )
}

export default Products



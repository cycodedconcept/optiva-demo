import React, { useEffect } from 'react';
import { getSalesChart } from '../../features/reportSlice';
import { useDispatch, useSelector } from 'react-redux';

const Progress = () => {
    const dispatch = useDispatch();
    let token = localStorage.getItem("token");
    const getId = localStorage.getItem("sid");
    const { loading, error, salesCard } = useSelector((state) => state.report);

    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();

    useEffect(() => {
        if (token) {
            dispatch(getSalesChart({ token, shop_id: getId, month, year }));
        }
    }, [token, dispatch]);

    // Ensure salesCard.bestSellingProducts exists
    if (!salesCard.bestSellingProducts || salesCard.bestSellingProducts.length === 0) {
        return <p>No sales data available</p>;
    }

    // Calculate total sales count
    const totalSales = salesCard.bestSellingProducts.reduce(
        (total, product) => total + Number(product.totalSold),
        0
    );

    return (
        <div style={{ width: '100%', padding: '20px', boxSizing: 'border-box' }}>
            {/* Progress Bar */}
            <div
                style={{
                    display: 'flex',
                    height: '20px',
                    width: '100%',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    backgroundColor: '#e0e0e0',
                }}
            >
                {salesCard.bestSellingProducts.map((product) => {
                    const percentageValue = parseFloat(product.percentage); // Convert "83.33%" to 83.33
                    return (
                        <div
                            key={product.product_id}
                            style={{
                                width: `${percentageValue}%`,
                                backgroundColor: "#7A0091",
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#fff',
                                fontSize: '14px',
                                fontWeight: 'bold'
                            }}
                        >
                            {product.percentage}
                        </div>
                    );
                })}
            </div>

            {/* Labels */}
            <div
                style={{
                    display: 'flex',
                    marginTop: '10px',
                    width: '100%',
                }}
            >
                {salesCard.bestSellingProducts.map((product) => {
                    const percentageValue = parseFloat(product.percentage); // Convert "83.33%" to 83.33
                    return (
                        <div
                            key={product.product_id}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                width: `${percentageValue}%`,
                                textAlign: 'center',
                                fontSize: '12px',
                            }}
                        >
                            <span
                                style={{
                                    display: 'block',
                                    width: '15px',
                                    height: '10px',
                                    backgroundColor: "#7A0091",
                                    marginBottom: '5px',
                                }}
                            ></span>
                            <span style={{ fontSize: '12px' }}>{product.product_name}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Progress;

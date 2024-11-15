import React from 'react'

const Progress = () => {
    const productSales = [
        { productName: 'Lush Wigs', sales: 30, color: '#FFCC00' },
        { productName: 'Experience Attachment', sales: 20, color: '#00C7BE' },
        { productName: 'Oneplus Sampoo', sales: 25, color: '#AF52DE' },
        { productName: 'Lush Soap', sales: 15, color: '#A2845E' },
        { productName: 'Others', sales: 10, color: '#FF9500' },
    ];

    const totalSales = productSales.reduce((total, product) => total + product.sales, 0);



  return (
    <>
      <div style={{ width: '100%', padding: '20px', boxSizing: 'border-box' }}>
            <div style={{
                display: 'flex',
                height: '20px',
                width: '100%',
                borderRadius: '10px',
                overflow: 'hidden',
                backgroundColor: '#e0e0e0',
            }}>
                {productSales.map((product) => (
                    <div
                        key={product.productName}
                        style={{
                            width: `${(product.sales / totalSales) * 100}%`,
                            backgroundColor: product.color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff',
                            fontSize: '14px',
                            fontWeight: 'bold'
                        }}
                    >
                        {product.sales}%
                    </div>
                ))}
            </div>

            <div style={{
                display: 'flex',
                marginTop: '10px',
                width: '100%'
            }}>
                {productSales.map((product) => (
                    <div
                        key={product.productName}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            width: `${(product.sales / totalSales) * 100}%`,
                            textAlign: 'center',
                            fontSize: '12px'
                        }}
                    >
                        <span
                            style={{
                                display: 'block',
                                width: '15px',
                                height: '10px',
                                backgroundColor: product.color,
                                marginBottom: '5px'
                            }}
                        ></span>
                        <span style={{fontSize: '12px'}}>{product.productName}</span>
                    </div>
                ))}
            </div>
      </div>
    </>
  )
}

export default Progress

// import React, { useState, useEffect } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons';
// import { Dash, Logo2, Invoice, Pay, Pro, Purc, Rep, Cus, Sup, Use, Not, Set } from '../assets/images';
// import '../style.css';

// const Sidebar = ({ onButtonClick, activeContent }) => {
//     const [menus, setMenus] = useState([]);
//     const [expanded, setExpanded] = useState(false);

//     useEffect(() => {
//         // const storedMenus = localStorage.getItem('menus');
//         // if (storedMenus) {
//         //     setMenus(JSON.parse(storedMenus));
//         // }

//         const handleResize = () => {
//             if (window.innerWidth > 768) {
//                 setExpanded(false);
//             }
//         };

//         window.addEventListener('resize', handleResize);

//         return () => {
//             window.removeEventListener('resize', handleResize);
//         };
//     }, []);

//     const menuIcons = {
//         'Dashboard': Dash,
//         'Invoice': Invoice,
//         'Payment': Pay,
//         'Products': Pro,
//         'Purchase': Purc,
//         'Reports': Rep,
//         'Customer': Cus,
//         'Supplier': Sup,
//         'Users': Use,
//         'Notification': Not,
//         'Settings': Set
//     };

//     // Helper function to toggle submenu visibility
//     const handleToggleExpand = (title) => {
//         setExpanded((prev) => ({ ...prev, [title]: !prev[title] }));
//     };

//     const renderMenu = menuItems.map((menu) => {
//         // const hasSubmenu = menu.submenu && menu.submenu.length > 0;
//         const isActive = activeContent === menu.menu_name;
        
//         return (
//             <div key={menu.title} className="sidebar-item">
//                 <button 
//                     className={`sidebar-menu button ${isActive ? 'active' : ''}`}
//                     onClick={() => hasSubmenu ? handleToggleExpand(menu.title) : onButtonClick(menu.path)}
//                 >
//                     <img src={menuIcons[menu.title]} alt={menu.title} className='px-3' style={{ width: '50px' }} />
//                     <span>{menu.title}</span>
//                     {hasSubmenu && (
//                         <span className="caret mx-3">
//                             {expanded[menu.title] ? <FontAwesomeIcon icon={faChevronDown} /> : <FontAwesomeIcon icon={faChevronRight} />}
//                         </span>
//                     )}
//                 </button>

//                 {hasSubmenu && expanded[menu.title] && (
//                     <div className={`submenu ${expanded[menu.title] ? 'open' : ''}`}>
//                         {menu.submenu.map((submenu) => (
//                             <button
//                                 key={submenu.title}
//                                 className={`sidebar-submenu button ${activeContent === submenu.path ? 'active' : ''}`}
//                                 onClick={() => onButtonClick(submenu.path)}
//                             >
//                                 {submenu.title}
//                             </button>
//                         ))}
//                     </div>
//                 )}


//             </div>
//         );
//     });


//     return (
//         <div className="sidebar">
//             <img src={Logo2} alt="Logo" className='mx-2 mt-2'/>
//             <div className="sidebar-menu">
//                 {renderMenu}
//             </div>
//         </div>
//     );
// };

// export default Sidebar;

// const getMenu = localStorage.getItem('user');
// const menu = JSON.parse(getMenu);
// const menuItems = menu.menus

// // const menuItems = [
// //     {
// //         title: 'Dashboard',
// //         icon: Dash,
// //         path: 'dashboard'
// //     },
// //     {
// //         title: 'Invoice',
// //         icon: Invoice,
// //         submenu: [
// //             { title: 'All Invoice', path: 'invoice/invoice list' },
// //             { title: 'Add Invoice', path: 'invoice/add' }
// //         ]
// //     },
// //     {
// //         title: 'Payment',
// //         icon: Pay,
// //         submenu: [
// //             { title: 'All Payment', path: 'payment list' },
// //             { title: 'Pending', path: 'payment/pending' }
// //         ]
// //     },
// //     {
// //         title: 'Products',
// //         icon: Pro,
// //         submenu: [
// //             { title: 'All Products', path: 'products' },
// //             { title: 'VIP', path: 'products/vip' }
// //         ]
// //     },
// //     {
// //         title: 'Purchase',
// //         icon: Purc,
// //         path: 'purchase'
// //     },
// //     {
// //         title: 'Reports',
// //         icon: Rep,
// //         submenu: [
// //             { title: 'Sales Reports', path: 'Sales Report' },
// //             { title: 'Stock History', path: 'Stock History' }
// //         ]
// //     },
// //     {
// //         title: 'Customer',
// //         icon: Cus,
// //         path: 'customer'
// //     },
// //     {
// //         title: 'Supplier',
// //         icon: Sup,
// //         path: 'supplier'
// //     },
// //     {
// //         title: 'Users',
// //         icon: Use,
// //         path: 'users'
// //     },
// //     {
// //         title: 'Notification',
// //         icon: Not,
// //         path: 'notification'
// //     },
// //     {
// //         title: 'Settings',
// //         icon: Set,
// //         path: 'settings'
// //     }
// // ];

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { Dash, Logo2, Invoice, Pay, Pro, Purc, Rep, Cus, Sup, Use, Not, Set } from '../assets/images';
import '../style.css';

const Sidebar = ({ onButtonClick, activeContent }) => {
    const [menus, setMenus] = useState([]);
    const [expanded, setExpanded] = useState({});

    useEffect(() => {
        const getMenu = localStorage.getItem('user');
        const menu = getMenu ? JSON.parse(getMenu) : { menus: [] };
        setMenus(menu.menus || []);

        const handleResize = () => {
            if (window.innerWidth > 768) {
                setExpanded({});
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const menuIcons = {
        Dashboard: Dash,
        Invoices: Invoice,
        Payment: Pay,
        Product: Pro,
        Purchase: Purc,
        Report: Rep,
        Customers: Cus,
        Suppliers: Sup,
        Users: Use,
        Notification: Not,
        Settings: Set,
    };

    const handleToggleExpand = (title) => {
        setExpanded((prev) => ({
            ...prev,
            [title]: !prev[title],
        }));
    };

    const renderMenu = menus.map((menu) => {
        const hasSubmenu = menu.submenu && menu.submenu.length > 0;
        const isActive = activeContent === menu.menu_name;

        return (
            <div key={menu.menu_name} className="sidebar-item">
                <button 
                    className={`sidebar-menu button ${isActive ? 'active' : ''}`}
                    onClick={() => hasSubmenu ? handleToggleExpand(menu.menu_name) : onButtonClick(menu.menu_name)}
                >
                    <img src={menuIcons[menu.menu_name]} alt={menu.menu_name} className='px-3' style={{ width: '50px' }} />
                    <span>{menu.menu_name}</span>
                    {hasSubmenu && (
                        <span className="caret mx-3">
                            {expanded[menu.menu_name] ? <FontAwesomeIcon icon={faChevronDown} /> : <FontAwesomeIcon icon={faChevronRight} />}
                        </span>
                    )}
                </button>

                {hasSubmenu && expanded[menu.menu_name] && (
                    <div className={`submenu ${expanded[menu.menu_name] ? 'open' : ''}`}>
                        {menu.submenu.map((submenu) => (
                            <button
                                key={submenu.title}
                                className={`sidebar-submenu button ${activeContent === submenu.path ? 'active' : ''}`}
                                onClick={() => onButtonClick(submenu.path)}
                            >
                                {submenu.title}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        );
    });

    return (
        <div className="sidebar">
            <img src={Logo2} alt="Logo" className='mx-2 mt-2'/>
            <div className="sidebar-menu">
                {renderMenu}
            </div>
        </div>
    );
};

export default Sidebar;

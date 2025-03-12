// import React, { useState, useEffect } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons';
// import { Dash, Logo2, Invoice, Pay, Pro, Purc, Rep, Cus, Sup, Use } from '../assets/images';
// import '../style.css';

// const Sidebar = ({ onButtonClick, activeContent }) => {
//     const [menus, setMenus] = useState([]);
//     const [expanded, setExpanded] = useState({});
//     const [isSidebarVisible, setIsSidebarVisible] = useState(false);
//     const [isMobile, setIsMobile] = useState(false);

//     useEffect(() => {
//         const getMenu = localStorage.getItem('user');
//         const menu = getMenu ? JSON.parse(getMenu) : { menus: [] };
//         setMenus(menu.menus || []);

//         const checkIfMobile = () => {
//             setIsMobile(window.innerWidth <= 768);
//         };

//         checkIfMobile();

//         const handleResize = () => {
//             checkIfMobile();
//             if (window.innerWidth > 768) {
//                 setIsSidebarVisible(false);
//             }
//         };

//         window.addEventListener('resize', handleResize);

//         return () => {
//             window.removeEventListener('resize', handleResize);
//         };
//     }, []);

//     const menuIcons = {
//         Dashboard: Dash,
//         Invoices: Invoice,
//         Payment: Pay,
//         Product: Pro,
//         Purchase: Purc,
//         Report: Rep,
//         Customers: Cus,
//         Suppliers: Sup,
//         Users: Use,
//     };

//     const handleToggleExpand = (menuId, event) => {
//         event.stopPropagation();
        
//         setExpanded((prev) => ({
//             ...prev,
//             [menuId]: !prev[menuId],
//         }));
//     };

//     const toggleSidebar = () => {
//         setIsSidebarVisible(prev => !prev);
//     };

//     const handleMenuClick = (menuName) => {
//         onButtonClick(menuName);
        
//         if (isMobile) {
//             setIsSidebarVisible(false);
//         }
//     };

//     const handleSubmenuClick = (childMenuName, event) => {
//         event.stopPropagation();
        
//         onButtonClick(childMenuName);
        
//         if (isMobile) {
//             setIsSidebarVisible(false);
//         }
//     };

//     const renderMenu = menus.map((menuItem) => {
//         const hasChildMenu = menuItem.child_menu && menuItem.child_menu.length > 0;
//         const isActive = activeContent === menuItem.parent_menu.menu_name;
//         const menuName = menuItem.parent_menu.menu_name;

//         return (
//             <div key={menuItem.parent_menu.id} className="sidebar-item">
//                 <button 
//                     className={`sidebar-menu button ${isActive ? 'active' : ''}`}
//                     onClick={() => hasChildMenu 
//                         ? null
//                         : handleMenuClick(menuName)
//                     }
//                 >
//                     <img 
//                         src={menuIcons[menuName]} 
//                         alt={menuName} 
//                         className='px-3' 
//                         style={{ width: '50px' }} 
//                     />
//                     <span>{menuName}</span>
//                     {hasChildMenu && (
//                         <span 
//                             className="caret mx-3"
//                             onClick={(e) => handleToggleExpand(menuItem.parent_menu.id, e)}
//                         >
//                             {expanded[menuItem.parent_menu.id] 
//                                 ? <FontAwesomeIcon icon={faChevronDown} /> 
//                                 : <FontAwesomeIcon icon={faChevronRight} />
//                             }
//                         </span>
//                     )}
//                 </button>

//                 {hasChildMenu && expanded[menuItem.parent_menu.id] && (
//                     <div className={`submenu ${expanded[menuItem.parent_menu.id] ? 'open' : ''}`}>
//                         {menuItem.child_menu.map((childMenu) => (
//                             <button
//                                 key={childMenu.id}
//                                 className={`sidebar-submenu button ${
//                                     activeContent === childMenu.child_menu_name ? 'active' : ''
//                                 }`}
//                                 onClick={(e) => handleSubmenuClick(childMenu.child_menu_name, e)}
//                             >
//                                 {childMenu.child_menu_name}
//                             </button>
//                         ))}
//                     </div>
//                 )}
//             </div>
//         );
//     });

//     return (
//         <>
//            <input 
//                 type="checkbox" 
//                 id="nav-toggle" 
//                 className="nav-toggle" 
//                 checked={isSidebarVisible}
//                 onChange={toggleSidebar}
//             />
//           <div className={`sidebar ${isSidebarVisible ? 'sidebar-visible' : ''}`}>
//             <img src={Logo2} alt="Logo" className='mx-2 mt-2'/>
//             <div className="sidebar-menu">
//                 {renderMenu}
//             </div>
//           </div>

//           {isSidebarVisible && (
//                 <div 
//                     className="sidebar-overlay" 
//                     onClick={() => setIsSidebarVisible(false)}
//                 />
//             )}
//         </>
//     );
// };

// export default Sidebar;

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronRight, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { Dash, Logo2, Invoice, Pay, Pro, Purc, Rep, Cus, Sup, Use } from '../assets/images';
import '../style.css';

const Sidebar = ({ onButtonClick, activeContent }) => {
    const [menus, setMenus] = useState([]);
    const [expanded, setExpanded] = useState({});
    const [isSidebarVisible, setIsSidebarVisible] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const getMenu = localStorage.getItem('user');
        const menu = getMenu ? JSON.parse(getMenu) : { menus: [] };
        setMenus(menu.menus || []);

        const checkIfMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkIfMobile();

        const handleResize = () => {
            checkIfMobile();
            if (window.innerWidth > 768) {
                setIsSidebarVisible(false);
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
    };

    const handleToggleExpand = (menuId, event) => {
        event.stopPropagation();
        
        setExpanded((prev) => ({
            ...prev,
            [menuId]: !prev[menuId],
        }));
    };

    const toggleSidebar = () => {
        setIsSidebarVisible(prev => !prev);
    };

    const handleMenuClick = (menuName) => {
        onButtonClick(menuName);
        
        if (isMobile) {
            setIsSidebarVisible(false);
        }
    };

    const handleSubmenuClick = (childMenuName, event) => {
        event.stopPropagation();
        
        onButtonClick(childMenuName);
        
        if (isMobile) {
            setIsSidebarVisible(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        
        window.location.href = '/';
    };

    const renderMenu = menus.map((menuItem) => {
        const hasChildMenu = menuItem.child_menu && menuItem.child_menu.length > 0;
        const isActive = activeContent === menuItem.parent_menu.menu_name;
        const menuName = menuItem.parent_menu.menu_name;

        return (
            <div key={menuItem.parent_menu.id} className="sidebar-item">
                <button 
                    className={`sidebar-menu button ${isActive ? 'active' : ''}`}
                    onClick={() => hasChildMenu 
                        ? null
                        : handleMenuClick(menuName)
                    }
                >
                    <img 
                        src={menuIcons[menuName]} 
                        alt={menuName} 
                        className='px-3' 
                        style={{ width: '50px' }} 
                    />
                    <span>{menuName}</span>
                    {hasChildMenu && (
                        <span 
                            className="caret mx-3"
                            onClick={(e) => handleToggleExpand(menuItem.parent_menu.id, e)}
                        >
                            {expanded[menuItem.parent_menu.id] 
                                ? <FontAwesomeIcon icon={faChevronDown} /> 
                                : <FontAwesomeIcon icon={faChevronRight} />
                            }
                        </span>
                    )}
                </button>

                {hasChildMenu && expanded[menuItem.parent_menu.id] && (
                    <div className={`submenu ${expanded[menuItem.parent_menu.id] ? 'open' : ''}`}>
                        {menuItem.child_menu.map((childMenu) => (
                            <button
                                key={childMenu.id}
                                className={`sidebar-submenu button ${
                                    activeContent === childMenu.child_menu_name ? 'active' : ''
                                }`}
                                onClick={(e) => handleSubmenuClick(childMenu.child_menu_name, e)}
                            >
                                {childMenu.child_menu_name}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        );
    });

    return (
        <>
           <input 
                type="checkbox" 
                id="nav-toggle" 
                className="nav-toggle" 
                checked={isSidebarVisible}
                onChange={toggleSidebar}
            />
          <div className={`sidebar ${isSidebarVisible ? 'sidebar-visible' : ''}`}>
            <img src={Logo2} alt="Logo" className='mx-2 mt-2'/>
            <div className="sidebar-menu">
                {renderMenu}
            </div>
            
            {/* Logout Button */}
            <div className="logout-container mt-2" style={{ marginTop: 'auto' }}>
                <button 
                    className="sidebar-menu button"
                    onClick={handleLogout}
                    style={{ 
                        outline: 'none',
                        boxShadow: 'none',
                        border: '0',
                        color: '#E5E4E6',
                        backgroundColor: '#7A0091',
                        fontSize: '14px'
                    }}
                >
                    <FontAwesomeIcon 
                        icon={faSignOutAlt} 
                        className='px-3' 
                        style={{ width: '20px', backgroundColor: '#7A0091' }} 
                    />
                    <span>Logout</span>
                </button>
            </div>
          </div>

          {isSidebarVisible && (
                <div 
                    className="sidebar-overlay" 
                    onClick={() => setIsSidebarVisible(false)}
                />
            )}
        </>
    );
};

export default Sidebar;
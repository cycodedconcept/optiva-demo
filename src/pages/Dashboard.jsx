import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import Sidebar from './Sidebar';
import Cards from './Cards';
import Invoice from './Invoice';
import CreateInvoice from './CreateInvoice';
import Sorted from './Sorted';
import Products from './Products';
import Payment from './Payment';
import Purchase from './Purchase';
import Report from './Report';
import Sales from './Sales';
import Customer from './Customer';
import Users from './Users';
import Suppliers from './Suppliers'
import Category from './support/Category';
import Discount from './Discount'
import '../style.css'
import { Us } from '../assets/images'

const Dashboard = () => {
  const { tab } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize activeContent based on URL param, state, or localStorage
  const [activeContent, setActiveContent] = useState(() => {
    // First, check if tab parameter exists in URL
    if (tab) {
      // Convert URL format (kebab-case) to component format (Title Case)
      const formattedTab = tab.split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      return formattedTab;
    }
    
    // If no tab in URL, check localStorage
    return localStorage.getItem('activeContent') || 'Dashboard';
  });
  
  // Update localStorage whenever activeContent changes
  useEffect(() => {
    localStorage.setItem('activeContent', activeContent);
  }, [activeContent]);

  // When a sidebar button is clicked, update state and navigate
  const handleButtonClick = (content) => {
    // Specific handling for known variations
    const contentMap = {
      'Sales Report': 'Sales Report',
      'Stock History': 'Stock History'
      // Add other known variations if needed
    };
  
    // Use mapped content or keep original
    const standardizedContent = contentMap[content] || content;
  
    console.log('Button Clicked - Original:', content);
    console.log('Standardized Content:', standardizedContent);
  
    // Set active content with standardized content
    setActiveContent(standardizedContent);
  
    // Convert to URL-friendly slug, ensuring lowercase
    const slug = standardizedContent.toLowerCase().replace(/\s+/g, '-');
  
    // Navigate to the specific route
    navigate(`/dashboard/${slug}`);
  };

  const renderContent = () => {
    const contentMap = {
      'Dashboard': <Cards />,
      'Invoice List': <Invoice />,
      'Sort Orders': <Sorted />,
      'Create Invoice': <CreateInvoice />,
      'Product List': <Products />,
      'Payment List': <Payment />,
      'Purchase': <Purchase />,
      'Stock History': <Report />,
      'Sales Report': <Sales />,
      'Suppliers': <Suppliers />,
      'Users': <Users />,
      'Category': <Category />,
      'Customers': <Customer />,
      'Discount': <Discount />
    };
  
    console.log('Current Active Content:', activeContent); // Debugging log
  
    // Try exact match first
    if (contentMap[activeContent]) {
      return contentMap[activeContent];
    }
  
    // If no exact match, try some fallback strategies
    const normalizedContent = activeContent.trim();
    const foundComponent = Object.keys(contentMap).find(
      key => key.toLowerCase() === normalizedContent.toLowerCase()
    );
  
    if (foundComponent) {
      return contentMap[foundComponent];
    }
  
    console.warn(`No component found for: ${activeContent}`);
    return <Cards />; // Default fallback
  };

  // useEffect(() => {
  //   console.log('Current Active Content (useEffect):', activeContent);
  //   console.log('Current URL Parameter:', tab);
  // }, [activeContent, tab]);

  // Update activeContent when URL changes (e.g., when browser back/forward buttons are clicked)
  useEffect(() => {
    if (tab) {
      // Convert URL format (kebab-case) to component format (Title Case)
      const formattedTab = tab.split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
      
      setActiveContent(formattedTab);
    }
  }, [tab]);

  const getItem = localStorage.getItem("user");
  const theItem = JSON.parse(getItem);
  const itemName = theItem.user_name;

  const upperLetter = (string) => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.clear();
    window.location.href = '/IVMS';
  };
  
  return (
    <>
      <Sidebar onButtonClick={handleButtonClick} activeContent={activeContent}/>
      <div className="main-content">
          <header className='d-flex justify-content-between'>
              <div className="head-left d-flex">
                <label htmlFor="nav-toggle" className="nav-toggle-label">
                  <FontAwesomeIcon icon={faBars} style={{fontSize: '25px'}} className="my-1"/>
                </label>
                <h3 className="mx-3 vega">{upperLetter(activeContent)}</h3>
              </div>
              <div className="head-right d-flex">
                  <p className='mt-1 mr-3'><b>{itemName}</b></p>
                  <img src={Us} alt="" className="mr-4 h-75"/>
                  <FontAwesomeIcon icon={faRightFromBracket} className="mt-2" onClick={handleLogout}/>
              </div>
          </header>

          {renderContent()}
      </div>
    </>
  );
};

export default Dashboard;



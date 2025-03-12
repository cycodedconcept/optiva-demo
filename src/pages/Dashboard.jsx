import React, { useState, useEffect } from 'react';
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
  const [activeContent, setActiveContent] = useState('Dashboard');

  const getItem = localStorage.getItem("user");
  const theItem = JSON.parse(getItem);
  const itemName = theItem.user_name;

  const handleButtonClick = (content) => {
    setActiveContent(content);
  };

  const upperLetter = (string) => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    window.location.href = '/';
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

          {activeContent === 'Dashboard' && <Cards /> }
          {activeContent === 'Invoice List' && <Invoice /> }
          {activeContent === 'sort orders' && <Sorted /> }
          {activeContent === 'Create Invoice' && <CreateInvoice /> }
          {activeContent === 'Product List' && <Products /> }
          {activeContent === 'Payment List' && <Payment /> }
          {activeContent === 'Purchase' && <Purchase /> }
          {activeContent === 'stock history' && <Report /> }
          {activeContent === 'sales report' && <Sales /> }
          {activeContent === 'Suppliers' && <Suppliers /> }
          {activeContent === 'Users' && <Users /> }
          {activeContent === 'Category' && <Category /> }
          {activeContent === 'Customers' && <Customer /> }
          {activeContent === 'Discount' && <Discount /> }
      </div>
    </>
  )
}

export default Dashboard

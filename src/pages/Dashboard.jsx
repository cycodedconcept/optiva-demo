import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faBell, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import Sidebar from './Sidebar';
import Cards from './Cards';
import Invoice from './Invoice';
import CreateInvoice from './CreateInvoice';
import Products from './Products';
import Payment from './Payment';
import Purchase from './Purchase';
import Report from './Report';
import Customer from './Customer';
import Users from './Users';
import Suppliers from './Suppliers'
import Category from './support/Category';
import Discount from './Discount'
import '../style.css'
import { Us } from '../assets/images'

const Dashboard = () => {
  const [activeContent, setActiveContent] = useState('Dashboard');

  const handleButtonClick = (content) => {
    setActiveContent(content);
  };

  const upperLetter = (string) => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  return (
    <>
      <Sidebar onButtonClick={handleButtonClick} activeContent={activeContent}/>
      <div className="main-content">
          <header className='d-flex justify-content-between'>
              <div className="head-left d-flex">
                <FontAwesomeIcon icon={faBars} style={{fontSize: '25px'}} className="my-1"/>
                <h3 className="mx-3 vega">{upperLetter(activeContent)}</h3>
              </div>
              <div className="head-right d-flex">
                  <FontAwesomeIcon icon={faBell} className="mr-4 mt-2"/>
                  <img src={Us} alt="" className="mr-4 h-75"/>
                  <FontAwesomeIcon icon={faRightFromBracket} className="mt-2"/>
              </div>
          </header>

          {activeContent === 'Dashboard' && <Cards /> }
          {activeContent === 'Invoice List' && <Invoice /> }
          {activeContent === 'Create Invoice' && <CreateInvoice /> }
          {activeContent === 'Product List' && <Products /> }
          {activeContent === 'Payment List' && <Payment /> }
          {activeContent === 'Purchase' && <Purchase /> }
          {activeContent === 'stock history' && <Report /> }
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

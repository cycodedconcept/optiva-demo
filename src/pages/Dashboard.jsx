import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faBell, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import Sidebar from './Sidebar'
import '../style.css'
import { Us } from '../assets/images'

const Dashboard = () => {
  const [activeContent, setActiveContent] = useState('dashboard');

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
      </div>
    </>
  )
}

export default Dashboard

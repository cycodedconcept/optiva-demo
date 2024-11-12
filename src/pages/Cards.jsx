import React from 'react'
import { Ts, Tcus, Tsold, Torder} from '../assets/images';

const Cards = () => {
    const cardItems = [
        {
          id: 0,
          icon: Ts,
          content: "TOTAL SALES",
          cvalue: "₦890,790,812",
          grp: "406%"
        },
        {
          id: 1,
          icon: Tsold,
          content: "ITEM SOLD",
          cvalue: "8,627",
          grp: "0.02%",
        },
        {
          id: 2,
          icon: Torder,
          content: "TOTAL ORDERS",
          cvalue: "2,825",
          grp: "1.04%"
        },
        {
          id: 3,
          icon: Tcus,
          content: "TOTAL CUSTOMERS",
          cvalue: "320",
          grp: "4.06%"
        }
      ]
  return (
    <>
      
    </>
  )
}

export default Cards

import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";

const ShopSelector = ({ shops, onShopSelectionChange, initialSelectedShops = [] }) => {
  const [expanded, setExpanded] = useState(false);
  const [selectedShops, setSelectedShops] = useState([]);

  const toggleAccordion = () => {
    setExpanded((prev) => !prev);
  };

  const handleCheckboxChange = (id) => {
    const newSelectedShops = selectedShops.includes(id) 
      ? selectedShops.filter(shopId => shopId !== id) 
      : [...selectedShops, id];
      
    setSelectedShops(newSelectedShops);
    onShopSelectionChange(newSelectedShops);
  };

  // Log selectedShops whenever it updates
  useEffect(() => {
    console.log("Selected Shops:", selectedShops);
  }, [selectedShops]);

  useEffect(() => {
    if (initialSelectedShops && initialSelectedShops.length > 0) {
      setSelectedShops(initialSelectedShops);
    }
  }, [initialSelectedShops]);

  return (
    <div style={{ width: "100%", border: "1px solid #DDE5E9", borderRadius: "5px" }}>
      <div
        style={{
          padding: "14px",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
        onClick={toggleAccordion}
      >
        <span>Select Shops</span>
        <span>{expanded ? <FontAwesomeIcon icon={faCaretUp} /> : <FontAwesomeIcon icon={faCaretDown} />}</span>
      </div>
      {expanded && (
        <div style={{ padding: "15px", borderTop: "1px solid #DDE5E9" }}>
          {shops.map((shop) => (
            <div
              key={shop.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <span>{shop.shop_name}</span>
              <div className="text-right">
                <input
                  type="checkbox"
                  checked={selectedShops.includes(shop.id)}
                  onChange={() => handleCheckboxChange(shop.id)}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShopSelector;


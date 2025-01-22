import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';

const ShopSelector = ({shops}) => {
  const [expanded, setExpanded] = useState(false);
  const [selectedShops, setSelectedShops] = useState([]);

  const toggleAccordion = () => {
    setExpanded((prev) => !prev);
  };

  const handleCheckboxChange = (id) => {
    setSelectedShops((prev) =>
      prev.includes(id) ? prev.filter((shopId) => shopId !== id) : [...prev, id]
    );
  };

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

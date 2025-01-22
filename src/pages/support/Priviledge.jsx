import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';

const Priviledge = ({ data }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [checkedPrivileges, setCheckedPrivileges] = useState({});
  const [selectedRoles, setSelectedRoles] = useState(null); 
  const [selectedPrivileges, setSelectedPrivileges] = useState([]);

  // Toggle dropdown
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  // Handle search input change
  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  // Handle checkbox toggle
  const handleCheckboxChange = (roleId, privilegeId) => {
    setCheckedPrivileges((prevState) => ({
      ...prevState,
      [roleId]: {
        ...prevState[roleId],
        [privilegeId]: !prevState[roleId]?.[privilegeId],
      },
    }));
  };


  const handleRoleSelection = (role_id) => {
    setSelectedRoles(role_id);
    setSelectedPrivileges([]);
  };

  const handlePrivilegeSelection = (privilege_id) => {
    setSelectedPrivileges((prevState) =>
      prevState.includes(privilege_id)
        ? prevState.filter((id) => id !== privilege_id)
        : [...prevState, privilege_id]
    );
  };

  // Filter data based on search query
  const filteredData = data.filter((role) =>
    role.role_type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ width: "100%" }}>
      {/* Select Input */}
      <div
        style={{
          border: "1px solid #DDE5E9",
          padding: "15px",
          cursor: "pointer",
          borderRadius: "5px",
        }}
        onClick={toggleDropdown}
      >
        <div className="d-flex justify-content-between">
            Select Role Privileges
            <FontAwesomeIcon icon={faCaretDown} className="text-right"/>
        </div>
        

        <div >
        </div>
      </div>

      {/* Dropdown */}
      {isDropdownOpen && (
        <div
          style={{
            border: "1px solid #ccc",
            borderRadius: "5px",
            marginTop: "5px",
            padding: "10px",
            maxHeight: "300px",
            overflowY: "auto",
            backgroundColor: "#fff",
          }}
        >
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search roles..."
            value={searchQuery}
            onChange={handleSearchChange}
            style={{
              padding: "5px",
              marginBottom: "10px",
              border: "1px solid #ccc",
              borderRadius: "5px",
              width: '100%'
            }}
          />

          {/* Accordion */}
          {filteredData.map((role) => (
            <div key={role.role_id} style={{ marginBottom: "10px" }}>
                {/* Accordion Header */}
                <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer",
                    padding: "5px 10px",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    backgroundColor: "#f9f9f9",
                }}
                onClick={() =>
                    setCheckedPrivileges((prevState) => ({
                    ...prevState,
                    [role.role_id]: {
                        ...prevState[role.role_id],
                        isOpen: !prevState[role.role_id]?.isOpen,
                    },
                    }))
                }
                >
                {/* Checkbox to get role_id */}
                <input
                    type="radio"
                    name="role"
                    checked={selectedRoles === role.role_id}
                    onClick={(e) => e.stopPropagation()}
                    onChange={() => handleRoleSelection(role.role_id)}
                    style={{ marginRight: "10px", width: "4%" }}
                />
                <div style={{ flex: 1 }}>{role.role_type}</div>
                <span>{checkedPrivileges[role.role_id]?.isOpen ? "-" : "+"}</span>
                </div>

                {/* Accordion Content */}
                {checkedPrivileges[role.role_id]?.isOpen &&
                role.privileges.map((privilege) => (
                    <div
                    key={privilege.id}
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "5px 10px",
                    }}
                    >
                    <span>{privilege.privileges}</span>
                    <input
                        type="checkbox"
                        checked={selectedPrivileges.includes(privilege.id)}
                        
                        onChange={() => handlePrivilegeSelection(privilege.id)}
                        style={{
                        width: "4%",
                        }}
                    />
                    </div>
                ))}
            </div>
          ))}

<div>
<h3>Selected Roles and Privileges:</h3>
<pre>
          {JSON.stringify(
            {
              role_type_id: selectedRoles,
              role_privilege_ids: selectedPrivileges,
            },
            null,
            2
          )}
        </pre>
      </div>
        </div>
      )}
    </div>
    
  );

  
};

export default Priviledge;

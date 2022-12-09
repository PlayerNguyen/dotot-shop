import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";

export default function AdminProduct() {
  const [searchBarValue, setSearchBarValue] = useState("");

  const handleSearchBarChange = (e) => {
    setSearchBarValue(e.target.value);
  };
  return (
    <div className="adminProduct-wrapper">
      <div className="font-bold text-3xl py-3">Products</div>
      <div>
        {/* Search */}
        <div className="form-control flex flex-row gap-3">
          <input
            className="input input-sm input-primary flex-1"
            type={"search"}
            placeholder="Search with ID, Name,..."
            onChange={handleSearchBarChange}
            value={searchBarValue}
          />
          <button
            className="btn btn-sm btn-primary"
            disabled={searchBarValue.length === 0}
          >
            <FaSearch />
          </button>
        </div>
      </div>
    </div>
  );
}

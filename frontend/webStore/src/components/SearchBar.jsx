import React, { useState, useRef, useEffect } from "react";

export default function SearchBar({ categories, filters, onChange }) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleCategorySelect = (categoryId) => {
        onChange({ target: { name: "categoryId", value: categoryId } });
        setDropdownOpen(false);
    };

    const selectedCategoryName =
        filters.categoryId === ""
            ? "All Categories"
            : categories.find((cat) => cat.id === filters.categoryId)?.name || "All Categories";

    return (
        <div className="search-bar" style={{ marginBottom: "1rem", display: "flex", gap: "0.5rem" }}>
            <div
                className="custom-dropdown"
                ref={dropdownRef}
                style={{ position: "relative", minWidth: "150px" }}
            >
                <button
                    type="button"
                    className="btn"
                    onClick={() => setDropdownOpen((open) => !open)}
                >
                    {selectedCategoryName}
                    <span style={{ float: "right", marginLeft: "1rem" }}>▼</span>
                </button>

                {dropdownOpen && (
                    <ul
                        className="dropdown-menu"
                        style={{listStyle: "none"}}
                    >
                        <li
                            key="all"
                            className="dropdown-item"
                            onClick={() => handleCategorySelect("")}
                        >
                            All Categories
                        </li>
                        {categories.map((cat) => (
                            <li
                                key={cat.id}
                                className="dropdown-item"
                                onClick={() => handleCategorySelect(cat.id)}
                            >
                                {cat.name}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <input
                type="text"
                name="searchText"
                placeholder="Search products..."
                value={filters.searchText || ""}
                onChange={onChange}
                style={{ width: "100%" }}
            />
        </div>
    );
}

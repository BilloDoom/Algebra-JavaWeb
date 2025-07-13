import { useState, useEffect } from "react";

export default function FiltersPanel({ filters, categories, onChange, onReset }) {
    const [localMin, setLocalMin] = useState(filters.priceMin);
    const [localMax, setLocalMax] = useState(filters.priceMax);

    useEffect(() => {
        setLocalMin(filters.priceMin);
        setLocalMax(filters.priceMax);
    }, [filters]);

    const handleApplyFilters = () => {
        onChange({ target: { name: "priceMin", value: localMin } });
        onChange({ target: { name: "priceMax", value: localMax } });
    };

    const handleMinChange = (e) => {
        const value = Math.min(Number(e.target.value), localMax);
        setLocalMin(value);
    };

    const handleMaxChange = (e) => {
        const value = Math.max(Number(e.target.value), localMin);
        setLocalMax(value);
    };

    return (
        <div className="filters-panel">
            <div>
                <label htmlFor="category">Category</label>
                <select
                    id="category"
                    name="categoryId"
                    value={filters.categoryId}
                    onChange={onChange}
                    className="dropdown"
                >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                            {cat.name}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label>Price Range</label>
                <div className="range-wrapper">
                    <input
                        type="range"
                        name="priceMin"
                        min="0"
                        max="1000"
                        value={localMin}
                        onChange={handleMinChange}
                        style={{
                            background: `linear-gradient(to right,
      rgba(128, 225, 255, 0.3) 0%,
      rgba(128, 225, 255, 0.3) ${(localMin / 1000) * 100}%,
      rgba(255, 255, 255, 0.2) ${(localMin / 1000) * 100}%,
      rgba(255, 255, 255, 0.2) 100%)`,
                        }}
                    />

                    <input
                        type="range"
                        name="priceMax"
                        min="0"
                        max="1000"
                        value={localMax}
                        onChange={handleMaxChange}
                        style={{
                            background: `linear-gradient(to right,
      rgba(128, 225, 255, 0.3) 0%,
      rgba(128, 225, 255, 0.3) ${(localMax / 1000) * 100}%,
      rgba(255, 255, 255, 0.2) ${(localMax / 1000) * 100}%,
      rgba(255, 255, 255, 0.2) 100%)`,
                        }}
                    />


                </div>
                <div className="range-labels">
                    <span>${localMin}</span>
                    <span>{localMax >= 1000 ? "∞" : `$${localMax}`}</span>
                </div>
            </div>

            <button className="btn" onClick={handleApplyFilters}>
                Apply Filters
            </button>
            <button className="btn secondary" onClick={onReset}>
                Reset Filters
            </button>
        </div>
    );
}

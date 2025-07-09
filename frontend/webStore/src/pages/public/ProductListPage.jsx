import { useEffect, useState } from "react";
import { addToCart, getAllProducts, getAllCategories } from "../../api/api";
import { useNavigate } from "react-router-dom";

export default function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    categoryId: "",
    priceMin: 0,
    priceMax: 1000,
  });

  const navigate = useNavigate();

  useEffect(() => {
    loadCategories();
    loadProducts();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [filters]);

  const loadProducts = async () => {
    const data = await getAllProducts(filters);
    setProducts(data);
  };

  const loadCategories = async () => {
    const data = await getAllCategories();
    setCategories(data);
  };

  const handleAddToCart = (product) => {
    const token = localStorage.getItem("jwt");

    if (!token) {
      const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
      const existingIndex = existingCart.findIndex((p) => p.id === product.id);

      if (existingIndex >= 0) {
        existingCart[existingIndex].quantity += 1;
      } else {
        existingCart.push({
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
        });
      }

      localStorage.setItem("cart", JSON.stringify(existingCart));
      alert("Added to cart (saved locally).");
    } else {
      addToCart(product.id)
        .then(() => alert("Added to cart."))
        .catch(() => alert("Failed to add to cart."));
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: name === "priceMin" || name === "priceMax" ? Number(value) : value,
    }));
  };

  const resetFilters = () => {
    setFilters({
      categoryId: "",
      priceMin: 0,
      priceMax: 1000,
    });
  };

  return (
    <div className="page-container max-w-4xl mx-auto">
      <h1 className="section-title">Product List</h1>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4 items-end glass-card">
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            name="categoryId"
            value={filters.categoryId}
            onChange={handleFilterChange}
            className="border px-3 py-1 rounded"
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
          <label className="block text-sm font-medium mb-1">Price Min</label>
          <input
            type="number"
            name="priceMin"
            min={0}
            max={1000}
            value={filters.priceMin}
            onChange={handleFilterChange}
            className="border px-3 py-1 rounded w-24"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Price Max</label>
          <input
            type="number"
            name="priceMax"
            min={0}
            max={1000}
            value={filters.priceMax}
            onChange={handleFilterChange}
            className="border px-3 py-1 rounded w-24"
          />
        </div>

        <button
          onClick={resetFilters}
          className="btn"
        >
          Reset Filters
        </button>
      </div>

      {/* Product List */}
      <ul className="space-y-4">
        {products.map((p) => (
          <li
            key={p.id}
            className="glass-card cursor-pointer"
          >
            <div onClick={() => navigate(`/products/${p.id}`)} className="mb-2">
              <p className="font-semibold">{p.name}</p>
              <p className="text-gray-400">${p.price.toFixed(2)}</p>
              <p className="text-sm text-gray-500">In stock: {p.quantity}</p>
            </div>

            <button
              className="btn"
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart(p);
              }}
            >
              Add to Cart
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

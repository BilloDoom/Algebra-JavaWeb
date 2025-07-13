import { useEffect, useState } from "react";
import { getAllProducts, getAllCategories, addToCart } from "../../api/api";

import FiltersPanel from "../../components/FiltersPanel";
import ProductCard from "../../components/ProductCard";
import Spinner from "../../components/Spinner";

export default function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    categoryId: "",
    priceMin: 0,
    priceMax: 1000,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCategories();
    loadProducts();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [filters]);

  const loadCategories = async () => {
    const data = await getAllCategories();
    setCategories(data);
  };

  const loadProducts = async () => {
    setLoading(true);
    const timeoutId = setTimeout(() => setLoading(false), 10000);
    try {
      const data = await getAllProducts(filters);
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
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
    setFilters({ categoryId: "", priceMin: 0, priceMax: 1000 });
  };

  return (
    <div className="page-container">
      <h1 className="section-title">Product List</h1>
      <div className="product-layout">
        <FiltersPanel
          filters={filters}
          categories={categories}
          onChange={handleFilterChange}
          onReset={resetFilters}
        />

        <div className="products-grid">
          {loading ? (
            <Spinner />
          ) : (
            <ul className="product-grid">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

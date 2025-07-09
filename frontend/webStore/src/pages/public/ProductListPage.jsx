import { useEffect, useState } from "react";
import { getAllProducts } from "../../api/api";
import { useNavigate } from "react-router-dom";

export default function ProductListPage() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const data = await getAllProducts();
    setProducts(data);
  };

const handleAddToCart = (product) => {
  const token = localStorage.getItem("jwt");

  if (!token) {
    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingIndex = existingCart.findIndex(p => p.id === product.id);
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
    addToCartBackend(product.id)
      .then(() => alert("Added to cart."))
      .catch(() => alert("Failed to add to cart."));
  }
};



  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Product List</h1>

      <ul className="space-y-4">
        {products.map((p) => (
          <li
            key={p.id}
            className="p-4 border rounded hover:bg-gray-50 transition"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
          >
            <div
              onClick={() => navigate(`/products/${p.id}`)}
              className="cursor-pointer"
            >
              <p className="font-semibold">{p.name}</p>
              <p className="text-gray-600">${p.price.toFixed(2)}</p>
              <p className="text-sm text-gray-500">In stock: {p.quantity}</p>
            </div>

            <button
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={() => handleAddToCart(p)}
            >
              Add to Cart
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

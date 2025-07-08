import { useEffect, useState } from "react";
import { getAllProducts, deleteProduct } from "../api/api";
import { useNavigate } from "react-router-dom";

export default function ProductListPage() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => {
    getAllProducts().then(setProducts);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await deleteProduct(id);
      loadProducts(); // refresh list
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Product List</h1>

      <button
        onClick={() => navigate("/products/new")}
        className="mb-4 px-4 py-2 bg-green-600 text-white rounded"
      >
        + Create New Product
      </button>

      <ul className="space-y-4">
        {products.map((p) => (
          <li
            key={p.id}
            className="p-4 border rounded flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{p.name}</p>
              <p className="text-gray-600">${p.price.toFixed(2)}</p>
            </div>

            <div className="space-x-2">
              <button
                onClick={() => navigate(`/products/edit/${p.id}`)}
                className="px-3 py-1 bg-blue-600 text-white rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(p.id)}
                className="px-3 py-1 bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

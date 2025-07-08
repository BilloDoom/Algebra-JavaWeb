import { useEffect, useState } from "react";
import {
  createProduct,
  updateProduct,
  getProductById,
  deleteProduct,
  getAllCategories,
} from "../api/api";
import { useNavigate, useParams } from "react-router-dom";

export default function ProductEditPage() {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: 0,
    quantity: 0,
    category: { id: "", name: "" },
    images: [],
    averageRating: 0,
    totalRatings: 0,
  });

  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  useEffect(() => {
    // Fetch categories
    getAllCategories().then(setCategories);

    if (isEdit) {
      getProductById(id).then((data) => {
        setProduct({
          ...data,
          category: data.category || { id: "", name: "" },
        });
      });
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "categoryId") {
      const selectedCategory = categories.find((c) => c.id === parseInt(value));
      setProduct((prev) => ({
        ...prev,
        category: selectedCategory || { id: "", name: "" },
      }));
    } else {
      setProduct((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const productPayload = {
      ...product,
      categoryId: product.category?.id,
    };

    if (isEdit) await updateProduct(id, productPayload);
    else await createProduct(productPayload);

    navigate("/products");
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await deleteProduct(id);
      navigate("/products");
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-6">
      <h2 className="text-xl font-semibold">
        {isEdit ? "Edit Product" : "Create Product"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          placeholder="Name"
          className="w-full p-2 border rounded"
          value={product.name}
          onChange={handleChange}
        />
        <textarea
          name="description"
          placeholder="Description"
          className="w-full p-2 border rounded"
          value={product.description}
          onChange={handleChange}
        />
        <input
          name="price"
          type="number"
          placeholder="Price"
          className="w-full p-2 border rounded"
          value={product.price}
          onChange={(e) =>
            setProduct({ ...product, price: parseFloat(e.target.value) })
          }
        />
        <input
          name="quantity"
          type="number"
          placeholder="Quantity"
          className="w-full p-2 border rounded"
          value={product.quantity}
          onChange={(e) =>
            setProduct({ ...product, quantity: parseInt(e.target.value) })
          }
        />

        {/* Category Dropdown */}
        <select
          name="categoryId"
          className="w-full p-2 border rounded"
          value={product.category?.id || ""}
          onChange={handleChange}
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          {isEdit ? "Update" : "Create"} Product
        </button>

        {isEdit && (
          <button
            type="button"
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded ml-4"
          >
            Delete
          </button>
        )}
      </form>

      {isEdit && (
        <div className="mt-6">
          <h3 className="font-semibold text-lg mb-2">Images</h3>
          <div className="flex gap-4 flex-wrap">
            {product.images?.map((img) => (
              <img
                key={img.id}
                src={img.imageUrl}
                alt="Product"
                className="w-24 h-24 object-cover border rounded"
              />
            ))}
            {!product.images?.length && <p>No images available.</p>}
          </div>

          <div className="mt-4">
            <p>
              <strong>Average Rating:</strong> {product.averageRating || 0} ⭐
            </p>
            <p>
              <strong>Total Ratings:</strong> {product.totalRatings || 0}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

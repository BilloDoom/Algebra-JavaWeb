import { useEffect, useState } from "react";
import {
  createProduct,
  updateProduct,
  getProductById,
  deleteProduct,
  getAllCategories,
  getAllProducts,
} from "../../api/api";
import { useNavigate } from "react-router-dom";

export default function AdminProductPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: 0,
    quantity: 0,
    category: { id: "", name: "" },
    images: [], // URLs of uploaded images
    averageRating: 0,
    totalRatings: 0,
  });
  const [imageFiles, setImageFiles] = useState([]); // Files selected for upload

  const navigate = useNavigate();

  useEffect(() => {
    loadCategories();
    loadProducts();
  }, []);

  const loadCategories = async () => {
    const data = await getAllCategories();
    setCategories(data);
  };

  const loadProducts = async () => {
    const data = await getAllProducts();
    setProducts(data);
  };

  // When clicking Edit button, load product details into form
  const handleEditClick = async (id) => {
    const data = await getProductById(id);
    setProduct({
      ...data,
      category: data.category || { id: "", name: "" },
      images: data.images || [],
    });
    setSelectedProductId(id);
    setImageFiles([]); // Reset image files on edit load
  };

  // Reset form for creating new product
  const handleNewProduct = () => {
    setSelectedProductId(null);
    setProduct({
      name: "",
      description: "",
      price: 0,
      quantity: 0,
      category: { id: "", name: "" },
      images: [],
      averageRating: 0,
      totalRatings: 0,
    });
    setImageFiles([]);
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "categoryId") {
      const selectedCategory = categories.find((c) => c.id === parseInt(value));
      setProduct((prev) => ({
        ...prev,
        category: selectedCategory || { id: "", name: "" },
      }));
    } else if (name === "price" || name === "quantity") {
      setProduct((prev) => ({
        ...prev,
        [name]: Number(value),
      }));
    } else {
      setProduct((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handle image file selection
  const handleImageFilesChange = (e) => {
    setImageFiles(Array.from(e.target.files));
  };

  // Placeholder function to upload images to Backblaze and get URLs
  // Replace this with actual upload logic later
  const uploadImages = async (files) => {
    // MOCK: simulate upload and return URLs array
    // You will implement actual upload to Backblaze and get URLs
    return Promise.all(
      files.map(
        (file, idx) =>
          new Promise((resolve) =>
            setTimeout(() => resolve(`https://fakeurl.com/${file.name}`), 500)
          )
      )
    );
  };

  // Handle form submit for create/update product
  const handleSubmit = async (e) => {
    e.preventDefault();

    let uploadedImageUrls = product.images;

    // If new image files selected, upload them and add URLs
    if (imageFiles.length > 0) {
      const newUrls = await uploadImages(imageFiles);
      uploadedImageUrls = [...uploadedImageUrls, ...newUrls];
    }

    const productPayload = {
      ...product,
      categoryId: product.category?.id,
      images: uploadedImageUrls,
    };

    if (selectedProductId) {
      await updateProduct(selectedProductId, productPayload);
      alert("Product updated.");
    } else {
      await createProduct(productPayload);
      alert("Product created.");
    }

    setImageFiles([]);
    setSelectedProductId(null);
    setProduct({
      name: "",
      description: "",
      price: 0,
      quantity: 0,
      category: { id: "", name: "" },
      images: [],
      averageRating: 0,
      totalRatings: 0,
    });
    loadProducts();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await deleteProduct(id);
      alert("Product deleted.");
      if (selectedProductId === id) {
        handleNewProduct();
      }
      loadProducts();
    }
  };

  return (
    <div className="page-container max-w-5xl mx-auto p-6 space-y-8">
      <h1 className="section-title">Admin Product Management</h1>

      {/* Product List */}
      <div>
        <h2 className="text-lg font-semibold mb-3">All Products</h2>
        <ul
          style={{ listStyleType: "none", paddingLeft: 0 }}
          className="space-y-3 max-h-96 overflow-y-auto"
        >
          {products.map((p) => (
            <li
              key={p.id}
              className="glass-card flex justify-between items-center"
              style={{ padding: "12px 16px" }}
            >
              <div className="flex flex-col">
                <span className="font-semibold">{p.name}</span>
                <span className="text-sm text-gray-300">
                  Category: {p.category?.name || "N/A"}
                </span>
                <span className="text-sm text-gray-400">
                  Price: ${p.price.toFixed(2)} | Qty: {p.quantity}
                </span>
              </div>
              <div className="flex gap-2">
                <button className="btn" onClick={() => handleEditClick(p.id)}>
                  Edit
                </button>
                <button
                  className="btn"
                  style={{ borderColor: "#ff0066", color: "#ff0066" }}
                  onClick={() => handleDelete(p.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
        {/* 
        <button className="btn mt-4" onClick={handleNewProduct}>
          + New Product
        </button> 
        */}
      </div>

      {/* Product Form */}
      <div>
        <h2 className="text-lg font-semibold mb-4">
          {selectedProductId ? "Edit Product" : "Create New Product"}
        </h2>
        <form
          onSubmit={handleSubmit}
          className="glass-card flex flex-col gap-4 max-w-md"
        >
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={product.name}
            onChange={handleChange}
            required
            style={{ padding: "8px" }}
          />
          <textarea
            name="description"
            placeholder="Description"
            value={product.description}
            onChange={handleChange}
            rows={3}
            style={{ padding: "8px" }}
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={product.price}
            onChange={handleChange}
            min={0}
            step="0.01"
            required
            style={{ padding: "8px" }}
          />
          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            value={product.quantity}
            onChange={handleChange}
            min={0}
            required
            style={{ padding: "8px" }}
          />
          <select
            name="categoryId"
            value={product.category?.id || ""}
            onChange={handleChange}
            required
            style={{ padding: "8px" }}
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Image Upload */}
          <div>
            <label className="block mb-1">Upload Images</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageFilesChange}
              className="border rounded p-1 bg-transparent"
            />
          </div>

          {/* Show existing images */}
          {product.images.length > 0 && (
            <div
              className="flex gap-3 flex-wrap mt-4"
              style={{ marginBottom: "12px" }}
            >
              {product.images.map((imgUrl, idx) => (
                <img
                  key={idx}
                  src={imgUrl}
                  alt={`Product ${idx + 1}`}
                  className="w-20 h-20 object-cover border rounded"
                />
              ))}
            </div>
          )}

          <button type="submit" className="btn">
            {selectedProductId ? "Update Product" : "Create Product"}
          </button>
        </form>
      </div>
    </div>
  );
}
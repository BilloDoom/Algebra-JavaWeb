import { useEffect, useState } from "react";

export default function ProductFormModal({ isOpen, onClose, onSubmit, categories, initialProduct }) {
  const [product, setProduct] = useState(initialProduct || {});
  const [imageFiles, setImageFiles] = useState([]);

  useEffect(() => {
    setProduct(initialProduct || {});
    setImageFiles([]);
  }, [initialProduct]);

  if (!isOpen) return null;

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

  const handleImageChange = (e) => {
    setImageFiles(Array.from(e.target.files));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(product, imageFiles);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{product?.id ? "Edit Product" : "Create New Product"}</h2>
        <form onSubmit={handleSubmit} className="form">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={product.name || ""}
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={product.description || ""}
            onChange={handleChange}
            rows={3}
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={product.price || 0}
            onChange={handleChange}
            min={0}
            step="0.01"
            required
          />
          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            value={product.quantity || 0}
            onChange={handleChange}
            min={0}
            required
          />
          <select
            name="categoryId"
            value={product.category?.id || ""}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <label>Upload Images</label>
          <input type="file" multiple accept="image/*" onChange={handleImageChange} />

          {product.images?.length > 0 && (
            <div className="image-preview">
              {product.images.map((url, idx) => (
                <img key={idx} src={url} alt={`Product ${idx}`} />
              ))}
            </div>
          )}

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {product?.id ? "Update" : "Create"}
            </button>
            <button type="button" className="btn btn-cancel" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

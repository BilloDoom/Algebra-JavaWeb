import { useEffect, useState } from "react";
import {
  createCategory,
  updateCategory,
  getCategoryById,
  deleteCategory,
  getAllCategories,
  getAllProducts,
} from "../../api/api";
import { uploadCategoryImage } from "../../api/minioImageClient";

export default function CategoryEditPage() {
  const [categories, setCategories] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [name, setName] = useState("");
  const [imageUrls, setImageUrls] = useState([""]);
  const [loading, setLoading] = useState(false);
  const [hasProducts, setHasProducts] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const data = await getAllCategories();
    setCategories(data);
  };

  const loadCategory = async (id) => {
    setLoading(true);
    const data = await getCategoryById(id);
    setName(data.name);
    setImageUrls(data.imageUrls?.map((img) => img.imageUrl) || [""]);
    setSelectedId(id);
    setLoading(false);

    const products = await getAllProducts({ categoryId: id });
    setHasProducts(products.length > 0);
  };

  const clearForm = () => {
    setSelectedId(null);
    setName("");
    setImageUrls([""]);
    setHasProducts(false);
  };

  const handleChangeImage = (index, value) => {
    const updated = [...imageUrls];
    updated[index] = value;
    setImageUrls(updated);
  };

  const handleAddImage = () => {
    setImageUrls([...imageUrls, ""]);
  };

  // New: Handle image file uploads
  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files.length) return;

    setLoading(true);
    try {
      const uploadedUrls = [];
      // Use selectedId if editing, else just upload with temp id (adjust backend as needed)
      const categoryId = selectedId || "temp-category";

      for (const file of files) {
        const url = await uploadCategoryImage(categoryId, file);
        uploadedUrls.push(url);
      }

      setImageUrls((prev) => [
        ...prev.filter((url) => url.trim() !== ""),
        ...uploadedUrls,
      ]);
    } catch (error) {
      alert("Error uploading images: " + error.message);
    }
    setLoading(false);

    // Reset file input value so user can upload same file(s) again if needed
    e.target.value = null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name,
      imageUrls: imageUrls
        .filter((url) => url.trim() !== "")
        .map((url) => ({ imageUrl: url })),
    };

    if (selectedId) {
      await updateCategory(selectedId, payload);
      alert("Category updated.");
    } else {
      await createCategory(payload);
      alert("Category created.");
    }

    clearForm();
    loadCategories();
  };

  const handleDelete = async (id) => {
    let categoryHasProducts = false;
    if (selectedId === id) {
      categoryHasProducts = hasProducts;
    } else {
      const products = await getAllProducts({ categoryId: id });
      categoryHasProducts = products.length > 0;
    }

    if (categoryHasProducts) {
      if (
        !window.confirm(
          "This category has products assigned to it. Deleting it will remove this association from those products. Are you sure?"
        )
      ) {
        return;
      }
    } else {
      if (!window.confirm("Are you sure you want to delete this category?")) {
        return;
      }
    }

    await deleteCategory(id);
    alert("Category deleted.");
    if (selectedId === id) {
      clearForm();
    }
    loadCategories();
  };

  if (loading) {
    return <div className="admin-container">Loading...</div>;
  }

  return (
    <div className="admin-container">
      <h1 className="admin-title">Category Management</h1>

      {/* Category list grid */}
      <div className="product-grid">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className={`product-card ${
              selectedId === cat.id ? "selected-card" : ""
            }`}
          >
            <div>
              <h3 className="product-name">{cat.name}</h3>
              {cat.imageUrls && cat.imageUrls.length > 0 && (
                <div className="image-row">
                  {cat.imageUrls.map((img, idx) => (
                    <img
                      key={idx}
                      src={img.imageUrl}
                      alt={`Category ${cat.name} ${idx + 1}`}
                      className="product-image-small"
                    />
                  ))}
                </div>
              )}
            </div>
            <div className="product-actions">
              <button
                className="btn btn-edit"
                onClick={() => loadCategory(cat.id)}
              >
                Edit
              </button>
              <button
                className="btn btn-delete"
                onClick={() => handleDelete(cat.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Form section */}
      <div className="centered form-section">
        <h2>{selectedId ? "Edit Category" : "Add New Category"}</h2>
        <form onSubmit={handleSubmit} className="form-card">
          <label className="form-label">
            Name
            <input
              type="text"
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Category name"
            />
          </label>

          <label className="form-label">
            Images
            {imageUrls.map((url, idx) => (
              <input
                key={idx}
                className="input mb-2"
                value={url}
                onChange={(e) => handleChangeImage(idx, e.target.value)}
                placeholder="Image URL"
              />
            ))}
            {/* File input for uploading images */}
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="mb-2"
            />
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleAddImage}
            >
              Add Image URL Manually
            </button>
          </label>

          <div className="form-buttons">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {selectedId ? "Update" : "Create"} Category
            </button>
            {selectedId && (
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => handleDelete(selectedId)}
              >
                Delete Category
              </button>
            )}
            <button
              type="button"
              className="btn btn-outline"
              onClick={clearForm}
              disabled={loading}
            >
              Clear Form
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

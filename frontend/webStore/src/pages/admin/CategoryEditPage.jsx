import { useEffect, useState } from "react";
import {
  createCategory,
  updateCategory,
  getCategoryById,
  deleteCategory,
  getAllCategories,
  getAllProducts,
} from "../../api/api";

function CategoryEditPage() {
  const [categories, setCategories] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [name, setName] = useState("");
  const [imageUrls, setImageUrls] = useState([""]);
  const [loading, setLoading] = useState(false);
  const [hasProducts, setHasProducts] = useState(false);

  // Load all categories
  const loadCategories = async () => {
    const data = await getAllCategories();
    setCategories(data);
  };

  // Load one category into form
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

  // Clear form for new category
  const clearForm = () => {
    setSelectedId(null);
    setName("");
    setImageUrls([""]);
    setHasProducts(false);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleChangeImage = (index, value) => {
    const updated = [...imageUrls];
    updated[index] = value;
    setImageUrls(updated);
  };

  const handleAddImage = () => {
    setImageUrls([...imageUrls, ""]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name,
      imageUrls: imageUrls
        .filter((url) => url.trim() !== "")
        .map((url) => ({
          imageUrl: url,
        })),
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
          "This category has products assigned to it. Deleting it will remove this association from those products. Are you sure you want to delete?"
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
    return <div>Loading...</div>;
  }

  return (
    <div className="page-container max-w-3xl mx-auto p-6 space-y-8">
      <h2 className="section-title">Categories</h2>

      {/* List of categories */}
      <ul className="space-y-4">
        {categories.map((cat) => (
          <li
            key={cat.id}
            className={`border p-4 rounded shadow-sm flex justify-between items-center ${
              selectedId === cat.id ? "bg-gray-100" : ""
            }`}
          >
            <div>
              <h3 className="font-semibold">{cat.name}</h3>
              {cat.imageUrls && cat.imageUrls.length > 0 && (
                <div className="flex space-x-2 mt-2">
                  {cat.imageUrls.map((img, idx) => (
                    <img
                      key={idx}
                      src={img.imageUrl}
                      alt={`Category ${cat.name} ${idx + 1}`}
                      className="h-12 w-12 object-cover rounded"
                    />
                  ))}
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => loadCategory(cat.id)}
                className="btn btn-sm btn-outline"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(cat.id)}
                className="btn btn-sm btn-danger"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      <hr />

      {/* Create / Edit form */}
      <div>
        <h3 className="text-xl font-semibold mb-4">
          {selectedId ? "Edit Category" : "Add New Category"}
        </h3>
        <form
          onSubmit={handleSubmit}
          className="glass-card flex flex-col gap-5 p-6 max-w-md"
        >
          <div>
            <label className="block font-semibold mb-2">Name</label>
            <input
              className="input w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Category name"
            />
          </div>
          <div>
            <label className="block font-semibold mb-2">Images</label>
            {imageUrls.map((url, idx) => (
              <input
                key={idx}
                className="input mb-3 w-full"
                value={url}
                onChange={(e) => handleChangeImage(idx, e.target.value)}
                placeholder="Image URL"
              />
            ))}
            <button
              type="button"
              className="btn btn-sm btn-secondary mb-4"
              onClick={handleAddImage}
            >
              Add Image
            </button>
          </div>
          <div className="flex gap-4">
            <button type="submit" className="btn btn-primary flex-grow">
              {selectedId ? "Update" : "Create"} Category
            </button>
            {selectedId && (
              <button
                type="button"
                className="btn btn-danger flex-grow"
                onClick={() => handleDelete(selectedId)}
              >
                Delete Category
              </button>
            )}
            <button
              type="button"
              className="btn btn-outline flex-grow"
              onClick={clearForm}
            >
              Clear Form
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CategoryEditPage;

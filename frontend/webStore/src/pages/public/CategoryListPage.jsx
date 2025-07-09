// src/pages/CategoryListPage.jsx
import { useEffect, useState } from "react";
import { getAllCategories, deleteCategory } from "../../api/api";
import { Link } from "react-router-dom";

function CategoryListPage() {
  const [categories, setCategories] = useState([]);

  const loadCategories = async () => {
    const data = await getAllCategories();
    setCategories(data);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this category?")) {
      await deleteCategory(id);
      loadCategories();
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Categories</h2>
      <Link to="/categories/new" className="btn btn-primary mb-4">
        Add New Category
      </Link>
      <ul className="space-y-4">
        {categories.map((cat) => (
          <li key={cat.id} className="border p-4 rounded shadow-sm">
            <h3 className="font-semibold">{cat.name}</h3>
            {cat.imageUrls && (
              <div className="flex space-x-2 mt-2">
                {cat.imageUrls.map((img) => (
                  <img
                    key={img.id}
                    src={img.imageUrl}
                    alt="category"
                    className="h-16 w-16 object-cover rounded"
                  />
                ))}
              </div>
            )}
            <div className="mt-2 space-x-2">
              <Link to={`/categories/edit/${cat.id}`} className="btn btn-sm btn-outline">
                Edit
              </Link>
              <button onClick={() => handleDelete(cat.id)} className="btn btn-sm btn-danger">
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CategoryListPage;

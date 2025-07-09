import { useEffect, useState } from "react";
import { getAllCategories } from "../../api/api";
import { useNavigate } from "react-router-dom";

function CategoryListPage() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  const loadCategories = async () => {
    const data = await getAllCategories();
    setCategories(data);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <div className="page-container max-w-4xl mx-auto">
      <h2 className="section-title mb-6">Categories</h2>
      <ul className="space-y-4" style={{ listStyleType: "none", paddingLeft: 0 }}>
        {categories.map((cat) => (
          <li
            key={cat.id}
            className="glass-card cursor-pointer p-4"
            onClick={() => navigate(`/products?categoryId=${cat.id}`)}
          >
            <div className="flex items-center gap-4">
              {cat.imageUrls && cat.imageUrls.length > 0 && (
                <img
                  src={cat.imageUrls[0].imageUrl}
                  alt={cat.name}
                  className="h-16 w-16 object-cover rounded"
                />
              )}
              <span className="font-semibold text-lg">{cat.name}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CategoryListPage;

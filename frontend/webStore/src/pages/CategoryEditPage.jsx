// src/pages/CategoryEditPage.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createCategory,
  updateCategory,
  getCategoryById,
} from "../api/api";

function CategoryEditPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [name, setName] = useState("");
  const [imageUrls, setImageUrls] = useState([""]);
  const navigate = useNavigate();

  useEffect(() => {
    if (isEdit) {
      getCategoryById(id).then((data) => {
        setName(data.name);
        setImageUrls(data.imageUrls?.map((img) => img.imageUrl) || [""]);
      });
    }
  }, [id]);

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
      imageUrls: imageUrls.filter((url) => url.trim() !== "").map((url) => ({
        imageUrl: url,
      })),
    };

    if (isEdit) {
      await updateCategory(id, payload);
    } else {
      await createCategory(payload);
    }

    navigate("/categories");
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{isEdit ? "Edit" : "Add"} Category</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block">Name</label>
          <input
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-1">Images</label>
          {imageUrls.map((url, idx) => (
            <input
              key={idx}
              className="input mb-2"
              value={url}
              onChange={(e) => handleChangeImage(idx, e.target.value)}
              placeholder="Image URL"
            />
          ))}
          <button type="button" className="btn btn-sm btn-secondary" onClick={handleAddImage}>
            Add Image
          </button>
        </div>
        <button type="submit" className="btn btn-primary">
          {isEdit ? "Update" : "Create"} Category
        </button>
      </form>
    </div>
  );
}

export default CategoryEditPage;

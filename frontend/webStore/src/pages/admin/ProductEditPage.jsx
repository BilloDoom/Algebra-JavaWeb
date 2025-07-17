import { useEffect, useState } from "react";
import {
  createProduct,
  updateProduct,
  getProductById,
  deleteProduct,
  getAllCategories,
  getAllProducts,
  uploadImage,
} from "../../api/api";
import ProductFormModal from "../../components/ProductFormModal";

export default function AdminProductPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

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

  const handleEditClick = async (id) => {
    const data = await getProductById(id);
    setSelectedProduct({
      ...data,
      category: data.category || { id: "", name: "" },
      images: data.images || [],
    });
  };

  const handleNewProduct = () => {
    setSelectedProduct({
      name: "",
      description: "",
      price: 0,
      quantity: 0,
      category: { id: "", name: "" },
      images: [],
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await deleteProduct(id);
      alert("Product deleted.");
      if (selectedProduct?.id === id) setSelectedProduct(null);
      loadProducts();
    }
  };

  const handleFormSubmit = async (formData, imageFiles) => {
    let productId = formData.id;
    let uploadedImageUrls = formData.images || [];

    // Upload new image files if present
    if (imageFiles.length > 0) {
      const newUrls = await Promise.all(
        imageFiles.map(async (file) => {
          const { url } = await uploadImage({
            bucket: "product-images",
            folder: "public",
            file,
          });
          return url;
        })
      );
      uploadedImageUrls = [...uploadedImageUrls, ...newUrls];
    }

    const payload = {
      ...formData,
      categoryId: formData.category?.id,
      images: uploadedImageUrls,
    };

    if (productId) {
      await updateProduct(productId, payload);
      alert("Product updated.");
    } else {
      const created = await createProduct(payload);
      alert("Product created.");
    }

    setSelectedProduct(null);
    loadProducts();
  };


  return (
    <div className="admin-container">
      <h1 className="admin-title">Admin Product Management</h1>

      <div className="product-grid">
        {products.map((p) => (
          <div key={p.id} className="product-card">
            <div>
              <h3 className="product-name">{p.name}</h3>
              <p className="product-category">{p.category?.name || "No Category"}</p>
              <p className="product-info">
                ${p.price.toFixed(2)} • {p.quantity} pcs
              </p>
            </div>
            <div className="product-actions">
              <button className="btn btn-edit" onClick={() => handleEditClick(p.id)}>
                Edit
              </button>
              <button className="btn btn-delete" onClick={() => handleDelete(p.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="centered">
        <button className="btn btn-primary" onClick={handleNewProduct}>
          + New Product
        </button>
      </div>

      <ProductFormModal
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onSubmit={handleFormSubmit}
        categories={categories}
        initialProduct={selectedProduct}
      />
    </div>
  );
}

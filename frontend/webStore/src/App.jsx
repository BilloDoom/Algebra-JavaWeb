import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AddressPage from "./pages/AddressPage";
import ProductListPage from "./pages/ProductListPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import ProductEditPage from "./pages/ProductEditPage";
import NavBar from "./components/NavBar";
import CategoryListPage from "./pages/CategoryListPage";
import CategoryEditPage from "./pages/CategoryEditPage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  return (
    <BrowserRouter>
      <div style={{ display: "flex" }}>
        <NavBar />
        <div style={{ flex: 1, padding: "1rem", paddingTop: "60px" }}>

          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/addresses" element={<AddressPage />} />
            <Route path="/products" element={<ProductListPage />} />
            <Route path="/products/:id" element={<ProductDetailsPage />} />
            <Route path="/products/edit/:id" element={<ProductEditPage />} />
            <Route path="/products/new" element={<ProductEditPage />} />
            <Route path="/categories" element={<CategoryListPage />} />
            <Route path="/categories/new" element={<CategoryEditPage />} />
            <Route path="/categories/edit/:id" element={<CategoryEditPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;

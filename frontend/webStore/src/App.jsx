import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/public/auth/LoginPage";
import RegisterPage from "./pages/public/auth/RegisterPage";
import ProductListPage from "./pages/public/ProductListPage";
import ProductDetailsPage from "./pages/public/ProductDetailsPage";
import ProductEditPage from "./pages/admin/ProductEditPage";
import NavBar from "./components/NavBar";
import CategoryListPage from "./pages/public/CategoryListPage";
import CategoryEditPage from "./pages/admin/CategoryEditPage";
import ProfilePage from "./pages/public/ProfilePage";
import AdminLogsPage from "./pages/admin/LogsPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";

function App() {
  return (
    <BrowserRouter>
      <div style={{ display: "flex" }}>
        <NavBar />
        <div style={{ flex: 1, padding: "1rem", paddingTop: "60px" }}>

          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/profile" element={<ProfilePage />} />

            <Route path="/products" element={<ProductListPage />} />
            <Route path="/products/:id" element={<ProductDetailsPage />} />

            <Route path="/categories" element={<CategoryListPage />} />

            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />

            {/* Admin Routes */}
            <Route path="/products/edit/:id" element={<ProductEditPage />} />
            <Route path="/products/new" element={<ProductEditPage />} />

            <Route path="/categories/new" element={<CategoryEditPage />} />
            <Route path="/categories/edit/:id" element={<CategoryEditPage />} />

            <Route path="/admin/logs" element={<AdminLogsPage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;

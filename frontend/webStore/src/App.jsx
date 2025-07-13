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
import RequireAuth from "./auth/RequireAuth";

function App() {
  return (
    <BrowserRouter>
      <div style={{ display: "flex" }}>
        <NavBar />
        <div style={{ flex: 1, paddingTop: "1.5rem" }}>

          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />

            <Route path="/products" element={<ProductListPage />} />
            <Route path="/products/:id" element={<ProductDetailsPage />} />

            <Route path="/categories" element={<CategoryListPage />} />

            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<RequireAuth><CheckoutPage /></RequireAuth>} />

            {/* Admin Routes */}
      
              <Route path="/products/edit/:id" element={<RequireAuth><ProductEditPage /></RequireAuth>} />
              <Route path="/products/new" element={<RequireAuth><ProductEditPage /></RequireAuth>} />

              <Route path="/categories/new" element={<RequireAuth><CategoryEditPage /></RequireAuth>} />
              <Route path="/categories/edit/:id" element={<RequireAuth><CategoryEditPage /></RequireAuth>} />

              <Route path="/admin/logs" element={<RequireAuth><AdminLogsPage /></RequireAuth>} />
         
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;

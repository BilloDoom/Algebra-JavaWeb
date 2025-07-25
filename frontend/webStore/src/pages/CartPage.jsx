import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getCart,
  updateCartItem,
  removeCartItem
} from "../api/api";

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    setIsLoggedIn(!!token);

    if (token) {
      getCart()
        .then((data) => {
          const mappedCart = data.map(item => ({
            id: item.id,
            quantity: item.quantity,
            productId: item.product.id,
            name: item.product.name,
            price: item.product.price,
            description: item.product.description,
            category: item.product.category,
            images: item.product.images,
          }));
          setCart(mappedCart);
        })
        .catch(() => alert("Failed to load cart from database"));

    } else {
      const stored = JSON.parse(localStorage.getItem("cart") || "[]");
      setCart(
        stored.map(p => ({
          ...p,
          quantity: p.quantity || 1,
          price: typeof p.price === "number" ? p.price : 0
        }))
      );
    }
  }, []);

  const handleQuantityChange = (productId, quantity) => {
    if (quantity < 1) return;

    const updatedCart = cart.map(item =>
      item.id === productId ? { ...item, quantity } : item
    );
    setCart(updatedCart);

    if (isLoggedIn) {
      updateCartItem(productId, quantity).catch(() =>
        alert("Failed to update cart")
      );
    } else {
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    }
  };

  const handleRemove = (productId) => {
    const updatedCart = cart.filter(item => item.id !== productId);
    setCart(updatedCart);

    if (isLoggedIn) {
      removeCartItem(productId).catch(() =>
        alert("Failed to remove item from cart")
      );
    } else {
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    }
  };

  const getTotal = () =>
    cart.reduce((acc, item) => acc + (item.price || 0) * item.quantity, 0);

  return (
    <div className="page-container p-4 max-width-4xl">
      <h1 className="section-title">Your Cart</h1>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <table className="section" style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ padding: "0.75rem", borderBottom: "1px solid rgba(255,255,255,0.1)", textAlign: "left" }}>Product</th>
                <th style={{ padding: "0.75rem", borderBottom: "1px solid rgba(255,255,255,0.1)", textAlign: "left" }}>Price</th>
                <th style={{ padding: "0.75rem", borderBottom: "1px solid rgba(255,255,255,0.1)", textAlign: "left" }}>Quantity</th>
                <th style={{ padding: "0.75rem", borderBottom: "1px solid rgba(255,255,255,0.1)", textAlign: "left" }}>Total</th>
                <th style={{ padding: "0.75rem", borderBottom: "1px solid rgba(255,255,255,0.1)", textAlign: "left" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.id}>
                  <td style={{ padding: "0.75rem", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>{item.name || "Unnamed Product"}</td>
                  <td style={{ padding: "0.75rem", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                    {typeof item.price === "number"
                      ? `$${item.price.toFixed(2)}`
                      : "N/A"}
                  </td>
                  <td style={{ padding: "0.75rem", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                    <input
                      type="number"
                      value={item.quantity}
                      min={1}
                      className="quantity-input"
                      onChange={(e) =>
                        handleQuantityChange(item.id, Number(e.target.value))
                      }
                      style={{
                        width: "60px",
                        padding: "0.4rem 0.6rem",
                        background: "rgba(255, 255, 255, 0.02)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        color: "#f2f2f2",
                        borderRadius: "0",
                        outline: "none",
                      }}
                    />
                  </td>
                  <td style={{ padding: "0.75rem", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                    {typeof item.price === "number"
                      ? `$${(item.price * item.quantity).toFixed(2)}`
                      : "N/A"}
                  </td>
                  <td style={{ padding: "0.75rem", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="btn btn-delete"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ textAlign: "right", marginTop: "1rem" }}>
            <p style={{ fontWeight: "bold", fontSize: "1.2rem", marginBottom: "0.5rem" }}>
              Total: ${getTotal().toFixed(2)}
            </p>
            <button
              className="btn"
              style={{ padding: "0.6rem 1.2rem", fontWeight: "600" }}
              onClick={() => navigate("/checkout")}
            >
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}

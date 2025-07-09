import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // ⬅️ Import for navigation
import {
  getCart,
  updateCartItem,
  removeCartItem
} from "../api/api";

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate(); // ⬅️ Hook to navigate

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    setIsLoggedIn(!!token);

    if (token) {
      getCart()
        .then((data) => setCart(data))
        .catch(() => alert("Failed to load cart from database"));
    } else {
      const stored = JSON.parse(localStorage.getItem("cart") || "[]");
      setCart(stored.map(p => ({ ...p, quantity: p.quantity || 1 })));
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
    cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Your Cart</h1>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <table className="w-full text-left border">
            <thead>
              <tr>
                <th className="p-2 border-b">Product</th>
                <th className="p-2 border-b">Price</th>
                <th className="p-2 border-b">Quantity</th>
                <th className="p-2 border-b">Total</th>
                <th className="p-2 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.id}>
                  <td className="p-2 border-b">{item.name}</td>
                  <td className="p-2 border-b">${item.price.toFixed(2)}</td>
                  <td className="p-2 border-b">
                    <input
                      type="number"
                      value={item.quantity}
                      min={1}
                      className="w-16 border px-2 py-1"
                      onChange={(e) =>
                        handleQuantityChange(item.id, Number(e.target.value))
                      }
                    />
                  </td>
                  <td className="p-2 border-b">
                    ${(item.price * item.quantity).toFixed(2)}
                  </td>
                  <td className="p-2 border-b">
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="text-right mt-4">
            <p className="text-lg font-bold mb-2">
              Total: ${getTotal().toFixed(2)}
            </p>
            <button
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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

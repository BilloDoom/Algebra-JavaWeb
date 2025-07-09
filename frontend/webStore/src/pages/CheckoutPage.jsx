import { useEffect, useState } from "react";
import { getCart } from "../api/api";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

export default function CheckoutPage() {
  const [cart, setCart] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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

  const getTotal = () =>
    cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleCashPayment = () => {
    alert("Cash payment successful!");
    // TODO: Clear cart, update DB if logged in, redirect to success page
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Checkout</h1>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="border p-4 rounded shadow-sm">
                <p className="font-medium">{item.name}</p>
                <p>Quantity: {item.quantity}</p>
                <p>Price: ${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 text-right">
            <p className="text-xl font-bold">
              Total: ${getTotal().toFixed(2)}
            </p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <button
              onClick={handleCashPayment}
              className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Pay with Cash
            </button>

            <PayPalScriptProvider options={{ "client-id": "YOUR_PAYPAL_CLIENT_ID" }}>
              <PayPalButtons
                style={{ layout: "vertical" }}
                createOrder={(data, actions) => {
                  return actions.order.create({
                    purchase_units: [
                      {
                        amount: {
                          value: getTotal().toFixed(2),
                        },
                      },
                    ],
                  });
                }}
                onApprove={(data, actions) => {
                  return actions.order.capture().then(function (details) {
                    alert("Payment completed by " + details.payer.name.given_name);
                    // TODO: Clear cart, update DB, redirect
                  });
                }}
              />
            </PayPalScriptProvider>
          </div>
        </>
      )}
    </div>
  );
}

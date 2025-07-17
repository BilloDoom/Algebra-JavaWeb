import { useEffect, useState } from "react";
import { getCart, getAddresses, addAddress, createOrder } from "../api/api";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

export default function CheckoutPage() {
  const [cart, setCart] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddress, setNewAddress] = useState({ street: "", city: "", zip: "", country: "" });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    const userId = localStorage.getItem("userId");
    setIsLoggedIn(!!token);

    if (token && userId) {
      getCart()
        .then((data) => {
          const mappedCart = data.map((item) => ({
            id: item.id,
            quantity: item.quantity,
            productId: item.product.id,
            name: item.product.name,
            price: item.product.price,
            description: item.product.description,
            images: item.product.images,
          }));
          setCart(mappedCart);
        })
        .catch(() => alert("Failed to load cart from database"));

      getAddresses(userId)
        .then((data) => {
          setAddresses(data);
          if (data.length === 1) {
            setSelectedAddress(data[0]);
          } else if (data.length > 1) {
            setSelectedAddress(null);
          } else {
            setShowAddressModal(true);
          }
        })
        .catch(() => {
          alert("Failed to load addresses");
          setShowAddressModal(true);
        });
    } else {
      const stored = JSON.parse(localStorage.getItem("cart") || "[]");
      setCart(
        stored.map((p) => ({
          ...p,
          quantity: p.quantity || 1,
          price: typeof p.price === "number" ? p.price : 0,
        }))
      );
    }
  }, []);

  const getTotal = () =>
    cart.reduce((acc, item) => acc + (item.price || 0) * (item.quantity || 1), 0);

  const handleCreateOrder = async (paymentType) => {
    const userId = localStorage.getItem("userId");
    if (!userId) return alert("You must be logged in to create an order.");
    if (!selectedAddress) return alert("Please select or add a shipping address.");

    try {
      await createOrder({
        userId,
        shippingAddress: `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.zip}, ${selectedAddress.country}`,
        paymentType,
      });
      alert("Order created successfully!");
      setCart([]);
      localStorage.removeItem("cart");
    } catch {
      alert("Failed to create order.");
    }
  };

  const handleCashPayment = async () => {
    if (!selectedAddress) {
      alert("Please select or add an address before proceeding.");
      setShowAddressModal(true);
      return;
    }
    await handleCreateOrder("CASH");
  };

  const handleAddAddress = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return alert("User not logged in.");
    if (!newAddress.street || !newAddress.city || !newAddress.zip || !newAddress.country) {
      return alert("Please fill all address fields.");
    }
    try {
      const savedAddress = await addAddress(userId, newAddress);
      setAddresses((prev) => [...prev, savedAddress]);
      setSelectedAddress(savedAddress);
      setShowAddressModal(false);
      setNewAddress({ street: "", city: "", zip: "", country: "" });
    } catch {
      alert("Failed to save address.");
    }
  };

  return (
    <div className="page-container">
      <h1 className="section-title">Checkout</h1>

      <div className="checkout-layout" style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
        {/* LEFT: Shipping Address */}
        <div className="checkout-left" style={{ flex: "1", minWidth: "250px" }}>
          <div className="section">
            <h2>Shipping Address</h2>
            {selectedAddress ? (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <p>Street: </p>
                  <p>{selectedAddress.street}</p>
                </div>
                <hr />
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <p>City: </p>
                  <p>{selectedAddress.city}</p>
                </div>
                <hr />
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <p>State: </p>
                  <p>{selectedAddress.state}</p>
                </div>
                <hr />
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <p>ZIP: </p>
                  <p>{selectedAddress.zip}</p>
                </div>
                <hr />
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <p>Country: </p>
                  <p>{selectedAddress.country}</p>
                </div>
                <hr />
              </div>
            ) : addresses.length > 1 ? (
              <p>Please select an address (feature coming soon).</p>
            ) : (
              <p>No address selected.</p>
            )}
            <button onClick={() => setShowAddressModal(true)} style={{ marginTop: "10px" }}>
              {addresses.length === 0 ? "Add Address" : "Change Address"}
            </button>
          </div>
        </div>

        {/* MIDDLE: Products */}
        <div
          className="checkout-middle section"
          style={{
            flex: "2",
            maxHeight: "500px",
            overflowY: "auto",
            padding: "15px",
          }}
        >
          {cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            cart.map((item) => (
              <div key={item.id || item.productId} style={{ marginBottom: "20px", borderBottom: "1px solid #ddd", paddingBottom: "10px" }}>
                <h4>{item.name}</h4>
                <p className="q-checkout">Quantity: {item.quantity}</p>
                <p className="price-checkout">Total: ${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))
          )}
        </div>

        {/* RIGHT: Total & Payment */}
        <div className="checkout-right" style={{ flex: "1", minWidth: "250px" }}>
          <div
            className="section"
            style={{
              padding: "15px",
              display: "flex",
              flexDirection: "column",
              alignItems: "stretch",
              gap: "15px",
            }}
          >
            <div style={{ fontSize: "1.2rem", fontWeight: "bold", textAlign: "center", background: "rgba(255, 255, 255, 0.03)", padding: ".5rem" }}>
              Total: ${getTotal().toFixed(2)}
            </div>

            <button
              onClick={handleCashPayment}
              disabled={cart.length === 0}
              style={{
                padding: "10px",
                fontSize: "16px",
                backgroundColor: cart.length === 0 ? "#ccc" : "#28a745",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: cart.length === 0 ? "not-allowed" : "pointer",
              }}
            >
              Pay with Cash
            </button>

            <PayPalScriptProvider
              options={{
                "client-id": "AQ2ByBtWUqWORMonUwblwgL-oEpaOvqvhn50n7l4MGT1YnPgo6KTimOqNXD8wV-gIxb-gKNsf_uuiTnE",
                currency: "EUR",
              }}
            >
              <PayPalButtons
                style={{ layout: "vertical" }}
                createOrder={(data, actions) =>
                  actions.order.create({
                    purchase_units: [{ amount: { value: getTotal().toFixed(2) } }],
                  })
                }
                onApprove={async (data, actions) => {
                  const details = await actions.order.capture();
                  alert(`Payment completed by ${details.payer.name.given_name}`);
                  await handleCreateOrder("PAYPAL");
                }}
                disabled={cart.length === 0}
              />
            </PayPalScriptProvider>
          </div>
        </div>
      </div>

      {/* Address Modal */}
      {showAddressModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add Shipping Address</h3>
            <div className="form">
              <input
                type="text"
                placeholder="Street"
                value={newAddress.street}
                onChange={(e) => setNewAddress((prev) => ({ ...prev, street: e.target.value }))}
              />
              <input
                type="text"
                placeholder="City"
                value={newAddress.city}
                onChange={(e) => setNewAddress((prev) => ({ ...prev, city: e.target.value }))}
              />
              <input
                type="text"
                placeholder="ZIP / Postal Code"
                value={newAddress.zip}
                onChange={(e) => setNewAddress((prev) => ({ ...prev, zip: e.target.value }))}
              />
              <input
                type="text"
                placeholder="Country"
                value={newAddress.country}
                onChange={(e) => setNewAddress((prev) => ({ ...prev, country: e.target.value }))}
              />

              <div className="form-buttons" style={{ marginTop: "10px" }}>
                <button onClick={() => setShowAddressModal(false)}>Cancel</button>
                <button onClick={handleAddAddress}>Save Address</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

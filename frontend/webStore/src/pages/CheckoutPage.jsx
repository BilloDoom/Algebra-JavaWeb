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
      // Load cart
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

      // Load addresses
      getAddresses(userId)
        .then((data) => {
          setAddresses(data);
          if (data.length === 1) {
            setSelectedAddress(data[0]);
          } else if (data.length > 1) {
            // Multiple addresses - for now leave selectedAddress null
            setSelectedAddress(null);
          } else {
            // No addresses - show modal to add new
            setShowAddressModal(true);
          }
        })
        .catch(() => {
          alert("Failed to load addresses");
          setShowAddressModal(true);
        });
    } else {
      // Guest user - load cart from localStorage
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
    if (!userId) {
      alert("You must be logged in to create an order.");
      return;
    }
    if (!selectedAddress) {
      alert("Please select or add a shipping address.");
      return;
    }
    try {
      await createOrder({
        userId,
        shippingAddress: `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.zip}, ${selectedAddress.country}`,
        paymentType,
      });
      alert("Order created successfully!");
      // Clear cart in state
      setCart([]);
      // Clear cart in localStorage for guests
      localStorage.removeItem("cart");
      // TODO: Redirect to order confirmation page if needed
    } catch (error) {
      alert("Failed to create order.");
    }
  };

  const handleCashPayment = async () => {
    if (!selectedAddress) {
      alert("Please select or add an address before proceeding.");
      setShowAddressModal(true);
      return;
    }
    // Call create order with payment type CASH
    await handleCreateOrder("CASH");
  };

  const handleAddAddress = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("User not logged in.");
      return;
    }
    if (!newAddress.street || !newAddress.city || !newAddress.zip || !newAddress.country) {
      alert("Please fill all address fields.");
      return;
    }
    try {
      const savedAddress = await addAddress(userId, newAddress);
      setAddresses((prev) => [...prev, savedAddress]);
      setSelectedAddress(savedAddress);
      setShowAddressModal(false);
      setNewAddress({ street: "", city: "", zip: "", country: "" });
    } catch (err) {
      alert("Failed to save address.");
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Checkout</h1>

      {/* Address Display */}
      <section className="mb-6 p-4 border rounded">
        <h2 className="font-semibold mb-2">Shipping Address</h2>
        {selectedAddress ? (
          <div>
            <p>{selectedAddress.street}</p>
            <p>
              {selectedAddress.city}, {selectedAddress.zip}
            </p>
            <p>{selectedAddress.country}</p>
          </div>
        ) : addresses.length > 1 ? (
          <p>Please select an address (feature coming soon).</p>
        ) : (
          <p>No address selected.</p>
        )}
        <button
          className="btn btn-secondary mt-2"
          onClick={() => setShowAddressModal(true)}
        >
          {addresses.length === 0 ? "Add Address" : "Change Address"}
        </button>
      </section>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div className="space-y-4 mb-6">
            {cart.map((item) => (
              <div
                key={item.id || item.productId}
                className="border p-4 rounded shadow-sm"
              >
                <p className="font-medium">{item.name || "Unnamed Product"}</p>
                <p>Quantity: {item.quantity}</p>
                <p>Price: ${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>

          <div className="text-right mb-6">
            <p className="text-xl font-bold">Total: ${getTotal().toFixed(2)}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <button
              onClick={handleCashPayment}
              className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Pay with Cash
            </button>

            <PayPalScriptProvider options={{
              "client-id": "AQ2ByBtWUqWORMonUwblwgL-oEpaOvqvhn50n7l4MGT1YnPgo6KTimOqNXD8wV-gIxb-gKNsf_uuiTnE",
              currency: "EUR"
            }}>
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
                onApprove={async (data, actions) => {
                  const details = await actions.order.capture();
                  alert("Payment completed by " + details.payer.name.given_name);
                  // After payment success, create order with payment type PAYPAL
                  await handleCreateOrder("PAYPAL");
                }}
              />
            </PayPalScriptProvider>
          </div>
        </>
      )}

      {/* Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Add Shipping Address</h3>
            <input
              type="text"
              placeholder="Street"
              className="input mb-2 w-full"
              value={newAddress.street}
              onChange={(e) =>
                setNewAddress((prev) => ({ ...prev, street: e.target.value }))
              }
            />
            <input
              type="text"
              placeholder="City"
              className="input mb-2 w-full"
              value={newAddress.city}
              onChange={(e) =>
                setNewAddress((prev) => ({ ...prev, city: e.target.value }))
              }
            />
            <input
              type="text"
              placeholder="ZIP / Postal Code"
              className="input mb-2 w-full"
              value={newAddress.zip}
              onChange={(e) =>
                setNewAddress((prev) => ({ ...prev, zip: e.target.value }))
              }
            />
            <input
              type="text"
              placeholder="Country"
              className="input mb-4 w-full"
              value={newAddress.country}
              onChange={(e) =>
                setNewAddress((prev) => ({ ...prev, country: e.target.value }))
              }
            />
            <div className="flex justify-end gap-2">
              <button
                className="btn btn-secondary"
                onClick={() => setShowAddressModal(false)}
              >
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleAddAddress}>
                Save Address
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

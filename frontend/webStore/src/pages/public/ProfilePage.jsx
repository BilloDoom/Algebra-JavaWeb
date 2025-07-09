import { useEffect, useState } from "react";
import {
  getAddresses,
  addAddress,
  deleteAddress,
  updateAddress,
  getUserOrders,
  getProfile,
} from "../../api/api"; // Assume these exist or you add them

export default function ProfilePage() {
  const userId = localStorage.getItem("userId");

  const blankAddress = {
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  };

  // Addresses state
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState({ ...blankAddress });
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedAddress, setEditedAddress] = useState({ ...blankAddress });

  // Orders state
  const [orders, setOrders] = useState([]);
  const [orderFilter, setOrderFilter] = useState("ALL");
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Profile details state
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  // Load addresses, orders, profile on mount
  useEffect(() => {
    if (!userId) return;

    fetchAddresses();
    fetchOrders();
    fetchProfile();
  }, []);

  // Fetch addresses
  const fetchAddresses = async () => {
    try {
      const data = await getAddresses(userId);
      setAddresses(data);
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  // Fetch orders with filtering
  const fetchOrders = async (status = "ALL") => {
    setLoadingOrders(true);
    try {
      // Assuming your API supports filter param or filter locally
      const data = await getUserOrders(userId);
      if (status !== "ALL") {
        setOrders(data.filter((o) => o.status === status));
      } else {
        setOrders(data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoadingOrders(false);
    }
  };

  // Fetch profile info
  const fetchProfile = async () => {
    setLoadingProfile(true);
    try {
      const data = await getProfile(userId);
      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoadingProfile(false);
    }
  };

  // Address handlers (same as before)
  const handleAddAddress = async () => {
    if (addresses.length >= 4) {
      alert("You can only have up to 4 addresses.");
      return;
    }

    try {
      const newAddr = await addAddress(userId, newAddress);
      setAddresses([...addresses, newAddr]);
      setNewAddress({ ...blankAddress });
    } catch (error) {
      console.error("Error adding address:", error);
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      await deleteAddress(userId, id);
      setAddresses(addresses.filter((a) => a.id !== id));
    } catch (error) {
      console.error("Error deleting address:", error);
    }
  };

  const handleEditAddress = async (id) => {
    try {
      const updated = await updateAddress(userId, {
        ...editedAddress,
        id,
      });
      const updatedList = addresses.map((a) => (a.id === id ? updated : a));
      setAddresses(updatedList);
      setEditingIndex(null);
      setEditedAddress({ ...blankAddress });
    } catch (error) {
      console.error("Error updating address:", error);
    }
  };

  // Render address form inputs
  const renderAddressInputs = (address, setAddress) => (
    <div className="flex flex-col gap-2">
      <input
        className="border rounded px-3 py-2"
        placeholder="Street"
        value={address.street}
        onChange={(e) => setAddress({ ...address, street: e.target.value })}
      />
      <input
        className="border rounded px-3 py-2"
        placeholder="City"
        value={address.city}
        onChange={(e) => setAddress({ ...address, city: e.target.value })}
      />
      <input
        className="border rounded px-3 py-2"
        placeholder="State"
        value={address.state}
        onChange={(e) => setAddress({ ...address, state: e.target.value })}
      />
      <input
        className="border rounded px-3 py-2"
        placeholder="ZIP"
        value={address.zip}
        onChange={(e) => setAddress({ ...address, zip: e.target.value })}
      />
      <input
        className="border rounded px-3 py-2"
        placeholder="Country"
        value={address.country}
        onChange={(e) => setAddress({ ...address, country: e.target.value })}
      />
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-10">
      <h1 className="text-3xl font-bold mb-4">My Profile</h1>

      {/* Addresses Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">My Addresses</h2>

        <ul className="space-y-4 mb-6">
          {addresses.length === 0 && (
            <li className="text-gray-600">No addresses added yet.</li>
          )}

          {addresses.map((addr, index) => (
            <li
              key={addr.id}
              className="border rounded p-4 shadow-sm flex flex-col sm:flex-row sm:justify-between items-start sm:items-center"
            >
              {editingIndex === index ? (
                <div className="flex-grow">
                  {renderAddressInputs(editedAddress, setEditedAddress)}
                  <div className="mt-3 space-x-2">
                    <button
                      onClick={() => handleEditAddress(addr.id)}
                      className="btn btn-primary"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingIndex(null)}
                      className="btn btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="mb-3 sm:mb-0">
                    {addr.street}, {addr.city}, {addr.state} {addr.zip},{" "}
                    {addr.country}
                  </div>
                  <div className="space-x-2">
                    <button
                      onClick={() => {
                        setEditingIndex(index);
                        setEditedAddress(addr);
                      }}
                      className="btn btn-secondary"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteAddress(addr.id)}
                      className="btn btn-danger"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>

        {addresses.length < 4 && (
          <div className="border rounded p-4 shadow-sm max-w-md">
            <h3 className="text-xl font-semibold mb-3">Add New Address</h3>
            {renderAddressInputs(newAddress, setNewAddress)}
            <button
              onClick={handleAddAddress}
              className="btn btn-primary mt-4 w-full"
            >
              Add Address
            </button>
          </div>
        )}
      </section>

      {/* Orders Section */}
      <section className="bg-white rounded shadow p-6">
        <h2 className="text-2xl font-semibold mb-4">My Orders</h2>

        {/* Filters */}
        <div className="mb-4 flex flex-wrap gap-3">
          {["ALL", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"].map(
            (status) => (
              <button
                key={status}
                className={`btn ${orderFilter === status
                    ? "btn-primary"
                    : "btn-secondary"
                  }`}
                onClick={() => {
                  setOrderFilter(status);
                  fetchOrders(status);
                }}
              >
                {status.charAt(0) + status.slice(1).toLowerCase()}
              </button>
            )
          )}
        </div>

        {loadingOrders ? (
          <p>Loading orders...</p>
        ) : orders.length === 0 ? (
          <p>No orders found for selected filter.</p>
        ) : (
          <ul className="space-y-4 max-h-96 overflow-auto">
            {orders.map((order) => (
              <li
                key={order.id}
                className="border rounded p-4 shadow-sm flex flex-col sm:flex-row justify-between"
              >
                <div>
                  <p>
                    <span className="font-semibold">Order ID:</span> {order.id}
                  </p>
                  <p>
                    <span className="font-semibold">Status:</span>{" "}
                    <span
                      className={`font-bold ${order.status === "DELIVERED"
                          ? "text-green-600"
                          : order.status === "CANCELLED"
                            ? "text-red-600"
                            : "text-yellow-600"
                        }`}
                    >
                      {order.status}
                    </span>
                  </p>
                  <p>
                    <span className="font-semibold">Total:</span> ${order.totalAmount.toFixed(2)}
                  </p>
                  <p>
                    <span className="font-semibold">Shipping:</span> {order.shippingAddress}
                  </p>
                </div>
                <div className="mt-3 sm:mt-0 sm:text-right">
                  {/* You can add order details, buttons here */}
                  <button className="btn btn-secondary">View Details</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Profile Info Section */}
      <section className="bg-pink-50 rounded shadow p-6 max-w-md">
        <h2 className="text-2xl font-semibold mb-4">Profile Info</h2>

        {loadingProfile ? (
          <p>Loading profile...</p>
        ) : profile ? (
          <div className="space-y-3 text-gray-800">
            <p>
              <span className="font-semibold">Username:</span> {profile.username}
            </p>
            <p>
              <span className="font-semibold">Email:</span> {profile.email}
            </p>
            <p>
              <span className="font-semibold">Role:</span> {profile.role}
            </p>
            <p>
              <span className="font-semibold">Profile Picture:</span>{" "}
              {profile.profilePictureUrl ? (
                <img src={profile.profilePictureUrl} alt="Profile" className="w-16 h-16 rounded-full" />
              ) : (
                "None"
              )}
            </p>
          </div>
        ) : (
          <p>No profile info available.</p>
        )}
      </section>
    </div>
  );
}

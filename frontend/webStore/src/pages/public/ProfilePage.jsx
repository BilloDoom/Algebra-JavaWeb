import { useEffect, useState } from "react";
import {
  getAddresses,
  addAddress,
  deleteAddress,
  updateAddress,
  getUserOrders,
  getProfile,
} from "../../api/api";

export default function ProfilePage() {
  const userId = localStorage.getItem("userId");

  const blankAddress = {
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  };

  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState({ ...blankAddress });
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedAddress, setEditedAddress] = useState({ ...blankAddress });
  const [showAddForm, setShowAddForm] = useState(false);

  const [orders, setOrders] = useState([]);
  const [orderFilter, setOrderFilter] = useState("ALL");
  const [loadingOrders, setLoadingOrders] = useState(false);

  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  const maxAdresses = 1;

  useEffect(() => {
    if (!userId) return;
    fetchAddresses();
    fetchOrders();
    fetchProfile();
  }, []);

  const fetchAddresses = async () => {
    try {
      const data = await getAddresses(userId);
      setAddresses(data);
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  const fetchOrders = async (status = "ALL") => {
    setLoadingOrders(true);
    try {
      const data = await getUserOrders(userId);
      setOrders(status === "ALL" ? data : data.filter((o) => o.status === status));
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoadingOrders(false);
    }
  };

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

  const handleAddAddress = async () => {
    if (addresses.length >= maxAdresses) {
      alert("You can only have up to " + maxAdresses + " addresses.");
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
      const updated = await updateAddress(userId, { ...editedAddress, id });
      const updatedList = addresses.map((a) => (a.id === id ? updated : a));
      setAddresses(updatedList);
      setEditingIndex(null);
      setEditedAddress({ ...blankAddress });
    } catch (error) {
      console.error("Error updating address:", error);
    }
  };

  const renderAddressInputs = (address, setAddress) => (
    <div className="form">
      <input
        className="input"
        placeholder="Street"
        value={address.street}
        onChange={(e) => setAddress({ ...address, street: e.target.value })}
      />
      <input
        className="input"
        placeholder="City"
        value={address.city}
        onChange={(e) => setAddress({ ...address, city: e.target.value })}
      />
      <input
        className="input"
        placeholder="State"
        value={address.state}
        onChange={(e) => setAddress({ ...address, state: e.target.value })}
      />
      <input
        className="input"
        placeholder="ZIP"
        value={address.zip}
        onChange={(e) => setAddress({ ...address, zip: e.target.value })}
      />
      <input
        className="input"
        placeholder="Country"
        value={address.country}
        onChange={(e) => setAddress({ ...address, country: e.target.value })}
      />
    </div>
  );

  return (
    <div className="page-container">
      <div className="profile-layout">
        {/* Left Column */}
        <div className="left-column">
          {/* Profile Section */}
          <section className="section">
            {loadingProfile ? (
              <p>Loading profile...</p>
            ) : profile ? (
              <div>
                <p><strong>Username:</strong> {profile.username}</p>
                <p><strong>Email:</strong> {profile.email}</p>
                <p><strong>Role:</strong> {profile.role}</p>
                <p><strong>Profile Picture:</strong> {profile.profilePictureUrl ? (
                  <img
                    src={profile.profilePictureUrl}
                    alt="Profile"
                    style={{ width: "60px", height: "60px", borderRadius: "50%" }}
                  />
                ) : (
                  "None"
                )}</p>
              </div>
            ) : (
              <p>No profile info available.</p>
            )}
          </section>

          {/* Addresses Section */}
          <section className="section">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2>Addresses</h2>
              {addresses.length < maxAdresses && editingIndex === null && !showAddForm && (
                <button className="btn" onClick={() => setShowAddForm(true)}>Add New Address</button>
              )}
            </div>

            <div className="address-list">
              {addresses.map((addr, index) => (
                <div key={addr.id} className="address-card">
                  {editingIndex === index ? (
                    <>
                      {renderAddressInputs(editedAddress, setEditedAddress)}
                      <div style={{ marginTop: "10px" }}>
                        <button className="btn" onClick={() => handleEditAddress(addr.id)}>Save</button>
                        <button
                          className="btn"
                          onClick={() => {
                            setEditingIndex(null);
                            setEditedAddress({ ...blankAddress });
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <p>Street: </p>
                        <p>{addr.street}</p>
                      </div>
                      <hr />
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <p>City: </p>
                        <p>{addr.city}</p>
                      </div>
                      <hr />
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <p>State: </p>
                        <p>{addr.state}</p>
                      </div>
                      <hr />
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <p>ZIP: </p>
                        <p>{addr.zip}</p>
                      </div>
                      <hr />
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <p>Country: </p>
                        <p>{addr.country}</p>
                      </div>
                      <hr />
                      <div style={{ marginTop: "10px" }}>
                        <button
                          className="btn"
                          onClick={() => {
                            setEditingIndex(index);
                            setEditedAddress(addr);
                            setShowAddForm(false);
                          }}
                        >
                          Edit
                        </button>
                        <button className="btn btn-delete" onClick={() => handleDeleteAddress(addr.id)}>Delete</button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>

            {showAddForm && (
              <div className="address-form">
                <h4>Add New Address</h4>
                {renderAddressInputs(newAddress, setNewAddress)}
                <div style={{ marginTop: "10px" }}>
                  <button className="btn" onClick={handleAddAddress}>Add Address</button>
                  <button
                    className="btn"
                    onClick={() => {
                      setShowAddForm(false);
                      setNewAddress({ ...blankAddress });
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Right Column */}
        <div className="right-column section">
          <h2>My Orders</h2>

          <div style={{ display: "flex" }}>
            {["ALL", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"].map((status) => (
              <button
                key={status}
                className={`btn ${orderFilter === status ? "" : "secondary"}`}
                onClick={() => {
                  setOrderFilter(status);
                  fetchOrders(status);
                }}
              >
                {status}
              </button>
            ))}
          </div>
          <hr></hr>

          {loadingOrders ? (
            <p>Loading orders...</p>
          ) : orders.length === 0 ? (
            <p>No orders found for selected filter.</p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0, maxHeight: "600px", overflowY: "auto", gap: "10px" }}>
              {orders.map((order) => (
                <li
                  key={order.id}
                  className="user-order-item"
                >
                  <p><strong>Status:</strong> <span style={{
                    color:
                      order.status === "DELIVERED" ? "green" :
                        order.status === "CANCELLED" ? "red" : "orange",
                    fontWeight: "bold"
                  }}>{order.status}</span></p>
                  <p><strong>Total:</strong> ${order.totalAmount.toFixed(2)}</p>
                  <p><strong>Destination:</strong> {order.shippingAddress}</p>
                  <button className="btn" style={{ marginTop: "10px" }}>View Details</button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );

}

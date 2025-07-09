import { useEffect, useState } from "react";
import {
  getAddresses,
  addAddress,
  deleteAddress,
  updateAddress,
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

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const data = await getAddresses(userId);
      setAddresses(data);
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

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

  const handleDeleteAddress = async (index, id) => {
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
      const updatedList = addresses.map((a) =>
        a.id === id ? updated : a
      );
      setAddresses(updatedList);
      setEditingIndex(null);
      setEditedAddress({ ...blankAddress });
    } catch (error) {
      console.error("Error updating address:", error);
    }
  };

  const renderAddressInputs = (address, setAddress) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      <input
        placeholder="Street"
        value={address.street}
        onChange={(e) => setAddress({ ...address, street: e.target.value })}
      />
      <input
        placeholder="City"
        value={address.city}
        onChange={(e) => setAddress({ ...address, city: e.target.value })}
      />
      <input
        placeholder="State"
        value={address.state}
        onChange={(e) => setAddress({ ...address, state: e.target.value })}
      />
      <input
        placeholder="ZIP"
        value={address.zip}
        onChange={(e) => setAddress({ ...address, zip: e.target.value })}
      />
      <input
        placeholder="Country"
        value={address.country}
        onChange={(e) => setAddress({ ...address, country: e.target.value })}
      />
    </div>
  );

  return (
    <div style={{ padding: "2rem" }}>
      <h2>My Profile</h2>

      <div style={{ marginBottom: "2rem" }}>
        <h3>My Addresses</h3>
        <ul>
          {addresses.map((addr, index) => (
            <li key={addr.id} style={{ marginBottom: "1rem" }}>
              {editingIndex === index ? (
                <div>
                  {renderAddressInputs(editedAddress, setEditedAddress)}
                  <button onClick={() => handleEditAddress(addr.id)}>Save</button>
                  <button onClick={() => setEditingIndex(null)}>Cancel</button>
                </div>
              ) : (
                <div>
                  <div>
                    {addr.street}, {addr.city}, {addr.state} {addr.zip}, {addr.country}
                  </div>
                  <button
                    onClick={() => {
                      setEditingIndex(index);
                      setEditedAddress(addr);
                    }}
                  >
                    Edit
                  </button>
                  <button onClick={() => handleDeleteAddress(index, addr.id)}>
                    Delete
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>

        {addresses.length < 4 && (
          <div style={{ marginTop: "1rem" }}>
            <h4>Add New Address</h4>
            {renderAddressInputs(newAddress, setNewAddress)}
            <button onClick={handleAddAddress}>Add Address</button>
          </div>
        )}
      </div>

      <div
        style={{
          backgroundColor: "#e3f2fd",
          padding: "1rem",
          marginBottom: "1rem",
          borderRadius: "8px",
        }}
      >
        <h3>My Orders</h3>
        <p>[Orders section coming soon]</p>
      </div>

      <div
        style={{
          backgroundColor: "#fce4ec",
          padding: "1rem",
          borderRadius: "8px",
        }}
      >
        <h3>Profile Info</h3>
        <p>[Profile details coming soon]</p>
      </div>
    </div>
  );
}

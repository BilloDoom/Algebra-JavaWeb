import { useState, useEffect } from "react";
import { getAddresses, addAddress, deleteAddress } from "../api/api";

export default function AddressPage() {
  const userId = localStorage.getItem("userId");
  const [addresses, setAddresses] = useState([]);
  const [form, setForm] = useState({ street: "", city: "", state: "", zip: "", country: "" });

  useEffect(() => {
    async function fetchData() {
      const data = await getAddresses(userId);
      setAddresses(data);
    }
    fetchData();
  }, [userId]);

  const handleAdd = async (e) => {
    e.preventDefault();
    const newAddress = await addAddress(userId, form);
    setAddresses([...addresses, newAddress]);
    setForm({ street: "", city: "", state: "", zip: "", country: "" });
  };

  const handleDelete = async (id) => {
    await deleteAddress(userId, id);
    setAddresses(addresses.filter(addr => addr.id !== id));
  };

  return (
    <div>
      <form onSubmit={handleAdd}>
        <input placeholder="Street" onChange={(e) => setForm({ ...form, street: e.target.value })} />
        <input placeholder="City" onChange={(e) => setForm({ ...form, city: e.target.value })} />
        <input placeholder="State" onChange={(e) => setForm({ ...form, state: e.target.value })} />
        <input placeholder="Zip" onChange={(e) => setForm({ ...form, zip: e.target.value })} />
        <input placeholder="Country" onChange={(e) => setForm({ ...form, country: e.target.value })} />
        <button type="submit" disabled={addresses.length >= 4}>Add Address</button>
      </form>

      <ul>
        {addresses.map(addr => (
          <li key={addr.id}>
            {addr.street}, {addr.city}, {addr.state}, {addr.zip}, {addr.country}
            <button onClick={() => handleDelete(addr.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

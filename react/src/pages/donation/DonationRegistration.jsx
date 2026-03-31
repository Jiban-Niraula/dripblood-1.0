import React, { useEffect, useState } from "react";
import axios from "axios";

const DonationRegistrations = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    event_id: "",
    user_id: "",
    status: ""
  });

  const [error, setError] = useState("");

  // 📥 FETCH DATA
  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await axios.get("/api/donation-registrations", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        params: filters
      });

      setData(res.data.data);
      setError("");
    } catch (err) {
      setError("Failed to load registrations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🔄 FILTER CHANGE
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = () => {
    fetchData();
  };

  // ❌ DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      await axios.delete(`/api/donation-registrations/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      fetchData();
    } catch {
      alert("Delete failed");
    }
  };

  // ✏️ UPDATE STATUS
  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `/api/donation-registrations/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      fetchData();
    } catch {
      alert("Update failed");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Donation Registrations</h1>

      {/* FILTERS */}
      <div className="flex gap-2 mb-4">
        <input
          name="event_id"
          placeholder="Event ID"
          className="border p-2"
          onChange={handleFilterChange}
        />

        <input
          name="user_id"
          placeholder="User ID"
          className="border p-2"
          onChange={handleFilterChange}
        />

        <select
          name="status"
          className="border p-2"
          onChange={handleFilterChange}
        >
          <option value="">All Status</option>
          <option value="registered">Registered</option>
          <option value="donated">Donated</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <button
          onClick={applyFilters}
          className="bg-blue-500 text-white px-4 py-2"
        >
          Filter
        </button>
      </div>

      {/* LOADING */}
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* TABLE */}
      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">User</th>
            <th className="border p-2">Event</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Registered At</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td className="border p-2">
                {item.user?.name}
              </td>

              <td className="border p-2">
                {item.blood_donation_event?.title || "Event"}
              </td>

              <td className="border p-2">
                <span className="px-2 py-1 bg-gray-200 rounded">
                  {item.status}
                </span>
              </td>

              <td className="border p-2">
                {item.registered_at}
              </td>

              <td className="border p-2 flex gap-2">
                <select
                  onChange={(e) =>
                    updateStatus(item.id, e.target.value)
                  }
                  value={item.status}
                  className="border p-1"
                >
                  <option value="registered">Registered</option>
                  <option value="donated">Donated</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="bg-red-500 text-white px-2 py-1"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DonationRegistrations;
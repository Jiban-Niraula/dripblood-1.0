import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle,
  Clock,
  Users,
  UserCheck,
  UserPlus,
  Filter,
  Download,
  Mail,
  Phone,
  Activity,
  Eye,
  Edit,
  Trash2,
  Search,
  X,
} from "lucide-react";

export default function UserPage() {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", phone: "", type: "Donor", status: "active" });
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("admin_user");
    if (userData) setUser(JSON.parse(userData));
    else navigate("/login");

    // 20 sample users
    const sampleUsers = Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      phone: `98123${String(45678 + i).padStart(3, "0")}`,
      type: i % 2 === 0 ? "Donor" : "Recipient",
      status: i % 3 === 0 ? "pending" : "active",
    }));
    setUsers(sampleUsers);
  }, [navigate]);

  const stats = [
    { label: "Total Users", value: users.length, color: "blue", icon: Users },
    {
      label: "Active Donors",
      value: users.filter((u) => u.type === "Donor" && u.status === "active").length,
      color: "green",
      icon: UserCheck,
    },
    {
      label: "Pending Users",
      value: users.filter((u) => u.status === "pending").length,
      color: "orange",
      icon: Clock,
    },
  ];

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.phone.includes(search)
  );

  const handleAddUser = () => {
    const id = users.length + 1;
    setUsers([...users, { id, ...newUser }]);
    setNewUser({ name: "", email: "", phone: "", type: "Donor", status: "active" });
    setModalOpen(false);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`p-3 rounded-xl bg-gradient-to-br ${
                    stat.color === "blue"
                      ? "from-blue-500 to-blue-600"
                      : stat.color === "green"
                      ? "from-green-500 to-green-600"
                      : "from-orange-500 to-orange-600"
                  } shadow-lg`}
                >
                  <stat.icon className="text-white" size={24} />
                </div>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.label}</h3>
              <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
            <h3 className="text-lg font-bold text-gray-800">Users</h3>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:flex-none">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full md:w-64 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all text-sm"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                />
              </div>

              <button
                className="py-2 px-4 rounded-xl bg-gradient-to-r from-red-500 via-rose-600 to-pink-600 text-white font-semibold hover:shadow-2xl transition-all duration-300 flex items-center gap-2"
                onClick={() => setModalOpen(true)}
              >
                <UserPlus size={16} /> Add User
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">User</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">Contact</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">Type</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr
                    key={u.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm ${
                            u.type === "Donor"
                              ? "bg-gradient-to-br from-blue-500 to-blue-600"
                              : "bg-gradient-to-br from-purple-500 to-purple-600"
                          }`}
                        >
                          {u.name.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <span className="font-medium text-gray-800">{u.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2 mb-1">
                        <Mail size={14} />
                        <span>{u.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone size={14} />
                        <span>{u.phone}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`text-sm font-medium ${u.type === "Donor" ? "text-red-600" : "text-blue-600"}`}>
                        {u.type}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg ${
                          u.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        <CheckCircle size={12} /> {u.status === "active" ? "Active" : "Pending"}
                      </span>
                    </td>
                    <td className="py-4 px-4 flex items-center gap-2">
                      <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                        <Eye size={16} />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                        <Edit size={16} />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-800">Recent Activity</h3>
            <Activity size={20} className="text-gray-400" />
          </div>
          <div className="space-y-4">
            {users.slice(0, 5).map((u, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-100">
                  <UserPlus size={18} className="text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">
                    <span className="font-semibold">{u.name}</span> joined the platform
                  </p>
                  <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                </div>
                <span className="text-xs font-medium px-2 py-1 rounded-lg bg-blue-100 text-blue-700">
                  Active
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Add User Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
              onClick={() => setModalOpen(false)}
            >
              <X size={20} />
            </button>
            <h3 className="text-lg font-bold mb-4">Add New User</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                className="w-full px-4 py-2 border rounded-xl text-sm"
              />
              <input
                type="email"
                placeholder="Email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                className="w-full px-4 py-2 border rounded-xl text-sm"
              />
              <input
                type="text"
                placeholder="Phone"
                value={newUser.phone}
                onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                className="w-full px-4 py-2 border rounded-xl text-sm"
              />
              <select
                value={newUser.type}
                onChange={(e) => setNewUser({ ...newUser, type: e.target.value })}
                className="w-full px-4 py-2 border rounded-xl text-sm"
              >
                <option value="Donor">Donor</option>
                <option value="Recipient">Recipient</option>
              </select>
              <select
                value={newUser.status}
                onChange={(e) => setNewUser({ ...newUser, status: e.target.value })}
                className="w-full px-4 py-2 border rounded-xl text-sm"
              >
                <option value="active">Active</option>
                <option value="pending">Pending</option>
              </select>
              <button
                className="w-full py-2 px-4 rounded-xl bg-gradient-to-r from-red-500 via-rose-600 to-pink-600 text-white font-semibold hover:shadow-2xl transition-all duration-300"
                onClick={handleAddUser}
              >
                Add User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

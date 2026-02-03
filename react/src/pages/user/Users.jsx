  import React, { useEffect, useState } from "react";
  import { useNavigate } from "react-router-dom";
  import {
    CheckCircle,
    Clock,
    Users,
    UserCheck,
    UserPlus,
    Download,
    Mail,
    Phone,
    Activity,
    Eye,
    Edit,
    Trash2,
    Search,
    X,
    AlertCircle,
    ChevronLeft,
    ChevronRight,
    Shield,
    User,
    MapPin,
    Calendar,
    Droplet,
    FileText,
    ArrowRight,
    ArrowLeft,
    Check,
  } from "lucide-react";

  // Demo API configuration - Replace these with your actual API endpoints
  const API_CONFIG = {
    BASE_URL: "https://api.example.com", // Replace with your actual API URL
    ENDPOINTS: {
      USERS: "/users",
      CREATE_USER: "/users/create",
      UPDATE_USER: "/users/update",
      DELETE_USER: "/users/delete",
    },
  };

  // Demo fetch function - Replace this with your actual API integration
  const demoFetch = async (endpoint, options = {}) => {
    console.log("API Call:", endpoint, options);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    // Return mock response
    return {
      success: true,
      message: "Operation successful",
      data: options.body ? JSON.parse(options.body) : null,
    };
  };

  export default function UserPage() {
    const [user, setUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [modalOpen, setModalOpen] = useState(false);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [formStep, setFormStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [newUser, setNewUser] = useState({
      // Step 1: Basic Info
      name: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      gender: "",
      
      // Step 2: Address Info
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "Nepal",
      
      // Step 3: Medical & Role Info
      bloodType: "",
      type: "Donor",
      role: "general",
      status: "active",
      medicalConditions: "",
      notes: "",
    });
    const [errors, setErrors] = useState({});
    const [activities, setActivities] = useState([]);
    const navigate = useNavigate();

    // Initialize users from localStorage or create sample data
    useEffect(() => {
      const userData = localStorage.getItem("admin_user");
      if (userData) setUser(JSON.parse(userData));
      else navigate("/login");

      const storedUsers = localStorage.getItem("users");
      const storedActivities = localStorage.getItem("activities");

      if (storedUsers) {
        setUsers(JSON.parse(storedUsers));
      } else {
        const cities = ["Kathmandu", "Pokhara", "Lalitpur", "Bhaktapur", "Biratnagar"];
        const states = ["Bagmati", "Gandaki", "Province 1", "Lumbini", "Karnali"];
        const genders = ["Male", "Female", "Other"];
        
        const sampleUsers = Array.from({ length: 50 }, (_, i) => ({
          id: i + 1,
          name: `User ${i + 1}`,
          email: `user${i + 1}@example.com`,
          phone: `98123${String(45678 + i).padStart(5, "0")}`,
          dateOfBirth: new Date(1990 + (i % 30), i % 12, (i % 28) + 1).toISOString().split("T")[0],
          gender: genders[i % 3],
          address: `Street ${i + 1}, Ward ${(i % 10) + 1}`,
          city: cities[i % cities.length],
          state: states[i % states.length],
          zipCode: `44600${i % 10}`,
          country: "Nepal",
          type: i % 2 === 0 ? "Donor" : "Recipient",
          role: i % 7 === 0 ? "admin" : "general",
          status: i % 5 === 0 ? "pending" : "active",
          bloodType: ["A+", "B+", "O+", "AB+", "A-", "B-", "O-", "AB-"][i % 8],
          medicalConditions: i % 3 === 0 ? "None" : "Hypertension",
          notes: `User notes for ${i + 1}`,
          createdAt: new Date(Date.now() - i * 86400000).toISOString(),
        }));
        setUsers(sampleUsers);
        localStorage.setItem("users", JSON.stringify(sampleUsers));
      }

      if (storedActivities) {
        setActivities(JSON.parse(storedActivities));
      } else {
        const initialActivities = [];
        setActivities(initialActivities);
        localStorage.setItem("activities", JSON.stringify(initialActivities));
      }
    }, [navigate]);

    useEffect(() => {
      if (users.length > 0) {
        localStorage.setItem("users", JSON.stringify(users));
      }
    }, [users]);

    useEffect(() => {
      if (activities.length > 0) {
        localStorage.setItem("activities", JSON.stringify(activities));
      }
    }, [activities]);

    const stats = [
      { label: "Total Users", value: users.length, color: "blue", icon: Users },
      {
        label: "Admin Users",
        value: users.filter((u) => u.role === "admin").length,
        color: "purple",
        icon: Shield,
      },
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

    const filteredUsers = users.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        u.phone.includes(search);

      const matchesRole =
        roleFilter === "all" ||
        (roleFilter === "admin" && u.role === "admin") ||
        (roleFilter === "general" && u.role === "general");

      return matchesSearch && matchesRole;
    });

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentUsers = filteredUsers.slice(startIndex, endIndex);

    useEffect(() => {
      setCurrentPage(1);
    }, [search, roleFilter]);

    // Validation for each step
    const validateStep = (step) => {
      const newErrors = {};

      if (step === 1) {
        if (!newUser.name || newUser.name.trim().length < 2) {
          newErrors.name = "Name must be at least 2 characters";
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!newUser.email || !emailRegex.test(newUser.email)) {
          newErrors.email = "Please enter a valid email address";
        }

        const phoneRegex = /^[0-9]{10,}$/;
        if (!newUser.phone || !phoneRegex.test(newUser.phone.replace(/\s/g, ""))) {
          newErrors.phone = "Please enter a valid phone number";
        }

        if (!newUser.dateOfBirth) {
          newErrors.dateOfBirth = "Date of birth is required";
        }

        if (!newUser.gender) {
          newErrors.gender = "Please select a gender";
        }
      }

      if (step === 2) {
        if (!newUser.address || newUser.address.trim().length < 5) {
          newErrors.address = "Address must be at least 5 characters";
        }

        if (!newUser.city) {
          newErrors.city = "City is required";
        }

        if (!newUser.state) {
          newErrors.state = "State/Province is required";
        }

        if (!newUser.zipCode) {
          newErrors.zipCode = "ZIP code is required";
        }
      }

      if (step === 3) {
        if (!newUser.bloodType) {
          newErrors.bloodType = "Blood type is required";
        }
      }

      return newErrors;
    };

    const addActivity = (action, userName, userType) => {
      const newActivity = {
        id: Date.now(),
        action,
        userName,
        userType,
        timestamp: new Date().toISOString(),
      };
      const updatedActivities = [newActivity, ...activities].slice(0, 10);
      setActivities(updatedActivities);
      localStorage.setItem("activities", JSON.stringify(updatedActivities));
    };

    const handleNextStep = () => {
      const validationErrors = validateStep(formStep);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
      setErrors({});
      setFormStep(formStep + 1);
    };

    const handlePrevStep = () => {
      setErrors({});
      setFormStep(formStep - 1);
    };

    const handleAddUser = async () => {
      const validationErrors = validateStep(3);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      if (users.some((u) => u.email.toLowerCase() === newUser.email.toLowerCase())) {
        setErrors({ email: "This email is already registered" });
        setFormStep(1);
        return;
      }

      setLoading(true);

      try {
        // Demo API call - Replace with actual API integration
        const response = await demoFetch(
          `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CREATE_USER}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newUser),
          }
        );

        if (response.success) {
          const id = users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;
          const newUserData = {
            id,
            ...newUser,
            createdAt: new Date().toISOString(),
          };

          setUsers([...users, newUserData]);
          addActivity("joined", newUser.name, newUser.type);
          
          // Reset form
          setNewUser({
            name: "",
            email: "",
            phone: "",
            dateOfBirth: "",
            gender: "",
            address: "",
            city: "",
            state: "",
            zipCode: "",
            country: "Nepal",
            bloodType: "",
            type: "Donor",
            role: "general",
            status: "active",
            medicalConditions: "",
            notes: "",
          });
          setErrors({});
          setFormStep(1);
          setModalOpen(false);
        }
      } catch (error) {
        console.error("Error adding user:", error);
        setErrors({ submit: "Failed to add user. Please try again." });
      } finally {
        setLoading(false);
      }
    };

    const handleViewUser = (userId) => {
      const userToView = users.find((u) => u.id === userId);
      setSelectedUser(userToView);
      setViewModalOpen(true);
    };

    const handleEditUser = (userId) => {
      const userToEdit = users.find((u) => u.id === userId);
      setSelectedUser(userToEdit);
      setNewUser({ ...userToEdit });
      setEditModalOpen(true);
    };

    const handleUpdateUser = async () => {
      const validationErrors = validateStep(1);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      if (
        users.some(
          (u) =>
            u.email.toLowerCase() === newUser.email.toLowerCase() && u.id !== selectedUser.id
        )
      ) {
        setErrors({ email: "This email is already registered" });
        return;
      }

      setLoading(true);

      try {
        // Demo API call - Replace with actual API integration
        await demoFetch(
          `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.UPDATE_USER}/${selectedUser.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newUser),
          }
        );

        const updatedUsers = users.map((u) =>
          u.id === selectedUser.id ? { ...u, ...newUser } : u
        );
        setUsers(updatedUsers);
        addActivity("updated", newUser.name, newUser.type);
        
        setNewUser({
          name: "",
          email: "",
          phone: "",
          dateOfBirth: "",
          gender: "",
          address: "",
          city: "",
          state: "",
          zipCode: "",
          country: "Nepal",
          bloodType: "",
          type: "Donor",
          role: "general",
          status: "active",
          medicalConditions: "",
          notes: "",
        });
        setErrors({});
        setEditModalOpen(false);
        setSelectedUser(null);
      } catch (error) {
        console.error("Error updating user:", error);
        setErrors({ submit: "Failed to update user. Please try again." });
      } finally {
        setLoading(false);
      }
    };

    const handleDeleteUser = async (userId) => {
      if (window.confirm("Are you sure you want to delete this user?")) {
        setLoading(true);
        try {
          // Demo API call - Replace with actual API integration
          await demoFetch(
            `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DELETE_USER}/${userId}`,
            {
              method: "DELETE",
            }
          );

          const userToDelete = users.find((u) => u.id === userId);
          setUsers(users.filter((u) => u.id !== userId));
          addActivity("removed", userToDelete.name, userToDelete.type);
        } catch (error) {
          console.error("Error deleting user:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    const handleExportUsers = () => {
      const csvContent = [
        ["ID", "Name", "Email", "Phone", "DOB", "Gender", "Address", "City", "State", "ZIP", "Country", "Blood Type", "Type", "Role", "Status", "Medical Conditions", "Created At"],
        ...filteredUsers.map((u) => [
          u.id,
          u.name,
          u.email,
          u.phone,
          u.dateOfBirth,
          u.gender,
          u.address,
          u.city,
          u.state,
          u.zipCode,
          u.country,
          u.bloodType,
          u.type,
          u.role,
          u.status,
          u.medicalConditions || "",
          new Date(u.createdAt).toLocaleDateString(),
        ]),
      ]
        .map((row) => row.join(","))
        .join("\n");

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `users_${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    };

    const timeAgo = (timestamp) => {
      const now = new Date();
      const past = new Date(timestamp);
      const diffInSeconds = Math.floor((now - past) / 1000);

      if (diffInSeconds < 60) return "Just now";
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
      if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
      return past.toLocaleDateString();
    };

    const goToPage = (page) => {
      if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
      }
    };

    const renderPageNumbers = () => {
      const pages = [];
      const maxVisiblePages = 5;

      if (totalPages <= maxVisiblePages) {
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        if (currentPage <= 3) {
          pages.push(1, 2, 3, 4, "...", totalPages);
        } else if (currentPage >= totalPages - 2) {
          pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
        } else {
          pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
        }
      }

      return pages;
    };

    return (
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
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
                        : stat.color === "purple"
                        ? "from-purple-500 to-purple-600"
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
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-3 mb-6 pb-6 border-b border-gray-200">
              <button
                onClick={() => setRoleFilter("all")}
                className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                  roleFilter === "all"
                    ? "bg-gradient-to-r from-red-500 via-rose-600 to-pink-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Users size={16} />
                All Users
                <span
                  className={`px-2 py-0.5 rounded-lg text-xs font-bold ${
                    roleFilter === "all" ? "bg-white/20" : "bg-gray-200"
                  }`}
                >
                  {users.length}
                </span>
              </button>

              <button
                onClick={() => setRoleFilter("admin")}
                className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                  roleFilter === "admin"
                    ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Shield size={16} />
                Admin
                <span
                  className={`px-2 py-0.5 rounded-lg text-xs font-bold ${
                    roleFilter === "admin" ? "bg-white/20" : "bg-gray-200"
                  }`}
                >
                  {users.filter((u) => u.role === "admin").length}
                </span>
              </button>

              <button
                onClick={() => setRoleFilter("general")}
                className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                  roleFilter === "general"
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <User size={16} />
                General Users
                <span
                  className={`px-2 py-0.5 rounded-lg text-xs font-bold ${
                    roleFilter === "general" ? "bg-white/20" : "bg-gray-200"
                  }`}
                >
                  {users.filter((u) => u.role === "general").length}
                </span>
              </button>
            </div>

            {/* Search and Actions */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-bold text-gray-800">
                  {roleFilter === "all"
                    ? "All Users"
                    : roleFilter === "admin"
                    ? "Admin Users"
                    : "General Users"}
                </h3>
                <span className="text-sm text-gray-500">
                  Showing {startIndex + 1}-{Math.min(endIndex, filteredUsers.length)} of{" "}
                  {filteredUsers.length}
                </span>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
                <div className="relative flex-1 md:flex-none">
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full md:w-64 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all text-sm"
                  />
                </div>

                <button
                  className="py-2 px-4 rounded-xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-all duration-300 flex items-center gap-2 text-sm"
                  onClick={handleExportUsers}
                >
                  <Download size={16} /> Export
                </button>

                <button
                  className="py-2 px-4 rounded-xl bg-gradient-to-r from-red-500 via-rose-600 to-pink-600 text-white font-semibold hover:shadow-2xl transition-all duration-300 flex items-center gap-2 text-sm"
                  onClick={() => setModalOpen(true)}
                >
                  <UserPlus size={16} /> Add User
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">
                      User
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">
                      Contact
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">
                      Location
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">
                      Type
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">
                      Role
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">
                      Blood
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">
                      Status
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="py-12 text-center text-gray-500">
                        <Users size={48} className="mx-auto mb-3 text-gray-300" />
                        <p className="font-medium">No users found</p>
                        <p className="text-sm text-gray-400 mt-1">
                          Try adjusting your search or filters
                        </p>
                      </td>
                    </tr>
                  ) : (
                    currentUsers.map((u) => (
                      <tr
                        key={u.id}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm ${
                                u.type === "Donor"
                                  ? "bg-gradient-to-br from-red-500 to-rose-600"
                                  : "bg-gradient-to-br from-blue-500 to-blue-600"
                              }`}
                            >
                              {u.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()}
                            </div>
                            <div>
                              <span className="font-medium text-gray-800 block">{u.name}</span>
                              <span className="text-xs text-gray-500">{u.gender}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2 mb-1">
                            <Mail size={14} className="text-gray-400" />
                            <span className="truncate max-w-[200px]">{u.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone size={14} className="text-gray-400" />
                            <span>{u.phone}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <MapPin size={14} className="text-gray-400" />
                            <span>{u.city}, {u.state}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`text-sm font-medium ${
                              u.type === "Donor" ? "text-red-600" : "text-blue-600"
                            }`}
                          >
                            {u.type}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg ${
                              u.role === "admin"
                                ? "bg-purple-100 text-purple-700"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {u.role === "admin" ? (
                              <Shield size={12} />
                            ) : (
                              <User size={12} />
                            )}
                            {u.role === "admin" ? "Admin" : "General"}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-red-50 text-red-700 text-xs font-semibold">
                            <Droplet size={12} />
                            {u.bloodType}
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
                            <CheckCircle size={12} />
                            {u.status === "active" ? "Active" : "Pending"}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <button
                              className="p-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors"
                              onClick={() => handleViewUser(u.id)}
                              title="View user"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              className="p-2 rounded-lg hover:bg-green-50 hover:text-green-600 transition-colors"
                              onClick={() => handleEditUser(u.id)}
                              title="Edit user"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              className="p-2 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
                              onClick={() => handleDeleteUser(u.id)}
                              title="Delete user"
                              disabled={loading}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200 flex-wrap gap-4">
                <div className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-lg transition-all ${
                      currentPage === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <ChevronLeft size={18} />
                  </button>

                  <div className="flex items-center gap-1">
                    {renderPageNumbers().map((page, index) =>
                      page === "..." ? (
                        <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-400">
                          ...
                        </span>
                      ) : (
                        <button
                          key={page}
                          onClick={() => goToPage(page)}
                          className={`px-3 py-2 rounded-lg transition-all font-medium text-sm ${
                            currentPage === page
                              ? "bg-gradient-to-r from-red-500 via-rose-600 to-pink-600 text-white shadow-lg"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {page}
                        </button>
                      )
                    )}
                  </div>

                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-lg transition-all ${
                      currentPage === totalPages
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>

                <div className="text-sm text-gray-600">
                  {filteredUsers.length} total users
                </div>
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-800">Recent Activity</h3>
              <Activity size={20} className="text-gray-400" />
            </div>
            <div className="space-y-4">
              {activities.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Activity size={48} className="mx-auto mb-2 text-gray-300" />
                  <p>No recent activity</p>
                </div>
              ) : (
                activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        activity.action === "joined"
                          ? "bg-green-100"
                          : activity.action === "updated"
                          ? "bg-blue-100"
                          : "bg-red-100"
                      }`}
                    >
                      {activity.action === "joined" ? (
                        <UserPlus size={18} className="text-green-600" />
                      ) : activity.action === "updated" ? (
                        <Edit size={18} className="text-blue-600" />
                      ) : (
                        <Trash2 size={18} className="text-red-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">
                        <span className="font-semibold">{activity.userName}</span>{" "}
                        {activity.action === "joined"
                          ? "joined the platform"
                          : activity.action === "updated"
                          ? "was updated"
                          : "was removed"}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {timeAgo(activity.timestamp)}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-lg ${
                        activity.userType === "Donor"
                          ? "bg-red-100 text-red-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {activity.userType}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>

        {/* Multi-Step Add User Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl p-8 w-full max-w-2xl shadow-2xl relative my-8">
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors z-10"
                onClick={() => {
                  setModalOpen(false);
                  setErrors({});
                  setFormStep(1);
                  setNewUser({
                    name: "",
                    email: "",
                    phone: "",
                    dateOfBirth: "",
                    gender: "",
                    address: "",
                    city: "",
                    state: "",
                    zipCode: "",
                    country: "Nepal",
                    bloodType: "",
                    type: "Donor",
                    role: "general",
                    status: "active",
                    medicalConditions: "",
                    notes: "",
                  });
                }}
              >
                <X size={24} />
              </button>

              {/* Header */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Add New User</h2>
                <p className="text-gray-500">Fill in the details to create a new user account</p>
              </div>

              {/* Progress Steps */}
              <div className="mb-8">
                <div className="flex items-center justify-between">
                  {[1, 2, 3].map((step) => (
                    <React.Fragment key={step}>
                      <div className="flex flex-col items-center flex-1">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                            formStep > step
                              ? "bg-green-500 text-white"
                              : formStep === step
                              ? "bg-gradient-to-r from-red-500 via-rose-600 to-pink-600 text-white shadow-lg"
                              : "bg-gray-200 text-gray-500"
                          }`}
                        >
                          {formStep > step ? <Check size={24} /> : step}
                        </div>
                        <span
                          className={`text-xs mt-2 font-medium ${
                            formStep >= step ? "text-gray-800" : "text-gray-400"
                          }`}
                        >
                          {step === 1 ? "Basic Info" : step === 2 ? "Address" : "Medical & Role"}
                        </span>
                      </div>
                      {step < 3 && (
                        <div
                          className={`flex-1 h-1 mx-2 rounded transition-all duration-300 ${
                            formStep > step ? "bg-green-500" : "bg-gray-200"
                          }`}
                        />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Form Steps */}
              <form className="space-y-6">
                {/* Step 1: Basic Information */}
                {formStep === 1 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="John Doe"
                          value={newUser.name}
                          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                          className={`w-full px-4 py-3 border rounded-xl text-sm focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all ${
                            errors.name ? "border-red-500" : "border-gray-200"
                          }`}
                        />
                        {errors.name && (
                          <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                            <AlertCircle size={12} /> {errors.name}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          placeholder="john.doe@example.com"
                          value={newUser.email}
                          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                          className={`w-full px-4 py-3 border rounded-xl text-sm focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all ${
                            errors.email ? "border-red-500" : "border-gray-200"
                          }`}
                        />
                        {errors.email && (
                          <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                            <AlertCircle size={12} /> {errors.email}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="9812345678"
                          value={newUser.phone}
                          onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                          className={`w-full px-4 py-3 border rounded-xl text-sm focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all ${
                            errors.phone ? "border-red-500" : "border-gray-200"
                          }`}
                        />
                        {errors.phone && (
                          <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                            <AlertCircle size={12} /> {errors.phone}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Date of Birth <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          value={newUser.dateOfBirth}
                          onChange={(e) => setNewUser({ ...newUser, dateOfBirth: e.target.value })}
                          className={`w-full px-4 py-3 border rounded-xl text-sm focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all ${
                            errors.dateOfBirth ? "border-red-500" : "border-gray-200"
                          }`}
                        />
                        {errors.dateOfBirth && (
                          <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                            <AlertCircle size={12} /> {errors.dateOfBirth}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Gender <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {["Male", "Female", "Other"].map((gender) => (
                          <button
                            key={gender}
                            type="button"
                            onClick={() => setNewUser({ ...newUser, gender })}
                            className={`py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                              newUser.gender === gender
                                ? "bg-gradient-to-r from-red-500 via-rose-600 to-pink-600 text-white shadow-lg"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                          >
                            {gender}
                          </button>
                        ))}
                      </div>
                      {errors.gender && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle size={12} /> {errors.gender}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 2: Address Information */}
                {formStep === 2 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Street Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Street name, Ward number"
                        value={newUser.address}
                        onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
                        className={`w-full px-4 py-3 border rounded-xl text-sm focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all ${
                          errors.address ? "border-red-500" : "border-gray-200"
                        }`}
                      />
                      {errors.address && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle size={12} /> {errors.address}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          City <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Kathmandu"
                          value={newUser.city}
                          onChange={(e) => setNewUser({ ...newUser, city: e.target.value })}
                          className={`w-full px-4 py-3 border rounded-xl text-sm focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all ${
                            errors.city ? "border-red-500" : "border-gray-200"
                          }`}
                        />
                        {errors.city && (
                          <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                            <AlertCircle size={12} /> {errors.city}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          State/Province <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={newUser.state}
                          onChange={(e) => setNewUser({ ...newUser, state: e.target.value })}
                          className={`w-full px-4 py-3 border rounded-xl text-sm focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all ${
                            errors.state ? "border-red-500" : "border-gray-200"
                          }`}
                        >
                          <option value="">Select Province</option>
                          <option value="Province 1">Province 1</option>
                          <option value="Madhesh">Madhesh</option>
                          <option value="Bagmati">Bagmati</option>
                          <option value="Gandaki">Gandaki</option>
                          <option value="Lumbini">Lumbini</option>
                          <option value="Karnali">Karnali</option>
                          <option value="Sudurpashchim">Sudurpashchim</option>
                        </select>
                        {errors.state && (
                          <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                            <AlertCircle size={12} /> {errors.state}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          ZIP Code <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="44600"
                          value={newUser.zipCode}
                          onChange={(e) => setNewUser({ ...newUser, zipCode: e.target.value })}
                          className={`w-full px-4 py-3 border rounded-xl text-sm focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all ${
                            errors.zipCode ? "border-red-500" : "border-gray-200"
                          }`}
                        />
                        {errors.zipCode && (
                          <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                            <AlertCircle size={12} /> {errors.zipCode}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Country
                        </label>
                        <input
                          type="text"
                          value={newUser.country}
                          onChange={(e) => setNewUser({ ...newUser, country: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Medical & Role Information */}
                {formStep === 3 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Blood Type <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={newUser.bloodType}
                          onChange={(e) => setNewUser({ ...newUser, bloodType: e.target.value })}
                          className={`w-full px-4 py-3 border rounded-xl text-sm focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all ${
                            errors.bloodType ? "border-red-500" : "border-gray-200"
                          }`}
                        >
                          <option value="">Select Blood Type</option>
                          <option value="A+">A+</option>
                          <option value="A-">A-</option>
                          <option value="B+">B+</option>
                          <option value="B-">B-</option>
                          <option value="O+">O+</option>
                          <option value="O-">O-</option>
                          <option value="AB+">AB+</option>
                          <option value="AB-">AB-</option>
                        </select>
                        {errors.bloodType && (
                          <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                            <AlertCircle size={12} /> {errors.bloodType}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          User Type
                        </label>
                        <select
                          value={newUser.type}
                          onChange={(e) => setNewUser({ ...newUser, type: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all"
                        >
                          <option value="Donor">Donor</option>
                          <option value="Recipient">Recipient</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Role
                        </label>
                        <select
                          value={newUser.role}
                          onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all"
                        >
                          <option value="general">General User</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Status
                        </label>
                        <select
                          value={newUser.status}
                          onChange={(e) => setNewUser({ ...newUser, status: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all"
                        >
                          <option value="active">Active</option>
                          <option value="pending">Pending</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Medical Conditions
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Diabetes, Hypertension (leave empty if none)"
                        value={newUser.medicalConditions}
                        onChange={(e) =>
                          setNewUser({ ...newUser, medicalConditions: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Additional Notes
                      </label>
                      <textarea
                        placeholder="Any additional information..."
                        value={newUser.notes}
                        onChange={(e) => setNewUser({ ...newUser, notes: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all resize-none"
                      />
                    </div>

                    {errors.submit && (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                        <p className="text-red-600 text-sm flex items-center gap-2">
                          <AlertCircle size={16} /> {errors.submit}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                  {formStep > 1 ? (
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="px-6 py-3 rounded-xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-all duration-300 flex items-center gap-2"
                    >
                      <ArrowLeft size={18} />
                      Previous
                    </button>
                  ) : (
                    <div></div>
                  )}

                  {formStep < 3 ? (
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 via-rose-600 to-pink-600 text-white font-semibold hover:shadow-2xl transition-all duration-300 flex items-center gap-2"
                    >
                      Next
                      <ArrowRight size={18} />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleAddUser}
                      disabled={loading}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold hover:shadow-2xl transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                          Adding...
                        </>
                      ) : (
                        <>
                          <Check size={18} />
                          Add User
                        </>
                      )}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}

        {/* View User Modal - Enhanced with all details */}
        {viewModalOpen && selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-2xl relative my-8">
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors"
                onClick={() => {
                  setViewModalOpen(false);
                  setSelectedUser(null);
                }}
              >
                <X size={20} />
              </button>
              <h3 className="text-xl font-bold mb-6 text-gray-800">User Details</h3>

              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
                <div
                  className={`w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-2xl ${
                    selectedUser.type === "Donor"
                      ? "bg-gradient-to-br from-red-500 to-rose-600"
                      : "bg-gradient-to-br from-blue-500 to-blue-600"
                  }`}
                >
                  {selectedUser.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-xl">{selectedUser.name}</h4>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg ${
                        selectedUser.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      <CheckCircle size={12} />
                      {selectedUser.status === "active" ? "Active" : "Pending"}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg ${
                        selectedUser.role === "admin"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {selectedUser.role === "admin" ? (
                        <Shield size={12} />
                      ) : (
                        <User size={12} />
                      )}
                      {selectedUser.role === "admin" ? "Admin" : "General"}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-red-50 text-red-700 text-xs font-semibold">
                      <Droplet size={12} />
                      {selectedUser.bloodType}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                  <Mail size={20} className="text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 font-medium mb-1">Email</p>
                    <p className="text-sm text-gray-800 break-all">{selectedUser.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                  <Phone size={20} className="text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 font-medium mb-1">Phone</p>
                    <p className="text-sm text-gray-800">{selectedUser.phone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                  <Calendar size={20} className="text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 font-medium mb-1">Date of Birth</p>
                    <p className="text-sm text-gray-800">
                      {new Date(selectedUser.dateOfBirth).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                  <User size={20} className="text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 font-medium mb-1">Gender</p>
                    <p className="text-sm text-gray-800">{selectedUser.gender}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl md:col-span-2">
                  <MapPin size={20} className="text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 font-medium mb-1">Address</p>
                    <p className="text-sm text-gray-800">
                      {selectedUser.address}, {selectedUser.city}, {selectedUser.state}{" "}
                      {selectedUser.zipCode}, {selectedUser.country}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                  <Users size={20} className="text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 font-medium mb-1">User Type</p>
                    <p
                      className={`text-sm font-semibold ${
                        selectedUser.type === "Donor" ? "text-red-600" : "text-blue-600"
                      }`}
                    >
                      {selectedUser.type}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                  <Clock size={20} className="text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 font-medium mb-1">Joined</p>
                    <p className="text-sm text-gray-800">
                      {new Date(selectedUser.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                {selectedUser.medicalConditions && (
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl md:col-span-2">
                    <Activity size={20} className="text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-1">Medical Conditions</p>
                      <p className="text-sm text-gray-800">{selectedUser.medicalConditions}</p>
                    </div>
                  </div>
                )}

                {selectedUser.notes && (
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl md:col-span-2">
                    <FileText size={20} className="text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-1">Notes</p>
                      <p className="text-sm text-gray-800">{selectedUser.notes}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Edit User Modal - Simplified */}
        {editModalOpen && selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-2xl relative my-8">
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors"
                onClick={() => {
                  setEditModalOpen(false);
                  setSelectedUser(null);
                  setErrors({});
                  setNewUser({
                    name: "",
                    email: "",
                    phone: "",
                    dateOfBirth: "",
                    gender: "",
                    address: "",
                    city: "",
                    state: "",
                    zipCode: "",
                    country: "Nepal",
                    bloodType: "",
                    type: "Donor",
                    role: "general",
                    status: "active",
                    medicalConditions: "",
                    notes: "",
                  });
                }}
              >
                <X size={20} />
              </button>
              <h3 className="text-xl font-bold mb-6 text-gray-800">Edit User</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={newUser.name}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="text"
                      value={newUser.phone}
                      onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Blood Type
                    </label>
                    <select
                      value={newUser.bloodType}
                      onChange={(e) => setNewUser({ ...newUser, bloodType: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all"
                    >
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select
                      value={newUser.type}
                      onChange={(e) => setNewUser({ ...newUser, type: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all"
                    >
                      <option value="Donor">Donor</option>
                      <option value="Recipient">Recipient</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <select
                      value={newUser.role}
                      onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all"
                    >
                      <option value="general">General User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={newUser.status}
                      onChange={(e) => setNewUser({ ...newUser, status: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all"
                    >
                      <option value="active">Active</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleUpdateUser}
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-red-500 via-rose-600 to-pink-600 text-white font-semibold hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                      Updating...
                    </>
                  ) : (
                    "Update User"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LogOut,
  User,
  Home,
  FileText,
  Users,
  Activity,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Calendar,
  BarChart3,
  Settings,
  Bell,
  Search,
  ChevronDown,
  ChevronRight,
  Droplet,
  Heart,
  MapPin,
  Phone,
  Mail,
  UserCheck,
  UserPlus,
  Filter,
  Download,
  MoreVertical,
} from "lucide-react";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("admin_user");
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    navigate("/login");
  };

  const menuItems = [
    {
      id: "overview",
      label: "Overview",
      icon: Home,
      section: "main",
    },
    {
      id: "users",
      label: "User Management",
      icon: Users,
      section: "main",
      submenu: [
        { id: "all-users", label: "All Users" },
        { id: "donors", label: "Donors" },
        { id: "recipients", label: "Recipients" },
      ],
    },
    {
      id: "donations",
      label: "Donations",
      icon: Droplet,
      section: "main",
      submenu: [
        { id: "active-donations", label: "Active" },
        { id: "pending-donations", label: "Pending" },
        { id: "completed-donations", label: "Completed" },
      ],
    },
    {
      id: "requests",
      label: "Blood Requests",
      icon: Heart,
      section: "main",
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart3,
      section: "main",
    },
    {
      id: "reports",
      label: "Reports",
      icon: FileText,
      section: "secondary",
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      section: "secondary",
    },
  ];

  const stats = [
    {
      label: "Total Users",
      value: "1,284",
      change: "+12.5%",
      trend: "up",
      icon: Users,
      color: "blue",
    },
    {
      label: "Active Donors",
      value: "856",
      change: "+8.2%",
      trend: "up",
      icon: UserCheck,
      color: "green",
    },
    {
      label: "Pending Requests",
      value: "23",
      change: "-5.3%",
      trend: "down",
      icon: Clock,
      color: "orange",
    },
    {
      label: "Donations This Month",
      value: "147",
      change: "+18.7%",
      trend: "up",
      icon: Droplet,
      color: "red",
    },
  ];

  const recentActivities = [
    {
      type: "donation",
      user: "John Doe",
      action: "donated O+ blood",
      time: "5 minutes ago",
      status: "completed",
    },
    {
      type: "request",
      user: "Jane Smith",
      action: "requested AB- blood",
      time: "12 minutes ago",
      status: "pending",
    },
    {
      type: "user",
      user: "Mike Johnson",
      action: "registered as donor",
      time: "1 hour ago",
      status: "active",
    },
    {
      type: "donation",
      user: "Sarah Williams",
      action: "donated A+ blood",
      time: "2 hours ago",
      status: "completed",
    },
  ];

  const bloodInventory = [
    { type: "A+", units: 45, status: "good", percentage: 75 },
    { type: "A-", units: 12, status: "low", percentage: 40 },
    { type: "B+", units: 38, status: "good", percentage: 70 },
    { type: "B-", units: 8, status: "critical", percentage: 25 },
    { type: "O+", units: 52, status: "good", percentage: 85 },
    { type: "O-", units: 15, status: "low", percentage: 45 },
    { type: "AB+", units: 22, status: "moderate", percentage: 60 },
    { type: "AB-", units: 6, status: "critical", percentage: 20 },
  ];

  const upcomingEvents = [
    {
      title: "Blood Donation Camp",
      location: "City Hospital",
      date: "Feb 5, 2026",
      donors: 45,
    },
    {
      title: "Health Awareness Drive",
      location: "Community Center",
      date: "Feb 8, 2026",
      donors: 32,
    },
    {
      title: "Emergency Blood Drive",
      location: "Medical College",
      date: "Feb 10, 2026",
      donors: 67,
    },
  ];

  return (
    <>
      

      {/* ================= MAIN CONTENT ================= */}
      <div className="flex-1 flex flex-col overflow-hidden">
        

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 p-8 overflow-y-auto">
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
                        : stat.color === "green"
                        ? "from-green-500 to-green-600"
                        : stat.color === "orange"
                        ? "from-orange-500 to-orange-600"
                        : "from-red-500 to-red-600"
                    } shadow-lg`}
                  >
                    <stat.icon className="text-white" size={24} />
                  </div>
                  <span
                    className={`text-sm font-semibold px-2 py-1 rounded-lg ${
                      stat.trend === "up"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-gray-600 text-sm font-medium mb-1">
                  {stat.label}
                </h3>
                <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
            {/* Blood Inventory - Takes 2 columns */}
            <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-800">
                  Blood Inventory Status
                </h3>
                <button className="text-sm text-red-600 font-medium hover:underline">
                  View All
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {bloodInventory.map((blood, index) => (
                  <div
                    key={index}
                    className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl font-bold text-gray-800">
                        {blood.type}
                      </span>
                      <span
                        className={`w-3 h-3 rounded-full ${
                          blood.status === "good"
                            ? "bg-green-500"
                            : blood.status === "moderate"
                            ? "bg-blue-500"
                            : blood.status === "low"
                            ? "bg-orange-500"
                            : "bg-red-500"
                        }`}
                      ></span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {blood.units} units
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          blood.status === "good"
                            ? "bg-green-500"
                            : blood.status === "moderate"
                            ? "bg-blue-500"
                            : blood.status === "low"
                            ? "bg-orange-500"
                            : "bg-red-500"
                        }`}
                        style={{ width: `${blood.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-800">
                  Upcoming Events
                </h3>
                <Calendar size={20} className="text-gray-400" />
              </div>
              <div className="space-y-4">
                {upcomingEvents.map((event, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gradient-to-br from-red-50 to-pink-50 rounded-xl border border-red-100"
                  >
                    <h4 className="font-semibold text-gray-800 mb-2">
                      {event.title}
                    </h4>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                      <MapPin size={14} />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{event.date}</span>
                      <span className="font-semibold text-red-600">
                        {event.donors} donors
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity & Users Table */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-800">
                  Recent Activity
                </h3>
                <Activity size={20} className="text-gray-400" />
              </div>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        activity.type === "donation"
                          ? "bg-red-100"
                          : activity.type === "request"
                          ? "bg-blue-100"
                          : "bg-green-100"
                      }`}
                    >
                      {activity.type === "donation" ? (
                        <Droplet
                          size={18}
                          className={
                            activity.type === "donation"
                              ? "text-red-600"
                              : "text-gray-600"
                          }
                        />
                      ) : activity.type === "request" ? (
                        <Heart size={18} className="text-blue-600" />
                      ) : (
                        <UserPlus size={18} className="text-green-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">
                        <span className="font-semibold">{activity.user}</span>{" "}
                        {activity.action}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {activity.time}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-lg ${
                        activity.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : activity.status === "pending"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {activity.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Users Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-800">
                  Recent Users
                </h3>
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <Filter size={18} className="text-gray-600" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <Download size={18} className="text-gray-600" />
                  </button>
                </div>
              </div>
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
                        Type
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            JD
                          </div>
                          <span className="font-medium text-gray-800">
                            John Doe
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm text-gray-600">
                          <div className="flex items-center gap-2 mb-1">
                            <Mail size={14} />
                            <span>john@example.com</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone size={14} />
                            <span>9812345678</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm font-medium text-red-600">
                          Donor
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg bg-green-100 text-green-700">
                          <CheckCircle size={12} /> Active
                        </span>
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            JS
                          </div>
                          <span className="font-medium text-gray-800">
                            Jane Smith
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm text-gray-600">
                          <div className="flex items-center gap-2 mb-1">
                            <Mail size={14} />
                            <span>jane@example.com</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone size={14} />
                            <span>9812345679</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm font-medium text-blue-600">
                          Recipient
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg bg-green-100 text-green-700">
                          <CheckCircle size={12} /> Active
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
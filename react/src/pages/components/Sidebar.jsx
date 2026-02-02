import React, { useState, useEffect, useContext } from "react";
import { ChevronRight, X, Droplet, Home, Users, Heart, BarChart3, FileText, Settings, LogOut } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { LayoutContext } from "../../context/LayoutContext";


export default function Sidebar({ darkMode, user }) {
  const { activeSection, setActiveSection } = useContext(LayoutContext);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState(null);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setMounted(true);

    // Detect current route on refresh
    const pathParts = location.pathname.split("/").filter(Boolean);
    if (pathParts.length === 1) {
      setActiveSection(pathParts[0]); // main menu only
      setExpandedMenu(null);
    } else if (pathParts.length >= 2) {
      setActiveSection(pathParts[1]); // submenu id
      setExpandedMenu(pathParts[0]);   // expand main menu
    }
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    navigate("/login");
  };

  const menuItems = [
    { id: "overview", label: "Overview", icon: Home, path: "/dashboard" },
    {
      id: "users",
      label: "User Management",
      icon: Users,
      path: "/users",
      submenu: [
        { id: "all-users", label: "All Users", path: "/users" },
        { id: "donors", label: "Donors", path: "/users/donors" },
        { id: "recipients", label: "Recipients", path: "/users/recipients" }
      ]
    },
    {
      id: "donations",
      label: "Donations",
      icon: Droplet,
      path: "/donations",
      submenu: [
        { id: "active-donations", label: "Active", path: "/donations/active" },
        { id: "pending-donations", label: "Pending", path: "/donations/pending" },
        { id: "completed-donations", label: "Completed", path: "/donations/completed" }
      ]
    },
    { id: "requests", label: "Blood Requests", icon: Heart, path: "/requests" },
    { id: "analytics", label: "Analytics", icon: BarChart3, path: "/analytics" },
    { id: "reports", label: "Reports", icon: FileText, path: "/reports" },
    { id: "settings", label: "Settings", icon: Settings, path: "/settings" },
  ];

  const handleMenuClick = (item) => {
    setActiveSection(item.id);
    setExpandedMenu(expandedMenu === item.id ? null : item.id);

    if (!item.submenu || item.submenu.length === 0) {
      navigate(item.path);
    }
  };

  const textPrimaryClass = darkMode ? "text-white" : "text-gray-900";
  const textSecondaryClass = darkMode ? "text-slate-400" : "text-gray-600";
  const cardBgClass = darkMode
    ? "bg-slate-800/30 backdrop-blur-xl border-white/10"
    : "bg-white/80 backdrop-blur-xl border-gray-200/50 shadow-lg shadow-gray-200/50";
  const sidebarBgClass = darkMode
    ? "bg-slate-900/50 backdrop-blur-xl border-white/10"
    : "bg-white/90 backdrop-blur-xl border-gray-200/50 shadow-2xl shadow-gray-300/30";
  const hoverBgClass = darkMode ? "hover:bg-white/5" : "hover:bg-gray-100/50";
  const activeBgClass = darkMode
    ? "bg-gradient-to-r from-red-500/20 via-rose-500/20 to-pink-500/20 border-red-500/30"
    : "bg-gradient-to-r from-red-50 via-rose-50 to-pink-50 border-red-300/50";

  return (
    <aside
      className={`${sidebarCollapsed ? "w-20" : "w-80"} ${sidebarBgClass} flex flex-col transition-all duration-500 border-r relative z-10`}
      style={{
        transform: mounted ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {/* Sidebar Glow */}
      <div className={`absolute inset-0 ${darkMode ? 'bg-gradient-to-r from-red-500/5' : 'bg-gradient-to-r from-red-400/10'} to-transparent pointer-events-none`}></div>

      {/* Logo */}
      <div className={`p-8 flex items-center gap-4 border-b ${darkMode ? 'border-white/10' : 'border-gray-200/50'} relative`}>
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-rose-600 rounded-2xl blur-lg opacity-50 animate-pulse"></div>
          <div className="relative w-12 h-12 bg-gradient-to-br from-red-500 via-rose-600 to-red-700 rounded-2xl flex items-center justify-center shadow-2xl transform hover:scale-110 hover:rotate-12 transition-all duration-300">
            <Droplet className="text-white" size={24} />
          </div>
        </div>
        {!sidebarCollapsed && (
          <div className="transform transition-all duration-500" style={{ opacity: mounted ? 1 : 0 }}>
            <span className="text-2xl font-bold bg-gradient-to-r from-red-500 via-rose-500 to-pink-500 bg-clip-text text-transparent" style={{ fontFamily: "'Poppins', sans-serif" }}>
              DripBlood
            </span>
            <p className={`text-xs ${textSecondaryClass} mt-1`} style={{ fontFamily: "'Inter', sans-serif" }}>
              Administrator Portal
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
        {menuItems.map((item, index) => {
          const isActiveMain = activeSection === item.id || (item.submenu?.some(sub => sub.id === activeSection));
          return (
            <div
              key={item.id}
              style={{
                transform: mounted ? 'translateX(0)' : 'translateX(-50px)',
                opacity: mounted ? 1 : 0,
                transition: `all 0.5s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s`,
              }}
            >
              <button
                onClick={() => handleMenuClick(item)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl font-medium transition-all duration-300 relative group ${isActiveMain
                  ? `${activeBgClass} ${textPrimaryClass} shadow-lg ${darkMode ? 'shadow-red-500/20' : 'shadow-red-300/30'} border`
                  : `${textSecondaryClass} ${hoverBgClass}`
                }`}
              >
                {isActiveMain && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-red-500 via-rose-500 to-pink-500 rounded-r-full"></div>
                )}
                {item.icon && <item.icon size={20} className={isActiveMain ? "text-red-500" : ""} />}
                {!sidebarCollapsed && (
                  <>
                    <span className="flex-1 text-left" style={{ fontFamily: "'Inter', sans-serif" }}>
                      {item.label}
                    </span>
                    {item.submenu && (
                      <ChevronRight
                        size={16}
                        className={`transition-transform duration-300 ${expandedMenu === item.id ? "rotate-90" : ""}`}
                      />
                    )}
                  </>
                )}
              </button>

              {!sidebarCollapsed && item.submenu && expandedMenu === item.id && (
                <div className="ml-12 mt-2 space-y-1 overflow-hidden">
                  {item.submenu.map((sub, subIndex) => {
                    const isSubActive = activeSection === sub.id;
                    return (
                      <button
                        key={sub.id}
                        onClick={() => {
                          setActiveSection(sub.id);
                          navigate(sub.path);
                        }}
                        className={`
              w-full text-left p-3 text-sm ${textSecondaryClass} 
              hover:text-red-500 ${hoverBgClass} rounded-lg 
              transition-all duration-200 transform
              ${isSubActive ? "font-semibold text-red-500" : ""}
            `}
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          animation: `slideIn 0.3s ease-out ${subIndex * 0.05}s both`
                        }}
                      >
                        {sub.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* User Section */}
      {!sidebarCollapsed && (
        <div className={`p-6 border-t ${darkMode ? 'border-white/10' : 'border-gray-200/50'}`}>
          <div className={`${cardBgClass} p-5 rounded-2xl border`}>
            <div className="flex items-center gap-4 mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-full blur opacity-50"></div>
                <div className="relative w-12 h-12 bg-gradient-to-br from-red-500 via-rose-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  {user?.email?.[0]?.toUpperCase() || "A"}
                </div>
              </div>
              <div className="flex-1">
                <p className={`font-semibold ${textPrimaryClass} text-sm`} style={{ fontFamily: "'Inter', sans-serif" }}>
                  {user?.email?.split("@")[0] || "Admin"}
                </p>
                <p className={`text-xs ${textSecondaryClass}`} style={{ fontFamily: "'Inter', sans-serif" }}>
                  System Administrator
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-red-500 via-rose-600 to-pink-600 text-white font-semibold hover:shadow-2xl hover:shadow-red-500/50 transition-all duration-300 transform hover:scale-105"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              <div className="flex items-center gap-2 justify-center">
                <LogOut size={16} /> Sign Out
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Collapse Toggle */}
      <button
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        className={`absolute -right-4 top-1/2 transform -translate-y-1/2 w-8 h-8 ${cardBgClass} rounded-full flex items-center justify-center ${textPrimaryClass} hover:scale-110 transition-all duration-300 z-20 border`}
      >
        {sidebarCollapsed ? <ChevronRight size={16} /> : <X size={16} />}
      </button>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </aside>
  );
}

import React, { useState, useEffect, useContext } from "react";
import { Droplet, Home, Users, Heart, BarChart3, FileText, Settings, LogOut, Tent, Menu } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { LayoutContext } from "../../context/LayoutContext";


export default function Sidebar({ darkMode, user }) {
  const { activeSection, setActiveSection } = useContext(LayoutContext);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: "overview",       label: "Overview",         icon: Home,      path: "/dashboard" },
    { id: "users",          label: "All Users",         icon: Users,     path: "/users" },
    { id: "donors",         label: "Donors",            icon: Users,     path: "/users/donors" },
    { id: "recipients",     label: "Recipients",        icon: Users,     path: "/users/recipients" },
    { id: "donation-camps", label: "Donation Camps",    icon: Tent,      path: "/donation-camps" },
    { id: "pending",        label: "Pending Donations", icon: Droplet,   path: "/donations/pending" },
    { id: "completed",      label: "Completed",         icon: Droplet,   path: "/donations/completed" },
    { id: "requests",       label: "Blood Requests",    icon: Heart,     path: "/requests" },
    { id: "analytics",      label: "Analytics",         icon: BarChart3, path: "/analytics" },
    { id: "reports",        label: "Reports",           icon: FileText,  path: "/medical-reports" },
    { id: "settings",       label: "Settings",          icon: Settings,  path: "/settings" },
  ];

  useEffect(() => {
    setMounted(true);
    // Match current pathname to a menu item by comparing paths directly
    const matched = menuItems.find(item => item.path === location.pathname)
      ?? menuItems.find(item => location.pathname.startsWith(item.path + "/"));
    if (matched) setActiveSection(matched.id);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    navigate("/login");
  };

  const handleMenuClick = (item) => {
    setActiveSection(item.id);   // set immediately — no mismatch
    navigate(item.path);
  };

  const textPrimaryClass   = darkMode ? "text-white"     : "text-gray-900";
  const textSecondaryClass = darkMode ? "text-slate-400" : "text-gray-600";
  const cardBgClass = darkMode
    ? "bg-slate-800/30 backdrop-blur-xl border-white/10"
    : "bg-white/80 backdrop-blur-xl border-gray-200/50 shadow-lg shadow-gray-200/50";
  const sidebarBgClass = darkMode
    ? "bg-slate-900/50 backdrop-blur-xl border-white/10"
    : "bg-white/90 backdrop-blur-xl border-gray-200/50 shadow-2xl shadow-gray-300/30";
  const hoverBgClass  = darkMode ? "hover:bg-white/5"  : "hover:bg-gray-100/50";
  const activeBgClass = darkMode
    ? "bg-gradient-to-r from-red-500/20 via-rose-500/20 to-pink-500/20 border-red-500/30"
    : "bg-gradient-to-r from-red-50 via-rose-50 to-pink-50 border-red-300/50";

  const navBtnStyle = (isActive) => ({
    height:         "52px",
    display:        "flex",
    alignItems:     "center",
    justifyContent: sidebarCollapsed ? "center" : "flex-start",
    paddingLeft:    sidebarCollapsed ? "0" : "16px",
    paddingRight:   sidebarCollapsed ? "0" : "16px",
    gap:            sidebarCollapsed ? "0" : "16px",
  });

  return (
    <>
      <style>{`
        .sidebar-nav::-webkit-scrollbar { display: none; }
        .sidebar-nav { scrollbar-width: none; -ms-overflow-style: none; }
      `}</style>

      <aside
        className={`${sidebarBgClass} flex flex-col border-r relative z-10`}
        style={{
          width:      sidebarCollapsed ? "80px" : "320px",
          minWidth:   sidebarCollapsed ? "80px" : "320px",
          overflow:   "hidden",
          transform:  mounted ? "translateX(0)" : "translateX(-100%)",
          transition: "width 0.5s cubic-bezier(0.4,0,0.2,1), min-width 0.5s cubic-bezier(0.4,0,0.2,1), transform 0.7s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        {/* Sidebar Glow */}
        <div className={`absolute inset-0 ${darkMode ? "bg-gradient-to-r from-red-500/5" : "bg-gradient-to-r from-red-400/10"} to-transparent pointer-events-none`} />

        {/* ── Logo header ── */}
        <div className={`p-8 flex items-center gap-4 border-b ${darkMode ? "border-white/10" : "border-gray-200/50"} relative flex-shrink-0`}>
          <div className="relative flex-shrink-0">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-rose-600 rounded-2xl blur-lg opacity-50 animate-pulse" />
            <div className="relative w-12 h-12 bg-gradient-to-br from-red-500 via-rose-600 to-red-700 rounded-2xl flex items-center justify-center shadow-2xl transform hover:scale-110 hover:rotate-12 transition-all duration-300">
              <Droplet className="text-white" size={24} />
            </div>
          </div>

          {/* Brand text — slides away when collapsed */}
          <div
            style={{
              overflow:   "hidden",
              maxWidth:   sidebarCollapsed ? "0px" : "200px",
              opacity:    sidebarCollapsed ? 0 : 1,
              transition: "max-width 0.5s cubic-bezier(0.4,0,0.2,1), opacity 0.25s ease",
              whiteSpace: "nowrap",
            }}
          >
            <span
              className="text-2xl font-bold bg-gradient-to-r from-red-500 via-rose-500 to-pink-500 bg-clip-text text-transparent"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              DripBlood
            </span>
            <p className={`text-xs ${textSecondaryClass} mt-1`} style={{ fontFamily: "'Inter', sans-serif" }}>
              Administrator Portal
            </p>
          </div>
        </div>

        {/* ── Navigation (scrollable, no scrollbar) ── */}
        <nav
          className="sidebar-nav flex-1 overflow-y-auto"
          style={{ padding: sidebarCollapsed ? "16px 12px" : "24px" }}
        >
          <div className="space-y-2">
            {menuItems.map((item, index) => {
              const isActive = activeSection === item.id;
              return (
                <div
                  key={item.id}
                  style={{
                    transform:  mounted ? "translateX(0)" : "translateX(-50px)",
                    opacity:    mounted ? 1 : 0,
                    transition: `all 0.5s cubic-bezier(0.4,0,0.2,1) ${index * 0.05}s`,
                  }}
                >
                  <button
                    onClick={() => handleMenuClick(item)}
                    title={sidebarCollapsed ? item.label : undefined}
                    className={`
                      w-full rounded-xl font-medium transition-all duration-300 relative
                      ${isActive
                        ? `${activeBgClass} ${textPrimaryClass} shadow-lg ${darkMode ? "shadow-red-500/20" : "shadow-red-300/30"} border`
                        : `${textSecondaryClass} ${hoverBgClass} border border-transparent`
                      }
                    `}
                    style={navBtnStyle(isActive)}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 h-7 w-1 bg-gradient-to-b from-red-500 via-rose-500 to-pink-500 rounded-r-full" />
                    )}
                    <item.icon
                      size={22}
                      className={`flex-shrink-0 ${isActive ? "text-red-500" : ""}`}
                    />
                    {!sidebarCollapsed && (
                      <span className="flex-1 text-left" style={{ fontFamily: "'Inter', sans-serif", fontSize: "15px" }}>
                        {item.label}
                      </span>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </nav>

        {/* ── Collapse toggle — sticky above user section ── */}
        <div
          className={`flex-shrink-0 border-t ${darkMode ? "border-white/10" : "border-gray-200/50"}`}
          style={{ padding: sidebarCollapsed ? "10px 12px" : "10px 24px" }}
        >
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={`
              w-full rounded-xl transition-all duration-300
              ${textSecondaryClass} ${hoverBgClass} hover:text-red-500
              border border-transparent
            `}
            style={{
              height:         "44px",
              display:        "flex",
              alignItems:     "center",
              justifyContent: sidebarCollapsed ? "center" : "flex-start",
              paddingLeft:    sidebarCollapsed ? "0" : "16px",
              paddingRight:   sidebarCollapsed ? "0" : "16px",
              gap:            sidebarCollapsed ? "0" : "14px",
            }}
          >
            <Menu size={22} className="flex-shrink-0" />
            {!sidebarCollapsed && (
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "15px" }}>
                Collapse
              </span>
            )}
          </button>
        </div>

        {/* ── User Section ── */}
        <div
          className={`border-t ${darkMode ? "border-white/10" : "border-gray-200/50"} flex-shrink-0`}
          style={{ padding: sidebarCollapsed ? "16px 12px" : "24px" }}
        >
          {sidebarCollapsed ? (
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-full blur opacity-50" />
                <div
                  className="relative w-11 h-11 bg-gradient-to-br from-red-500 via-rose-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg"
                  style={{ fontFamily: "'Poppins', sans-serif", fontSize: "16px" }}
                >
                  {user?.email?.[0]?.toUpperCase() || "A"}
                </div>
              </div>
              <button
                onClick={handleLogout}
                title="Sign Out"
                className="w-11 h-11 flex items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-pink-600 text-white hover:shadow-lg hover:shadow-red-500/40 transition-all duration-300 hover:scale-105"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div className={`${cardBgClass} p-5 rounded-2xl border`}>
              <div className="flex items-center gap-4 mb-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-full blur opacity-50" />
                  <div
                    className="relative w-12 h-12 bg-gradient-to-br from-red-500 via-rose-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
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
          )}
        </div>
      </aside>
    </>
  );
}
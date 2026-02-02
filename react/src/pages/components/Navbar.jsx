import React, { useState, useEffect } from "react";
import { Search, Sun, Moon, Bell } from "lucide-react";

export default function Navbar({ darkMode, toggleTheme, user, activeSection, menuItems }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const textPrimaryClass = darkMode ? "text-white" : "text-gray-900";
  const textSecondaryClass = darkMode ? "text-slate-400" : "text-gray-600";
  const inputBgClass = darkMode 
    ? "bg-slate-800/50 border-white/10 text-white placeholder-slate-500" 
    : "bg-gray-100/50 border-gray-300/50 text-gray-900 placeholder-gray-400";
  const cardBgClass = darkMode 
    ? "bg-slate-800/30 backdrop-blur-xl border-white/10" 
    : "bg-white/80 backdrop-blur-xl border-gray-200/50 shadow-lg shadow-gray-200/50";
  const hoverBgClass = darkMode ? "hover:bg-slate-700/50" : "hover:bg-gray-100/50";

  // Determine main menu & submenu
  let mainLabel = null;
  let subLabel = null;
  const currentMenu = menuItems?.find(item => 
    item.id === activeSection || 
    (item.submenu && item.submenu.some(sub => sub.id === activeSection))
  );

  if (currentMenu) {
    mainLabel = currentMenu.label;
    if (currentMenu.submenu) {
      const sub = currentMenu.submenu.find(sub => sub.id === activeSection);
      if (sub) subLabel = sub.label;
    }
  }

  return (
    <header
      className={`h-24 ${darkMode ? 'bg-slate-900/30' : 'bg-white/50'} backdrop-blur-xl border-b ${darkMode ? 'border-white/10' : 'border-gray-200/50'} flex items-center justify-between px-10 ${darkMode ? 'shadow-2xl' : 'shadow-xl shadow-gray-200/50'}`}
      style={{
        transform: mounted ? 'translateY(0)' : 'translateY(-100%)',
        opacity: mounted ? 1 : 0,
        transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1) 0.2s',
      }}
    >
      <div>
        {/* Heading / Breadcrumb logic */}
        {activeSection === "overview" ? (
          <>
            <h1 className={`text-3xl font-bold ${textPrimaryClass} mb-1`} style={{ fontFamily: "'Poppins', sans-serif" }}>
              Overview
            </h1>
            <p className={`text-sm ${textSecondaryClass}`} style={{ fontFamily: "'Inter', sans-serif" }}>
              Welcome back, <span className="text-red-500 font-semibold">{user?.email?.split("@")[0] || "Admin"}</span>
            </p>
          </>
        ) : (
          <>
            {subLabel ? (
              <>
                {/* Submenu emphasized on top */}
                <h1 className={`text-3xl font-bold ${textPrimaryClass} mb-1`} style={{ fontFamily: "'Poppins', sans-serif" }}>
                  {subLabel}
                </h1>
                {/* Main menu below */}
                <p className={`text-sm ${textSecondaryClass}`} style={{ fontFamily: "'Inter', sans-serif" }}>
                  {mainLabel}
                </p>
              </>
            ) : (
              // Only main menu, bold as usual
              <h1 className={`text-3xl font-bold ${textPrimaryClass} mb-1`} style={{ fontFamily: "'Poppins', sans-serif" }}>
                {mainLabel}
              </h1>
            )}
          </>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden md:block group">
          <Search
            className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${textSecondaryClass} group-focus-within:text-red-500 transition-colors`}
            size={18}
          />
          <input
            type="text"
            placeholder="Search anything..."
            className={`pl-12 pr-4 py-3 w-80 ${inputBgClass} backdrop-blur-lg border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all duration-300`}
            style={{ fontFamily: "'Inter', sans-serif" }}
          />
        </div>

        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className={`relative p-3 rounded-xl ${cardBgClass} border ${hoverBgClass} transition-all duration-300 group overflow-hidden`}
        >
          <div className="relative z-10">
            {darkMode ? (
              <Sun size={20} className={`${textSecondaryClass} group-hover:text-yellow-400 transition-colors`} />
            ) : (
              <Moon size={20} className={`${textSecondaryClass} group-hover:text-indigo-500 transition-colors`} />
            )}
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/0 to-yellow-400/10 transform scale-0 group-hover:scale-100 transition-transform duration-300"></div>
        </button>

        {/* Notifications */}
        <button className={`relative p-3 rounded-xl ${cardBgClass} border ${hoverBgClass} transition-all duration-300 group`}>
          <Bell size={20} className={`${textSecondaryClass} group-hover:text-red-500 transition-colors`} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-pulse"></span>
        </button>

        {/* User Avatar */}
        <div className="relative">
          <div className="w-11 h-11 bg-gradient-to-br from-red-500 via-rose-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg cursor-pointer hover:scale-110 transition-transform duration-300 ring-4 ring-red-500/20" style={{ fontFamily: "'Poppins', sans-serif" }}>
            {user?.email?.[0]?.toUpperCase() || "A"}
          </div>
        </div>
      </div>
    </header>
  );
}

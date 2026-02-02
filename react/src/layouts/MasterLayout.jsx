import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../pages/components/Sidebar.jsx";
import Navbar from "../pages/components/Navbar.jsx";
import { LayoutContext } from "../context/LayoutContext.jsx";

export default function MasterLayout() {
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  const [activeSection, setActiveSection] = useState("overview");
  const [expandedMenu, setExpandedMenu] = useState(null);

  const location = useLocation();

  /* --------------------------------------------------
     Sync activeSection & expandedMenu from URL or localStorage
  -------------------------------------------------- */
  useEffect(() => {
    const savedExpanded = localStorage.getItem("expandedMenu");
    if (savedExpanded) setExpandedMenu(savedExpanded);

    const path = location.pathname.replace("/", "");
    if (!path) {
      setActiveSection("overview");
      setExpandedMenu("overview");
      return;
    }
    const parts = path.split("/");

    if (parts.length === 1) {
      setActiveSection(parts[0]);
      setExpandedMenu(parts[0]);
    } else if (parts.length > 1) {
      setActiveSection(parts[1]);
      setExpandedMenu(parts[0]); // main menu stays expanded
    }
  }, [location.pathname]);

  /* Load user & theme */
  useEffect(() => {
    const userData = localStorage.getItem("admin_user");
    setUser(userData ? JSON.parse(userData) : { email: "admin@dripblood.com" });

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) setDarkMode(savedTheme === "dark");
  }, []);

  const toggleTheme = () => {
    setDarkMode(prev => {
      const next = !prev;
      localStorage.setItem("theme", next ? "dark" : "light");
      return next;
    });
  };

  const bgClass = darkMode
    ? "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"
    : "bg-gradient-to-br from-gray-50 via-white to-gray-100";

  // Menu items for both Navbar & Sidebar
  const menuItems = [
    { id: "overview", label: "Overview" },
    { 
      id: "users", 
      label: "User Management", 
      submenu: [
        { id: "all-users", label: "All Users" }, 
        { id: "donors", label: "Donors" },
        { id: "recipients", label: "Recipients" }
      ]
    },
    { id: "donations", label: "Donations" },
    { id: "requests", label: "Blood Requests" },
    { id: "analytics", label: "Analytics" },
    { id: "reports", label: "Reports" },
    { id: "settings", label: "Settings" },
  ];

  return (
    <LayoutContext.Provider value={{ activeSection, setActiveSection, expandedMenu, setExpandedMenu }}>
      <div className={`flex h-screen ${bgClass} overflow-hidden relative transition-colors duration-500`}>
        <Sidebar darkMode={darkMode} user={user} menuItems={menuItems} />
        <div className="flex-1 flex flex-col overflow-hidden relative z-10">
          <Navbar darkMode={darkMode} toggleTheme={toggleTheme} user={user} activeSection={activeSection} menuItems={menuItems} />
          <main className="flex-1 overflow-y-auto p-10">
            <Outlet />
          </main>
        </div>
      </div>
    </LayoutContext.Provider>
  );
}

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle, Clock, Users, UserCheck, UserPlus, Download,
  Mail, Phone, Activity, Eye, EyeOff, Edit, Trash2, Search, X,
  AlertCircle, ChevronLeft, ChevronRight, Shield, User,
  MapPin, Calendar, Droplet, FileText, ArrowRight, ArrowLeft,
  Check, Upload, Camera, Hash, RefreshCw, Filter, Lock,
} from "lucide-react";

// ─── API CONFIG ────────────────────────────────────────────────────────────────
const API_BASE = "http://127.0.0.1:8000/api";

// AUTH STRATEGY:
//   Token-based (Sanctum/Passport): token is read from localStorage.
//   Key checked in order: "auth_token" → "access_token" (covers both naming conventions).
//   If your app uses Sanctum cookie/SPA auth instead, remove the Authorization header
//   and replace it with credentials: "include" so cookies are sent automatically.
const getAuthToken = () =>
  localStorage.getItem("auth_token") || localStorage.getItem("access_token") || null;

const apiFetch = async (path, options = {}) => {
  const token = getAuthToken();
  const isFormData = options.body instanceof FormData;
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    // credentials: "include", // ← uncomment if using Sanctum SPA cookie auth
    headers: {
      // Do NOT set Content-Type for FormData — the browser must set it
      // automatically so it includes the correct multipart boundary.
      // Forcing "application/json" here is what caused the Laravel image
      // validation to always fail.
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  if (!res.ok) {
    let errMsg = `HTTP ${res.status}`;
    try {
      const err = await res.json();
      // Laravel validation errors come back as { errors: { field: [msg] } }
      // Flatten them into a single readable string for the toast.
      if (err.errors) {
        errMsg = Object.values(err.errors).flat().join(" | ");
      } else {
        errMsg = err.message || errMsg;
      }
    } catch {
      // Backend returned non-JSON (e.g. HTML error page) — use generic message
    }
    throw new Error(errMsg);
  }
  try {
    return await res.json();
  } catch {
    throw new Error("Invalid JSON response from server");
  }
};

// ─── BLANK FORM ────────────────────────────────────────────────────────────────
const BLANK = {
  name: "", email: "", phone: "",
  date_of_birth: "", gender: "",
  address: "", city: "", state: "", zip_code: "", country: "Nepal",
  blood_type: "",
  // FIX #6: Single source of truth — use 'role' only; 'type' is derived/display only
  role: "user",   // values: "user" | "admin"
  status: "active", medical_conditions: "", notes: "", profile_image: "",
  password: "", password_confirmation: "",
};

// ─── STATUS / ROLE BADGE HELPERS ───────────────────────────────────────────────
const statusBadge = (status) => {
  const map = {
    active:   "bg-green-100 text-green-700",
    inactive: "bg-orange-100 text-orange-700",
    blocked:  "bg-red-100 text-red-700",
  };
  return map[status] || "bg-gray-100 text-gray-600";
};

// FIX #6: Use role instead of type for badge styling
const roleBadge = (role) =>
  role === "admin"
    ? "bg-purple-100 text-purple-700"
    : "bg-blue-100 text-blue-700";

// ─── AVATAR ────────────────────────────────────────────────────────────────────
// FIX #5: Replace dynamic Tailwind class (`w-${size}`) with a static map
const avatarSizeMap = {
  9:  "w-9 h-9",
  10: "w-10 h-10",
  16: "w-16 h-16",
};

const Avatar = ({ user, size = 10 }) => {
  const sizeClass = avatarSizeMap[size] || "w-10 h-10";
  // FIX #6: Check role instead of type
  const isAdmin = user.role === "admin";

  return user.profile_image ? (
    <img
      src={user.profile_image}
      alt={user.name}
      className={`${sizeClass} rounded-full object-cover ring-2 ring-white shadow-sm`}
    />
  ) : (
    <div
      className={`${sizeClass} rounded-full flex items-center justify-center text-white font-semibold text-sm ring-2 ring-white shadow-sm
        ${isAdmin ? "bg-gradient-to-br from-purple-500 to-purple-700" : "bg-gradient-to-br from-red-500 to-rose-600"}`}
    >
      {user.name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
    </div>
  );
};

// ─── NORMALIZE META ────────────────────────────────────────────────────────────
// FIX #4: Safely normalize pagination meta so nulls never break UI
const normalizeMeta = (raw, fallbackPage) => ({
  total:        raw?.total        ?? 0,
  last_page:    raw?.last_page    ?? 1,
  current_page: raw?.current_page ?? fallbackPage,
});

// ═══════════════════════════════════════════════════════════════════════════════
export default function UserPage() {
  const navigate = useNavigate();

  // ── state ──────────────────────────────────────────────────────────────────
  const [users,       setUsers]       = useState([]);
  const [meta,        setMeta]        = useState({ total: 0, last_page: 1, current_page: 1 });
  const [loading,     setLoading]     = useState(false);
  const [search,      setSearch]      = useState("");
  // FIX #2 & #6: Filter key uses "role" consistently (all | admin | user)
  const [roleFilter,  setRoleFilter]  = useState("all");
  const [page,        setPage]        = useState(1);

  const [modalOpen,     setModalOpen]     = useState(false);
  const [viewModal,     setViewModal]     = useState(false);
  const [editModal,     setEditModal]     = useState(false);
  const [selectedUser,  setSelectedUser]  = useState(null);
  const [formStep,      setFormStep]      = useState(1);
  const [formData,      setFormData]      = useState(BLANK);
  const [imagePreview,  setImagePreview]  = useState(null);
  const [errors,        setErrors]        = useState({});
  const [submitting,    setSubmitting]    = useState(false);
  const [toast,         setToast]         = useState(null);
  // FIX #6: Dedicated error state so the UI can render an error banner
  // instead of silently showing an empty table after a failed fetch.
  const [fetchError,    setFetchError]    = useState(null);
  // Password visibility toggles (Add modal + Edit modal separate)
  const [showPassword,      setShowPassword]      = useState(false);
  const [showConfirm,       setShowConfirm]       = useState(false);
  const [showEditPassword,  setShowEditPassword]  = useState(false);

  // Debounce ref — prevents an API call on every search keystroke (FIX #7)
  const debounceRef = useRef(null);

  // ── imageFile ref ──────────────────────────────────────────────────────────
  // Holds the raw File object selected by the user.
  // Kept OUT of formData/state — File objects can't be JSON.stringify'd and
  // FormData.append() needs the real File, not a base64 string.
  const imageFileRef = useRef(null);

  // ── auth guard ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const u = localStorage.getItem("admin_user");
    if (!u) navigate("/login");
  }, [navigate]);

  // ── toast ──────────────────────────────────────────────────────────────────
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── fetch users ────────────────────────────────────────────────────────────
  // Stable fetchUsers — receives all params explicitly so useCallback dep array
  // stays empty and the function reference never changes between renders.
  const fetchUsers = useCallback(async (currentPage, currentSearch, currentRole) => {
    setLoading(true);
    setFetchError(null); // clear previous error on new attempt
    try {
      const params = new URLSearchParams({ page: currentPage, per_page: 10 });
      if (currentSearch) params.set("search", currentSearch);
      if (currentRole !== "all") params.set("role", currentRole);

      const data = await apiFetch(`/users?${params}`);

      // FIX #2: Laravel Resource API always wraps rows in { data: [] }.
      // Never assume the response is a bare array — always read data.data.
      // Fallback to [] keeps the UI safe if the shape is unexpected.
      const rows = Array.isArray(data) ? data : (data.data ?? []);
      const sorted = [...rows].sort((a, b) => b.id - a.id);
      setUsers(sorted);

      // FIX #3: Use backend meta directly — never synthesise pagination values.
      // normalizeMeta only fills genuine nulls/undefineds so the UI never crashes;
      // it does NOT invent pagination that the server didn't send.
      const rawMeta = Array.isArray(data)
        ? { total: sorted.length, last_page: 1, current_page: currentPage }
        : (data.meta ?? data.links ?? {}); // support both meta and links shapes
      setMeta(normalizeMeta(rawMeta, currentPage));

    } catch (e) {
      // FIX #6: Surface error in UI state AND stop the spinner so the user
      // isn't left staring at an infinite loading indicator.
      const msg = e.message || "Failed to load users";
      setFetchError(msg);
      showToast(msg, "error");
      // Keep whatever users were previously loaded rather than wiping the list
    } finally {
      setLoading(false);
    }
  }, []); // stable — no external deps

  // FIX #7: Single unified effect drives all fetching with debounce.
  // Search input is debounced (400 ms); page/role changes fire immediately.
  // FIX #5: setPage(1) runs synchronously before the debounced fetch so the
  // correct page number is always used — no stale-page race.
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const delay = search ? 400 : 0;
    debounceRef.current = setTimeout(() => {
      fetchUsers(page, search, roleFilter);
    }, delay);
    return () => clearTimeout(debounceRef.current);
  }, [page, search, roleFilter, fetchUsers]);

  // FIX #5: Reset to page 1 whenever search text or role filter changes.
  // This runs before the effect above so `page` is already 1 when fetchUsers fires.
  useEffect(() => { setPage(1); }, [search, roleFilter]);

  // ── stats (derived from loaded page) ──────────────────────────────────────
  // FIX #8: Stats computed from users array (actual data), not guessed from meta.
  //         meta.total is still used for "Total Users" since it reflects the full
  //         server count. Role/status breakdowns reflect the current page data;
  //         for full accuracy, implement a backend /stats endpoint.
  const stats = [
    { label: "Total Users",  value: meta.total,                                          color: "blue",   icon: Users },
    { label: "Admins",       value: users.filter(u => u.role === "admin").length,         color: "purple", icon: Shield },
    { label: "Active",       value: users.filter(u => u.status === "active").length,      color: "green",  icon: UserCheck },
    { label: "Blocked",      value: users.filter(u => u.status === "blocked").length,     color: "orange", icon: Clock },
  ];

  // ── image ──────────────────────────────────────────────────────────────────
  // ROOT CAUSE FIX: previously we stored reader.result (base64 string) into
  // formData.profile_image and then sent it via JSON.stringify. Laravel's
  // 'image' validation rule expects a real UploadedFile — a base64 string
  // always fails it. Solution: keep the raw File in imageFileRef and only use
  // the object-URL for the <img> preview. The File is appended to FormData at
  // submit time so Laravel receives a genuine multipart file upload.
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setErrors(p => ({ ...p, profile_image: "Invalid image file" }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors(p => ({ ...p, profile_image: "Max size is 5 MB" }));
      return;
    }
    imageFileRef.current = file;                          // store real File
    setImagePreview(URL.createObjectURL(file));           // preview only
    setErrors(p => ({ ...p, profile_image: undefined }));
  };

  // ── validation ─────────────────────────────────────────────────────────────
  const validate = (step) => {
    const e = {};
    if (step === 1) {
      if (!formData.name?.trim() || formData.name.trim().length < 2)  e.name  = "Name must be at least 2 characters";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))         e.email = "Valid email required";
      if (!/^[0-9]{7,}$/.test(formData.phone?.replace(/\s/g, "")))    e.phone = "Valid phone number required";
      if (!formData.date_of_birth)                                     e.date_of_birth = "Date of birth required";
      if (!formData.gender)                                            e.gender = "Gender required";
      if (!formData.password || formData.password.length < 8)         e.password = "Password must be at least 8 characters";
      if (formData.password !== formData.password_confirmation)        e.password_confirmation = "Passwords do not match";
    }
    if (step === 2) {
      if (!formData.address?.trim() || formData.address.trim().length < 5) e.address  = "Address must be at least 5 characters";
      if (!formData.city)    e.city    = "City required";
      if (!formData.state)   e.state   = "Province required";
      if (!formData.zip_code) e.zip_code = "ZIP code required";
    }
    if (step === 3) {
      if (!formData.blood_type) e.blood_type = "Blood type required";
    }
    return e;
  };

  const handleNext = () => {
    const e = validate(formStep);
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setFormStep(s => s + 1);
  };

  const handlePrev = () => { setErrors({}); setFormStep(s => s - 1); };

  // ── CRUD ───────────────────────────────────────────────────────────────────
  // CORE FIX: both store and update now send multipart/form-data so Laravel's
  // 'image' validation rule receives a real UploadedFile, not a JSON string.

  // Helper — builds a FormData from the current formData state + raw image file.
  // Fields with empty-string values are omitted so Laravel 'sometimes' rules work.
  const buildFormData = (overrides = {}) => {
    const fd = new FormData();
    const merged = { ...formData, ...overrides };
    const textFields = [
      "name","email","phone","date_of_birth","gender",
      "address","city","state","zip_code","country",
      "blood_type","role","status","medical_conditions","notes",
      "password","password_confirmation",
    ];
    textFields.forEach(key => {
      if (merged[key] !== "" && merged[key] != null) fd.append(key, merged[key]);
    });
    // Append the real File object only when the user has picked one this session.
    // imageFileRef.current is null when editing without changing the photo.
    if (imageFileRef.current instanceof File) {
      fd.append("profile_image", imageFileRef.current);
    }
    return fd;
  };

  const handleAddUser = async () => {
    const e = validate(3);
    if (Object.keys(e).length) { setErrors(e); return; }
    setSubmitting(true);
    try {
      await apiFetch("/users", { method: "POST", body: buildFormData() });
      showToast("User created successfully");
      resetForm();
      setModalOpen(false);
      fetchUsers(page, search, roleFilter);
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateUser = async () => {
    const e = validate(1);
    if (formData.password) {
      if (formData.password.length < 8)
        e.password = "Password must be at least 8 characters";
      if (formData.password !== formData.password_confirmation)
        e.password_confirmation = "Passwords do not match";
    }
    if (Object.keys(e).length) { setErrors(e); return; }
    setSubmitting(true);
    try {
      // Laravel does not parse multipart bodies on PUT/PATCH requests.
      // The standard workaround is to POST with a hidden _method=PUT field,
      // which Laravel's method spoofing middleware converts automatically.
      const fd = buildFormData({
        _method: "PUT",
        // Strip password fields when the admin left them blank
        ...(formData.password ? {} : { password: "", password_confirmation: "" }),
      });
      if (!formData.password) {
        fd.delete("password");
        fd.delete("password_confirmation");
      }
      await apiFetch(`/users/${selectedUser.id}`, { method: "POST", body: fd });
      showToast("User updated successfully");
      setEditModal(false);
      setSelectedUser(null);
      resetForm();
      fetchUsers(page, search, roleFilter);
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Permanently delete this user?")) return;
    try {
      await apiFetch(`/users/${id}`, { method: "DELETE" });
      showToast("User deleted");
      fetchUsers(page, search, roleFilter);
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const openEdit = (u) => {
    setSelectedUser(u);
    setFormData({ ...BLANK, ...u, role: u.role || u.type || "user",
      // Never put the server-returned image value (path/base64) back into
      // formData — it would be re-sent as a string and break validation.
      // The existing image is already shown via imagePreview below.
      profile_image: "",
      password: "", password_confirmation: "",
    });
    imageFileRef.current = null;            // no new file picked yet
    setImagePreview(u.profile_image || null);
    setErrors({});
    setEditModal(true);
  };

  const openView = (u) => { setSelectedUser(u); setViewModal(true); };

  const resetForm = () => {
    setFormData(BLANK);
    setImagePreview(null);
    setErrors({});
    setFormStep(1);
    setShowPassword(false);
    setShowConfirm(false);
    setShowEditPassword(false);
    imageFileRef.current = null;
  };

  // ── export ─────────────────────────────────────────────────────────────────
  const handleExport = () => {
    const rows = [
      ["ID","UID","Name","Email","Phone","DOB","Gender","Address","City","State","ZIP","Country","Blood","Role","Status","Created"],
      ...users.map(u => [
        u.id, u.uid, u.name, u.email, u.phone, u.date_of_birth, u.gender,
        u.address, u.city, u.state, u.zip_code, u.country,
        u.blood_type,
        u.role || u.type,  // FIX #6: export whichever is present
        u.status,
        new Date(u.created_at).toLocaleDateString(),
      ]),
    ].map(r => r.map(c => `"${String(c ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");

    const blob = new Blob([rows], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = `users_${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const timeAgo = (ts) => {
    if (!ts) return "—";
    const s = Math.floor((Date.now() - new Date(ts)) / 1000);
    if (s < 60) return "just now";
    if (s < 3600) return `${Math.floor(s / 60)}m ago`;
    if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
    return `${Math.floor(s / 86400)}d ago`;
  };

  const renderPages = () => {
    // FIX #4: meta values are guaranteed non-null via normalizeMeta
    const total = meta.last_page;
    const cur   = meta.current_page;
    const pages = [];
    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else if (cur <= 4) {
      pages.push(1, 2, 3, 4, 5, "…", total);
    } else if (cur >= total - 3) {
      pages.push(1, "…", total-4, total-3, total-2, total-1, total);
    } else {
      pages.push(1, "…", cur-1, cur, cur+1, "…", total);
    }
    return pages;
  };

  // ── derived role label (for display only) ─────────────────────────────────
  // FIX #6: helper so table/view always reads from 'role', falling back to legacy 'type'
  const userRole = (u) => u.role || u.type || "user";

  // ══════════════════════════════════════════════════════════════════════════
  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#F4F6FA] font-[system-ui]">

      {/* ── Toast ── */}
      {toast && (
        <div className={`fixed top-5 right-5 z-[200] flex items-center gap-3 px-5 py-3 rounded-xl shadow-xl text-sm font-medium transition-all
          ${toast.type === "error" ? "bg-red-600 text-white" : "bg-green-600 text-white"}`}>
          {toast.type === "error" ? <AlertCircle size={16}/> : <Check size={16}/>}
          {toast.msg}
        </div>
      )}

      <main className="flex-1 p-6 lg:p-8 space-y-6 max-w-screen-2xl mx-auto w-full">

        {/* ── Page Header ── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">User Management</h1>
            <p className="text-sm text-gray-500 mt-0.5">Manage platform users, roles, and permissions</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => { setFetchError(null); fetchUsers(page, search, roleFilter); }} className="p-2.5 rounded-xl border border-gray-200 bg-white text-gray-500 hover:text-gray-700 hover:border-gray-300 transition-all shadow-sm">
              <RefreshCw size={16} className={loading ? "animate-spin" : ""}/>
            </button>
            <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm font-semibold shadow-sm transition-all duration-300">
              <Download size={15}/> Export
            </button>
            <button onClick={() => { resetForm(); setModalOpen(true); }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-500 via-rose-600 to-pink-600 text-white text-sm font-semibold hover:shadow-2xl transition-all duration-300">
              <UserPlus size={15}/> Add User
            </button>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-start gap-4">
              <div className={`p-3 rounded-xl shadow-lg bg-gradient-to-br ${
                s.color === "blue"   ? "from-blue-500 to-blue-600"     :
                s.color === "purple" ? "from-purple-500 to-purple-600" :
                s.color === "green"  ? "from-green-500 to-green-600"   :
                                       "from-orange-500 to-orange-600"
              }`}>
                <s.icon className="text-white" size={24}/>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">{s.label}</p>
                <p className="text-3xl font-bold text-gray-800 mt-0.5">{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Table Card ── */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">

          {/* Table Toolbar */}
          <div className="px-6 py-4 border-b border-gray-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            {/* Role tabs — FIX #2: tabs now use "user" not "general" to match role field */}
            <div className="flex items-center gap-2 flex-wrap">
              {[
                { key: "all",   label: "All Users", count: meta.total },
                { key: "admin", label: "Admin",     count: users.filter(u => userRole(u) === "admin").length },
                { key: "user",  label: "General",   count: users.filter(u => userRole(u) !== "admin").length },
              ].map(tab => (
                <button key={tab.key} onClick={() => setRoleFilter(tab.key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all duration-300 text-sm ${
                    tab.key === "all" && roleFilter === tab.key
                      ? "bg-gradient-to-r from-red-500 via-rose-600 to-pink-600 text-white shadow-lg"
                      : tab.key === "admin" && roleFilter === tab.key
                      ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg"
                      : tab.key === "user" && roleFilter === tab.key
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}>
                  {tab.label}
                  <span className={`px-2 py-0.5 rounded-lg text-xs font-bold ${
                    roleFilter === tab.key ? "bg-white/20" : "bg-gray-200"
                  }`}>{tab.count}</span>
                </button>
              ))}
            </div>

            {/* Search — FIX #7: debounce is handled in useEffect; input is unthrottled */}
            <div className="relative w-full md:w-80">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
              <input
                type="text"
                placeholder="Search by UID, name, email, phone…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-9 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all placeholder-gray-400"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X size={14}/>
                </button>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  {["User", "UID", "Contact", "Location", "Blood", "Role", "Status", "Joined", "Actions"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr><td colSpan={9} className="py-16 text-center">
                    <RefreshCw size={24} className="animate-spin mx-auto text-gray-300 mb-2"/>
                    <p className="text-gray-400 text-sm">Loading users…</p>
                  </td></tr>
                ) : fetchError ? (
                  <tr><td colSpan={9} className="py-16 text-center">
                    <AlertCircle size={40} className="mx-auto text-red-300 mb-3"/>
                    <p className="text-red-500 font-medium">Failed to load users</p>
                    <p className="text-gray-400 text-sm mt-1">{fetchError}</p>
                    <button onClick={() => fetchUsers(page, search, roleFilter)}
                      className="mt-4 px-4 py-2 rounded-lg bg-red-50 text-red-600 text-sm font-medium hover:bg-red-100 transition-colors">
                      Retry
                    </button>
                  </td></tr>
                ) : users.length === 0 ? (
                  <tr><td colSpan={9} className="py-16 text-center">
                    <Users size={48} className="mx-auto text-gray-300 mb-3"/>
                    <p className="text-gray-500 font-medium">No users found</p>
                    <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filters</p>
                  </td></tr>
                ) : (
                  users.map(u => (
                    <tr key={u.id} className="hover:bg-gray-50 transition-colors group">
                      {/* User */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar user={u} size={9}/>
                          <div>
                            <p className="font-semibold text-slate-800 leading-tight">{u.name}</p>
                            <p className="text-xs text-slate-400 capitalize mt-0.5">{u.gender || "—"}</p>
                          </div>
                        </div>
                      </td>
                      {/* UID */}
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 text-xs font-mono text-slate-400 bg-slate-50 border border-slate-100 px-2 py-1 rounded-md">
                          <Hash size={10}/>{u.uid ? u.uid.split("-")[0] : u.id}
                        </span>
                      </td>
                      {/* Contact */}
                      <td className="px-4 py-3 text-slate-600 space-y-0.5">
                        <div className="flex items-center gap-1.5 text-xs"><Mail size={11} className="text-slate-300"/>{u.email}</div>
                        <div className="flex items-center gap-1.5 text-xs"><Phone size={11} className="text-slate-300"/>{u.phone || "—"}</div>
                      </td>
                      {/* Location */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <MapPin size={11} className="text-slate-300"/>
                          {[u.city, u.state].filter(Boolean).join(", ") || "—"}
                        </div>
                      </td>
                      {/* Blood */}
                      <td className="px-4 py-3">
                        {u.blood_type ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-red-50 text-red-600 border border-red-100 text-xs font-bold">
                            <Droplet size={10}/>{u.blood_type}
                          </span>
                        ) : <span className="text-slate-300 text-xs">—</span>}
                      </td>
                      {/* Role — FIX #6: unified role field display */}
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${roleBadge(userRole(u))}`}>
                          {userRole(u) === "admin" ? <Shield size={10}/> : <User size={10}/>}
                          <span className="capitalize">{userRole(u)}</span>
                        </span>
                      </td>
                      {/* Status */}
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${statusBadge(u.status)}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${u.status === "active" ? "bg-emerald-500" : u.status === "blocked" ? "bg-red-500" : "bg-amber-500"}`}/>
                          <span className="capitalize">{u.status}</span>
                        </span>
                      </td>
                      {/* Joined */}
                      <td className="px-4 py-3 text-xs text-slate-400">{timeAgo(u.created_at)}</td>
                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button onClick={() => openView(u)} className="p-2 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors" title="View">
                            <Eye size={15}/>
                          </button>
                          <button onClick={() => openEdit(u)} className="p-2 rounded-lg text-gray-500 hover:text-green-600 hover:bg-green-50 transition-colors" title="Edit">
                            <Edit size={15}/>
                          </button>
                          <button onClick={() => handleDeleteUser(u.id)} className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors" title="Delete">
                            <Trash2 size={15}/>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination — FIX #4: meta values are normalized, safe to render */}
          {meta.last_page > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between flex-wrap gap-3">
              <p className="text-sm text-gray-600">
                Page <span className="font-semibold text-gray-800">{meta.current_page}</span> of{" "}
                <span className="font-semibold text-gray-800">{meta.last_page}</span>
                {meta.total ? ` · ${meta.total} total users` : ""}
              </p>
              <div className="flex items-center gap-2">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={meta.current_page === 1}
                  className="p-2 rounded-lg bg-gray-100 text-gray-700 disabled:opacity-30 hover:bg-gray-200 transition-all">
                  <ChevronLeft size={16}/>
                </button>
                {renderPages().map((pg, i) =>
                  pg === "…" ? (
                    <span key={`e${i}`} className="px-3 py-2 text-gray-400">…</span>
                  ) : (
                    <button key={pg} onClick={() => setPage(pg)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        meta.current_page === pg
                          ? "bg-gradient-to-r from-red-500 via-rose-600 to-pink-600 text-white shadow-lg"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}>{pg}</button>
                  )
                )}
                <button onClick={() => setPage(p => Math.min(meta.last_page, p + 1))} disabled={meta.current_page === meta.last_page}
                  className="p-2 rounded-lg bg-gray-100 text-gray-700 disabled:opacity-30 hover:bg-gray-200 transition-all">
                  <ChevronRight size={16}/>
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ══════════════════════════════════════════════════════════════
          ADD USER MODAL — 3-step wizard
      ══════════════════════════════════════════════════════════════ */}
      {modalOpen && (
        <Modal onClose={() => { setModalOpen(false); resetForm(); }} title="Add New User" subtitle="Complete all steps to create a new user account">
          <Stepper step={formStep}/>

          {/* Step 1 */}
          {formStep === 1 && (
            <div className="space-y-4">
              <ImageUpload preview={imagePreview} onChange={handleImageChange} onRemove={() => { imageFileRef.current = null; setImagePreview(null); }} error={errors.profile_image}/>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Full Name" required error={errors.name}>
                  <input type="text" placeholder="Jane Doe" value={formData.name}
                    onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                    className={input(errors.name)}/>
                </Field>
                <Field label="Email Address" required error={errors.email}>
                  <input type="email" placeholder="jane@example.com" value={formData.email}
                    onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                    className={input(errors.email)}/>
                </Field>
                <Field label="Phone Number" required error={errors.phone}>
                  <input type="text" placeholder="9800000000" value={formData.phone}
                    onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                    className={input(errors.phone)}/>
                </Field>
                <Field label="Date of Birth" required error={errors.date_of_birth}>
                  <input type="date" value={formData.date_of_birth}
                    onChange={e => setFormData(p => ({ ...p, date_of_birth: e.target.value }))}
                    className={input(errors.date_of_birth)}/>
                </Field>
              </div>
              <Field label="Gender" required error={errors.gender}>
                <div className="flex gap-2">
                  {["male","female","other"].map(g => (
                    <button key={g} type="button" onClick={() => setFormData(p => ({ ...p, gender: g }))}
                      className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition-all duration-300 capitalize ${
                        formData.gender === g ? "bg-gradient-to-r from-red-500 via-rose-600 to-pink-600 text-white border-transparent shadow-lg" : "bg-gray-100 text-gray-700 border-transparent hover:bg-gray-200"
                      }`}>{g}</button>
                  ))}
                </div>
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Password" required error={errors.password}>
                  <div className="relative">
                    <Lock size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"/>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Min. 8 characters"
                      value={formData.password}
                      onChange={e => setFormData(p => ({ ...p, password: e.target.value }))}
                      className={`${input(errors.password)} pl-8 pr-9`}
                    />
                    <button type="button" onClick={() => setShowPassword(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                      {showPassword ? <EyeOff size={14}/> : <Eye size={14}/>}
                    </button>
                  </div>
                </Field>
                <Field label="Confirm Password" required error={errors.password_confirmation}>
                  <div className="relative">
                    <Lock size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"/>
                    <input
                      type={showConfirm ? "text" : "password"}
                      placeholder="Re-enter password"
                      value={formData.password_confirmation}
                      onChange={e => setFormData(p => ({ ...p, password_confirmation: e.target.value }))}
                      className={`${input(errors.password_confirmation)} pl-8 pr-9`}
                    />
                    <button type="button" onClick={() => setShowConfirm(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                      {showConfirm ? <EyeOff size={14}/> : <Eye size={14}/>}
                    </button>
                  </div>
                </Field>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {formStep === 2 && (
            <div className="space-y-4">
              <Field label="Street Address" required error={errors.address}>
                <input type="text" placeholder="Street name, Ward number" value={formData.address}
                  onChange={e => setFormData(p => ({ ...p, address: e.target.value }))}
                  className={input(errors.address)}/>
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="City" required error={errors.city}>
                  <input type="text" placeholder="Kathmandu" value={formData.city}
                    onChange={e => setFormData(p => ({ ...p, city: e.target.value }))}
                    className={input(errors.city)}/>
                </Field>
                <Field label="Province" required error={errors.state}>
                  <select value={formData.state} onChange={e => setFormData(p => ({ ...p, state: e.target.value }))} className={input(errors.state)}>
                    <option value="">Select Province</option>
                    {["Province 1","Madhesh","Bagmati","Gandaki","Lumbini","Karnali","Sudurpashchim"].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </Field>
                <Field label="ZIP Code" required error={errors.zip_code}>
                  <input type="text" placeholder="44600" value={formData.zip_code}
                    onChange={e => setFormData(p => ({ ...p, zip_code: e.target.value }))}
                    className={input(errors.zip_code)}/>
                </Field>
                <Field label="Country">
                  <input type="text" value={formData.country}
                    onChange={e => setFormData(p => ({ ...p, country: e.target.value }))}
                    className={input()}/>
                </Field>
              </div>
            </div>
          )}

          {/* Step 3 — FIX #6: "User Type" select now sets 'role', not 'type' */}
          {formStep === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Blood Type" required error={errors.blood_type}>
                  <select value={formData.blood_type} onChange={e => setFormData(p => ({ ...p, blood_type: e.target.value }))} className={input(errors.blood_type)}>
                    <option value="">Select</option>
                    {["A+","A-","B+","B-","O+","O-","AB+","AB-"].map(b => <option key={b}>{b}</option>)}
                  </select>
                </Field>
                <Field label="Role">
                  <select value={formData.role} onChange={e => setFormData(p => ({ ...p, role: e.target.value }))} className={input()}>
                    <option value="user">General User</option>
                    <option value="admin">Admin</option>
                  </select>
                </Field>
                <Field label="Status">
                  <select value={formData.status} onChange={e => setFormData(p => ({ ...p, status: e.target.value }))} className={input()}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="blocked">Blocked</option>
                  </select>
                </Field>
              </div>
              <Field label="Medical Conditions">
                <input type="text" placeholder="Hypertension, Diabetes…" value={formData.medical_conditions}
                  onChange={e => setFormData(p => ({ ...p, medical_conditions: e.target.value }))}
                  className={input()}/>
              </Field>
              <Field label="Notes">
                <textarea rows={3} placeholder="Additional notes…" value={formData.notes}
                  onChange={e => setFormData(p => ({ ...p, notes: e.target.value }))}
                  className={`${input()} resize-none`}/>
              </Field>
              {errors.submit && <ErrorBox msg={errors.submit}/>}
            </div>
          )}

          {/* Wizard Nav */}
          <div className="flex items-center justify-between mt-6 pt-5 border-t border-gray-200">
            {formStep > 1
              ? <button type="button" onClick={handlePrev} className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gray-100 text-gray-700 text-sm font-semibold hover:bg-gray-200 transition-all duration-300"><ArrowLeft size={15}/>Previous</button>
              : <div/>}
            {formStep < 3
              ? <button type="button" onClick={handleNext} className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-500 via-rose-600 to-pink-600 text-white text-sm font-semibold hover:shadow-2xl transition-all duration-300">Next<ArrowRight size={15}/></button>
              : <button type="button" onClick={handleAddUser} disabled={submitting} className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-semibold hover:shadow-2xl transition-all duration-300 disabled:opacity-50">
                  {submitting ? <><Spinner/> Saving…</> : <><Check size={15}/>Create User</>}
                </button>}
          </div>
        </Modal>
      )}

      {/* ══════════════════════════════════════════════════════════════
          VIEW USER MODAL
      ══════════════════════════════════════════════════════════════ */}
      {viewModal && selectedUser && (
        <Modal onClose={() => { setViewModal(false); setSelectedUser(null); }} title="User Details" wide>
          <div className="flex items-center gap-4 pb-5 mb-5 border-b border-slate-100">
            <Avatar user={selectedUser} size={16}/>
            <div>
              <h3 className="text-lg font-bold text-slate-800">{selectedUser.name}</h3>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${statusBadge(selectedUser.status)}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${selectedUser.status === "active" ? "bg-emerald-500" : selectedUser.status === "blocked" ? "bg-red-500" : "bg-amber-500"}`}/>
                  <span className="capitalize">{selectedUser.status}</span>
                </span>
                {/* FIX #6: use userRole() for badge */}
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${roleBadge(userRole(selectedUser))}`}>
                  {userRole(selectedUser) === "admin" ? <Shield size={10}/> : <User size={10}/>}
                  <span className="capitalize">{userRole(selectedUser)}</span>
                </span>
                {selectedUser.blood_type && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-bold bg-red-50 text-red-600 border border-red-100">
                    <Droplet size={10}/>{selectedUser.blood_type}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { icon: Hash,      label: "UID",            val: selectedUser.uid || "—" },
              { icon: Mail,      label: "Email",           val: selectedUser.email },
              { icon: Phone,     label: "Phone",           val: selectedUser.phone || "—" },
              { icon: Calendar,  label: "Date of Birth",   val: selectedUser.date_of_birth ? new Date(selectedUser.date_of_birth).toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"}) : "—" },
              { icon: User,      label: "Gender",          val: selectedUser.gender ? selectedUser.gender.charAt(0).toUpperCase()+selectedUser.gender.slice(1) : "—" },
              { icon: Shield,    label: "Role",            val: userRole(selectedUser) },
              { icon: Clock,     label: "Joined",          val: selectedUser.created_at ? new Date(selectedUser.created_at).toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"}) : "—" },
              { icon: MapPin,    label: "Address",         val: [selectedUser.address, selectedUser.city, selectedUser.state, selectedUser.zip_code, selectedUser.country].filter(Boolean).join(", ") || "—", full: true },
              ...(selectedUser.medical_conditions ? [{ icon: Activity, label: "Medical Conditions", val: selectedUser.medical_conditions, full: true }] : []),
              ...(selectedUser.notes ? [{ icon: FileText, label: "Notes", val: selectedUser.notes, full: true }] : []),
            ].map(({ icon: Icon, label, val, full }, i) => (
              <div key={i} className={`flex items-start gap-3 p-3 bg-slate-50 rounded-lg ${full ? "md:col-span-2" : ""}`}>
                <Icon size={16} className="text-slate-400 mt-0.5 flex-shrink-0"/>
                <div>
                  <p className="text-xs font-medium text-slate-400 mb-0.5">{label}</p>
                  <p className="text-sm text-slate-700 break-all">{val}</p>
                </div>
              </div>
            ))}
          </div>
        </Modal>
      )}

      {/* ══════════════════════════════════════════════════════════════
          EDIT USER MODAL — FIX #6: all fields reference 'role'
      ══════════════════════════════════════════════════════════════ */}
      {editModal && selectedUser && (
        <Modal onClose={() => { setEditModal(false); setSelectedUser(null); resetForm(); }} title={`Edit — ${selectedUser.name}`} wide>
          <ImageUpload preview={imagePreview} onChange={handleImageChange} onRemove={() => { imageFileRef.current = null; setImagePreview(null); }}/>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <Field label="Full Name" error={errors.name}>
              <input type="text" value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} className={input(errors.name)}/>
            </Field>
            <Field label="Email" error={errors.email}>
              <input type="email" value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} className={input(errors.email)}/>
            </Field>
            <Field label="Phone" error={errors.phone}>
              <input type="text" value={formData.phone} onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))} className={input(errors.phone)}/>
            </Field>
            <Field label="Date of Birth">
              <input type="date" value={formData.date_of_birth} onChange={e => setFormData(p => ({ ...p, date_of_birth: e.target.value }))} className={input()}/>
            </Field>
            <Field label="City">
              <input type="text" value={formData.city} onChange={e => setFormData(p => ({ ...p, city: e.target.value }))} className={input()}/>
            </Field>
            <Field label="Province">
              <select value={formData.state} onChange={e => setFormData(p => ({ ...p, state: e.target.value }))} className={input()}>
                <option value="">Select Province</option>
                {["Province 1","Madhesh","Bagmati","Gandaki","Lumbini","Karnali","Sudurpashchim"].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </Field>
            <Field label="Blood Type">
              <select value={formData.blood_type} onChange={e => setFormData(p => ({ ...p, blood_type: e.target.value }))} className={input()}>
                <option value="">Select</option>
                {["A+","A-","B+","B-","O+","O-","AB+","AB-"].map(b => <option key={b}>{b}</option>)}
              </select>
            </Field>
            {/* FIX #6: 'role' field drives both type badge and filter */}
            <Field label="Role">
              <select value={formData.role} onChange={e => setFormData(p => ({ ...p, role: e.target.value }))} className={input()}>
                <option value="user">General User</option>
                <option value="admin">Admin</option>
              </select>
            </Field>
            <Field label="Status">
              <select value={formData.status} onChange={e => setFormData(p => ({ ...p, status: e.target.value }))} className={input()}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="blocked">Blocked</option>
              </select>
            </Field>
          </div>
          <Field label="Medical Conditions" className="mt-3">
            <input type="text" value={formData.medical_conditions} onChange={e => setFormData(p => ({ ...p, medical_conditions: e.target.value }))} className={input()}/>
          </Field>
          <Field label="Notes" className="mt-3">
            <textarea rows={2} value={formData.notes} onChange={e => setFormData(p => ({ ...p, notes: e.target.value }))} className={`${input()} resize-none`}/>
          </Field>

          {/* ── Optional password reset ─────────────────────────────── */}
          <div className="mt-4 pt-4 border-t border-dashed border-slate-200">
            <p className="text-xs font-semibold text-slate-500 mb-3 flex items-center gap-1.5">
              <Lock size={12}/> Change Password <span className="font-normal text-slate-400">(leave blank to keep current)</span>
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Field label="New Password" error={errors.password}>
                <div className="relative">
                  <Lock size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"/>
                  <input
                    type={showEditPassword ? "text" : "password"}
                    placeholder="Min. 8 characters"
                    value={formData.password}
                    onChange={e => setFormData(p => ({ ...p, password: e.target.value }))}
                    className={`${input(errors.password)} pl-8 pr-9`}
                  />
                  <button type="button" onClick={() => setShowEditPassword(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                    {showEditPassword ? <EyeOff size={14}/> : <Eye size={14}/>}
                  </button>
                </div>
              </Field>
              <Field label="Confirm New Password" error={errors.password_confirmation}>
                <div className="relative">
                  <Lock size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"/>
                  <input
                    type={showEditPassword ? "text" : "password"}
                    placeholder="Re-enter new password"
                    value={formData.password_confirmation}
                    onChange={e => setFormData(p => ({ ...p, password_confirmation: e.target.value }))}
                    className={`${input(errors.password_confirmation)} pl-8 pr-9`}
                  />
                </div>
              </Field>
            </div>
          </div>
          {errors.submit && <ErrorBox msg={errors.submit}/>}

          <div className="mt-5 pt-5 border-t border-gray-200">
            <button onClick={handleUpdateUser} disabled={submitting}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-red-500 via-rose-600 to-pink-600 text-white text-sm font-semibold hover:shadow-2xl transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2">
              {submitting ? <><Spinner/>Updating…</> : "Update User"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── SHARED SUB-COMPONENTS ─────────────────────────────────────────────────────

function Modal({ children, onClose, title, subtitle, wide }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
      <div className={`bg-white rounded-2xl shadow-2xl w-full ${wide ? "max-w-2xl" : "max-w-xl"} relative my-8`}>
        <div className="flex items-start justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-800">{title}</h2>
            {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-500 hover:text-gray-800 transition-colors ml-4 flex-shrink-0">
            <X size={20}/>
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

function Stepper({ step }) {
  const labels = ["Basic Info", "Address", "Medical & Role"];
  return (
    <div className="flex items-center mb-8">
      {labels.map((label, i) => {
        const n = i + 1;
        return (
          <React.Fragment key={n}>
            <div className="flex flex-col items-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-300 ${
                step > n  ? "bg-green-500 text-white" :
                step === n ? "bg-gradient-to-r from-red-500 via-rose-600 to-pink-600 text-white shadow-lg" :
                             "bg-gray-200 text-gray-500"
              }`}>
                {step > n ? <Check size={22}/> : n}
              </div>
              <span className={`text-xs mt-2 font-medium whitespace-nowrap ${step >= n ? "text-gray-800" : "text-gray-400"}`}>{label}</span>
            </div>
            {i < labels.length - 1 && (
              <div className={`flex-1 h-1 mx-2 mb-5 rounded transition-all duration-300 ${step > n ? "bg-green-500" : "bg-gray-200"}`}/>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function ImageUpload({ preview, onChange, onRemove, error }) {
  return (
    <div className="flex flex-col items-center mb-4">
      <div className="relative">
        {preview ? (
          <>
            <img src={preview} alt="Preview" className="w-28 h-28 rounded-full object-cover border-4 border-gray-200"/>
            <button type="button" onClick={onRemove} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shadow">
              <X size={14}/>
            </button>
          </>
        ) : (
          <div className="w-28 h-28 rounded-full bg-gray-100 border-4 border-gray-200 flex items-center justify-center">
            <Camera size={28} className="text-gray-400"/>
          </div>
        )}
      </div>
      <label htmlFor="img-upload" className="mt-4 flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-500 via-rose-600 to-pink-600 text-white text-sm font-medium hover:shadow-lg cursor-pointer transition-all">
        <Upload size={14}/>{preview ? "Change Image" : "Upload Image"}
      </label>
      <input id="img-upload" type="file" accept="image/*" onChange={onChange} className="hidden"/>
      <p className="text-xs text-gray-500 mt-2">Max size: 5MB. Formats: JPG, PNG, GIF</p>
      {error && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={11}/>{error}</p>}
    </div>
  );
}

function Field({ label, required, error, children, className }) {
  return (
    <div className={className}>
      <label className="block text-xs font-semibold text-slate-600 mb-1">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={11}/>{error}</p>}
    </div>
  );
}

function ErrorBox({ msg }) {
  return (
    <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm">
      <AlertCircle size={15} className="flex-shrink-0"/>{msg}
    </div>
  );
}

function Spinner() {
  return <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"/>;
}

const input = (err) =>
  `w-full px-3 py-2 border rounded-lg text-sm transition-all focus:outline-none focus:ring-2 ${
    err
      ? "border-red-300 focus:ring-red-200 bg-red-50"
      : "border-slate-200 focus:ring-slate-200 focus:border-slate-300 bg-white"
  }`;
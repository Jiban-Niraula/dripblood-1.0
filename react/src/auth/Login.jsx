import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, User, Phone, AlertCircle } from "lucide-react";


/* ================= HEADER ================= */
export function Header({ onDownloadClick }) {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <style>{`
  /* Header nav links */
  .hdr-nav a {
    color: #fff;               /* text white */
    text-decoration: none;
    font-weight: 500;
    font-size: 0.95rem;
    transition: color 0.2s;
  }

  .hdr-nav a:hover {
    color: #ffe4e6;            /* slightly lighter on hover */
  }

  /* Admin button */
  .btn-admin {
    color: #fff;               /* text white */
    border: 1.5px solid rgba(255, 255, 255, 0.55);
    background: transparent;
    padding: 0.625rem 1.25rem;
    border-radius: 0.75rem;
    font-weight: 600;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .btn-admin:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: #fff;
  }

  /* Download button */
  .btn-download{
    color: #dc0000;               /* text white */
    background: #fff;
    padding: 0.625rem 1.25rem;
    border-radius: 0.75rem;
    font-weight: 600;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .btn-download:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(255, 71, 87, 0.3);
  }
`}</style>


      <header className={`hdr ${scrolled ? "scrolled" : ""}`}>
        <div className="hdr-inner">

          {/* Logo */}
          <div className="logo" onClick={() => navigate("/")}>
            <div className="logo-icon">🩸</div>
            <span className="logo-text">DripBlood</span>
          </div>

          {/* Navigation */}
          <nav className="hdr-nav">
            <a href="#home">Home</a>
            <a href="#about">About</a>
            <a href="#services">Services</a>
            <a href="#contact">Contact</a>
          </nav>

          {/* Actions */}
          <div className="hdr-actions">
            <button className="btn-download" onClick={onDownloadClick}>
              Download App
            </button>
          </div>

        </div>
      </header>
    </>
  );
}

/* ================= LOGIN ================= */
export default function Login() {
  const navigate = useNavigate();

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Load saved credentials
  useEffect(() => {
    const savedLogin = localStorage.getItem("saved_login");
    if (savedLogin) {
      setLogin(savedLogin);
      setRememberMe(true);
    }
  }, []);

  const handleDownloadClick = () => {
    alert("Download app coming soon! Available on iOS and Android.");
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  // Basic validation
  if (login.length < 3) {
    setError("Please enter a valid username or phone number");
    setLoading(false);
    return;
  }

  if (password.length < 6) {
    setError("Password must be at least 6 characters");
    setLoading(false);
    return;
  }

  try {
    const response = await fetch("http://localhost:8000/api/admin-login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        login: login,
        password: password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Invalid credentials. Please try again.");
    }

    // SUCCESS
    setSuccess(true);

    // Save token and user info for persistent login
    localStorage.setItem("admin_token", data.token);
    localStorage.setItem("admin_user", JSON.stringify(data.user));

    // Save login if "Remember me" is checked
    if (rememberMe) {
      localStorage.setItem("saved_login", login);
    } else {
      localStorage.removeItem("saved_login");
    }

    // Redirect to dashboard
    setTimeout(() => {
      navigate("/dashboard");
    }, 800);
  } catch (err) {
    setError(err.message);
    setLoading(false);
  }
};


  return (
    <>
      <Header onDownloadClick={handleDownloadClick} />

      {/* Background Pattern */}
      <div className="fixed inset-0 bg-gradient-to-br from-red-50 via-white to-pink-50 -z-10">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-96 h-96 bg-red-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-red-100 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>
      </div>

      <div className="min-h-screen w-full flex items-center justify-center pt-24 pb-12 px-4">
        <div className="w-full max-w-[480px] animate-fadeInUp">
          {/* Card */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-2xl shadow-black/5 border border-gray-100 backdrop-blur-lg">

            {/* Logo */}
            <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-[#ff4757] to-[#ff6b81] rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/30 animate-scaleIn">
              <span className="text-white text-4xl">🩸</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-center mb-2 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Admin Login
            </h1>
            <p className="text-center text-gray-500 mb-8">
              Sign in with your username or phone number
            </p>

            {/* ERROR */}
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 animate-shake">
                <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                <span className="text-red-700 text-sm font-medium">{error}</span>
              </div>
            )}

            {/* SUCCESS */}
            {success && (
              <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 flex items-center justify-center gap-2 animate-fadeIn">
                <span className="text-green-700 text-sm font-medium">✓ Login successful! Redirecting...</span>
              </div>
            )}

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* LOGIN */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Username or Phone
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#ff4757] transition-colors">
                    <User size={20} />
                  </div>
                  <input
                    type="text"
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                    placeholder="Enter username or phone"
                    required
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-gray-200 
                      focus:border-[#ff4757] focus:ring-4 focus:ring-red-500/10 
                      outline-none transition-all duration-200
                      placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#ff4757] transition-colors">
                    <Lock size={20} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="w-full pl-12 pr-12 py-3.5 rounded-xl border-2 border-gray-200 
                      focus:border-[#ff4757] focus:ring-4 focus:ring-red-500/10 
                      outline-none transition-all duration-200
                      placeholder:text-gray-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* REMEMBER ME & FORGOT PASSWORD */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-2 border-gray-300 text-[#ff4757] 
                      focus:ring-2 focus:ring-red-500/20 cursor-pointer"
                  />
                  <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                    Remember me
                  </span>
                </label>

                <a
                  href="/forgot-password"
                  className="text-sm font-semibold text-[#ff4757] hover:text-[#ff3747] transition-colors"
                >
                  Forgot password?
                </a>
              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={loading || success || !login || !password}
                className="w-full py-4 rounded-xl font-bold text-white text-lg
                  transition-all duration-300 transform
                  hover:scale-[1.02] hover:shadow-xl hover:shadow-red-500/30
                  active:scale-[0.98]
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                  relative overflow-hidden group"
                style={{
                  background: success
                    ? "linear-gradient(135deg, #00b894 0%, #00d2a0 100%)"
                    : "linear-gradient(135deg, #ff4757 0%, #ff6b81 100%)"
                }}
              >
                <span className="relative z-10">
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </span>
                  ) : success ? (
                    "✓ Success! Redirecting..."
                  ) : (
                    "Sign in to Dashboard"
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                  -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </button>
            </form>

            {/* DIVIDER */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Not an admin?</span>
              </div>
            </div>

            {/* FOOTER LINKS */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-sm">
              <a
                href="/"
                className="flex items-center gap-1 text-gray-600 hover:text-[#ff4757] font-semibold transition-colors"
              >
                ← Back to home
              </a>
              <span className="hidden sm:block text-gray-300">•</span>
              <a
                href="/donor-login"
                className="text-gray-600 hover:text-[#ff4757] font-semibold transition-colors"
              >
                Donor Login
              </a>
            </div>
          </div>

          {/* SECURITY NOTE */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500 flex items-center justify-center gap-2">
              <Lock size={12} />
              <span>Secure connection • Your data is encrypted</span>
            </p>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(50px, 50px) scale(1.05); }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.5s ease-out;
        }

        .animate-shake {
          animation: shake 0.4s ease-out;
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </>
  );
}
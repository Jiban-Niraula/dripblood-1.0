// src/pages/LandingPage.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

/* ─── SCROLL-INTO-VIEW HOOK ─── */
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

/* ─── MODAL ─── */
function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        {children}
      </div>
    </div>
  );
}

/* ─── INJECTED STYLES ─── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,700&family=DM+Sans:wght@400;500;600&display=swap');
`;

/* ═══════════════════════════════════════════
   PAGE COMPONENTS
   ═══════════════════════════════════════════ */

function Header({ onDownloadClick }) {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate(); 
  
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  return (
    <header className={`hdr ${scrolled ? "scrolled" : ""}`}>
      <div className="hdr-inner">
        <a href="#home" className="logo">
          <div className="logo-icon">🩸</div>
          <span className="logo-text">DripBlood</span>
        </a>
        <nav className="hdr-nav">
          <a href="#how">How It Works</a>
          <a href="#platform">Platform</a>
          <a href="#campaigns">Campaigns</a>
        </nav>
        <div className="hdr-actions">
          <button
            className="btn-admin"
            onClick={() => navigate("/login")} // ✅ useNavigate
          >
            🔐 Admin Login
          </button>
          <button className="btn-download" onClick={onDownloadClick}>
            ⬇ Download App
          </button>
        </div>
      </div>
    </header>
  );
}

function Hero({ onDownloadClick }) {
  return (
    <section className="hero" id="home">
      <div className="blob blob-1" /><div className="blob blob-2" /><div className="blob blob-3" />
      <div className="hero-inner">
        {/* Left: text */}
        <div className="hero-text">
          <div className="hero-badge">
            <span className="badge-dot" /> 3 Live Campaigns · Updated just now
          </div>
          <h1>Blood donation, <span className="acc">reimagined</span> for everyone.</h1>
          <p>DripBlood connects donors with hospitals in real time. Find drives near you, schedule donations, and track your life-saving impact — from your phone or browser.</p>
          <div className="hero-btns">
            <button className="btn-primary" onClick={onDownloadClick}>⬇ Download the App</button>
            <a href="#how" className="btn-ghost">See how it works →</a>
          </div>
        </div>
        {/* Right: Phone mockup */}
        <div className="hero-phone">
          <div className="phone-glow" />
          <div className="phone-frame">
            <div className="phone-notch" />
            <div className="phone-status"><span>9:41</span><span>●●●</span></div>
            <div className="phone-header">
              <div className="ph-logo">🩸 DripBlood</div>
              <div className="ph-sub">Your blood donation companion</div>
            </div>
            <div className="phone-body">
              <div className="phone-card">
                <div className="pc-icon r">🩸</div>
                <div><div className="pc-title">Donate Blood</div><div className="pc-sub">Schedule a session</div></div>
              </div>
              <div className="phone-card">
                <div className="pc-icon b">🏥</div>
                <div><div className="pc-title">Find Hospitals</div><div className="pc-sub">3 hospitals nearby</div></div>
              </div>
              <div className="phone-card">
                <div className="pc-icon g">📜</div>
                <div><div className="pc-title">My History</div><div className="pc-sub">5 donations · 15 lives</div></div>
              </div>
              <div className="phone-stat-row">
                <div className="phone-stat"><div className="ps-num">5</div><div className="ps-lab">Donated</div></div>
                <div className="phone-stat"><div className="ps-num">15</div><div className="ps-lab">Lives</div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatsBar() {
  const stats = [
    { num: "12,400+", lab: "Lives Saved" },
    { num: "3,800+", lab: "Active Donors" },
    { num: "47", lab: "Partner Hospitals" },
    { num: "98%", lab: "Donor Satisfaction" },
  ];
  return (
    <div className="stats-bar">
      <div className="stats-inner">
        {stats.map((s, i) => (
          <div className="stat" key={i}>
            <div className="stat-num">{s.num}</div>
            <div className="stat-lab">{s.lab}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HowItWorks() {
  const [ref, inView] = useInView();
  const steps = [
    { n: "1", title: "Download & Register", desc: "Get the app on iOS or Android. Sign up in under a minute with your basic details and blood type." },
    { n: "2", title: "Find a Drive Near You", desc: "Browse active campaigns and hospitals in real time. Filter by distance, blood type needed, and availability." },
    { n: "3", title: "Donate & Track Impact", desc: "Schedule your slot, show up, and donate. See exactly how many lives your blood has helped save." },
  ];
  return (
    <section className="sec how" id="how" ref={ref}>
      <div className="sec-inner">
        <div className="sec-head">
          <div className="sec-tag">How It Works</div>
          <h2 className="sec-title">Three steps to saving lives</h2>
          <p className="sec-sub">From download to donation — the whole journey is simple, fast, and meaningful.</p>
        </div>
        <div className="how-grid">
          {steps.map((s, i) => (
            <div className={`how-card ${inView ? "vis" : ""}`} key={i}>
              <div className="how-num">{s.n}</div>
              <h4>{s.title}</h4>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Platform({ onDownloadClick }) {
  const [ref, inView] = useInView();
  return (
    <section className="sec platform" id="platform" ref={ref}>
      <div className="sec-inner">
        <div className="sec-head">
          <div className="sec-tag">The Platform</div>
          <h2 className="sec-title">Built for donors <em style={{ fontStyle: 'italic', color: 'var(--red)' }}>& hospitals</em></h2>
          <p className="sec-sub">Two powerful interfaces. One shared mission — connecting supply with demand, instantly.</p>
        </div>
        <div className="plat-grid">
          {/* Mobile App Card */}
          <div className={`plat-card mobile ${inView ? "vis" : ""}`}>
            <div className="corner-deco" />
            <div className="plat-card-icon">📱</div>
            <h3>Mobile App</h3>
            <p>Your pocket-sized donation companion. Everything a donor needs, beautifully designed for on-the-go use.</p>
            <ul className="plat-features">
              <li><span className="check">✓</span> Real-time hospital & drive finder with map view</li>
              <li><span className="check">✓</span> One-tap appointment scheduling</li>
              <li><span className="check">✓</span> Personal donation history & impact tracker</li>
              <li><span className="check">✓</span> Push notifications for urgent blood needs nearby</li>
            </ul>
            <button className="plat-btn" onClick={onDownloadClick}>⬇ Download Free</button>
          </div>
          {/* Web Platform Card */}
          <div className={`plat-card web ${inView ? "vis" : ""}`}>
            <div className="corner-deco" />
            <div className="plat-card-icon">🌐</div>
            <h3>Web Platform</h3>
            <p>The full-featured dashboard for hospitals, organizers, and administrators to manage blood supply.</p>
            <ul className="plat-features">
              <li><span className="check">✓</span> Campaign creation & management tools</li>
              <li><span className="check">✓</span> Live donor tracking & inventory dashboard</li>
              <li><span className="check">✓</span> Blood type matching & shortage alerts</li>
              <li><span className="check">✓</span> Reports, analytics & partner coordination</li>
            </ul>
            <a href="/admin/login" className="plat-btn">🔐 Admin Login</a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Campaigns() {
  const [ref, inView] = useInView();
  const camps = [
    { tag: "City Drive", title: "City Blood Drive", desc: "Community-wide effort to fill critical shortages at local hospitals this month.", img: "https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=600" },
    { tag: "Campus", title: "University Donation Camp", desc: "Students and faculty uniting to make a collective life-saving impact.", img: "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=600" },
    { tag: "Community", title: "Community Blood Drive", desc: "Neighbors helping neighbors — every unit donated stays local.", img: "https://images.unsplash.com/photo-1582560475093-ba66accbc424?w=600" },
  ];
  return (
    <section className="sec campaigns" id="campaigns" ref={ref}>
      <div className="sec-inner">
        <div className="sec-head">
          <div className="sec-tag">Active Now</div>
          <h2 className="sec-title">Current Campaigns</h2>
          <p className="sec-sub">These drives are actively looking for donors. Download the app to join one near you.</p>
        </div>
        <div className="camp-grid">
          {camps.map((c, i) => (
            <div className={`camp-card ${inView ? "vis" : ""}`} key={i}>
              <img src={c.img} alt={c.title} className="camp-img" />
              <div className="camp-body">
                <span className="camp-tag">{c.tag}</span>
                <h4 className="camp-title">{c.title}</h4>
                <p className="camp-desc">{c.desc}</p>
                <a href="#" className="camp-link">Learn more <span>→</span></a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DownloadCTA({ onDownloadClick }) {
  return (
    <section className="sec dl-section">
      <div className="dl-inner">
        <div className="sec-tag">Ready to help?</div>
        <h2>Download DripBlood today.<br /><em style={{ fontStyle: 'italic', color: 'rgba(255,255,255,.7)' }}>It's free, forever.</em></h2>
        <p>Join thousands of donors already saving lives. Available on iOS and Android — no sign-up hassle, just download and go.</p>
        <div className="dl-btns">
          <div className="dl-btn" onClick={onDownloadClick}>
            <span className="dl-btn-icon">🍎</span>
            <div className="dl-btn-text"><span className="dl-label">Download on the</span><span className="dl-name">App Store</span></div>
          </div>
          <div className="dl-btn" onClick={onDownloadClick}>
            <span className="dl-btn-icon">▶️</span>
            <div className="dl-btn-text"><span className="dl-label">Get it on</span><span className="dl-name">Google Play</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="ft-brand">
            <span className="logo-text">DripBlood</span>
            <p>A community-driven platform connecting donors with hospitals to save lives, one drop at a time.</p>
          </div>
          <div className="ft-col"><h5>Platform</h5><a href="#">Mobile App</a><a href="#">Web Dashboard</a><a href="#">Campaigns</a><a href="#">How It Works</a></div>
          <div className="ft-col"><h5>Company</h5><a href="#">About Us</a><a href="#">Partners</a><a href="#">Blog</a><a href="#">Careers</a></div>
          <div className="ft-col"><h5>Support</h5><a href="#">FAQ</a><a href="#">Contact</a><a href="#">Eligibility</a><a href="#">Report Issue</a></div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 DripBlood. All rights reserved.</span>
          <div><a href="#">Privacy</a><a href="#">Terms</a><a href="#">Cookies</a></div>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════ */
const LandingPage = () => {
  const [dlModal, setDlModal] = useState(false);

  useEffect(() => {
    const tag = document.createElement("style");
    tag.textContent = STYLES;
    document.head.appendChild(tag);
    return () => document.head.removeChild(tag);
  }, []);

  return (
    <div>
      <Header onDownloadClick={() => setDlModal(true)} />
      <Hero onDownloadClick={() => setDlModal(true)} />
      <StatsBar />
      <HowItWorks />
      <Platform onDownloadClick={() => setDlModal(true)} />
      <Campaigns />
      <DownloadCTA onDownloadClick={() => setDlModal(true)} />
      <Footer />

      {/* Download Modal */}
      <Modal open={dlModal} onClose={() => setDlModal(false)}>
        <h3>🩸 Download DripBlood</h3>
        <p>Choose your platform below to get started. It's completely free — no hidden costs.</p>
        <div className="modal-store-btns">
          <a href="#" className="modal-store-btn">
            <span className="msb-icon">🍎</span>
            <div className="msb-text"><div className="msb-label">Download on the</div><div className="msb-name">App Store</div></div>
          </a>
          <a href="#" className="modal-store-btn">
            <span className="msb-icon">▶️</span>
            <div className="msb-text"><div className="msb-label">Get it on</div><div className="msb-name">Google Play</div></div>
          </a>
        </div>
      </Modal>
    </div>
  );
};

export default LandingPage;
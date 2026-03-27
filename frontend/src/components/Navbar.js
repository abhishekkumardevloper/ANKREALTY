/* ============================= */
/* 🌟 GLOBAL SETTINGS */
/* ============================= */

.App {
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* ============================= */
/* 🛠️ FIX FOR INPUTS (WHITE BACKGROUND ON AUTOFILL) */
/* ============================= */

/* This prevents browsers from turning inputs white when autofilling */
input:-webkit-autofill,
input:-webkit-autofill:hover, 
input:-webkit-autofill:focus, 
input:-webkit-autofill:active,
textarea:-webkit-autofill,
textarea:-webkit-autofill:hover,
textarea:-webkit-autofill:focus,
select:-webkit-autofill {
  -webkit-box-shadow: 0 0 0 30px transparent inset !important;
  -webkit-text-fill-color: inherit !important;
  transition: background-color 5000s ease-in-out 0s;
}

/* Smooth gold focus ring for all inputs */
input:focus, 
textarea:focus, 
select:focus {
  outline: none !important;
  border-color: #D4AF37 !important;
  box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.2) !important;
  transition: all 0.3s ease;
}

/* ============================= */
/* 🏡 PROPERTY CARD */
/* ============================= */

.property-card {
  overflow: hidden;
  border-radius: 16px; /* Slightly softer corners for premium feel */
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  background: white;
}

.property-card-image {
  transition: transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform;
}

.property-card:hover {
  box-shadow: 0 20px 40px rgba(139, 0, 0, 0.08); /* Soft maroon shadow */
  transform: translateY(-6px);
}

.property-card:hover .property-card-image {
  transform: scale(1.1); /* Smooth image zoom */
}

/* ============================= */
/* 🔴 PRIMARY BUTTON (DEEP MAROON) */
/* ============================= */

.btn-primary {
  /* Adjusted to a deeper, richer maroon gradient */
  background: linear-gradient(135deg, #8B0000, #600000);
  color: white;
  padding: 0.75rem 2rem;
  border-radius: 8px;
  font-weight: 700;
  letter-spacing: 0.5px;
  border: 1px solid #600000;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(139, 0, 0, 0.2);
}

.btn-primary:hover {
  transform: translateY(-2px);
  background: linear-gradient(135deg, #600000, #400000);
  box-shadow: 0 8px 25px rgba(139, 0, 0, 0.4);
}

.btn-primary:active {
  transform: translateY(0);
}

/* ============================= */
/* 🟡 SECONDARY BUTTON (LUXURY GOLD) */
/* ============================= */

.btn-secondary {
  /* Adjusted to true luxury gold, removing bright yellow */
  background: linear-gradient(135deg, #D4AF37, #AA8000);
  color: #050505; /* Pure black text for perfect contrast */
  padding: 0.75rem 2rem;
  border-radius: 8px;
  font-weight: 800;
  letter-spacing: 0.5px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;
  box-shadow: 0 4px 15px rgba(212, 175, 55, 0.2);
}

.btn-secondary:hover {
  transform: translateY(-2px);
  background: linear-gradient(135deg, #E6C27A, #C5A028); /* Lighter gold on hover */
  box-shadow: 0 8px 25px rgba(212, 175, 55, 0.4);
}

.btn-secondary:active {
  transform: translateY(0);
}

/* ============================= */
/* 🎯 HERO SECTION */
/* ============================= */

.hero-section {
  position: relative;
  height: 80vh; /* Slightly taller for better visual impact */
  min-height: 600px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(5, 5, 5, 0.6), /* Darker top to make navbar readable */
    rgba(5, 5, 5, 0.95)
  );
}

/* ============================= */
/* 🧊 GLASS NAVBAR (PREMIUM DARK) */
/* ============================= */

.glass-nav {
  background: rgba(5, 5, 5, 0.85); /* Deep black */
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(212, 175, 55, 0.15); /* Soft gold border */
}

/* ============================= */
/* 🔍 SEARCH TOGGLE */
/* ============================= */

.search-toggle {
  display: inline-flex;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 8px;
  padding: 0.35rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.search-toggle button {
  padding: 0.6rem 1.75rem;
  border-radius: 6px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 0.8rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  color: #94a3b8; /* Slate 400 */
}

.search-toggle button:hover {
  color: white;
}

/* Active State (Gold Highlight) */
.search-toggle button.active {
  background: linear-gradient(135deg, #D4AF37, #AA8000);
  color: #050505;
  box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
}

/* ============================= */
/* ✨ ANIMATIONS */
/* ============================= */

.fade-in {
  animation: fadeIn 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Add a subtle pulse for verified/important badges */
.gold-pulse {
  animation: goldPulse 2s infinite;
}

@keyframes goldPulse {
  0% { box-shadow: 0 0 0 0 rgba(212, 175, 55, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(212, 175, 55, 0); }
  100% { box-shadow: 0 0 0 0 rgba(212, 175, 55, 0); }
}

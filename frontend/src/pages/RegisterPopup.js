import React, { useState, useEffect, useMemo } from 'react';
import { Building2, X, KeyRound, Sparkles, AlertCircle, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api';

// Validation Regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[0-9]{10,14}$/;

const validatePassword = (value) => {
  if (value.length < 8) return 'Password must be at least 8 characters long.';
  if (!/[A-Za-z]/.test(value) || !/[0-9]/.test(value)) return 'Password must include at least one letter and one number.';
  return '';
};

export default function RegisterPopup() {
  const { login, register } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('register'); // Defaulting to register for a register popup
  const [loading, setLoading] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [forgotEmail, setForgotEmail] = useState('');
  const [registerData, setRegisterData] = useState({
    name: '', email: '', password: '', phone: '', role: 'client'
  });

  const allowedRoles = ['client', 'agent', 'broker'];

  // Password Strength Calculator
  const passwordStrength = useMemo(() => {
    const score = [registerData.password.length >= 8, /[A-Za-z]/.test(registerData.password), /[0-9]/.test(registerData.password)].filter(Boolean).length;
    return ['Weak', 'Weak', 'Good', 'Strong'][score] || 'Weak';
  }, [registerData.password]);

  // Trigger popup after 4 seconds if not logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) return;
    const timer = setTimeout(() => setIsOpen(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setErrors({});
  };

  // Validation Functions
  const validateLogin = () => {
    const next = {};
    if (!loginData.email.trim()) next.loginEmail = 'Email is required.';
    if (!loginData.password.trim()) next.loginPassword = 'Password is required.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const validateRegister = () => {
    const next = {};
    if (registerData.name.trim().length < 2) next.registerName = 'Enter your full name.';
    if (!emailRegex.test(registerData.email.trim())) next.registerEmail = 'Enter a valid email address.';
    const passwordError = validatePassword(registerData.password.trim());
    if (passwordError) next.registerPassword = passwordError;
    if (!phoneRegex.test(registerData.phone.replace(/\D/g, ''))) next.registerPhone = 'Enter a valid 10+ digit phone number.';
    if (!allowedRoles.includes(registerData.role)) next.registerRole = 'Please choose a valid account type.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  // Submit Handlers
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateLogin()) return;
    setLoading(true);
    try {
      await login(loginData.email.trim(), loginData.password);
      toast.success('Login successful. Welcome back!');
      setIsOpen(false);
      window.location.reload();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Unable to sign in. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateRegister()) return;
    setLoading(true);
    try {
      await register(
        registerData.name.trim(),
        registerData.email.trim(),
        registerData.password,
        registerData.phone.trim(),
        registerData.role
      );
      toast.success('Account created successfully!');
      setIsOpen(false);
      window.location.reload();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!emailRegex.test(forgotEmail.trim())) {
      toast.error('Enter a valid email for password help.');
      return;
    }
    setForgotLoading(true);
    try {
      const response = await apiClient.post('/auth/forgot-password', { email: forgotEmail.trim() });
      toast.success(response.data.message || 'Password help request submitted.');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Unable to process request right now.');
    } finally {
      setForgotLoading(false);
    }
  };

  const FieldError = ({ message }) => message ? <p className="mt-1 text-xs text-red-500 flex items-center gap-1 font-medium"><AlertCircle className="w-3.5 h-3.5" />{message}</p> : null;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050505]/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      
      <div className="relative w-full max-w-[28rem] rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 bg-white animate-in zoom-in-95 duration-300">
        
        {/* CLOSE BUTTON */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md hover:bg-white text-white hover:text-[#8B0000] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* HEADER */}
        <div className="bg-gradient-to-br from-[#8B0000] to-[#4A0000] text-white p-8 pb-10 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#D4AF37]/30 blur-[60px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 blur-[40px] rounded-full pointer-events-none" />

          <div className="relative z-10">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-white/10 flex items-center justify-center border border-[#D4AF37]/30 backdrop-blur-sm shadow-lg">
              <Building2 className="w-7 h-7 text-[#D4AF37]" />
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight">ANK <span className="text-[#D4AF37]">REALTY</span></h2>
            <p className="text-sm text-white/80 mt-2 flex items-center justify-center gap-1.5 font-medium tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              Unlock Premium Properties
            </p>
          </div>
        </div>

        {/* CONTENT */}
        <div className="px-8 pb-8 pt-6 relative bg-white rounded-t-[2rem] -mt-6">
          
          {/* Custom Tabs Toggle */}
          <div className="flex p-1 bg-slate-100 rounded-xl mb-6">
            <button
              onClick={() => handleTabChange('login')}
              className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${activeTab === 'login' ? 'bg-white text-[#8B0000] shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Sign In
            </button>
            <button
              onClick={() => handleTabChange('register')}
              className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${activeTab === 'register' ? 'bg-white text-[#8B0000] shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Create Account
            </button>
          </div>

          {/* LOGIN FORM */}
          {activeTab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4 animate-in fade-in slide-in-from-left-4" noValidate>
              <div>
                <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-1 block">Email</Label>
                <Input
                  type="email"
                  value={loginData.email}
                  onChange={(e) => {
                    setLoginData({ ...loginData, email: e.target.value });
                    setForgotEmail(e.target.value);
                  }}
                  className="h-11 bg-slate-50 border-slate-200 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] rounded-xl font-medium"
                  placeholder="name@example.com"
                />
                <FieldError message={errors.loginEmail} />
              </div>

              <div>
                <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-1 block">Password</Label>
                <Input
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  className="h-11 bg-slate-50 border-slate-200 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] rounded-xl font-medium"
                  placeholder="Enter your password"
                />
                <FieldError message={errors.loginPassword} />
              </div>

              {/* FORGOT PASSWORD MINIMAL */}
              <div className="flex items-center justify-between mt-2 mb-4">
                <div className="flex items-center gap-1.5 text-slate-600 text-xs font-semibold">
                  <KeyRound className="w-3.5 h-3.5 text-[#D4AF37]" /> Forgot?
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Email for reset"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="h-8 w-32 bg-slate-50 border-slate-200 focus:border-[#D4AF37] rounded-md text-xs px-2"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleForgotPassword}
                    disabled={forgotLoading}
                    className="h-8 px-3 text-[10px] uppercase font-bold tracking-wider text-[#8B0000] bg-red-50 hover:bg-red-100 rounded-md transition-colors"
                  >
                    {forgotLoading ? '...' : 'Send'}
                  </Button>
                </div>
              </div>

              <Button type="submit" className="w-full h-12 bg-[#8B0000] hover:bg-[#600000] text-white font-bold rounded-xl text-sm shadow-md shadow-[#8B0000]/20 transition-all hover:-translate-y-0.5" disabled={loading}>
                {loading ? 'Authenticating...' : 'Secure Login'}
              </Button>
            </form>
          )}

          {/* REGISTER FORM */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3.5 animate-in fade-in slide-in-from-right-4" noValidate>
              <div>
                <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-1 block">Full Name</Label>
                <Input
                  value={registerData.name}
                  onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                  className="h-10 bg-slate-50 border-slate-200 focus:border-[#D4AF37] rounded-xl text-sm font-medium"
                  placeholder="e.g. John Doe"
                />
                <FieldError message={errors.registerName} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-1 block">Email</Label>
                  <Input
                    type="email"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    className="h-10 bg-slate-50 border-slate-200 focus:border-[#D4AF37] rounded-xl text-sm font-medium"
                    placeholder="name@example.com"
                  />
                  <FieldError message={errors.registerEmail} />
                </div>
                <div>
                  <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-1 block">Phone</Label>
                  <Input
                    type="tel"
                    value={registerData.phone}
                    onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                    className="h-10 bg-slate-50 border-slate-200 focus:border-[#D4AF37] rounded-xl text-sm font-medium"
                    placeholder="+91 98765 43210"
                  />
                  <FieldError message={errors.registerPhone} />
                </div>
              </div>

              <div>
                <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-1 block">Password</Label>
                <Input
                  type="password"
                  value={registerData.password}
                  onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                  className="h-10 bg-slate-50 border-slate-200 focus:border-[#D4AF37] rounded-xl text-sm font-medium"
                  placeholder="Min 8 chars (letters & numbers)"
                />
                {registerData.password.length > 0 && (
                  <p className="mt-1 ml-1 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    Strength: <span className={passwordStrength === 'Strong' ? 'text-green-500' : passwordStrength === 'Good' ? 'text-[#D4AF37]' : 'text-red-500'}>{passwordStrength}</span>
                  </p>
                )}
                <FieldError message={errors.registerPassword} />
              </div>

              <div>
                <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-1 block">I am a</Label>
                <select
                  value={registerData.role}
                  onChange={(e) => setRegisterData({ ...registerData, role: e.target.value })}
                  className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] text-sm font-medium text-slate-700"
                >
                  <option value="client">Property Buyer / Client</option>
                  <option value="agent">Real Estate Agent</option>
                  <option value="broker">Broker / Channel Partner</option>
                </select>
                <FieldError message={errors.registerRole} />
              </div>

              <div className="pt-2">
                <Button type="submit" className="w-full h-12 bg-[#D4AF37] hover:bg-[#b08d24] text-black font-extrabold rounded-xl text-sm shadow-md transition-all hover:-translate-y-0.5" disabled={loading}>
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

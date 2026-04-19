// src/components/RegisterPopup.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Building2, X, KeyRound, Sparkles, AlertCircle, ShieldCheck, Mail, Lock, User, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  const [activeTab, setActiveTab] = useState('register'); // Default to register
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

  const FieldError = ({ message }) => message ? <p className="mt-1.5 text-[10px] text-red-500 flex items-center gap-1 font-bold uppercase tracking-wider"><AlertCircle className="w-3 h-3" />{message}</p> : null;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050505]/70 backdrop-blur-md p-4 animate-in fade-in duration-300">
      
      <div className="relative w-full max-w-[26rem] rounded-[2.5rem] overflow-hidden shadow-2xl bg-white border border-slate-100 animate-in zoom-in-95 duration-500 ease-out">
        
        {/* CLOSE BUTTON */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-5 right-5 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md hover:bg-white text-white hover:text-slate-900 transition-all shadow-sm"
        >
          <X className="w-4 h-4" />
        </button>

        {/* HEADER */}
        <div className="bg-slate-900 text-white pt-10 pb-12 px-8 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#D4AF37]/20 blur-[60px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#8B0000]/30 blur-[40px] rounded-full pointer-events-none translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10 flex flex-col items-center">
            <div className="w-12 h-12 mb-4 rounded-2xl bg-gradient-to-br from-[#8B0000] to-[#D4AF37] p-[1px] shadow-lg">
               <div className="w-full h-full bg-slate-900 rounded-2xl flex items-center justify-center">
                 <Building2 className="w-6 h-6 text-[#D4AF37]" />
               </div>
            </div>
            <h2 className="text-2xl font-black tracking-tight mb-1">Join <span className="text-[#D4AF37]">ANK REALTY</span></h2>
            <p className="text-xs text-slate-400 flex items-center justify-center gap-1.5 font-bold tracking-widest uppercase">
              <Sparkles className="w-3 h-3 text-[#D4AF37]" /> The Red Carpet of Real Estate
            </p>
          </div>
        </div>

        {/* CONTENT */}
        <div className="px-8 pb-8 pt-6 relative bg-white rounded-t-[2rem] -mt-6 z-10 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
          
          {/* Custom Tabs Toggle */}
          <div className="flex p-1 bg-slate-100/80 rounded-xl mb-6 border border-slate-200/60">
            <button
              onClick={() => handleTabChange('login')}
              className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all duration-300 ${activeTab === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Sign In
            </button>
            <button
              onClick={() => handleTabChange('register')}
              className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all duration-300 ${activeTab === 'register' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Create Account
            </button>
          </div>

          {/* LOGIN FORM */}
          {activeTab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300" noValidate>
              
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-slate-400 group-focus-within:text-[#D4AF37] transition-colors" />
                </div>
                <Input
                  type="email"
                  value={loginData.email}
                  onChange={(e) => {
                    setLoginData({ ...loginData, email: e.target.value });
                    setForgotEmail(e.target.value);
                  }}
                  className="pl-10 h-12 bg-slate-50 border-slate-200 focus:bg-white focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/10 rounded-xl text-sm font-medium transition-all outline-none"
                  placeholder="Email address"
                />
                <FieldError message={errors.loginEmail} />
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-slate-400 group-focus-within:text-[#D4AF37] transition-colors" />
                </div>
                <Input
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  className="pl-10 h-12 bg-slate-50 border-slate-200 focus:bg-white focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/10 rounded-xl text-sm font-medium transition-all outline-none"
                  placeholder="Password"
                />
                <FieldError message={errors.loginPassword} />
              </div>

              {/* FORGOT PASSWORD MINIMAL */}
              <div className="flex flex-col gap-2 pt-2 pb-4">
                <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-widest pl-1">
                  <KeyRound className="w-3 h-3 text-[#D4AF37]" /> Password Recovery
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter email to reset"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="h-10 flex-1 bg-slate-50 border-slate-200 focus:bg-white focus:border-[#D4AF37] rounded-lg text-xs transition-all outline-none"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleForgotPassword}
                    disabled={forgotLoading}
                    className="h-10 px-4 text-[10px] uppercase font-black tracking-widest text-slate-600 hover:text-[#8B0000] bg-slate-100 hover:bg-red-50 rounded-lg transition-colors border border-slate-200"
                  >
                    {forgotLoading ? '...' : 'Send Link'}
                  </Button>
                </div>
              </div>

              <Button type="submit" className="w-full h-12 bg-[#8B0000] hover:bg-[#600000] text-white font-black rounded-xl text-sm shadow-lg shadow-[#8B0000]/20 transition-all hover:-translate-y-0.5" disabled={loading}>
                {loading ? 'Authenticating...' : 'Secure Login'}
              </Button>
            </form>
          )}

          {/* REGISTER FORM */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3.5 animate-in fade-in slide-in-from-right-4 duration-300" noValidate>
              
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-slate-400 group-focus-within:text-[#D4AF37] transition-colors" />
                </div>
                <Input
                  value={registerData.name}
                  onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                  className="pl-10 h-11 bg-slate-50 border-slate-200 focus:bg-white focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/10 rounded-xl text-sm font-medium transition-all outline-none"
                  placeholder="Full Name"
                />
                <FieldError message={errors.registerName} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-slate-400 group-focus-within:text-[#D4AF37] transition-colors" />
                  </div>
                  <Input
                    type="email"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    className="pl-10 h-11 bg-slate-50 border-slate-200 focus:bg-white focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/10 rounded-xl text-sm font-medium transition-all outline-none"
                    placeholder="Email"
                  />
                  <FieldError message={errors.registerEmail} />
                </div>
                
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Phone className="h-4 w-4 text-slate-400 group-focus-within:text-[#D4AF37] transition-colors" />
                  </div>
                  <Input
                    type="tel"
                    value={registerData.phone}
                    onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                    className="pl-10 h-11 bg-slate-50 border-slate-200 focus:bg-white focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/10 rounded-xl text-sm font-medium transition-all outline-none"
                    placeholder="Phone"
                  />
                  <FieldError message={errors.registerPhone} />
                </div>
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-slate-400 group-focus-within:text-[#D4AF37] transition-colors" />
                </div>
                <Input
                  type="password"
                  value={registerData.password}
                  onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                  className="pl-10 h-11 bg-slate-50 border-slate-200 focus:bg-white focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/10 rounded-xl text-sm font-medium transition-all outline-none"
                  placeholder="Create Password (Min 8 chars)"
                />
                {registerData.password.length > 0 && (
                  <p className="mt-1.5 ml-1 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    Strength: <span className={passwordStrength === 'Strong' ? 'text-green-500' : passwordStrength === 'Good' ? 'text-[#D4AF37]' : 'text-red-500'}>{passwordStrength}</span>
                  </p>
                )}
                <FieldError message={errors.registerPassword} />
              </div>

              <div className="pt-1 pb-2">
                <select
                  value={registerData.role}
                  onChange={(e) => setRegisterData({ ...registerData, role: e.target.value })}
                  className="w-full h-11 px-4 bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/10 rounded-xl outline-none appearance-none font-bold text-sm text-slate-600 transition-all cursor-pointer"
                >
                  <option value="client">I am a Buyer / Client</option>
                  <option value="agent">I am an Agent</option>
                  <option value="broker">I am a Channel Partner</option>
                </select>
                <FieldError message={errors.registerRole} />
              </div>

              <div className="pt-2">
                <Button type="submit" className="w-full h-12 bg-[#8B0000] hover:bg-[#600000] text-white font-black rounded-xl text-sm shadow-lg shadow-[#8B0000]/20 transition-all hover:-translate-y-0.5" disabled={loading}>
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </div>
              
              <div className="text-center pt-2 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Your data is secured</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

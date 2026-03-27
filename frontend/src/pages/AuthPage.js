import React, { useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, AlertCircle, KeyRound, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[0-9]{10,14}$/;

const validatePassword = (value) => {
  if (value.length < 8) return 'Password must be at least 8 characters long.';
  if (!/[A-Za-z]/.test(value) || !/[0-9]/.test(value)) return 'Password must include at least one letter and one number.';
  return '';
};

export default function AuthPage() {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  
  const [activeTab, setActiveTab] = useState('login');
  const [loading, setLoading] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [forgotEmail, setForgotEmail] = useState('');
  
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ name: '', email: '', password: '', phone: '', role: 'client' });
  const allowedRoles = ['client', 'agent', 'broker'];

  const passwordStrength = useMemo(() => {
    const score = [registerData.password.length >= 8, /[A-Za-z]/.test(registerData.password), /[0-9]/.test(registerData.password)].filter(Boolean).length;
    return ['Weak', 'Weak', 'Good', 'Strong'][score] || 'Weak';
  }, [registerData.password]);

  const validateLogin = () => {
    const next = {};
    if (!emailRegex.test(loginData.email.trim())) next.loginEmail = 'Enter a valid email address.';
    const passwordError = validatePassword(loginData.password.trim());
    if (passwordError) next.loginPassword = passwordError;
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const validateRegister = () => {
    const next = {};
    if (registerData.name.trim().length < 2) next.registerName = 'Enter your full name.';
    if (!emailRegex.test(registerData.email.trim())) next.registerEmail = 'Enter a valid email address.';
    const passwordError = validatePassword(registerData.password.trim());
    if (passwordError) next.registerPassword = passwordError;
    if (!phoneRegex.test(registerData.phone.replace(/\D/g, ''))) next.registerPhone = 'Enter a valid phone number with at least 10 digits.';
    if (!allowedRoles.includes(registerData.role)) next.registerRole = 'Please choose a valid account type.';
    
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateLogin()) return;
    setLoading(true);
    try {
      await login(loginData.email.trim(), loginData.password);
      toast.success('Login successful. Welcome back!');
      navigate('/');
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
      await register(registerData.name.trim(), registerData.email.trim(), registerData.password, registerData.phone.trim(), registerData.role);
      toast.success('Account created successfully. You are now signed in.');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Registration failed. Please review your details and try again.');
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
      toast.error(error.response?.data?.detail || 'Unable to process forgot password right now.');
    } finally {
      setForgotLoading(false);
    }
  };

  const FieldError = ({ message }) => message ? <p className="mt-1 text-xs text-red-600 flex items-center gap-1 font-medium"><AlertCircle className="w-3.5 h-3.5" />{message}</p> : null;

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4 py-10 relative overflow-hidden selection:bg-[#D4AF37]/30">
      {/* Background styling */}
      <div className="absolute inset-0 opacity-20 mix-blend-overlay" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2000&q=80')`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/80 via-[#050505]/95 to-[#050505] z-0" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#8B0000]/20 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#D4AF37]/10 rounded-full blur-[100px] pointer-events-none translate-y-1/2 -translate-x-1/3" />

      <div className="w-full max-w-md relative z-10">
        {/* Back Button & Logo */}
        <div className="flex flex-col items-center justify-center space-y-4 mb-8">
          <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-[#D4AF37] flex items-center text-sm font-medium transition-colors mb-2 absolute left-0 top-2 hidden sm:flex">
             <ChevronLeft className="w-4 h-4 mr-1" /> Back
          </button>
          <Link to="/" className="flex items-center space-x-2 group">
            <h1 className="text-4xl font-extrabold tracking-tight text-[#D4AF37] group-hover:scale-105 transition-transform duration-300">
              ANK <span className="text-white">REALTY</span>
            </h1>
          </Link>
          <p className="text-slate-400 text-sm font-medium tracking-wide">The Red Carpet of Real Estate</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-[2rem] shadow-2xl p-8 border border-slate-100">
          
          {/* Security Badge */}
          <div className="flex items-center gap-3 mb-8 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <ShieldCheck className="w-6 h-6 text-[#D4AF37] shrink-0" />
            <p className="text-xs text-slate-500 font-medium leading-relaxed">Secure login with encrypted validation and robust account protection protocols.</p>
          </div>

          {/* Custom Tabs Toggle */}
          <div className="flex p-1 bg-slate-100 rounded-xl mb-8">
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-2.5 text-sm font-black uppercase tracking-wider rounded-lg transition-all ${activeTab === 'login' ? 'bg-white text-[#8B0000] shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Login
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-2.5 text-sm font-black uppercase tracking-wider rounded-lg transition-all ${activeTab === 'register' ? 'bg-white text-[#8B0000] shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Register
            </button>
          </div>
          
          {/* LOGIN FORM */}
          {activeTab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-5 animate-in fade-in slide-in-from-left-4" noValidate>
              <div>
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 mb-1.5 block">Email Address</Label>
                <Input 
                  type="email" 
                  value={loginData.email} 
                  onChange={(e) => { 
                    setLoginData({ ...loginData, email: e.target.value }); 
                    setForgotEmail(e.target.value); 
                  }} 
                  placeholder="name@example.com" 
                  required 
                  className="h-12 bg-white shadow-sm border-slate-200 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] rounded-xl font-medium"
                />
                <FieldError message={errors.loginEmail} />
              </div>
              <div>
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 mb-1.5 block">Password</Label>
                <Input 
                  type="password" 
                  value={loginData.password} 
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} 
                  placeholder="Minimum 8 characters" 
                  required 
                  className="h-12 bg-white shadow-sm border-slate-200 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] rounded-xl font-medium"
                />
                <FieldError message={errors.loginPassword} />
              </div>
              
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 mt-2">
                <div className="flex items-center gap-2 text-slate-700 font-bold text-sm mb-3">
                  <KeyRound className="w-4 h-4 text-[#D4AF37]" /> Forgot password?
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input 
                    type="email" 
                    placeholder="Registered email" 
                    value={forgotEmail} 
                    onChange={(e) => setForgotEmail(e.target.value)} 
                    className="h-10 bg-white shadow-sm border-slate-200 focus:border-[#D4AF37] rounded-lg text-sm"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="h-10 shrink-0 border-slate-200 text-slate-600 hover:text-[#8B0000] hover:border-[#8B0000] rounded-lg text-xs font-bold transition-colors bg-white" 
                    onClick={handleForgotPassword} 
                    disabled={forgotLoading}
                  >
                    {forgotLoading ? 'Sending...' : 'Send Reset Link'}
                  </Button>
                </div>
              </div>

              <Button type="submit" className="w-full h-14 bg-[#8B0000] hover:bg-[#600000] text-white font-black rounded-xl text-base shadow-lg shadow-[#8B0000]/20 transition-all hover:-translate-y-0.5 mt-4" disabled={loading}>
                {loading ? 'Authenticating...' : 'Secure Login'}
              </Button>
            </form>
          )}

          {/* REGISTER FORM */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4 animate-in fade-in slide-in-from-right-4" noValidate>
              <div>
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 mb-1 block">Full Name</Label>
                <Input 
                  type="text" 
                  value={registerData.name} 
                  onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })} 
                  placeholder="e.g. John Doe"
                  required 
                  className="h-11 bg-white shadow-sm border-slate-200 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] rounded-xl font-medium text-sm"
                />
                <FieldError message={errors.registerName} />
              </div>
              <div>
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 mb-1 block">Email Address</Label>
                <Input 
                  type="email" 
                  value={registerData.email} 
                  onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })} 
                  placeholder="name@example.com" 
                  required 
                  className="h-11 bg-white shadow-sm border-slate-200 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] rounded-xl font-medium text-sm"
                />
                <FieldError message={errors.registerEmail} />
              </div>
              <div>
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 mb-1 block">Phone Number</Label>
                <Input 
                  type="tel" 
                  value={registerData.phone} 
                  onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })} 
                  placeholder="+91 98765 43210" 
                  required 
                  className="h-11 bg-white shadow-sm border-slate-200 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] rounded-xl font-medium text-sm"
                />
                <FieldError message={errors.registerPhone} />
              </div>
              <div>
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 mb-1 block">Password</Label>
                <Input 
                  type="password" 
                  value={registerData.password} 
                  onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })} 
                  placeholder="Minimum 8 chars (letters & numbers)" 
                  required 
                  className="h-11 bg-white shadow-sm border-slate-200 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] rounded-xl font-medium text-sm"
                />
                <p className="mt-1 ml-1 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                  Strength: <span className={passwordStrength === 'Strong' ? 'text-green-500' : passwordStrength === 'Good' ? 'text-[#D4AF37]' : 'text-red-500'}>{passwordStrength}</span>
                </p>
                <FieldError message={errors.registerPassword} />
              </div>
              <div>
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 mb-1 block">I am a</Label>
                <select 
                  value={registerData.role} 
                  onChange={(e) => setRegisterData({ ...registerData, role: e.target.value })} 
                  className="w-full h-11 px-4 bg-white shadow-sm border border-slate-200 rounded-xl outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] appearance-none font-medium text-sm text-slate-900"
                >
                  <option value="client">Property Buyer / Client</option>
                  <option value="agent">Real Estate Agent</option>
                  <option value="broker">Broker / Channel Partner</option>
                </select>
                <FieldError message={errors.registerRole} />
              </div>
              <Button type="submit" className="w-full h-14 bg-[#8B0000] hover:bg-[#600000] text-white font-black rounded-xl text-base shadow-lg shadow-[#8B0000]/20 transition-all hover:-translate-y-0.5 mt-6" disabled={loading}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>
          )}

        </div>

        <p className="text-center text-slate-500 text-xs mt-6 font-medium">
          By continuing, you agree to our <br/><Link to="/terms" className="text-[#D4AF37] hover:text-white transition-colors">Terms of Service</Link> and <Link to="/privacy" className="text-[#D4AF37] hover:text-white transition-colors">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
}

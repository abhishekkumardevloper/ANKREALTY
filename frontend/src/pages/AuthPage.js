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

// Standard Google 'G' Logo SVG
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

export default function AuthPage() {
  const navigate = useNavigate();
  
  // FIX 1: We added loginWithGoogle here
  const { login, register, loginWithGoogle } = useAuth(); 
  
  const [activeTab, setActiveTab] = useState('login');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
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

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setErrors({}); 
  };

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

  // FIX 2: Updated Google handler to use the context function
  const handleGoogleAuth = async () => {
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
      // Notice we do NOT set loading to false here on success, 
      // because the page will redirect to Google!
    } catch (error) {
      toast.error('Failed to authenticate with Google.');
      setGoogleLoading(false);
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
              onClick={() => handleTabChange('login')}
              className={`flex-1 py-2.5 text-sm font-black uppercase tracking-wider rounded-lg transition-all ${activeTab === 'login' ? 'bg-white text-[#8B0000] shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Login
            </button>
            <button
              onClick={() => handleTabChange('register')}
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
                  placeholder="Enter your password" 
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
                {registerData.password.length > 0 && (
                  <p className="mt-1 ml-1 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    Strength: <span className={passwordStrength === 'Strong' ? 'text-green-500' : passwordStrength === 'Good' ? 'text-[#D4AF37]' : 'text-red-500'}>{passwordStrength}</span>
                  </p>
                )}
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

          {/* SOCIAL LOGIN DIVIDER & BUTTON */}
          <div className="mt-8 mb-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-slate-400 font-bold tracking-wide uppercase text-xs">Or continue with</span>
            </div>
          </div>

          <Button 
            type="button" 
            variant="outline" 
            onClick={handleGoogleAuth}
            disabled={loading || googleLoading}
            className="w-full h-14 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-3 text-base"
          >
            {googleLoading ? (
               <div className="w-5 h-5 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
            ) : (
               <GoogleIcon />
            )}
            {activeTab === 'login' ? 'Sign in with Google' : 'Sign up with Google'}
          </Button>

        </div>

        <p className="text-center text-slate-500 text-xs mt-6 font-medium">
          By continuing, you agree to our <br/><Link to="/terms" className="text-[#D4AF37] hover:text-white transition-colors">Terms of Service</Link> and <Link to="/privacy" className="text-[#D4AF37] hover:text-white transition-colors">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
}

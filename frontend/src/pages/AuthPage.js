import React, { useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Building2, ShieldCheck, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

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
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ name: '', email: '', password: '', phone: '', role: 'user' });

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

  const FieldError = ({ message }) => message ? <p className="mt-1 text-sm text-red-600 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{message}</p> : null;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center space-x-2 mb-8">
          <Building2 className="h-10 w-10 text-[#C8102E]" />
          <span className="text-3xl font-black">ANK Realty</span>
        </Link>

        <div className="bg-white rounded-3xl shadow-lg p-8 border border-slate-200">
          <div className="flex items-center gap-3 mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <p className="text-sm text-slate-600">Secure login with email validation, password rules, and strict backend checks.</p>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4" noValidate>
                <div>
                  <Label>Email</Label>
                  <Input type="email" value={loginData.email} onChange={(e) => setLoginData({ ...loginData, email: e.target.value })} placeholder="name@example.com" required />
                  <FieldError message={errors.loginEmail} />
                </div>
                <div>
                  <Label>Password</Label>
                  <Input type="password" value={loginData.password} onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} placeholder="Minimum 8 characters" required />
                  <FieldError message={errors.loginPassword} />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</Button>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4" noValidate>
                <div>
                  <Label>Full Name</Label>
                  <Input type="text" value={registerData.name} onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })} required />
                  <FieldError message={errors.registerName} />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input type="email" value={registerData.email} onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })} placeholder="name@example.com" required />
                  <FieldError message={errors.registerEmail} />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input type="tel" value={registerData.phone} onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })} placeholder="9876543210" required />
                  <FieldError message={errors.registerPhone} />
                </div>
                <div>
                  <Label>Password</Label>
                  <Input type="password" value={registerData.password} onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })} placeholder="Use letters and numbers" required />
                  <p className="mt-1 text-xs text-slate-500">Password strength: <span className="font-bold">{passwordStrength}</span></p>
                  <FieldError message={errors.registerPassword} />
                </div>
                <div>
                  <Label>I am a</Label>
                  <select value={registerData.role} onChange={(e) => setRegisterData({ ...registerData, role: e.target.value })} className="w-full h-10 px-3 border rounded-md outline-none focus:ring-2 focus:ring-red-200 focus:border-red-500 transition-all">
                    <option value="user">Property Buyer / User</option>
                    <option value="agent">Real Estate Agent</option>
                  </select>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Creating account...' : 'Create Account'}</Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

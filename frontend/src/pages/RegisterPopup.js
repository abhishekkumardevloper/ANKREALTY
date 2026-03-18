import React, { useState, useEffect } from 'react';
import { Building2, X, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api';

const validEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export default function RegisterPopup() {
  const { login, register } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [forgotEmail, setForgotEmail] = useState('');
  const [registerData, setRegisterData] = useState({ name: '', email: '', password: '', phone: '', role: 'client' });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) return;
    const timer = setTimeout(() => setIsOpen(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(loginData.email.trim(), loginData.password);
      toast.success('Login successful!');
      setIsOpen(false);
      window.location.reload();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(registerData.name.trim(), registerData.email.trim(), registerData.password, registerData.phone.trim(), registerData.role);
      toast.success('Registration successful!');
      setIsOpen(false);
      window.location.reload();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!validEmail(forgotEmail.trim())) {
      toast.error('Enter a valid registered email.');
      return;
    }
    setForgotLoading(true);
    try {
      const response = await apiClient.post('/auth/forgot-password', { email: forgotEmail.trim() });
      toast.success(response.data.message || 'Password help sent.');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Could not process forgot password.');
    } finally {
      setForgotLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl relative overflow-hidden">
        <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-red-100 text-gray-500 hover:text-red-600 rounded-full z-10"><X className="w-5 h-5" /></button>
        <div className="bg-slate-50 p-6 border-b border-slate-100 flex flex-col items-center">
          <div className="bg-red-100 p-3 rounded-full mb-3"><Building2 className="h-8 w-8 text-red-600" /></div>
          <h2 className="text-2xl font-black text-slate-900">Join ANK Realty</h2>
          <p className="text-sm text-slate-500 mt-1 text-center">Find your dream property or start selling today.</p>
        </div>
        <div className="p-6">
          <Tabs defaultValue="register" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-slate-100"><TabsTrigger value="login">Login</TabsTrigger><TabsTrigger value="register">Register</TabsTrigger></TabsList>
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1"><Label>Email</Label><Input type="email" placeholder="you@example.com" value={loginData.email} onChange={(e) => { setLoginData({ ...loginData, email: e.target.value }); setForgotEmail(e.target.value); }} required /></div>
                <div className="space-y-1"><Label>Password</Label><Input type="password" placeholder="••••••••" value={loginData.password} onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} required /></div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2"><div className="text-sm font-semibold text-slate-700 flex items-center gap-2"><KeyRound className="w-4 h-4 text-red-600" /> Forgot password?</div><Input type="email" placeholder="Registered email" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} /><Button type="button" variant="outline" className="w-full" onClick={handleForgotPassword} disabled={forgotLoading}>{forgotLoading ? 'Sending help...' : 'Send password help'}</Button></div>
                <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold h-11" disabled={loading}>{loading ? 'Logging in...' : 'Login to Account'}</Button>
              </form>
            </TabsContent>
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-1"><Label>Full Name</Label><Input type="text" placeholder="John Doe" value={registerData.name} onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })} required /></div>
                <div className="grid grid-cols-2 gap-4"><div className="space-y-1"><Label>Email</Label><Input type="email" placeholder="you@email.com" value={registerData.email} onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })} required /></div><div className="space-y-1"><Label>Phone</Label><Input type="tel" placeholder="9876543210" value={registerData.phone} onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })} required /></div></div>
                <div className="space-y-1"><Label>Password</Label><Input type="password" placeholder="••••••••" value={registerData.password} onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })} required /></div>
                <div className="space-y-1"><Label>I am a</Label><select value={registerData.role} onChange={(e) => setRegisterData({ ...registerData, role: e.target.value })} className="w-full h-10 px-3 border rounded-md outline-none focus:ring-2 focus:ring-red-200 focus:border-red-500 text-sm"><option value="client">Property Buyer / Client</option><option value="agent">Real Estate Agent</option></select></div>
                <Button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold h-11" disabled={loading}>{loading ? 'Creating account...' : 'Create Free Account'}</Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

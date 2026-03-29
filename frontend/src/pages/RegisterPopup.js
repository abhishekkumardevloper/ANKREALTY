import React, { useState, useEffect } from 'react';
import { Building2, X, KeyRound, Sparkles } from 'lucide-react';
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
  const [registerData, setRegisterData] = useState({
    name: '', email: '', password: '', phone: '', role: 'client'
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) return;
    const timer = setTimeout(() => setIsOpen(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(loginData.email.trim(), loginData.password);
      toast.success('Welcome back!');
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
      await register(
        registerData.name.trim(),
        registerData.email.trim(),
        registerData.password,
        registerData.phone.trim(),
        registerData.role
      );
      toast.success('Account created!');
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
      toast.error('Enter valid email');
      return;
    }
    setForgotLoading(true);
    try {
      const res = await apiClient.post('/auth/forgot-password', { email: forgotEmail });
      toast.success(res.data.message);
    } catch {
      toast.error('Error sending reset');
    } finally {
      setForgotLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md p-4">

      <div className="relative w-full max-w-lg rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 bg-white/95 backdrop-blur-xl">

        {/* CLOSE BUTTON */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-white/80 hover:bg-red-100 text-gray-600 hover:text-red-600 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* HEADER */}
        <div className="bg-gradient-to-br from-[#8B0000] to-[#600000] text-white p-8 text-center relative overflow-hidden">

          <div className="absolute top-0 right-0 w-40 h-40 bg-[#D4AF37]/20 blur-3xl rounded-full" />

          <div className="relative z-10">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center border border-[#D4AF37]/40">
              <Building2 className="w-8 h-8 text-[#D4AF37]" />
            </div>

            <h2 className="text-3xl font-black">ANK Realty</h2>
            <p className="text-sm text-white/80 mt-2 flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              Premium Property Experience
            </p>
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-8">

          <Tabs defaultValue="register" className="w-full">

            <TabsList className="grid grid-cols-2 mb-6 bg-slate-100 rounded-xl">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            {/* LOGIN */}
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">

                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={loginData.email}
                    onChange={(e) => {
                      setLoginData({ ...loginData, email: e.target.value });
                      setForgotEmail(e.target.value);
                    }}
                    className="h-12 mt-1"
                    required
                  />
                </div>

                <div>
                  <Label>Password</Label>
                  <Input
                    type="password"
                    value={loginData.password}
                    onChange={(e) =>
                      setLoginData({ ...loginData, password: e.target.value })
                    }
                    className="h-12 mt-1"
                    required
                  />
                </div>

                {/* FORGOT */}
                <div className="bg-slate-50 border rounded-xl p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold mb-2">
                    <KeyRound className="w-4 h-4 text-[#8B0000]" />
                    Forgot password?
                  </div>

                  <Input
                    placeholder="Enter email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="mb-2"
                  />

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleForgotPassword}
                  >
                    {forgotLoading ? 'Sending...' : 'Send Reset Link'}
                  </Button>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-[#8B0000] hover:bg-[#600000] text-white font-bold"
                >
                  {loading ? 'Logging in...' : 'Login'}
                </Button>
              </form>
            </TabsContent>

            {/* REGISTER */}
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">

                <Input
                  placeholder="Full Name"
                  value={registerData.name}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, name: e.target.value })
                  }
                  className="h-12"
                  required
                />

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    placeholder="Email"
                    value={registerData.email}
                    onChange={(e) =>
                      setRegisterData({ ...registerData, email: e.target.value })
                    }
                    required
                  />
                  <Input
                    placeholder="Phone"
                    value={registerData.phone}
                    onChange={(e) =>
                      setRegisterData({ ...registerData, phone: e.target.value })
                    }
                    required
                  />
                </div>

                <Input
                  type="password"
                  placeholder="Password"
                  value={registerData.password}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, password: e.target.value })
                  }
                  className="h-12"
                  required
                />

                <select
                  value={registerData.role}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, role: e.target.value })
                  }
                  className="w-full h-12 px-3 rounded-xl border"
                >
                  <option value="client">Client</option>
                  <option value="agent">Agent</option>
                </select>

                <Button
                  type="submit"
                  className="w-full h-12 bg-[#D4AF37] hover:bg-[#c09b2e] text-black font-bold"
                >
                  {loading ? 'Creating...' : 'Create Account'}
                </Button>

              </form>
            </TabsContent>

          </Tabs>

        </div>
      </div>
    </div>
  );
}

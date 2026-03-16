import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const API_URL = "https://ankrealty.onrender.com/api";

export default function RegisterPopup() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Auto-open after 5 seconds
  useEffect(() => {
    // Agar user pehle se logged in hai, toh popup mat dikhao
    const token = localStorage.getItem("token");
    if (token) return;

    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 5000); // 5000 milliseconds = 5 seconds

    return () => clearTimeout(timer); // Cleanup timer
  }, []);

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    name: "", email: "", password: "", phone: "", role: "user",
  });

  // ================= LOGIN =================
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Login failed");
      
      const token = data.token || data.access_token;
      if (!token) throw new Error("Token not received from server");

      localStorage.setItem("token", token);
      toast.success("Login successful!");
      setIsOpen(false); // Popup close kar do
      window.location.reload(); // Page refresh to update user state

    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ================= REGISTER =================
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Registration failed");

      toast.success("Registration successful! Please login.");
      // Automatically switch to login tab (optional) by keeping modal open
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Agar isOpen false hai, toh kuch mat dikhao
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300 p-4">
      {/* Modal Box */}
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl relative animate-in zoom-in-95 duration-300 overflow-hidden">
        
        {/* Close Button */}
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-red-100 text-gray-500 hover:text-red-600 rounded-full transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Header */}
        <div className="bg-slate-50 p-6 border-b border-slate-100 flex flex-col items-center">
          <div className="bg-red-100 p-3 rounded-full mb-3">
            <Building2 className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">Join ANK Realty</h2>
          <p className="text-sm text-slate-500 mt-1 text-center">
            Find your dream property or start selling today.
          </p>
        </div>

        {/* Form Content */}
        <div className="p-6">
          {/* Default value "register" kar diya taaki pehle register form khule */}
          <Tabs defaultValue="register" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-slate-100">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            {/* LOGIN TAB */}
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1">
                  <Label>Email</Label>
                  <Input type="email" placeholder="you@example.com" value={loginData.email} onChange={(e) => setLoginData({ ...loginData, email: e.target.value })} required />
                </div>
                <div className="space-y-1">
                  <Label>Password</Label>
                  <Input type="password" placeholder="••••••••" value={loginData.password} onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} required />
                </div>
                <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold h-11" disabled={loading}>
                  {loading ? "Logging in..." : "Login to Account"}
                </Button>
              </form>
            </TabsContent>

            {/* REGISTER TAB */}
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-1">
                  <Label>Full Name</Label>
                  <Input type="text" placeholder="John Doe" value={registerData.name} onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })} required />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label>Email</Label>
                    <Input type="email" placeholder="you@email.com" value={registerData.email} onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })} required />
                  </div>
                  <div className="space-y-1">
                    <Label>Phone</Label>
                    <Input type="tel" placeholder="+91..." value={registerData.phone} onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })} required />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label>Password</Label>
                  <Input type="password" placeholder="••••••••" value={registerData.password} onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })} required />
                </div>

                <div className="space-y-1">
                  <Label>I am a</Label>
                  <select 
                    value={registerData.role} 
                    onChange={(e) => setRegisterData({ ...registerData, role: e.target.value })} 
                    className="w-full h-10 px-3 border rounded-md outline-none focus:ring-2 focus:ring-red-200 focus:border-red-500 transition-all text-sm"
                  >
                    <option value="user">Property Buyer / User</option>
                    <option value="agent">Real Estate Agent</option>
                  </select>
                </div>

                <Button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold h-11" disabled={loading}>
                  {loading ? "Creating account..." : "Create Free Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AnnamLogo } from '../components/AnnamLogo';
import { Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, loginAsDemo } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const user = await login(email, password);
      redirectToDashboard(user.role);
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const redirectToDashboard = (role) => {
    switch (role) {
      case 'DONOR': navigate('/donor/dashboard'); break;
      case 'NGO': navigate('/ngo/dashboard'); break;
      case 'VOLUNTEER': navigate('/volunteer/dashboard'); break;
      case 'ADMIN': navigate('/admin/dashboard'); break;
      default: navigate('/');
    }
  };

  const handleDemoLogin = async (role) => {
    setLoading(true);
    try {
      const user = await loginAsDemo(role);
      redirectToDashboard(user.role);
    } catch (err) {
      setError('Demo login failed. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f7f0] bg-annam-doodle flex items-center justify-center p-4 pb-28">
      <div className="w-full max-w-md bg-white rounded-[32px] border border-[#d2e2cc] shadow-xl overflow-hidden">
        
        {/* Top Header */}
        <div className="p-8 text-center bg-[#0d3822] text-white relative">
          <div className="flex justify-center mb-3">
            <div className="w-16 h-16 rounded-full bg-[#fdf8ee] flex items-center justify-center shadow-lg border-2 border-emerald-400/30">
              <svg viewBox="0 0 40 40" className="w-10 h-10 fill-none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 7 C 20 7 24 10 24 14 C 21 14 19 12 20 7 Z" fill="#15803d" />
                <path d="M19 8 C 19 8 16 11 16 14 C 18.5 14.5 19.5 12 19 8 Z" fill="#22c55e" />
                <path d="M20 14 C 27 14 31 19 31 25 C 31 31.5 26 35 20 35 C 14 35 9 31.5 9 25 C 9 19 13 14 20 14 Z" fill="#15803d" />
                <path d="M20 16.5 C 25.5 16.5 28.5 20.5 28.5 25.2 C 28.5 30 24.5 32.8 20 32.8 C 15.5 32.8 11.5 30 11.5 25.2 C 11.5 20.5 14.5 16.5 20 16.5 Z" fill="#fdfbf7" />
                <path d="M20 22 C 22 19.5 25 21 24.5 23.5 C 24 25.5 20 29 20 29 C 20 29 16 25.5 15.5 23.5 C 15 21 18 19.5 20 22 Z" fill="#f59e0b" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white">Annam Login</h2>
          <p className="text-xs text-emerald-200 mt-0.5 uppercase tracking-widest font-semibold">
            Green Family Surplus Food Portal
          </p>
        </div>

        {/* Demo Fast Login Bar */}
        <div className="p-4 bg-[#eaf3e7] border-b border-[#d6e5d1]">
          <div className="text-[11px] font-bold text-[#0f3825] uppercase tracking-wider text-center mb-2">
            ⚡ Quick Demo Sign-In (Evaluation Mode)
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleDemoLogin('DONOR')}
              className="py-2 px-3 bg-white hover:bg-emerald-50 border border-[#cce0c6] rounded-xl font-bold text-[#0f3825] transition shadow-xs text-left flex items-center justify-between"
            >
              <span>🍕 Food Donor</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#15803d]" />
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('NGO')}
              className="py-2 px-3 bg-white hover:bg-emerald-50 border border-[#cce0c6] rounded-xl font-bold text-[#0f3825] transition shadow-xs text-left flex items-center justify-between"
            >
              <span>🏢 NGO Shelter</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#15803d]" />
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('VOLUNTEER')}
              className="py-2 px-3 bg-white hover:bg-amber-50 border border-amber-200 rounded-xl font-bold text-amber-800 transition shadow-xs text-left flex items-center justify-between"
            >
              <span>🛵 Volunteer</span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-600" />
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('ADMIN')}
              className="py-2 px-3 bg-white hover:bg-purple-50 border border-purple-200 rounded-xl font-bold text-purple-800 transition shadow-xs text-left flex items-center justify-between"
            >
              <span>📊 Gov Admin</span>
              <ArrowRight className="w-3.5 h-3.5 text-purple-600" />
            </button>
          </div>
        </div>

        {/* Standard Form */}
        <form onSubmit={handleLogin} className="p-6 sm:p-8 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-[#0f3825] uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-[#f3f7f0] border border-[#d6e5d1] rounded-2xl text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0f3825] focus:bg-white transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0f3825] uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-[#f3f7f0] border border-[#d6e5d1] rounded-2xl text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0f3825] focus:bg-white transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-full bg-[#f29913] hover:bg-[#d97706] active:scale-[0.98] text-[#0a291b] font-black text-sm tracking-wide shadow-md shadow-[#f29913]/30 transition flex items-center justify-center gap-2 mt-2"
          >
            {loading ? 'Authenticating...' : 'Sign In to Annam'}
          </button>

          <div className="text-center pt-2">
            <span className="text-xs text-slate-500">Don't have an account? </span>
            <Link to="/register" className="text-xs font-bold text-[#15803d] hover:underline">
              Create an account
            </Link>
          </div>
        </form>

      </div>
    </div>
  );
};

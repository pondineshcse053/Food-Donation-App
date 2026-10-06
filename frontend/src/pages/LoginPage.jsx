import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HeartHandshake, LogIn, Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';

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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        
        {/* Top Header */}
        <div className="p-8 text-center bg-gradient-to-b from-emerald-50/80 to-white border-b border-slate-100">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-tr from-green-600 to-emerald-500 items-center justify-center text-white shadow-lg shadow-green-600/30 mb-3">
            <HeartHandshake className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">Welcome Back</h2>
          <p className="text-xs text-slate-500 mt-1">
            Access your AI Food Redistribution Portal
          </p>
        </div>

        {/* Demo Fast Login Bar */}
        <div className="p-4 bg-emerald-50/50 border-b border-emerald-100">
          <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider text-center mb-2">
            ⚡ Quick Demo Sign-In (College Project Evaluation)
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleDemoLogin('DONOR')}
              className="py-2 px-3 bg-white hover:bg-emerald-50 border border-emerald-200 rounded-xl font-bold text-emerald-800 transition shadow-xs text-left flex items-center justify-between"
            >
              <span>🍕 Food Donor</span>
              <ArrowRight className="w-3.5 h-3.5 text-emerald-600" />
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('NGO')}
              className="py-2 px-3 bg-white hover:bg-blue-50 border border-blue-200 rounded-xl font-bold text-blue-800 transition shadow-xs text-left flex items-center justify-between"
            >
              <span>🏢 NGO Shelter</span>
              <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
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
        <form onSubmit={handleLogin} className="p-8 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 shadow-md shadow-emerald-600/30 transition text-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : (
              <>
                <LogIn className="w-4 h-4" /> Sign In
              </>
            )}
          </button>

          <div className="text-center pt-2">
            <span className="text-xs text-slate-500">Don't have an account yet? </span>
            <Link to="/register" className="text-xs font-bold text-emerald-600 hover:underline">
              Create New Account
            </Link>
          </div>
        </form>

      </div>
    </div>
  );
};

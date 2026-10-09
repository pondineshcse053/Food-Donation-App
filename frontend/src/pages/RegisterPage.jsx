import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HeartHandshake, UserPlus, Lock, Mail, User, Phone, AlertCircle, Building2, Truck, Gift } from 'lucide-react';

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    role: 'DONOR'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.full_name || !formData.email || !formData.password) {
      setError('Please fill in all mandatory fields.');
      return;
    }

    setLoading(true);
    try {
      const user = await register(formData);
      switch (user.role) {
        case 'DONOR': navigate('/donor/dashboard'); break;
        case 'NGO': navigate('/ngo/dashboard'); break;
        case 'VOLUNTEER': navigate('/volunteer/dashboard'); break;
        default: navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f7f0] bg-annam-doodle flex items-center justify-center p-4 pb-28">
      <div className="w-full max-w-lg bg-white rounded-[32px] border border-[#d2e2cc] shadow-xl overflow-hidden">
        
        {/* Header */}
        <div className="p-7 text-center bg-[#0d3822] text-white">
          <div className="flex justify-center mb-2">
            <div className="w-14 h-14 rounded-full bg-[#fdf8ee] flex items-center justify-center shadow-lg border-2 border-emerald-400/30">
              <svg viewBox="0 0 40 40" className="w-9 h-9 fill-none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 7 C 20 7 24 10 24 14 C 21 14 19 12 20 7 Z" fill="#15803d" />
                <path d="M19 8 C 19 8 16 11 16 14 C 18.5 14.5 19.5 12 19 8 Z" fill="#22c55e" />
                <path d="M20 14 C 27 14 31 19 31 25 C 31 31.5 26 35 20 35 C 14 35 9 31.5 9 25 C 9 19 13 14 20 14 Z" fill="#15803d" />
                <path d="M20 16.5 C 25.5 16.5 28.5 20.5 28.5 25.2 C 28.5 30 24.5 32.8 20 32.8 C 15.5 32.8 11.5 30 11.5 25.2 C 11.5 20.5 14.5 16.5 20 16.5 Z" fill="#fdfbf7" />
                <path d="M20 22 C 22 19.5 25 21 24.5 23.5 C 24 25.5 20 29 20 29 C 20 29 16 25.5 15.5 23.5 C 15 21 18 19.5 20 22 Z" fill="#f59e0b" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white">Join Annam</h2>
          <p className="text-xs text-emerald-200 mt-0.5 font-semibold uppercase tracking-wider">
            Green Family Surplus Food Network
          </p>
        </div>

        <form onSubmit={handleRegister} className="p-6 sm:p-8 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Role Selection Tabs */}
          <div>
            <label className="block text-xs font-bold text-[#0f3825] uppercase tracking-wider mb-2">
              Select Your Role
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'DONOR' })}
                className={`p-3 rounded-2xl border text-center transition flex flex-col items-center gap-1.5 ${
                  formData.role === 'DONOR'
                    ? 'border-[#0f3825] bg-[#eaf3e7] text-[#0f3825] font-black shadow-xs ring-1 ring-[#0f3825]'
                    : 'border-[#d6e5d1] hover:bg-[#f3f7f0] text-slate-600'
                }`}
              >
                <Gift className="w-5 h-5 text-[#15803d]" />
                <span className="text-xs">Food Donor</span>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'NGO' })}
                className={`p-3 rounded-2xl border text-center transition flex flex-col items-center gap-1.5 ${
                  formData.role === 'NGO'
                    ? 'border-[#0f3825] bg-[#eaf3e7] text-[#0f3825] font-black shadow-xs ring-1 ring-[#0f3825]'
                    : 'border-[#d6e5d1] hover:bg-[#f3f7f0] text-slate-600'
                }`}
              >
                <Building2 className="w-5 h-5 text-[#15803d]" />
                <span className="text-xs">NGO Shelter</span>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'VOLUNTEER' })}
                className={`p-3 rounded-2xl border text-center transition flex flex-col items-center gap-1.5 ${
                  formData.role === 'VOLUNTEER'
                    ? 'border-[#0f3825] bg-[#eaf3e7] text-[#0f3825] font-black shadow-xs ring-1 ring-[#0f3825]'
                    : 'border-[#d6e5d1] hover:bg-[#f3f7f0] text-slate-600'
                }`}
              >
                <Truck className="w-5 h-5 text-[#f59e0b]" />
                <span className="text-xs">Volunteer</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0f3825] uppercase tracking-wider mb-1.5">
              Full Name / Organization Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                name="full_name"
                required
                value={formData.full_name}
                onChange={handleChange}
                placeholder="e.g. Grand Banquet Hall / Hope Foundation"
                className="w-full pl-10 pr-4 py-2.5 bg-[#f3f7f0] border border-[#d6e5d1] rounded-2xl text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0f3825] focus:bg-white transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0f3825] uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="email@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-[#f3f7f0] border border-[#d6e5d1] rounded-2xl text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0f3825] focus:bg-white transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0f3825] uppercase tracking-wider mb-1.5">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
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
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
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
            {loading ? 'Creating Account...' : 'Complete Registration'}
          </button>

          <div className="text-center pt-2">
            <span className="text-xs text-slate-500">Already registered? </span>
            <Link to="/login" className="text-xs font-bold text-[#15803d] hover:underline">
              Sign In
            </Link>
          </div>
        </form>

      </div>
    </div>
  );
};

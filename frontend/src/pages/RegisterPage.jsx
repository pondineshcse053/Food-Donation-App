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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        
        {/* Header */}
        <div className="p-6 text-center bg-gradient-to-b from-emerald-50/80 to-white border-b border-slate-100">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-green-600 to-emerald-500 items-center justify-center text-white shadow-md shadow-green-600/30 mb-2">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">Create an Account</h2>
          <p className="text-xs text-slate-500 mt-1">
            Join the automated hunger-relief and redistribution network
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
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Select Your Role
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'DONOR' })}
                className={`p-3 rounded-xl border text-center transition flex flex-col items-center gap-1.5 ${
                  formData.role === 'DONOR'
                    ? 'border-emerald-500 bg-emerald-50/80 text-emerald-800 font-bold shadow-xs'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                <Gift className="w-5 h-5 text-emerald-600" />
                <span className="text-xs">Food Donor</span>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'NGO' })}
                className={`p-3 rounded-xl border text-center transition flex flex-col items-center gap-1.5 ${
                  formData.role === 'NGO'
                    ? 'border-blue-500 bg-blue-50/80 text-blue-800 font-bold shadow-xs'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                <Building2 className="w-5 h-5 text-blue-600" />
                <span className="text-xs">NGO / Shelter</span>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'VOLUNTEER' })}
                className={`p-3 rounded-xl border text-center transition flex flex-col items-center gap-1.5 ${
                  formData.role === 'VOLUNTEER'
                    ? 'border-amber-500 bg-amber-50/80 text-amber-800 font-bold shadow-xs'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                <Truck className="w-5 h-5 text-amber-600" />
                <span className="text-xs">Volunteer</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Full Name or Organization Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                name="full_name"
                required
                value={formData.full_name}
                onChange={handleChange}
                placeholder="e.g. Grand Catering / ABC Community Trust"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="contact@domain.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98401 12345"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Create Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimum 6 characters"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 shadow-md shadow-emerald-600/30 transition text-sm flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            {loading ? 'Creating Profile...' : (
              <>
                <UserPlus className="w-4 h-4" /> Complete Registration
              </>
            )}
          </button>

          <div className="text-center pt-2">
            <span className="text-xs text-slate-500">Already registered? </span>
            <Link to="/login" className="text-xs font-bold text-emerald-600 hover:underline">
              Sign In Instead
            </Link>
          </div>
        </form>

      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { adminService } from '../services/api';
import { 
  Award, 
  Leaf, 
  Users, 
  Soup, 
  Building2, 
  Truck, 
  TrendingUp, 
  HeartHandshake,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export const ImpactDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await adminService.getStatistics();
      setStats(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const summary = stats?.summary || {
    food_rescued_kg: 696,
    meals_served: 2190,
    people_benefited: 1970,
    completed_donations: 10,
    total_ngos: 5,
    total_volunteers: 8,
    co2_saved_kg: 1740
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Hero Banner */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-emerald-800 via-teal-700 to-green-800 text-white shadow-xl text-center relative overflow-hidden">
        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold backdrop-blur-md mb-3">
            <Award className="w-4 h-4 text-emerald-300" /> Transparent Real-World Social Impact
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            Our Collective Ecological & Humanitarian Impact
          </h1>
          <p className="text-emerald-100 text-sm mt-2">
            Every kilogram of surplus food saved represents meals served to the needy and methane emissions eliminated from our atmosphere.
          </p>
        </div>
      </div>

      {/* Main Impact Metrics (Section 20) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        
        <div className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-xs text-center space-y-1">
          <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto mb-2">
            <Leaf className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold text-slate-400 uppercase block">Food Rescued</span>
          <span className="text-2xl font-black text-slate-900">{summary.food_rescued_kg} kg</span>
        </div>

        <div className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-xs text-center space-y-1">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-2">
            <Soup className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold text-slate-400 uppercase block">Meals Served</span>
          <span className="text-2xl font-black text-emerald-600">{summary.meals_served}</span>
        </div>

        <div className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-xs text-center space-y-1">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-2">
            <Users className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold text-slate-400 uppercase block">People Benefited</span>
          <span className="text-2xl font-black text-purple-600">{summary.people_benefited}</span>
        </div>

        <div className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-xs text-center space-y-1">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-2">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold text-slate-400 uppercase block">Batches Completed</span>
          <span className="text-2xl font-black text-blue-600">{summary.completed_donations}</span>
        </div>

        <div className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-xs text-center space-y-1">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-2">
            <Building2 className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold text-slate-400 uppercase block">Active NGOs</span>
          <span className="text-2xl font-black text-indigo-600">{summary.total_ngos}</span>
        </div>

        <div className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-xs text-center space-y-1">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-2">
            <Truck className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold text-slate-400 uppercase block">Volunteers</span>
          <span className="text-2xl font-black text-amber-600">{summary.total_volunteers}</span>
        </div>

      </div>

      {/* Visual Impact Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Cumulative Food Rescued */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Food Rescued This Month & Historical Growth</h3>
              <p className="text-xs text-slate-400">Kilograms of rescued food over time</p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800">
              +{summary.co2_saved_kg} kg CO2e Avoided
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.monthly_trends || []}>
                <defs>
                  <linearGradient id="rescuedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip />
                <Area type="monotone" dataKey="rescued_kg" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#rescuedGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Beneficiaries Reached */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">People Benefited Per Month</h3>
              <p className="text-xs text-slate-400">Direct meals delivered to families and night shelters</p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-black bg-purple-100 text-purple-800">
              Zero Food Landfill
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.monthly_trends || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip />
                <Bar dataKey="people" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};

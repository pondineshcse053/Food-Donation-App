import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { donationService } from '../services/api';
import { 
  Gift, 
  PackageCheck, 
  Clock, 
  Scale, 
  Plus, 
  MapPin, 
  ArrowRight, 
  BrainCircuit, 
  Search, 
  ChevronRight,
  TrendingUp,
  Sparkles
} from 'lucide-react';

export const DonorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    fetchMyDonations();
  }, []);

  const fetchMyDonations = async () => {
    try {
      const res = await donationService.getAll({ donor_id: user?.id });
      setDonations(res.data);
    } catch (err) {
      console.error("Error fetching donor donations:", err);
    } finally {
      setLoading(false);
    }
  };

  const totalDonations = donations.length;
  const activeDonations = donations.filter(d => !['COMPLETED', 'CANCELLED'].includes(d.status)).length;
  const completedDonations = donations.filter(d => d.status === 'COMPLETED').length;
  const foodRescuedKg = donations.reduce((sum, d) => sum + (d.quantity || 0), 0);

  const filteredDonations = donations.filter(d => {
    if (filter === 'ACTIVE') return !['COMPLETED', 'CANCELLED'].includes(d.status);
    if (filter === 'COMPLETED') return d.status === 'COMPLETED';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-[32px] bg-[#0d3822] text-white shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-6 border border-[#1b4e33]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#f59e0b]" /> Annam Donor Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Welcome, {user?.full_name || 'Donor'}
          </h1>
          <p className="text-emerald-100/90 text-xs sm:text-sm mt-1 max-w-xl">
            Green Family surplus food redistribution dashboard. Every leftover plate can become someone's dinner.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            to="/donor/donate"
            className="px-6 py-3.5 rounded-full font-black bg-[#f29913] hover:bg-[#d97706] text-[#0a291b] transition shadow-lg shadow-[#f29913]/30 flex items-center gap-2 text-xs sm:text-sm"
          >
            <Plus className="w-4 h-4 stroke-[3]" /> Post New Donation
          </Link>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Total Donations */}
        <div className="p-5 sm:p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Gift className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Donations</span>
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{totalDonations}</span>
          </div>
        </div>

        {/* Active Donations */}
        <div className="p-5 sm:p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Active Donations</span>
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{activeDonations}</span>
          </div>
        </div>

        {/* Completed Donations */}
        <div className="p-5 sm:p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <PackageCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Completed</span>
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{completedDonations}</span>
          </div>
        </div>

        {/* Food Rescued */}
        <div className="p-5 sm:p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Food Rescued</span>
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{foodRescuedKg} kg</span>
          </div>
        </div>

      </div>

      {/* Donations List & Management */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        
        {/* Table Header / Filters */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="font-extrabold text-lg text-slate-900">My Donation Listings</h3>
            <p className="text-xs text-slate-500 mt-0.5">Real-time status tracking and AI priority evaluations</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${filter === 'ALL' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              All ({totalDonations})
            </button>
            <button
              onClick={() => setFilter('ACTIVE')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${filter === 'ACTIVE' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              Active ({activeDonations})
            </button>
            <button
              onClick={() => setFilter('COMPLETED')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${filter === 'COMPLETED' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              Completed ({completedDonations})
            </button>
          </div>
        </div>

        {/* Content Table */}
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            Loading donation records...
          </div>
        ) : filteredDonations.length === 0 ? (
          <div className="p-12 text-center">
            <Gift className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="text-base font-bold text-slate-800">No donations found</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Ready to reduce hunger in your area? Submit your first surplus food listing.
            </p>
            <Link
              to="/donor/donate"
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition"
            >
              <Plus className="w-3.5 h-3.5" /> Create Donation
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">Donation ID & Food</th>
                  <th className="py-3.5 px-4">Quantity</th>
                  <th className="py-3.5 px-4">AI Priority</th>
                  <th className="py-3.5 px-4">Current Status</th>
                  <th className="py-3.5 px-4">Assigned Partner</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDonations.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50/70 transition">
                    
                    {/* ID & Food Name */}
                    <td className="py-4 px-4 sm:px-6">
                      <div className="font-mono font-bold text-slate-900">{d.donation_code}</div>
                      <div className="font-semibold text-slate-700 mt-0.5">{d.food_name}</div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" /> {d.pickup_address}
                      </div>
                    </td>

                    {/* Quantity */}
                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-800">{d.number_of_packets} Packets</div>
                      <div className="text-[11px] text-slate-400">{d.quantity} kg • {d.food_type}</div>
                    </td>

                    {/* AI Priority */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          d.priority === 'URGENT' ? 'bg-rose-100 text-rose-700 border border-rose-200' :
                          d.priority === 'HIGH' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                          d.priority === 'MEDIUM' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {d.priority}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400">
                          {d.priority_score?.toFixed(0)}/100
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-1 max-w-[180px] truncate" title={d.priority_reason}>
                        {d.priority_reason}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        d.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' :
                        d.status === 'ON_THE_WAY' ? 'bg-purple-100 text-purple-800 animate-pulse' :
                        d.status === 'PICKED_UP' ? 'bg-indigo-100 text-indigo-800' :
                        d.status === 'VOLUNTEER_ASSIGNED' ? 'bg-amber-100 text-amber-800' :
                        d.status === 'NGO_ACCEPTED' ? 'bg-blue-100 text-blue-800' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {d.status.replace(/_/g, ' ')}
                      </span>
                    </td>

                    {/* Partner */}
                    <td className="py-4 px-4">
                      {d.ngo ? (
                        <div className="font-semibold text-slate-800">{d.ngo.name}</div>
                      ) : (
                        <span className="text-slate-400 italic">Finding NGO...</span>
                      )}
                      {d.volunteer && (
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          Vol: {d.volunteer.name}
                        </div>
                      )}
                    </td>

                    {/* Action */}
                    <td className="py-4 px-4 sm:px-6 text-right">
                      <Link
                        to={`/track/${d.donation_code}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition"
                      >
                        Track <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

    </div>
  );
};

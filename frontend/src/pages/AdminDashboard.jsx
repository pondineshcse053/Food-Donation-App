import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { adminService, donationService, ngoService, volunteerService } from '../services/api';
import { 
  Users, 
  Gift, 
  Building2, 
  Truck, 
  Scale, 
  Heart, 
  ShieldCheck, 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  Plus, 
  ArrowUpRight,
  Sparkles,
  BarChart3,
  Calendar
} from 'lucide-react';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4'];

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('ANALYTICS'); // 'ANALYTICS' | 'USERS' | 'DONATIONS' | 'NGOS' | 'VOLUNTEERS'
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [donations, setDonations] = useState([]);
  const [ngos, setNgos] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('');
  const [donationStatusFilter, setDonationStatusFilter] = useState('');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, donationsRes, ngosRes, volRes] = await Promise.all([
        adminService.getStatistics(),
        adminService.getUsers(),
        donationService.getAll(),
        ngoService.getAll(),
        volunteerService.getAll(),
      ]);

      setStats(statsRes.data);
      setUsers(usersRes.data);
      setDonations(donationsRes.data);
      setNgos(ngosRes.data);
      setVolunteers(volRes.data);
    } catch (err) {
      console.error("Failed to load admin stats:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUserStatus = async (userId) => {
    try {
      await adminService.toggleUserStatus(userId);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, is_active: !u.is_active } : u));
    } catch (err) {
      console.error(err);
      alert('Failed to change user status.');
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesRole = !userRoleFilter || u.role === userRoleFilter;
    const matchesSearch = !userSearch || 
      u.full_name?.toLowerCase().includes(userSearch.toLowerCase()) || 
      u.email?.toLowerCase().includes(userSearch.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const filteredDonations = donations.filter(d => {
    return !donationStatusFilter || d.status === donationStatusFilter;
  });

  const summary = stats?.summary || {
    total_users: 19,
    total_donors: 5,
    total_ngos: 5,
    total_volunteers: 8,
    total_donations: 20,
    completed_donations: 10,
    food_rescued_kg: 696,
    people_benefited: 1970
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold backdrop-blur-md mb-2 border border-indigo-500/30">
            <ShieldCheck className="w-3.5 h-3.5" /> State Redistribution Authority Oversight
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Central Administration Command
          </h1>
          <p className="text-slate-400 text-sm mt-1 max-w-xl">
            Real-time multi-agency monitoring, user verification, compliance audits, and food waste telemetry.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap gap-1.5 bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700/80">
          <button
            onClick={() => setActiveTab('ANALYTICS')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${activeTab === 'ANALYTICS' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'}`}
          >
            Analytics & Charts
          </button>
          <button
            onClick={() => setActiveTab('USERS')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${activeTab === 'USERS' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'}`}
          >
            Users ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('DONATIONS')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${activeTab === 'DONATIONS' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'}`}
          >
            Donations ({donations.length})
          </button>
          <button
            onClick={() => setActiveTab('NGOS')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${activeTab === 'NGOS' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'}`}
          >
            NGOs ({ngos.length})
          </button>
          <button
            onClick={() => setActiveTab('VOLUNTEERS')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${activeTab === 'VOLUNTEERS' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'}`}
          >
            Volunteers ({volunteers.length})
          </button>
        </div>
      </div>

      {/* KPI Cards (Section 15) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Users</span>
          <span className="text-xl font-extrabold text-slate-900">{summary.total_users}</span>
        </div>
        <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Donors</span>
          <span className="text-xl font-extrabold text-emerald-600">{summary.total_donors}</span>
        </div>
        <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Active NGOs</span>
          <span className="text-xl font-extrabold text-blue-600">{summary.total_ngos}</span>
        </div>
        <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Volunteers</span>
          <span className="text-xl font-extrabold text-amber-600">{summary.total_volunteers}</span>
        </div>
        <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Donations</span>
          <span className="text-xl font-extrabold text-slate-900">{summary.total_donations}</span>
        </div>
        <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Completed</span>
          <span className="text-xl font-extrabold text-emerald-600">{summary.completed_donations}</span>
        </div>
        <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Food Rescued</span>
          <span className="text-xl font-extrabold text-teal-600">{summary.food_rescued_kg} kg</span>
        </div>
        <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">People Benefited</span>
          <span className="text-xl font-extrabold text-purple-600">{summary.people_benefited}</span>
        </div>
      </div>

      {/* Tab 1: Analytics & Recharts (Section 15) */}
      {activeTab === 'ANALYTICS' && (
        <div className="space-y-6">
          
          {/* Charts Row 1: Monthly Trends & Rescued Food */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Chart 1: Monthly Donations */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">1. Monthly Donations Trend</h3>
                  <p className="text-xs text-slate-400">Total surplus listings processed monthly</p>
                </div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  +18% MoM
                </span>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stats?.monthly_trends || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip />
                    <Line type="monotone" dataKey="donations" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Food Rescued Per Month */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">2. Food Rescued Per Month (kg)</h3>
                  <p className="text-xs text-slate-400">Weight of edible meals diverted from landfills</p>
                </div>
                <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">
                  Net Biomass Saved
                </span>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats?.monthly_trends || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip />
                    <Bar dataKey="rescued_kg" fill="#0d9488" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Charts Row 2: Donations by Food Type & NGO Performance */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Chart 3: Donations By Food Type */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4 lg:col-span-1">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">3. Donations By Food Type</h3>
                <p className="text-xs text-slate-400">Category breakdown</p>
              </div>
              <div className="h-60 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats?.donations_by_food_type || []}
                      dataKey="count"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={75}
                      label
                    >
                      {(stats?.donations_by_food_type || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 4: NGO Performance */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4 lg:col-span-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">4. NGO Capacity & Distribution Efficiency</h3>
                  <p className="text-xs text-slate-400">Accepted vs Completed fulfillments</p>
                </div>
              </div>
              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats?.ngo_performance || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickFormatter={(t) => t.substring(0, 10) + '..'} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="accepted_count" name="Accepted" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="completed_count" name="Completed" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Chart 5: Area-wise Donations Table & Hotspots */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">5. Area-Wise Food Demand & Redistribution Heatmap</h3>
              <p className="text-xs text-slate-400">Green = Surplus Hotspot, Yellow = Balanced, Red = Critical Need Zone</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {(stats?.area_donations || []).map((area, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border text-xs ${
                    area.status === 'GREEN' ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950' :
                    area.status === 'YELLOW' ? 'bg-amber-50/70 border-amber-200 text-amber-950' :
                    'bg-rose-50/70 border-rose-200 text-rose-950'
                  }`}
                >
                  <span className="font-extrabold block text-sm">{area.area}</span>
                  <div className="mt-1">Donations: <strong>{area.donations} batches</strong></div>
                  <div className="mt-0.5">Need Level: <strong>{area.demand_level}</strong></div>
                  <span className={`inline-block mt-2 px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                    area.status === 'GREEN' ? 'bg-emerald-200 text-emerald-900' :
                    area.status === 'YELLOW' ? 'bg-amber-200 text-amber-900' :
                    'bg-rose-200 text-rose-900'
                  }`}>
                    {area.status} ZONE
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Tab 2: User Management (Section 16) */}
      {activeTab === 'USERS' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="font-extrabold text-lg text-slate-900">User Governance & Verification</h3>
              <p className="text-xs text-slate-400 mt-0.5">Manage donors, NGOs, volunteers and administrative credentials</p>
            </div>

            {/* Search & Role Filter */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Search user name or email..."
                  className="pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <select
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value)}
                className="py-1.5 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
              >
                <option value="">All Roles</option>
                <option value="DONOR">Donor</option>
                <option value="NGO">NGO</option>
                <option value="VOLUNTEER">Volunteer</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{u.full_name}</div>
                      <div className="text-[11px] text-slate-400">{u.email}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                        u.role === 'NGO' ? 'bg-blue-100 text-blue-700' :
                        u.role === 'VOLUNTEER' ? 'bg-amber-100 text-amber-700' :
                        'bg-emerald-100 text-emerald-700'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">{u.phone || 'N/A'}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        u.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {u.is_active ? 'Active' : 'Deactivated'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {u.role !== 'ADMIN' && (
                        <button
                          onClick={() => handleToggleUserStatus(u.id)}
                          className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                            u.is_active
                              ? 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          }`}
                        >
                          {u.is_active ? 'Deactivate' : 'Activate'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Donation Management (Section 17) */}
      {activeTab === 'DONATIONS' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="font-extrabold text-lg text-slate-900">All Master Donation Records</h3>
              <p className="text-xs text-slate-400 mt-0.5">Audit end-to-end chain of custody</p>
            </div>

            <select
              value={donationStatusFilter}
              onChange={(e) => setDonationStatusFilter(e.target.value)}
              className="py-1.5 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
            >
              <option value="">All Statuses</option>
              <option value="CREATED">Created</option>
              <option value="NGO_ACCEPTED">NGO Accepted</option>
              <option value="VOLUNTEER_ASSIGNED">Volunteer Assigned</option>
              <option value="PICKED_UP">Picked Up</option>
              <option value="ON_THE_WAY">On The Way</option>
              <option value="DELIVERED">Delivered</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Code</th>
                  <th className="py-3 px-4">Donor</th>
                  <th className="py-3 px-4">Food & Packets</th>
                  <th className="py-3 px-4">NGO</th>
                  <th className="py-3 px-4">Volunteer</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Track</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDonations.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{d.donation_code}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{d.donor_name}</td>
                    <td className="py-3 px-4">
                      <strong>{d.food_name}</strong>
                      <div className="text-[10px] text-slate-400">{d.number_of_packets} pkts • {d.quantity} kg</div>
                    </td>
                    <td className="py-3 px-4 text-blue-700">{d.ngo ? d.ngo.name : '—'}</td>
                    <td className="py-3 px-4 text-amber-700">{d.volunteer ? d.volunteer.name : '—'}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        d.priority === 'URGENT' ? 'bg-rose-100 text-rose-700' :
                        d.priority === 'HIGH' ? 'bg-amber-100 text-amber-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {d.priority}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        d.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {d.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <a href={`/track/${d.donation_code}`} className="text-indigo-600 font-bold hover:underline">
                        View
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: NGO Management (Section 18) */}
      {activeTab === 'NGOS' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-lg text-slate-900">Certified NGO Redistribution Centers</h3>
              <p className="text-xs text-slate-400 mt-0.5">Verified food shelters and community relief hubs</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ngos.map((ngo) => (
              <div key={ngo.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-slate-900">{ngo.name}</h4>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                    Cap: {ngo.capacity} pkts
                  </span>
                </div>
                <div className="text-xs text-slate-600">Contact: {ngo.contact_person} ({ngo.phone})</div>
                <div className="text-xs text-slate-500">{ngo.address}</div>
                <div className="text-[11px] text-emerald-700 bg-emerald-50 p-2 rounded-lg mt-2">
                  Demanded foods: {ngo.food_requirements}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Volunteer Management (Section 19) */}
      {activeTab === 'VOLUNTEERS' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-4">
          <div>
            <h3 className="font-extrabold text-lg text-slate-900">Registered Delivery Volunteers</h3>
            <p className="text-xs text-slate-400 mt-0.5">Rapid logistics fleet with vehicle types and availability</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {volunteers.map((vol) => (
              <div key={vol.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-slate-900">{vol.name}</h4>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    vol.availability === 'AVAILABLE' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {vol.availability}
                  </span>
                </div>
                <div className="text-xs text-slate-600">Phone: {vol.phone}</div>
                <div className="text-xs text-slate-500">Vehicle: {vol.vehicle_type}</div>
                <div className="text-xs font-bold text-indigo-700 pt-1">
                  Deliveries Done: {vol.completed_deliveries}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

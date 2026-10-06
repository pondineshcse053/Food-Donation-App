import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { donationService, ngoService } from '../services/api';
import { 
  Building2, 
  Package, 
  CheckCircle, 
  Users, 
  MapPin, 
  Clock, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle,
  Truck,
  Sparkles
} from 'lucide-react';

export const NgoDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [availableDonations, setAvailableDonations] = useState([]);
  const [myDonations, setMyDonations] = useState([]);
  const [activeTab, setActiveTab] = useState('AVAILABLE'); // 'AVAILABLE' | 'ACCEPTED' | 'DELIVERIES'
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch available donations (status: CREATED)
      const availRes = await donationService.getAll({ status: 'CREATED' });
      setAvailableDonations(availRes.data);

      // 2. Fetch donations associated with this NGO or all non-created
      const allRes = await donationService.getAll({});
      const accepted = allRes.data.filter(d => d.status !== 'CREATED');
      setMyDonations(accepted);
    } catch (err) {
      console.error("Failed to load NGO dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptDonation = async (donationId) => {
    setActionLoading(donationId);
    try {
      await donationService.updateStatus(donationId, {
        status: 'NGO_ACCEPTED',
        notes: `Accepted by ${user.full_name}`
      });
      await fetchData();
      setActiveTab('ACCEPTED');
    } catch (err) {
      console.error(err);
      alert('Failed to accept donation. Check server connection.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleConfirmReceipt = async (donationId) => {
    setActionLoading(donationId);
    try {
      await donationService.updateStatus(donationId, {
        status: 'COMPLETED',
        notes: `Delivery verified and accepted by ${user.full_name}. Food redistributed.`
      });
      await fetchData();
    } catch (err) {
      console.error(err);
      alert('Failed to confirm receipt.');
    } finally {
      setActionLoading(null);
    }
  };

  const totalAvailable = availableDonations.length;
  const acceptedCount = myDonations.filter(d => ['NGO_ACCEPTED', 'VOLUNTEER_ASSIGNED', 'PICKED_UP', 'ON_THE_WAY', 'DELIVERED'].includes(d.status)).length;
  const completedCount = myDonations.filter(d => d.status === 'COMPLETED').length;
  const peopleServed = myDonations.reduce((sum, d) => sum + (d.number_of_packets ? d.number_of_packets * 2 : 50), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-600 to-sky-700 text-white shadow-lg flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-md mb-2">
            <Building2 className="w-3.5 h-3.5" /> Certified Relief Distribution Hub
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {user?.full_name}
          </h1>
          <p className="text-blue-100 text-sm mt-1 max-w-xl">
            Review live inbound surplus food offers, claim donations matching shelter demand, and confirm final deliveries.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('AVAILABLE')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition ${activeTab === 'AVAILABLE' ? 'bg-white text-blue-900 shadow-sm' : 'bg-white/20 text-white hover:bg-white/30'}`}
          >
            Available ({totalAvailable})
          </button>
          <button
            onClick={() => setActiveTab('ACCEPTED')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition ${activeTab === 'ACCEPTED' ? 'bg-white text-blue-900 shadow-sm' : 'bg-white/20 text-white hover:bg-white/30'}`}
          >
            My Active Orders ({acceptedCount})
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 sm:p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Available Donations</span>
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{totalAvailable}</span>
          </div>
        </div>

        <div className="p-5 sm:p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Accepted Batches</span>
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{acceptedCount}</span>
          </div>
        </div>

        <div className="p-5 sm:p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Received & Completed</span>
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{completedCount}</span>
          </div>
        </div>

        <div className="p-5 sm:p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">People Served</span>
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{peopleServed}</span>
          </div>
        </div>
      </div>

      {/* Main Content Sections */}
      {activeTab === 'AVAILABLE' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-4">
          <div>
            <h3 className="font-extrabold text-lg text-slate-900">Available Surplus Donations Nearby</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Review food items posted by local banquet halls, caterers, and canteens.
            </p>
          </div>

          {availableDonations.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-sm">
              No new unassigned donations at the moment. All active food batches have been routed.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableDonations.map((d) => (
                <div
                  key={d.id}
                  className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-blue-300 transition space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-mono text-[11px] font-bold text-slate-400">{d.donation_code}</span>
                      <h4 className="font-bold text-base text-slate-900">{d.food_name}</h4>
                      <div className="text-xs text-slate-500 mt-0.5">Donor: <strong>{d.donor_name}</strong></div>
                    </div>

                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      d.priority === 'URGENT' ? 'bg-rose-100 text-rose-700' :
                      d.priority === 'HIGH' ? 'bg-amber-100 text-amber-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {d.priority} Priority
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Quantity</span>
                      <strong className="text-slate-800">{d.number_of_packets} Packets</strong> ({d.quantity} kg)
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Available Until</span>
                      <strong className="text-rose-600">{d.available_until}</strong>
                    </div>
                  </div>

                  <div className="text-xs text-slate-500 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{d.pickup_address}</span>
                  </div>

                  {d.priority_reason && (
                    <div className="text-[11px] text-purple-700 bg-purple-50 p-2 rounded-lg">
                      AI Note: {d.priority_reason}
                    </div>
                  )}

                  <div className="pt-2 flex items-center justify-between gap-2">
                    <Link
                      to={`/track/${d.donation_code}`}
                      className="text-xs font-bold text-slate-500 hover:text-slate-800"
                    >
                      View Details
                    </Link>

                    <button
                      onClick={() => handleAcceptDonation(d.id)}
                      disabled={actionLoading === d.id}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition shadow-sm disabled:opacity-50"
                    >
                      {actionLoading === d.id ? 'Accepting...' : 'Accept Donation'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* My Active / Claimed Donations Tab */}
      {activeTab === 'ACCEPTED' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-4">
          <div>
            <h3 className="font-extrabold text-lg text-slate-900">Assigned Inbound Shipments</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Confirm receipt when volunteer drops off the food packages at your center.
            </p>
          </div>

          <div className="divide-y divide-slate-100">
            {myDonations.map((d) => (
              <div key={d.id} className="py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-800">{d.donation_code}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      d.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' :
                      d.status === 'DELIVERED' ? 'bg-rose-100 text-rose-800 animate-pulse font-extrabold' :
                      d.status === 'ON_THE_WAY' ? 'bg-purple-100 text-purple-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {d.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="font-bold text-sm text-slate-900">{d.food_name} • {d.number_of_packets} Packets</div>
                  <div className="text-xs text-slate-500">
                    Donor: {d.donor_name} {d.volunteer ? `• Volunteer: ${d.volunteer.name}` : ''}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to={`/track/${d.donation_code}`}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
                  >
                    Track Status
                  </Link>

                  {d.status === 'DELIVERED' && (
                    <button
                      onClick={() => handleConfirmReceipt(d.id)}
                      disabled={actionLoading === d.id}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition disabled:opacity-50"
                    >
                      {actionLoading === d.id ? 'Confirming...' : 'Confirm Receipt'}
                    </button>
                  )}

                  {d.status === 'COMPLETED' && (
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" /> Received & Served
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { donationService, trackingService } from '../services/api';
import { 
  Truck, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  Navigation, 
  ArrowRight, 
  AlertCircle,
  PackageCheck,
  Bike
} from 'lucide-react';

export const VolunteerDashboard = () => {
  const { user } = useAuth();

  const [availablePickups, setAvailablePickups] = useState([]);
  const [activeDeliveries, setActiveDeliveries] = useState([]);
  const [completedDeliveries, setCompletedDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchPickups();
  }, []);

  const fetchPickups = async () => {
    setLoading(true);
    try {
      const allRes = await donationService.getAll({});
      const all = allRes.data;

      // Available pickups: donations that have been accepted by NGO, but have no volunteer assigned yet
      const avail = all.filter(d => d.status === 'NGO_ACCEPTED' && !d.volunteer_id);
      setAvailablePickups(avail);

      // Active deliveries: assigned to volunteer, picked up, or on the way
      const active = all.filter(d => ['VOLUNTEER_ASSIGNED', 'PICKED_UP', 'ON_THE_WAY'].includes(d.status));
      setActiveDeliveries(active);

      // Completed / Delivered
      const done = all.filter(d => ['DELIVERED', 'COMPLETED'].includes(d.status));
      setCompletedDeliveries(done);
    } catch (err) {
      console.error("Failed to load volunteer tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptPickup = async (donationId) => {
    setActionLoading(donationId);
    try {
      await donationService.updateStatus(donationId, {
        status: 'VOLUNTEER_ASSIGNED',
        notes: `Accepted pickup by volunteer ${user.full_name}`
      });
      await fetchPickups();
    } catch (err) {
      console.error(err);
      alert('Failed to accept pickup.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleUpdateStatus = async (donationId, newStatus) => {
    setActionLoading(donationId);
    try {
      await donationService.updateStatus(donationId, {
        status: newStatus,
        notes: `Volunteer updated stage to ${newStatus}`
      });
      await fetchPickups();
    } catch (err) {
      console.error(err);
      alert(`Failed to update status to ${newStatus}`);
    } finally {
      setActionLoading(null);
    }
  };

  const distanceTravelledKm = (completedDeliveries.length * 6.5) + (activeDeliveries.length * 2.8);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-[32px] bg-[#0d3822] text-white shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-6 border border-[#1b4e33]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Truck className="w-3.5 h-3.5 text-[#f59e0b]" /> Annam Green Family Logistics
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Volunteer: {user?.full_name || 'Karthik Raja'}
          </h1>
          <p className="text-emerald-100/90 text-xs sm:text-sm mt-1 max-w-xl">
            Pick up surplus meal containers from banquet halls and deliver directly to partner shelters before expiry.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white/10 px-4 py-2.5 rounded-2xl backdrop-blur-md border border-white/20">
          <Bike className="w-5 h-5 text-[#f59e0b]" />
          <div className="text-xs">
            <span className="text-emerald-200 block">Vehicle Status:</span>
            <span className="font-bold text-white">Active on Road</span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 sm:p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Available Pickups</span>
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{availablePickups.length}</span>
          </div>
        </div>

        <div className="p-5 sm:p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Navigation className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Active In-Transit</span>
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{activeDeliveries.length}</span>
          </div>
        </div>

        <div className="p-5 sm:p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Completed Deliveries</span>
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{completedDeliveries.length}</span>
          </div>
        </div>

        <div className="p-5 sm:p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Distance Logged</span>
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{distanceTravelledKm.toFixed(1)} km</span>
          </div>
        </div>
      </div>

      {/* Active Transit Assignments */}
      {activeDeliveries.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Navigation className="w-5 h-5 text-amber-600 animate-bounce" />
            <h3 className="font-extrabold text-lg text-slate-900">Active Pickup & Delivery in Progress</h3>
          </div>

          <div className="space-y-4">
            {activeDeliveries.map((d) => (
              <div key={d.id} className="p-5 rounded-2xl border-2 border-amber-300 bg-amber-50/30 space-y-4">
                
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="font-mono text-xs font-bold text-amber-900">{d.donation_code}</span>
                    <h4 className="font-extrabold text-base text-slate-900 mt-0.5">{d.food_name} ({d.number_of_packets} Packets)</h4>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-amber-200 text-amber-900">
                    Status: {d.status.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-white p-3.5 rounded-xl border border-amber-100">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">1. Pickup Location</span>
                    <span className="font-semibold text-slate-800">{d.donor_name}</span>
                    <div className="text-slate-500 mt-0.5">{d.pickup_address}</div>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">2. Delivery Shelter</span>
                    <span className="font-semibold text-blue-700">{d.ngo ? d.ngo.name : 'Target NGO'}</span>
                    <div className="text-slate-500 mt-0.5">{d.ngo ? d.ngo.address : 'Redistribution Hub'}</div>
                  </div>
                </div>

                {/* Logistics Controls */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <Link
                    to={`/track/${d.donation_code}`}
                    className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1"
                  >
                    Open Live GPS Map <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <div className="flex items-center gap-2">
                    {d.status === 'VOLUNTEER_ASSIGNED' && (
                      <button
                        onClick={() => handleUpdateStatus(d.id, 'PICKED_UP')}
                        disabled={actionLoading === d.id}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition disabled:opacity-50"
                      >
                        {actionLoading === d.id ? 'Updating...' : 'Mark as Picked Up'}
                      </button>
                    )}

                    {d.status === 'PICKED_UP' && (
                      <button
                        onClick={() => handleUpdateStatus(d.id, 'ON_THE_WAY')}
                        disabled={actionLoading === d.id}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-sm transition disabled:opacity-50"
                      >
                        {actionLoading === d.id ? 'Updating...' : 'Set as On The Way'}
                      </button>
                    )}

                    {(d.status === 'ON_THE_WAY' || d.status === 'PICKED_UP') && (
                      <button
                        onClick={() => handleUpdateStatus(d.id, 'DELIVERED')}
                        disabled={actionLoading === d.id}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition disabled:opacity-50"
                      >
                        {actionLoading === d.id ? 'Updating...' : 'Mark as Delivered'}
                      </button>
                    )}
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Pickups to Claim */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-4">
        <div>
          <h3 className="font-extrabold text-lg text-slate-900">Available Pickup Requests</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Surplus food accepted by NGOs waiting for volunteer transport.
          </p>
        </div>

        {availablePickups.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">
            No pending pickups available right now. You are all caught up!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availablePickups.map((d) => (
              <div
                key={d.id}
                className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-amber-300 transition space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-mono text-[11px] font-bold text-slate-400">{d.donation_code}</span>
                    <h4 className="font-bold text-base text-slate-900">{d.food_name}</h4>
                    <span className="text-xs text-slate-500">{d.number_of_packets} Packets • {d.quantity} kg</span>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                    d.priority === 'URGENT' ? 'bg-rose-100 text-rose-700' :
                    d.priority === 'HIGH' ? 'bg-amber-100 text-amber-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {d.priority} Priority
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Pickup:</strong> {d.pickup_address}</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                    <span><strong>Drop-off:</strong> {d.ngo?.name || 'Assigned Shelter'} ({d.ngo?.address || 'City Center'})</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-100">
                  <Link
                    to={`/track/${d.donation_code}`}
                    className="text-xs font-bold text-slate-500 hover:text-slate-800"
                  >
                    View Map Route
                  </Link>

                  <button
                    onClick={() => handleAcceptPickup(d.id)}
                    disabled={actionLoading === d.id}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 transition shadow-sm disabled:opacity-50"
                  >
                    {actionLoading === d.id ? 'Claiming...' : 'Accept Pickup'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

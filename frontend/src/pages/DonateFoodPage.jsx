import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { donationService } from '../services/api';
import { 
  Gift, 
  BrainCircuit, 
  CheckCircle2, 
  MapPin, 
  Clock, 
  Calendar, 
  Layers, 
  Scale, 
  AlertCircle, 
  Sparkles, 
  Building2, 
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

const FOOD_TYPES = [
  "Cooked Meals",
  "Rice",
  "Chapati",
  "Vegetables",
  "Snacks",
  "Fruits",
  "Other"
];

export const DonateFoodPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    food_name: '',
    food_type: 'Cooked Meals',
    quantity: 25,
    number_of_packets: 50,
    prepared_date: new Date().toISOString().split('T')[0],
    prepared_time: '12:00 PM',
    available_until: '06:00 PM',
    food_description: '',
    pickup_address: '12 Grand Banquet Hall, Anna Salai, Chennai',
    latitude: 13.0418,
    longitude: 80.2341,
    food_image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [createdDonation, setCreatedDonation] = useState(null);
  const [recommendedNgos, setRecommendedNgos] = useState([]);
  const [acceptingNgoId, setAcceptingNgoId] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' || name === 'number_of_packets' || name === 'latitude' || name === 'longitude'
        ? parseFloat(value) || 0
        : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.food_name.trim()) {
      setError('Food name is required.');
      return;
    }
    if (formData.quantity <= 0) {
      setError('Enter a valid quantity.');
      return;
    }

    setLoading(true);
    try {
      const res = await donationService.create(formData);
      setCreatedDonation(res.data);

      // Fetch AI Recommended NGOs for this newly created donation
      const recRes = await donationService.getRecommendedNgos(res.data.id);
      setRecommendedNgos(recRes.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create food donation. Please review the inputs.');
    } finally {
      setLoading(false);
    }
  };

  const handleNgoAcceptDirectly = async (ngoId) => {
    if (!createdDonation) return;
    setAcceptingNgoId(ngoId);
    try {
      await donationService.updateStatus(createdDonation.id, {
        status: 'NGO_ACCEPTED',
        ngo_id: ngoId,
        notes: 'Assigned directly from donor recommendation matching.'
      });
      navigate(`/track/${createdDonation.donation_code}`);
    } catch (err) {
      console.error(err);
      setError('Failed to assign NGO.');
    } finally {
      setAcceptingNgoId(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Title */}
      <div className="mb-8">
        <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Surplus Recovery</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">Donate Surplus Food</h1>
        <p className="text-sm text-slate-500 mt-1">
          Submit details of unserved, hygienically packed food. Our AI engine instantly computes perishability and recommends the closest shelters.
        </p>
      </div>

      {/* Success View with AI Analysis & Recommended NGOs */}
      {createdDonation ? (
        <div className="space-y-6">
          
          {/* Success Banner */}
          <div className="p-6 rounded-3xl bg-emerald-600 text-white shadow-lg flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-7 h-7 text-white" />
              </div>
              <div>
                <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-100">
                  Submission Confirmed
                </span>
                <h2 className="text-xl font-black">Food Donation Successfully Created</h2>
                <div className="text-sm text-emerald-100 mt-0.5">
                  Generated Donation ID: <span className="font-mono font-bold text-white bg-white/20 px-2 py-0.5 rounded">{createdDonation.donation_code}</span>
                </div>
              </div>
            </div>

            <Link
              to={`/track/${createdDonation.donation_code}`}
              className="px-5 py-2.5 rounded-xl font-bold bg-white text-emerald-800 hover:bg-emerald-50 transition shadow-sm text-xs sm:text-sm flex items-center gap-1.5"
            >
              Open Live Tracking <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* AI Food Priority Analysis Card (Section 7) */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-md">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <BrainCircuit className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">AI Food Priority Analysis</h3>
                  <p className="text-[11px] text-slate-400">Automated shelf-life decay & logistical triage</p>
                </div>
              </div>

              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                createdDonation.priority === 'URGENT' ? 'bg-rose-100 text-rose-700 border border-rose-200' :
                createdDonation.priority === 'HIGH' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                createdDonation.priority === 'MEDIUM' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                'bg-slate-100 text-slate-700'
              }`}>
                Priority: {createdDonation.priority}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-2xl">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Reasoning</div>
                <div className="text-sm font-semibold text-slate-800 mt-1">
                  "{createdDonation.priority_reason}"
                </div>
              </div>

              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl">
                <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Recommendation</div>
                <div className="text-sm font-semibold text-emerald-900 mt-1">
                  "{createdDonation.priority_recommendation}"
                </div>
              </div>
            </div>

            {/* Mandatory Disclaimer */}
            <div className="mt-4 p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl flex items-center gap-2 text-xs text-amber-800">
              <ShieldAlert className="w-4 h-4 shrink-0 text-amber-600" />
              <span><strong>IMPORTANT:</strong> This is an AI decision-support feature, not a guarantee of food safety. Organoleptic checks required at pickup.</span>
            </div>
          </div>

          {/* Smart NGO Matching (Section 8) */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-md">
            <div className="mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                <h3 className="font-extrabold text-slate-900 text-base">Smart NGO Matching Engine</h3>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Ranked using composite score: Distance Score + Food Requirement Score + Capacity Score + Urgency Score
              </p>
            </div>

            <div className="space-y-3">
              {recommendedNgos.map((ngo, idx) => (
                <div
                  key={ngo.ngo_id}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-emerald-300 transition flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-slate-900">{ngo.ngo_name}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        Match Score: {ngo.total_match_score}%
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 flex flex-wrap gap-x-3 gap-y-1">
                      <span><strong>Distance:</strong> {ngo.distance_km} km</span>
                      <span>•</span>
                      <span><strong>Capacity:</strong> {ngo.capacity} packets</span>
                      <span>•</span>
                      <span className="text-emerald-700 font-medium">{ngo.compatibility_reason}</span>
                    </div>

                    <div className="text-[11px] text-slate-400">
                      {ngo.address} • Contact: {ngo.contact_person} ({ngo.phone})
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <button
                      onClick={() => handleNgoAcceptDirectly(ngo.ngo_id)}
                      disabled={acceptingNgoId === ngo.ngo_id}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition disabled:opacity-50"
                    >
                      {acceptingNgoId === ngo.ngo_id ? 'Assigning...' : 'Assign to this NGO'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <Link
                to="/donor/dashboard"
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>

        </div>
      ) : (

        /* Standard Donation Creation Form */
        <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-lg space-y-6">
          
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Food Details */}
          <div className="space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
              1. Food Details & Categorization
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Food Name *
                </label>
                <input
                  type="text"
                  name="food_name"
                  required
                  value={formData.food_name}
                  onChange={handleChange}
                  placeholder="e.g. Vegetable Biryani, Meals, Chapati"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Food Type *
                </label>
                <select
                  name="food_type"
                  value={formData.food_type}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                >
                  {FOOD_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Quantity (in kg) *
                </label>
                <input
                  type="number"
                  name="quantity"
                  required
                  min="1"
                  step="0.5"
                  value={formData.quantity}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Number of Packets *
                </label>
                <input
                  type="number"
                  name="number_of_packets"
                  required
                  min="1"
                  value={formData.number_of_packets}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Food Description & Packaging Notes
              </label>
              <textarea
                name="food_description"
                rows="2"
                value={formData.food_description}
                onChange={handleChange}
                placeholder="Mention storage state (hot, chilled, containerized), dietary notes (100% veg), etc."
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
              />
            </div>
          </div>

          {/* Time & Usability */}
          <div className="space-y-4 pt-2">
            <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
              2. Preparation Timeline & Usability Window
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Prepared Date *
                </label>
                <input
                  type="date"
                  name="prepared_date"
                  required
                  value={formData.prepared_date}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Prepared Time *
                </label>
                <input
                  type="text"
                  name="prepared_time"
                  required
                  value={formData.prepared_time}
                  onChange={handleChange}
                  placeholder="e.g. 11:30 AM"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Available Until *
                </label>
                <input
                  type="text"
                  name="available_until"
                  required
                  value={formData.available_until}
                  onChange={handleChange}
                  placeholder="e.g. 05:00 PM"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                />
              </div>
            </div>
          </div>

          {/* Pickup Location & Coordinates */}
          <div className="space-y-4 pt-2">
            <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
              3. Pickup Location & GPS Coordinates
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Pickup Address *
              </label>
              <input
                type="text"
                name="pickup_address"
                required
                value={formData.pickup_address}
                onChange={handleChange}
                placeholder="Full venue address, gate number, contact at desk"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Latitude *
                </label>
                <input
                  type="number"
                  step="0.0001"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Longitude *
                </label>
                <input
                  type="number"
                  step="0.0001"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Food Image URL
              </label>
              <input
                type="url"
                name="food_image_url"
                value={formData.food_image_url}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/donor/dashboard')}
              className="px-5 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition text-sm"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 shadow-md shadow-emerald-600/30 transition text-sm flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Evaluating AI Urgency...' : (
                <>
                  <Gift className="w-4 h-4" /> Submit Donation
                </>
              )}
            </button>
          </div>

        </form>
      )}

    </div>
  );
};

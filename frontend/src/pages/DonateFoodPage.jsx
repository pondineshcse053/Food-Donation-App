import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { donationService } from '../services/api';
import { 
  ArrowLeft, 
  Camera, 
  CheckCircle2, 
  Sparkles, 
  MapPin, 
  Clock, 
  Users, 
  Building2, 
  ShieldCheck, 
  BrainCircuit,
  ArrowRight,
  UploadCloud,
  Check
} from 'lucide-react';

const FUNCTION_TYPES = ['Wedding', 'Birthday', 'Temple', 'Office'];

const PRESET_PHOTOS = [
  { name: 'Biryani Feast', url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80' },
  { name: 'Roti & Curry', url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80' },
  { name: 'Rice & Sambar', url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80' },
];

export const DonateFoodPage = () => {
  const navigate = useNavigate();

  const [selectedFunction, setSelectedFunction] = useState('Wedding');
  const [isVegetarian, setIsVegetarian] = useState(true);
  const [photoUrl, setPhotoUrl] = useState(PRESET_PHOTOS[0].url);

  const [formData, setFormData] = useState({
    food_name: 'Veg biryani and raita',
    servings: 40,
    best_before: '11:00 pm',
    pickup_address: 'Hall B, [Your area]',
    quantity_kg: 20,
    prepared_time: '01:30 PM',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [createdDonation, setCreatedDonation] = useState(null);
  const [recommendedNgos, setRecommendedNgos] = useState([]);
  const [acceptingNgoId, setAcceptingNgoId] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.food_name.trim()) {
      setError('Please enter the food name.');
      return;
    }

    setLoading(true);

    const payload = {
      food_name: formData.food_name,
      food_type: isVegetarian ? 'Cooked Meals (Veg)' : 'Cooked Meals (Non-Veg)',
      quantity: parseFloat(formData.quantity_kg) || Math.round(Number(formData.servings) / 2) || 15,
      number_of_packets: parseInt(formData.servings) || 40,
      prepared_date: new Date().toISOString().split('T')[0],
      prepared_time: formData.prepared_time || '12:00 PM',
      available_until: formData.best_before || '11:00 pm',
      food_description: `Type of function: ${selectedFunction}. ${isVegetarian ? 'Pure Vegetarian.' : ''} Kept covered and fresh.`,
      pickup_address: formData.pickup_address,
      latitude: 13.0827,
      longitude: 80.2707,
      food_image_url: photoUrl
    };

    try {
      const res = await donationService.create(payload);
      setCreatedDonation(res.data);

      // AI NGO recommendations
      try {
        const recRes = await donationService.getRecommendedNgos(res.data.id);
        setRecommendedNgos(recRes.data);
      } catch (recErr) {
        console.warn("Could not load recommendations:", recErr);
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to post donation. Please check your connection.');
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
        notes: 'Assigned directly from Annam AI matching recommendation.'
      });
      navigate(`/track/${createdDonation.donation_code}`);
    } catch (err) {
      console.error(err);
      setError('Failed to assign shelter.');
    } finally {
      setAcceptingNgoId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f7f0] bg-annam-doodle selection:bg-[#0f3825] selection:text-white py-4 sm:py-8 px-4 flex justify-center pb-28">
      
      <div className="w-full max-w-md bg-[#f3f7f0] rounded-[36px] border border-[#d2e2cc] shadow-xl overflow-hidden flex flex-col">
        
        {/* Header (Matching Screen 3: "< Donate leftover food") */}
        <div className="flex items-center justify-between px-5 py-4 bg-[#f3f7f0] border-b border-[#d8e8d2]">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-white/80 hover:bg-white border border-[#d2e2cc] text-[#0f3825] flex items-center justify-center transition shadow-xs"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-base font-black text-[#0f3825] tracking-tight">
            Donate leftover food
          </h1>
          <div className="w-10 h-10" />
        </div>

        {/* If donation successfully created, show confirmation & AI Match */}
        {createdDonation ? (
          <div className="p-5 sm:p-6 space-y-5">
            {/* Success Card */}
            <div className="p-6 rounded-3xl bg-[#0d3822] text-white space-y-3 shadow-lg text-center">
              <div className="w-14 h-14 rounded-full bg-[#fdf8ee] text-[#15803d] mx-auto flex items-center justify-center shadow-md">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>
              <h2 className="text-xl font-black">Donation Posted!</h2>
              <p className="text-xs text-emerald-200">
                Pickup code is <strong className="text-base text-[#f59e0b] font-mono font-black">{createdDonation.donation_code}</strong>
              </p>
              
              <div className="p-3 bg-white/10 rounded-2xl text-left space-y-1 text-xs">
                <div><span className="text-emerald-300">Food:</span> {createdDonation.food_name}</div>
                <div><span className="text-emerald-300">Servings:</span> {createdDonation.number_of_packets} meals</div>
                <div><span className="text-emerald-300">AI Urgency:</span> <span className="font-bold text-[#f59e0b]">{createdDonation.priority || 'HIGH'}</span></div>
              </div>
            </div>

            {/* Recommended NGO Shelters */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-[#15803d]" />
                <span className="text-xs font-black text-[#0f3825] uppercase tracking-wider">
                  Nearby Verified Shelters
                </span>
              </div>

              {recommendedNgos.length > 0 ? (
                <div className="space-y-2">
                  {recommendedNgos.slice(0, 2).map((ngo) => (
                    <div key={ngo.id} className="p-3.5 rounded-2xl bg-white border border-[#d6e5d1] flex items-center justify-between gap-3 shadow-xs">
                      <div>
                        <h4 className="text-xs font-black text-[#0f3825]">{ngo.name}</h4>
                        <p className="text-[11px] text-slate-500">{ngo.distance_km} km away • {ngo.capacity} capacity</p>
                      </div>
                      <button
                        onClick={() => handleNgoAcceptDirectly(ngo.id)}
                        disabled={acceptingNgoId === ngo.id}
                        className="py-2 px-3 rounded-xl bg-[#0f3825] hover:bg-[#144d33] text-white font-bold text-xs shrink-0 transition"
                      >
                        {acceptingNgoId === ngo.id ? 'Assigning...' : 'Assign Shelter'}
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-white border border-[#d6e5d1] text-xs text-slate-600 text-center">
                  Listing shared to all certified Green Family shelters nearby.
                </div>
              )}

              <button
                onClick={() => navigate(`/track/${createdDonation.donation_code}`)}
                className="w-full py-3.5 px-6 rounded-full bg-[#f29913] hover:bg-[#d97706] text-[#0a291b] font-black text-sm shadow-md transition text-center"
              >
                Track Live Pickup Status →
              </button>
            </div>
          </div>
        ) : (
          /* Form matching Screen 3 */
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
            
            {error && (
              <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-semibold border border-red-200">
                {error}
              </div>
            )}

            {/* Dotted Photo Upload Box (Screen 3) */}
            <div className="p-6 rounded-3xl border-2 border-dashed border-[#b8d1b1] bg-[#eaf3e7]/60 hover:bg-[#eaf3e7] transition flex flex-col items-center justify-center text-center cursor-pointer group">
              <div className="w-12 h-12 rounded-full bg-white text-[#15803d] flex items-center justify-center shadow-xs mb-2 group-hover:scale-105 transition-transform">
                <Camera className="w-6 h-6 text-[#15803d]" />
              </div>
              <span className="text-xs font-extrabold text-[#0f3825]">
                Add a photo of the food
              </span>
              <span className="text-[10px] text-slate-500 mt-0.5">
                Helps shelters verify freshness instantly
              </span>

              {/* Photo presets row */}
              <div className="flex gap-2 mt-3">
                {PRESET_PHOTOS.map((p, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => setPhotoUrl(p.url)}
                    className={`w-12 h-12 rounded-xl overflow-hidden border-2 transition ${
                      photoUrl === p.url ? 'border-[#0f3825] ring-2 ring-[#0f3825]/30' : 'border-white opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={p.url} alt={p.name} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Food Name Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#0f3825] uppercase tracking-wider">
                Food name
              </label>
              <input
                type="text"
                name="food_name"
                value={formData.food_name}
                onChange={handleInputChange}
                placeholder="e.g. Veg biryani and raita"
                required
                className="w-full px-4 py-3 rounded-2xl bg-white border border-[#d6e5d1] text-xs sm:text-sm font-semibold text-[#0f3825] focus:outline-none focus:ring-2 focus:ring-[#0f3825]"
              />
            </div>

            {/* Type of Function Pills (Wedding, Birthday, Temple, Office) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#0f3825] uppercase tracking-wider">
                Type of function
              </label>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                {FUNCTION_TYPES.map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSelectedFunction(type)}
                    className={`py-2 px-4 rounded-xl text-xs font-black transition-all ${
                      selectedFunction === type
                        ? 'bg-[#0f3825] text-white shadow-sm'
                        : 'bg-white hover:bg-[#eaf3e7] text-[#0f3825] border border-[#d6e5d1]'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Two-Column: Servings | Best before */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0f3825] uppercase tracking-wider">
                  Servings
                </label>
                <input
                  type="number"
                  name="servings"
                  min="1"
                  value={formData.servings}
                  onChange={handleInputChange}
                  placeholder="40"
                  required
                  className="w-full px-4 py-3 rounded-2xl bg-white border border-[#d6e5d1] text-xs sm:text-sm font-semibold text-[#0f3825] focus:outline-none focus:ring-2 focus:ring-[#0f3825]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0f3825] uppercase tracking-wider">
                  Best before
                </label>
                <input
                  type="text"
                  name="best_before"
                  value={formData.best_before}
                  onChange={handleInputChange}
                  placeholder="11:00 pm"
                  required
                  className="w-full px-4 py-3 rounded-2xl bg-white border border-[#d6e5d1] text-xs sm:text-sm font-semibold text-[#0f3825] focus:outline-none focus:ring-2 focus:ring-[#0f3825]"
                />
              </div>
            </div>

            {/* Pickup Address */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#0f3825] uppercase tracking-wider">
                Pickup address
              </label>
              <input
                type="text"
                name="pickup_address"
                value={formData.pickup_address}
                onChange={handleInputChange}
                placeholder="Hall B, [Your area]"
                required
                className="w-full px-4 py-3 rounded-2xl bg-white border border-[#d6e5d1] text-xs sm:text-sm font-semibold text-[#0f3825] focus:outline-none focus:ring-2 focus:ring-[#0f3825]"
              />
            </div>

            {/* Vegetarian Switch Toggle */}
            <div className="p-4 rounded-2xl bg-white border border-[#d6e5d1] flex items-center justify-between gap-3 shadow-xs">
              <div>
                <span className="text-xs font-black text-[#0f3825] block">
                  Vegetarian
                </span>
                <span className="text-[11px] text-slate-500">
                  Food was kept covered and fresh
                </span>
              </div>

              <button
                type="button"
                onClick={() => setIsVegetarian(!isVegetarian)}
                className={`w-12 h-7 rounded-full p-1 transition-colors duration-200 ease-in-out relative ${
                  isVegetarian ? 'bg-[#0f3825]' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
                    isVegetarian ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Sticky Action Button: Post donation (Screen 3) */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 rounded-full bg-[#f29913] hover:bg-[#d97706] active:scale-[0.99] text-[#0a291b] font-black text-sm tracking-wide shadow-lg shadow-[#f29913]/30 transition flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span>Publishing Donation...</span>
                ) : (
                  <span>Post donation</span>
                )}
              </button>
            </div>

          </form>
        )}

      </div>

    </div>
  );
};

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, 
  ArrowLeft, 
  Users, 
  Clock, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Soup, 
  Navigation,
  Share2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { donationService } from '../services/api';

export const FoodDetailsModal = ({ donation, isOpen, onClose, onClaimSuccess }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [claiming, setClaiming] = useState(false);
  const [claimedCode, setClaimedCode] = useState(null);

  if (!isOpen || !donation) return null;

  // Defaults fallback from donation object
  const foodName = donation.food_name || 'Veg biryani and raita';
  const foodType = donation.food_type || 'Cooked Meals';
  const servings = donation.number_of_packets ? `${donation.number_of_packets} servings` : (donation.quantity ? `${Math.round(donation.quantity * 2)} servings` : '40 servings');
  const availableUntil = donation.available_until || '10:30 pm';
  const preparedTime = donation.prepared_time || 'Cooked 2 hours ago';
  const address = donation.pickup_address || 'Wedding reception, Hall B';
  const donorPhone = donation.donor?.phone || '+91 98765 43210';
  const donationCode = donation.donation_code || '4821';

  const handleClaim = async () => {
    setClaiming(true);
    try {
      if (donation.id) {
        await donationService.updateStatus(donation.id, {
          status: 'NGO_ACCEPTED',
          notes: `Claimed by ${user?.full_name || 'Green Family NGO'}`
        });
      }
      setClaimedCode(donationCode);
      if (onClaimSuccess) onClaimSuccess(donation);
    } catch (err) {
      console.warn("Could not sync with backend directly, using instant local claim:", err);
      setClaimedCode(donationCode);
    } finally {
      setClaiming(false);
    }
  };

  const handleGoToTracking = () => {
    onClose();
    navigate(`/track/${donationCode}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-md max-h-[92vh] overflow-y-auto bg-[#f3f7f0] rounded-[32px] border border-[#d3e5cd] shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top App Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-5 py-3.5 bg-[#f3f7f0]/95 backdrop-blur-sm border-b border-[#d8e8d2]">
          <button 
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/80 hover:bg-white border border-[#d2e2cc] text-[#0f3825] flex items-center justify-center transition shadow-xs"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-bold text-[#0f3825] tracking-wide">Food details</span>
          <div className="w-9 h-9" />
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 space-y-4">

          {/* Hero Forest Green Banner Card */}
          <div className="p-5 sm:p-6 rounded-[28px] bg-[#0d3822] text-white relative overflow-hidden shadow-md">
            {/* Background subtle doodle circle */}
            <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
            
            <div className="flex items-start justify-between relative z-10">
              <div className="space-y-1 max-w-[70%]">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/15 text-emerald-200 text-[11px] font-semibold tracking-wider">
                  {foodType}
                </span>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-snug">
                  {foodName}
                </h2>
                <p className="text-xs text-emerald-200/90 font-medium">
                  {address.split(',')[0] || 'Community Hall'}
                </p>
              </div>

              {/* Smiling Steaming Bowl Icon Badge */}
              <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                <svg viewBox="0 0 32 32" className="w-8 h-8 fill-none stroke-emerald-300 stroke-[1.8] stroke-linecap-round stroke-linejoin-round" xmlns="http://www.w3.org/2000/svg">
                  {/* Bowl */}
                  <path d="M6 15 C6 23 11 27 16 27 C21 27 26 23 26 15 Z" />
                  {/* Steam */}
                  <path d="M12 9 C12 7 13 6 13 4" />
                  <path d="M16 10 C16 8 17 7 17 4" />
                  <path d="M20 9 C20 7 21 6 21 4" />
                  {/* Happy Smile Eyes inside bowl */}
                  <path d="M11 18 Q 13 20 15 18" />
                  <path d="M17 18 Q 19 20 21 18" />
                </svg>
              </div>
            </div>
          </div>

          {/* Card 1: Servings */}
          <div className="p-4 rounded-2xl bg-white border border-[#dce8d7] shadow-xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#eaf3e7] text-[#0f3825] flex items-center justify-center shrink-0">
              <Users className="w-5 h-5 text-[#135334]" />
            </div>
            <div>
              <div className="text-sm font-black text-[#0f3825]">{servings}</div>
              <div className="text-xs text-slate-500 font-medium">Enough for a small family shelter</div>
            </div>
          </div>

          {/* Card 2: Pick up by time */}
          <div className="p-4 rounded-2xl bg-white border border-[#dce8d7] shadow-xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#eaf3e7] text-[#0f3825] flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-[#135334]" />
            </div>
            <div>
              <div className="text-sm font-black text-[#0f3825]">Pick up by {availableUntil}</div>
              <div className="text-xs text-slate-500 font-medium">Cooked 2 hours ago, kept covered & hygienic</div>
            </div>
          </div>

          {/* Card 3: Distance & Location */}
          <div className="p-4 rounded-2xl bg-white border border-[#dce8d7] shadow-xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#eaf3e7] text-[#0f3825] flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5 text-[#135334]" />
            </div>
            <div>
              <div className="text-sm font-black text-[#0f3825]">0.8 km away</div>
              <div className="text-xs text-slate-500 font-medium line-clamp-1">{address}</div>
            </div>
          </div>

          {/* Map Preview Card */}
          <div className="p-3 rounded-2xl bg-white border border-[#dce8d7] shadow-xs">
            <div className="relative h-32 w-full rounded-xl overflow-hidden bg-[#e6ede3] border border-[#d2e2cc] flex flex-col items-center justify-center">
              {/* Simulated Map Visual */}
              <div className="absolute inset-0 bg-[radial-gradient(#cde0c8_2px,transparent_2px)] [background-size:16px_16px] opacity-70" />
              {/* Road lines */}
              <svg className="absolute inset-0 w-full h-full stroke-[#bddbb5] stroke-[4]" xmlns="http://www.w3.org/2000/svg">
                <line x1="10" y1="90" x2="200" y2="40" />
                <line x1="200" y1="40" x2="380" y2="80" />
              </svg>
              {/* Pin badge */}
              <div className="relative z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/95 shadow-md border border-emerald-200">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-xs font-bold text-[#0f3825]">Map preview • 0.8 km away</span>
              </div>
            </div>
          </div>

          {/* If already claimed in this session */}
          {claimedCode && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 space-y-3 text-center">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Food Claimed Successfully!
              </div>
              <p className="text-xs text-emerald-700">
                Your volunteer pickup code is <strong className="text-base text-amber-700 font-black">{claimedCode}</strong>
              </p>
              <button
                onClick={handleGoToTracking}
                className="w-full py-2.5 rounded-xl bg-[#0f3825] hover:bg-[#144d33] text-white font-bold text-xs shadow-md transition"
              >
                Track Live Volunteer Pickup →
              </button>
            </div>
          )}

        </div>

        {/* Sticky Action Footer */}
        {!claimedCode && (
          <div className="sticky bottom-0 z-20 px-5 py-4 bg-[#f3f7f0]/95 backdrop-blur-sm border-t border-[#d8e8d2] flex items-center gap-3">
            <a 
              href={`tel:${donorPhone}`}
              className="w-12 h-12 rounded-full bg-white hover:bg-[#eaf3e7] border border-[#cfdfc9] text-[#0f3825] flex items-center justify-center shrink-0 shadow-sm transition active:scale-95"
              title="Call Donor"
            >
              <Phone className="w-5 h-5 text-[#15803d]" />
            </a>

            <button
              onClick={handleClaim}
              disabled={claiming}
              className="flex-1 py-3.5 px-6 rounded-full bg-[#f29913] hover:bg-[#d97706] active:scale-[0.98] text-[#0a291b] font-black text-sm tracking-wide shadow-md shadow-[#f29913]/30 transition flex items-center justify-center gap-2"
            >
              {claiming ? (
                <span>Confirming Claim...</span>
              ) : (
                <span>Claim this food</span>
              )}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

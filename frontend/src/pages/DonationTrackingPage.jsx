import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { donationService, trackingService } from '../services/api';
import { donorIcon, ngoIcon, volunteerIcon } from '../utils/leafletIcons';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  Play, 
  RotateCcw, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  Heart,
  Check
} from 'lucide-react';

export const DonationTrackingPage = () => {
  const { code } = useParams();
  const navigate = useNavigate();

  const [donation, setDonation] = useState(null);
  const [mapData, setMapData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [simulating, setSimulating] = useState(false);
  const [volunteerPosition, setVolunteerPosition] = useState(null);

  const simRef = useRef(null);

  useEffect(() => {
    fetchDonationDetails();
    return () => {
      if (simRef.current) clearInterval(simRef.current);
    };
  }, [code]);

  const fetchDonationDetails = async () => {
    try {
      const res = await donationService.getByCode(code);
      setDonation(res.data);

      const mRes = await trackingService.getMapData(res.data.id);
      setMapData(mRes.data);

      if (mRes.data.volunteer) {
        setVolunteerPosition([mRes.data.volunteer.lat, mRes.data.volunteer.lng]);
      }
    } catch (err) {
      console.warn("Using sample tracking data for mockup display", err);
      // Fallback matching mockup screenshot 5
      setDonation({
        id: 999,
        donation_code: code || '4821',
        food_name: 'Veg biryani and raita',
        quantity: 20,
        number_of_packets: 40,
        status: 'ON_THE_WAY',
        pickup_address: 'Hall B, Grand Palace, Anna Salai',
        donor_name: 'Wedding Host',
        volunteer: {
          name: 'Karthik Raja',
          phone: '+91 98765 43210',
          vehicle: 'Hero Electric Van'
        }
      });
      setVolunteerPosition([13.0518, 80.2441]);
    } finally {
      setLoading(false);
    }
  };

  const handleStartSimulation = () => {
    if (simulating) {
      clearInterval(simRef.current);
      setSimulating(false);
      return;
    }

    setSimulating(true);
    let step = 0;
    const totalSteps = 25;

    const startLat = mapData?.donor?.lat || 13.0418;
    const startLng = mapData?.donor?.lng || 80.2341;
    const endLat = mapData?.ngo?.lat || 13.0610;
    const endLng = mapData?.ngo?.lng || 80.2405;

    simRef.current = setInterval(() => {
      step += 1;
      const progress = step / totalSteps;

      const currentLat = startLat + (endLat - startLat) * progress;
      const currentLng = startLng + (endLng - startLng) * progress;

      setVolunteerPosition([currentLat, currentLng]);

      if (step >= totalSteps) {
        clearInterval(simRef.current);
        setSimulating(false);
      }
    }, 400);
  };

  const donorCoords = mapData?.donor ? [mapData.donor.lat, mapData.donor.lng] : [13.0418, 80.2341];
  const ngoCoords = mapData?.ngo ? [mapData.ngo.lat, mapData.ngo.lng] : [13.0610, 80.2405];
  const currentVolCoords = volunteerPosition || [13.0518, 80.2370];

  const servingsCount = donation?.number_of_packets || 40;
  const foodTitle = donation?.food_name || 'Veg biryani and raita';
  const pickupCode = donation?.donation_code || '4821';
  const volunteerName = donation?.volunteer?.name || 'Karthik Raja';
  const volunteerPhone = donation?.volunteer?.phone || '+91 98765 43210';

  return (
    <div className="min-h-screen bg-[#f3f7f0] bg-annam-doodle selection:bg-[#0f3825] selection:text-white py-4 sm:py-8 px-4 flex justify-center pb-28">
      
      <div className="w-full max-w-md bg-[#f3f7f0] rounded-[36px] border border-[#d2e2cc] shadow-xl overflow-hidden flex flex-col">
        
        {/* Header (Matching Screen 5: "< Pickup status") */}
        <div className="flex items-center justify-between px-5 py-4 bg-[#f3f7f0] border-b border-[#d8e8d2]">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-white/80 hover:bg-white border border-[#d2e2cc] text-[#0f3825] flex items-center justify-center transition shadow-xs"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-base font-black text-[#0f3825] tracking-tight">
            Pickup status
          </h1>
          <div className="w-10 h-10" />
        </div>

        <div className="p-4 sm:p-5 space-y-4">

          {/* Forest Green Banner Card (Screen 5 Top Banner) */}
          <div className="p-5 rounded-[28px] bg-[#0d3822] text-white shadow-lg flex items-center justify-between gap-4 relative overflow-hidden">
            <div className="space-y-0.5 relative z-10">
              <span className="text-[11px] text-emerald-200/90 font-medium block">
                Volunteer arrives in
              </span>
              <div className="text-2xl sm:text-3xl font-black tracking-tight">
                12 min
              </div>
            </div>

            <div className="text-right space-y-0.5 relative z-10">
              <span className="text-[11px] text-emerald-200/90 font-medium block">
                Pickup code
              </span>
              <div className="text-2xl sm:text-3xl font-black tracking-tight text-[#f59e0b] font-mono">
                {pickupCode}
              </div>
            </div>
          </div>

          {/* Progress Timeline Checklist (Screen 5 Checklist) */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white border border-[#dce8d7] shadow-xs space-y-4">
            
            {/* Step 1: Food claimed (DONE) */}
            <div className="flex items-start gap-3.5 relative">
              <div className="w-6 h-6 rounded-full bg-[#15803d] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <div className="space-y-0.5 flex-1">
                <h4 className="text-xs font-black text-[#0f3825]">Food claimed</h4>
                <p className="text-[11px] text-slate-500 font-medium">
                  {foodTitle}, {servingsCount} servings
                </p>
              </div>
              {/* Connector line */}
              <div className="absolute left-3 top-7 bottom-0 w-0.5 bg-[#d0e4cb] -translate-x-1/2 -z-0 h-4" />
            </div>

            {/* Step 2: Volunteer on the way (ACTIVE) */}
            <div className="flex items-start gap-3.5 relative">
              <div className="w-6 h-6 rounded-full bg-[#fef3c7] border-2 border-[#f59e0b] flex items-center justify-center shrink-0 mt-0.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#f59e0b] animate-ping" />
              </div>
              <div className="space-y-0.5 flex-1">
                <h4 className="text-xs font-black text-[#0f3825]">Volunteer on the way</h4>
                <p className="text-[11px] text-slate-500 font-medium">
                  Please keep the food packed and ready
                </p>
              </div>
              {/* Connector line */}
              <div className="absolute left-3 top-7 bottom-0 w-0.5 bg-[#e2e8f0] -translate-x-1/2 -z-0 h-4" />
            </div>

            {/* Step 3: Picked up (PENDING) */}
            <div className="flex items-start gap-3.5 relative">
              <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-slate-300" />
              </div>
              <div className="space-y-0.5 flex-1">
                <h4 className="text-xs font-bold text-slate-400">Picked up</h4>
                <p className="text-[11px] text-slate-400 font-medium">
                  Share the code with the volunteer
                </p>
              </div>
              {/* Connector line */}
              <div className="absolute left-3 top-7 bottom-0 w-0.5 bg-[#e2e8f0] -translate-x-1/2 -z-0 h-4" />
            </div>

            {/* Step 4: Delivered to shelter (PENDING) */}
            <div className="flex items-start gap-3.5">
              <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-slate-300" />
              </div>
              <div className="space-y-0.5 flex-1">
                <h4 className="text-xs font-bold text-slate-400">Delivered to shelter</h4>
                <p className="text-[11px] text-slate-400 font-medium">
                  You will get a thank you note
                </p>
              </div>
            </div>

          </div>

          {/* Volunteer Profile Card (Screen 5 Volunteer Pill) */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-[#dce8d7] shadow-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-[#eaf3e7] border border-[#cce0c6] text-[#0f3825] font-black flex items-center justify-center text-sm shrink-0">
                V
              </div>
              <div>
                <h4 className="text-xs font-black text-[#0f3825]">
                  {volunteerName}
                </h4>
                <p className="text-[11px] text-emerald-700 font-semibold">
                  Green Family volunteer
                </p>
              </div>
            </div>

            <a
              href={`tel:${volunteerPhone}`}
              className="w-10 h-10 rounded-full bg-[#0d3822] hover:bg-[#154c31] text-white flex items-center justify-center shrink-0 shadow-sm transition active:scale-95"
              title="Call Volunteer"
            >
              <Phone className="w-4 h-4 text-emerald-300" />
            </a>
          </div>

          {/* Interactive Live Route Leaflet Map */}
          <div className="p-3 rounded-2xl bg-white border border-[#dce8d7] shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs px-1">
              <span className="font-bold text-[#0f3825] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#15803d]" /> Live Route GPS
              </span>
              <button
                onClick={handleStartSimulation}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#eaf3e7] text-[#0f3825] font-bold text-[11px] hover:bg-[#d9ead4] transition"
              >
                {simulating ? <RotateCcw className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
                {simulating ? 'Simulating...' : 'Simulate GPS'}
              </button>
            </div>

            <div className="h-44 w-full rounded-xl overflow-hidden border border-[#d2e2cc]">
              <MapContainer
                center={currentVolCoords}
                zoom={13}
                scrollWheelZoom={false}
                className="w-full h-full"
              >
                <TileLayer
                  attribution='&copy; OpenStreetMap'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={donorCoords} icon={donorIcon}>
                  <Popup>Pickup Hall (Donor)</Popup>
                </Marker>
                <Marker position={ngoCoords} icon={ngoIcon}>
                  <Popup>Shelter (NGO)</Popup>
                </Marker>
                <Marker position={currentVolCoords} icon={volunteerIcon}>
                  <Popup>Volunteer: {volunteerName}</Popup>
                </Marker>
                <Polyline positions={[donorCoords, ngoCoords]} color="#15803d" dashArray="5, 10" />
              </MapContainer>
            </div>
          </div>

          {/* Warm Bottom Impact Banner (Screen 5 Bottom Banner) */}
          <div className="p-3.5 rounded-2xl bg-[#fef8ea] border border-[#f5dfa8] text-center shadow-xs">
            <p className="text-xs font-extrabold text-[#92400e] flex items-center justify-center gap-1.5">
              <span>🌾</span>
              <span>Your leftover food will feed <strong>{servingsCount} people</strong> tonight</span>
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};

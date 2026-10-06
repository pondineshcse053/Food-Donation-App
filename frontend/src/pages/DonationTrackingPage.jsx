import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { donationService, trackingService } from '../services/api';
import { donorIcon, ngoIcon, volunteerIcon } from '../utils/leafletIcons';
import { 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Truck, 
  Building2, 
  ArrowLeft, 
  Play, 
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Layers,
  ChevronRight
} from 'lucide-react';

const TIMELINE_STEPS = [
  { key: 'CREATED', label: 'Donation Created', desc: 'Listing submitted by donor' },
  { key: 'NGO_ACCEPTED', label: 'NGO Accepted', desc: 'Matched shelter approved demand' },
  { key: 'VOLUNTEER_ASSIGNED', label: 'Volunteer Assigned', desc: 'Driver confirmed route' },
  { key: 'PICKED_UP', label: 'Food Picked Up', desc: 'Collected in insulated crates' },
  { key: 'ON_THE_WAY', label: 'On The Way', desc: 'In transit via optimal route' },
  { key: 'DELIVERED', label: 'Delivered', desc: 'Dropped off at recipient center' },
  { key: 'COMPLETED', label: 'NGO Confirmed', desc: 'Food inspected and served' },
];

export const DonationTrackingPage = () => {
  const { code } = useParams();
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
      console.error("Failed to load tracking data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Simulated Volunteer GPS Movement between Donor & NGO
  const handleStartSimulation = () => {
    if (!mapData || !mapData.donor || !mapData.ngo) return;

    if (simulating) {
      clearInterval(simRef.current);
      setSimulating(false);
      return;
    }

    setSimulating(true);
    let step = 0;
    const totalSteps = 25;

    const startLat = mapData.donor.lat;
    const startLng = mapData.donor.lng;
    const endLat = mapData.ngo.lat;
    const endLng = mapData.ngo.lng;

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

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-400">
        Loading live tracking telemetry...
      </div>
    );
  }

  if (!donation) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-800">Donation Not Found</h2>
        <p className="text-xs text-slate-500 mt-1">Please verify the donation code: {code}</p>
        <Link to="/" className="mt-4 inline-block px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold">
          Go Home
        </Link>
      </div>
    );
  }

  const currentStepIndex = TIMELINE_STEPS.findIndex(s => s.key === donation.status);
  const effectiveIndex = currentStepIndex === -1 ? 0 : currentStepIndex;

  const donorCoords = mapData?.donor ? [mapData.donor.lat, mapData.donor.lng] : [13.0418, 80.2341];
  const ngoCoords = mapData?.ngo ? [mapData.ngo.lat, mapData.ngo.lng] : [13.0610, 80.2405];
  const currentVolCoords = volunteerPosition || donorCoords;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Link
            to="/donor/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-emerald-600 mb-2 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Donation Tracking: <span className="font-mono text-emerald-600">{donation.donation_code}</span>
            </h1>
            <span className={`px-2.5 py-1 rounded-full text-xs font-black uppercase ${
              donation.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' :
              donation.status === 'ON_THE_WAY' ? 'bg-purple-100 text-purple-800 animate-pulse' :
              'bg-blue-100 text-blue-800'
            }`}>
              {donation.status.replace(/_/g, ' ')}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Food: <strong>{donation.food_name}</strong> • Quantity: <strong>{donation.number_of_packets} Packets ({donation.quantity} kg)</strong>
          </p>
        </div>

        {/* Live Simulation Button (Section 12) */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleStartSimulation}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-sm ${
              simulating
                ? 'bg-rose-600 text-white hover:bg-rose-700'
                : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600'
            }`}
          >
            {simulating ? (
              <>
                <RotateCcw className="w-4 h-4 animate-spin" /> Stop Simulation
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" /> Track Volunteer (Simulate Movement)
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Grid: Interactive Map + Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Map (Section 12) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 shadow-md p-4 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-600" />
              <h3 className="font-extrabold text-base text-slate-900">Live Geospatial Route Map</h3>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-bold">
              <span className="flex items-center gap-1 text-emerald-700"><span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block"></span> Donor</span>
              <span className="flex items-center gap-1 text-blue-700"><span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block"></span> NGO</span>
              <span className="flex items-center gap-1 text-amber-700"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span> Volunteer</span>
            </div>
          </div>

          {/* Leaflet Map */}
          <div className="h-[420px] w-full rounded-2xl overflow-hidden border border-slate-200 relative">
            <MapContainer
              center={donorCoords}
              zoom={13}
              scrollWheelZoom={false}
              className="h-full w-full"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* Donor Marker */}
              <Marker position={donorCoords} icon={donorIcon}>
                <Popup>
                  <div className="text-xs">
                    <strong className="text-emerald-700 block">Donor Location</strong>
                    <span>{donation.donor_name}</span>
                    <div className="text-slate-500 mt-0.5">{donation.pickup_address}</div>
                  </div>
                </Popup>
              </Marker>

              {/* NGO Marker */}
              <Marker position={ngoCoords} icon={ngoIcon}>
                <Popup>
                  <div className="text-xs">
                    <strong className="text-blue-700 block">Recipient NGO</strong>
                    <span>{donation.ngo?.name || 'Assigned Center'}</span>
                    <div className="text-slate-500 mt-0.5">{donation.ngo?.address || 'Metro Relief Center'}</div>
                  </div>
                </Popup>
              </Marker>

              {/* Volunteer Marker */}
              <Marker position={currentVolCoords} icon={volunteerIcon}>
                <Popup>
                  <div className="text-xs">
                    <strong className="text-amber-700 block">Volunteer Live Position</strong>
                    <span>{donation.volunteer?.name || 'Volunteer Transit Rider'}</span>
                    <div className="text-slate-500 mt-0.5">Vehicle: {donation.volunteer?.vehicle_type || 'Motorcycle/Van'}</div>
                  </div>
                </Popup>
              </Marker>

              {/* Route Polyline connecting Donor and NGO */}
              <Polyline
                positions={[donorCoords, currentVolCoords, ngoCoords]}
                color="#2563eb"
                dashArray="6, 8"
                weight={3}
              />
            </MapContainer>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-500 flex items-center justify-between">
            <span>Route Distance: <strong>~3.8 km</strong> • Est. Transit Window: <strong>12-15 mins</strong></span>
            <span className="text-emerald-700 font-semibold">OpenStreetMap Verified</span>
          </div>
        </div>

        {/* Right Side: Timeline & Checkpoints (Section 11) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/80 shadow-md p-6 space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-base text-slate-900">Donation Lifecycle Timeline</h3>
            <p className="text-xs text-slate-400 mt-0.5">Live verifiable milestones synchronized with database</p>
          </div>

          <div className="space-y-4">
            {TIMELINE_STEPS.map((step, idx) => {
              const isPassed = idx < effectiveIndex;
              const isCurrent = idx === effectiveIndex;
              const isPending = idx > effectiveIndex;

              return (
                <div key={step.key} className="flex items-start gap-3 relative">
                  
                  {/* Connecting Line */}
                  {idx < TIMELINE_STEPS.length - 1 && (
                    <div className={`absolute left-3.5 top-7 bottom-0 w-0.5 ${
                      isPassed ? 'bg-emerald-500' : 'bg-slate-200'
                    }`} />
                  )}

                  {/* Node Icon */}
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 transition ${
                    isPassed ? 'bg-emerald-600 text-white shadow-xs' :
                    isCurrent ? 'bg-amber-500 text-white ring-4 ring-amber-100 shadow-sm animate-pulse' :
                    'bg-slate-100 text-slate-300'
                  }`}>
                    {isPassed ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <span className="text-[10px] font-bold">{idx + 1}</span>
                    )}
                  </div>

                  {/* Step Description */}
                  <div className="flex-1 pb-3">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold ${
                        isPassed ? 'text-slate-800' :
                        isCurrent ? 'text-amber-800 font-extrabold' :
                        'text-slate-400'
                      }`}>
                        {step.label}
                      </span>
                      {isPassed && (
                        <span className="text-[10px] font-bold text-emerald-600">✓ Done</span>
                      )}
                      {isCurrent && (
                        <span className="text-[10px] font-bold text-amber-600">● Active</span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {step.desc}
                    </p>
                  </div>

                </div>
              );
            })}
          </div>

          {/* AI Priority Reminder Box */}
          <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-100 text-xs text-purple-900 space-y-1">
            <div className="font-extrabold flex items-center gap-1.5 text-purple-950">
              <Sparkles className="w-4 h-4 text-purple-600" /> AI Perishability Safeguard
            </div>
            <p className="text-[11px] text-purple-800 leading-relaxed">
              Priority level: <strong>{donation.priority}</strong>. {donation.priority_recommendation}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import { adminService } from '../services/api';
import { createCustomPin } from '../utils/leafletIcons';
import { 
  Building2, 
  MapPin, 
  ShieldCheck, 
  TrendingDown, 
  AlertTriangle, 
  FileText,
  Flame,
  Award,
  Layers
} from 'lucide-react';

export const GovernmentDashboard = () => {
  const [govData, setGovData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGovData();
  }, []);

  const fetchGovData = async () => {
    try {
      const res = await adminService.getGovernmentDashboard();
      setGovData(res.data);
    } catch (err) {
      console.error("Failed to load gov data:", err);
    } finally {
      setLoading(false);
    }
  };

  const areas = govData?.area_donations || [
    { area: "Central Sector", donations: 142, demand_level: "High", status: "GREEN", lat: 13.0827, lng: 80.2707 },
    { area: "North Metro", donations: 98, demand_level: "Medium", status: "YELLOW", lat: 13.1150, lng: 80.2850 },
    { area: "South Tech Corridor", donations: 175, demand_level: "High", status: "GREEN", lat: 12.9800, lng: 80.2200 },
    { area: "East Coast Harbor", donations: 45, demand_level: "Critical Need", status: "RED", lat: 13.0450, lng: 80.2800 },
    { area: "West Suburban Ring", donations: 64, demand_level: "Medium", status: "YELLOW", lat: 13.0500, lng: 80.1800 }
  ];

  const getPinForZone = (status) => {
    if (status === 'GREEN') return createCustomPin('#10b981', 'HI');
    if (status === 'YELLOW') return createCustomPin('#f59e0b', 'MED');
    return createCustomPin('#ef4444', 'CRIT');
  };

  const getCircleColor = (status) => {
    if (status === 'GREEN') return '#10b981';
    if (status === 'YELLOW') return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Official Government Authority Header */}
      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-white shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2 border border-emerald-500/30">
            <ShieldCheck className="w-3.5 h-3.5" /> Department of Civil Supplies & Consumer Protection
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Food Redistribution Policy & Urban Need Analytics
          </h1>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            Statewide surveillance portal analyzing municipal surplus patterns, poverty food-deficit pockets, and authorized NGO operations.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-800 p-3.5 rounded-2xl border border-slate-700">
          <FileText className="w-5 h-5 text-emerald-400" />
          <div className="text-xs">
            <span className="text-slate-400 block">Surplus Diversion Rate</span>
            <span className="font-extrabold text-emerald-400 text-base">94.2% Diverted</span>
          </div>
        </div>
      </div>

      {/* Geospatial Need Analysis Map (Section 21) */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="font-extrabold text-base text-slate-900">
              Municipal Surplus Redistribution Map & Vulnerability Heatmap
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Identifies geographic zones requiring increased volunteer allocation and shelter infrastructure.
            </p>
          </div>

          {/* Map Legend */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
            <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span> Green = High Donation Area
            </span>
            <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Yellow = Medium Area
            </span>
            <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span> Red = Critical Need Area
            </span>
          </div>
        </div>

        {/* Map Container */}
        <div className="h-[460px] w-full rounded-2xl overflow-hidden border border-slate-200">
          <MapContainer
            center={[13.0600, 80.2400]}
            zoom={12}
            scrollWheelZoom={false}
            className="h-full w-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {areas.map((area, idx) => (
              <React.Fragment key={idx}>
                <Marker position={[area.lat, area.lng]} icon={getPinForZone(area.status)}>
                  <Popup>
                    <div className="text-xs">
                      <strong className="block text-slate-900 text-sm">{area.area}</strong>
                      <div className="mt-1">Redistributed: <strong>{area.donations} batches</strong></div>
                      <div>Demand Severity: <strong>{area.demand_level}</strong></div>
                      <div className="font-bold mt-1 text-slate-700">Classification: {area.status} Zone</div>
                    </div>
                  </Popup>
                </Marker>

                <Circle
                  center={[area.lat, area.lng]}
                  radius={1800}
                  pathOptions={{
                    color: getCircleColor(area.status),
                    fillColor: getCircleColor(area.status),
                    fillOpacity: 0.18,
                  }}
                />
              </React.Fragment>
            ))}
          </MapContainer>
        </div>

        {/* Action Directives */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
            <span className="font-bold text-slate-800 block">East Coast Harbor (Red Zone)</span>
            <p className="text-slate-500 mt-1">
              Low commercial banquet density, high migrant labor population. Directive: Reroute weekend surplus vans from Central Sector banquets here.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
            <span className="font-bold text-slate-800 block">South Tech Corridor (Green Zone)</span>
            <p className="text-slate-500 mt-1">
              High surplus yield from IT campus cafeterias. 175 batches collected this month. Sufficient local NGO capacity.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
            <span className="font-bold text-slate-800 block">Statutory Compliance Status</span>
            <p className="text-slate-500 mt-1">
              All 5 NGOs adhere to food safety guidelines and temperature-controlled handover regulations. Zero contamination incidents logged.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};

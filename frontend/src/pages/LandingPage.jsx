import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, 
  ArrowRight, 
  HeartHandshake, 
  BrainCircuit, 
  MapPin, 
  ShieldCheck, 
  Truck, 
  Users, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  Soup, 
  ChevronRight,
  AlertCircle,
  Building,
  Award
} from 'lucide-react';

export const LandingPage = () => {
  const { user, loginAsDemo } = useAuth();
  const navigate = useNavigate();

  const handleQuickDemo = async (role) => {
    await loginAsDemo(role);
    if (role === 'DONOR') navigate('/donor/dashboard');
    else if (role === 'NGO') navigate('/ngo/dashboard');
    else if (role === 'VOLUNTEER') navigate('/volunteer/dashboard');
    else if (role === 'ADMIN') navigate('/admin/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-emerald-500 selection:text-white">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-emerald-50/60 via-white to-slate-50 border-b border-slate-200/60">
        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-green-100/50 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center max-w-3xl mx-auto">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-300 text-emerald-800 text-xs font-semibold uppercase tracking-wider mb-6 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-spin" style={{ animationDuration: '4s' }} />
              Real-World College Capstone Project • Live Prototype
            </div>

            {/* Title & Subtitle */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              AI-Based Smart <br />
              <span className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent">
                Food Donation & Redistribution
              </span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-slate-600 font-normal leading-relaxed">
              Reduce Food Waste. Feed the Needy. Build a Better Tomorrow.
            </p>
            <p className="mt-2 text-sm text-slate-500 max-w-xl mx-auto">
              Bridging banquet halls, canteens, and generous donors with certified NGOs and nearby volunteers via intelligent perishability ranking and geospatial routing.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <Link
                to={user ? "/donor/donate" : "/login"}
                className="px-6 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 shadow-lg shadow-emerald-600/30 transition transform hover:-translate-y-0.5 flex items-center gap-2 text-sm sm:text-base"
              >
                Donate Food <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to={user ? "/ngo/dashboard" : "/login"}
                className="px-6 py-3.5 rounded-xl font-bold text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 shadow-sm transition text-sm sm:text-base flex items-center gap-2"
              >
                Find Donations
              </Link>

              {!user && (
                <Link
                  to="/login"
                  className="px-5 py-3.5 rounded-xl font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition text-sm sm:text-base"
                >
                  Login
                </Link>
              )}
            </div>

            {/* Interactive Demo Instant Logins */}
            <div className="mt-10 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm max-w-2xl mx-auto">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2.5">
                ⚡ Interactive College Evaluation Mode • One-Click Login:
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  onClick={() => handleQuickDemo('DONOR')}
                  className="px-3 py-2 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 transition text-center"
                >
                  🍕 Donor Portal
                </button>
                <button
                  onClick={() => handleQuickDemo('NGO')}
                  className="px-3 py-2 rounded-xl text-xs font-bold bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200 transition text-center"
                >
                  🏢 NGO Portal
                </button>
                <button
                  onClick={() => handleQuickDemo('VOLUNTEER')}
                  className="px-3 py-2 rounded-xl text-xs font-bold bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 transition text-center"
                >
                  🛵 Volunteer App
                </button>
                <button
                  onClick={() => handleQuickDemo('ADMIN')}
                  className="px-3 py-2 rounded-xl text-xs font-bold bg-purple-50 text-purple-800 hover:bg-purple-100 border border-purple-200 transition text-center"
                >
                  📊 Admin Panel
                </button>
              </div>
            </div>

          </div>

          {/* Visual End-to-End Workflow Diagram */}
          <div className="mt-16 max-w-5xl mx-auto">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xl">
              <div className="text-center mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Automated End-to-End Operational Pipeline
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 mt-2">
                  Food Donor → AI Analysis → NGO Matching → Volunteer → Delivery → Impact
                </h3>
              </div>

              {/* Steps Flow Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {[
                  { step: "01", title: "Food Donor", desc: "Uploads surplus batch & pickup GPS", icon: Soup, color: "text-emerald-600 bg-emerald-50" },
                  { step: "02", title: "AI Analysis", desc: "Scores perishability & urgency level", icon: BrainCircuit, color: "text-purple-600 bg-purple-50" },
                  { step: "03", title: "NGO Matching", desc: "Haversine distance & capacity rank", icon: Building, color: "text-blue-600 bg-blue-50" },
                  { step: "04", title: "Volunteer", desc: "Accepts pickup & departs on route", icon: Truck, color: "text-amber-600 bg-amber-50" },
                  { step: "05", title: "Delivery", desc: "Live Leaflet GPS route tracking", icon: MapPin, color: "text-rose-600 bg-rose-50" },
                  { step: "06", title: "Impact", desc: "Meals recorded & metrics aggregated", icon: Award, color: "text-teal-600 bg-teal-50" }
                ].map((item, idx) => (
                  <div key={idx} className="relative p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 text-center flex flex-col items-center">
                    <span className="text-[10px] font-black text-slate-400 mb-1">{item.step}</span>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2.5 ${item.color}`}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-xs text-slate-800">{item.title}</span>
                    <span className="text-[11px] text-slate-500 mt-1 leading-snug">{item.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Why Food Donation Matters Section */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Global & Regional Crisis</span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-1">Why Food Donation Matters</h2>
            <p className="text-slate-600 text-sm mt-2">
              Over 40% of prepared food in banquets and restaurants goes to waste, while thousands suffer malnutrition. Our technology closes this gap immediately.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-300 transition shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Zero Food Landfill</h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Rotting food in landfills produces methane, a greenhouse gas 28x more potent than carbon dioxide. Rescuing food protects the local biosphere.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-300 transition shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Nourishing Vulnerable Families</h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Every packet preserved is safely delivered to orphanages, night shelters, and low-income community kitchens before expiry.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-300 transition shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Transparent Accountability</h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Full chain of custody: Donor creates listing, NGO validates demand, Volunteer signs for transit, and NGO signs delivery confirmation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AI-Powered Priority & Smart Matching Feature Section */}
      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div>
              <span className="text-xs font-bold text-purple-600 uppercase tracking-widest">Decision Support System</span>
              <h2 className="text-3xl font-extrabold text-slate-900 mt-1">
                AI Food Priority & Multi-Criteria NGO Matching
              </h2>
              <p className="text-slate-600 text-sm mt-3 leading-relaxed">
                Traditional donation hotlines suffer delays that cause food spoilage. Our engine computes urgency based on temperature, food category, preparation elapsed time, and weather factor.
              </p>

              <div className="mt-6 space-y-3.5">
                <div className="flex items-start gap-3">
                  <div className="p-1 rounded-full bg-emerald-100 text-emerald-700 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Perishability Matrix Analysis</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Weights cooked meals, rice, chapati, and fresh vegetables dynamically.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1 rounded-full bg-emerald-100 text-emerald-700 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Haversine Distance Scoring</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Prioritizes shelters within 3-5 km radius to prevent transit delays.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1 rounded-full bg-emerald-100 text-emerald-700 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Real-Time NGO Capacity Matching</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Ensures receiving centers have refrigerated storage and immediate demand.</p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Link
                  to="/impact"
                  className="inline-flex items-center gap-2 text-sm font-bold text-emerald-700 hover:text-emerald-800"
                >
                  Explore System Impact Statistics <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* AI Mock Card */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-lg">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <BrainCircuit className="w-5 h-5 text-purple-600" />
                  <span className="font-extrabold text-sm text-slate-900">AI Food Priority Engine</span>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-black bg-rose-100 text-rose-700 border border-rose-200">
                  URGENT PRIORITY
                </span>
              </div>

              <div className="mt-4 space-y-3">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase">Donation Batch</div>
                  <div className="text-sm font-bold text-slate-800">Vegetable Rice & Curry (80 Packets)</div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <div className="text-[11px] font-semibold text-slate-400">Prep Elapsed</div>
                    <div className="text-sm font-bold text-slate-800">3.5 Hours Ago</div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <div className="text-[11px] font-semibold text-slate-400">Remaining Shelf-life</div>
                    <div className="text-sm font-bold text-rose-600">1.5 Hours Left</div>
                  </div>
                </div>

                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl">
                  <div className="text-xs font-bold text-rose-900">AI Recommendation:</div>
                  <div className="text-xs text-rose-700 mt-0.5">
                    "High perishability detected. Immediate volunteer dispatch routed to ABC Community Trust (2.1 km away)."
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Live Donation Tracking & Leaflet Maps Section */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Logistics Engine</span>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-1">Live Donation Tracking & Verification</h2>
          <p className="text-slate-600 text-sm mt-2 max-w-2xl mx-auto">
            Interactive OpenStreetMap Leaflet integration allows donors, volunteers, and NGOs to observe live route status with tamper-proof milestone logging.
          </p>

          <div className="mt-8 p-6 bg-slate-900 text-white rounded-3xl max-w-3xl mx-auto shadow-xl text-left">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs text-slate-400">Donation ID:</span>
                <span className="ml-2 font-mono text-sm font-bold text-emerald-400">DON-2026-00125</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                ● On The Way
              </span>
            </div>

            {/* Stepper */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="border-l-2 border-emerald-500 pl-3">
                <div className="text-emerald-400 font-bold">✓ Created</div>
                <div className="text-slate-400 text-[11px]">11:30 AM</div>
              </div>
              <div className="border-l-2 border-emerald-500 pl-3">
                <div className="text-emerald-400 font-bold">✓ NGO Accepted</div>
                <div className="text-slate-400 text-[11px]">11:42 AM</div>
              </div>
              <div className="border-l-2 border-emerald-500 pl-3">
                <div className="text-emerald-400 font-bold">✓ Picked Up</div>
                <div className="text-slate-400 text-[11px]">12:10 PM</div>
              </div>
              <div className="border-l-2 border-amber-500 pl-3">
                <div className="text-amber-400 font-bold">● Transit Route</div>
                <div className="text-slate-400 text-[11px]">ETA 15 mins</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer / Contact */}
      <footer className="mt-auto bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 text-white font-extrabold text-xl">
                <HeartHandshake className="w-6 h-6 text-emerald-400" />
                FoodBridge AI
              </div>
              <p className="mt-2 text-xs text-slate-400 max-w-sm leading-relaxed">
                Smart Food Donation, Tracking & Redistribution System. A complete real-world engineering project addressing hunger and carbon emissions.
              </p>
              <div className="mt-4 text-xs text-slate-500">
                Built with React, FastAPI, SQLAlchemy, SQLite, Leaflet, and Scikit-learn.
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Roles</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><Link to="/donor/dashboard" className="hover:text-emerald-400">Donor Portal</Link></li>
                <li><Link to="/ngo/dashboard" className="hover:text-emerald-400">NGO Verification</Link></li>
                <li><Link to="/volunteer/dashboard" className="hover:text-emerald-400">Volunteer Logistics</Link></li>
                <li><Link to="/admin/dashboard" className="hover:text-emerald-400">State Administration</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Civil Authority</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><Link to="/government" className="hover:text-emerald-400">Government Support Dashboard</Link></li>
                <li><Link to="/impact" className="hover:text-emerald-400">Impact Analytics</Link></li>
                <li><span className="text-slate-500">Emergency Relief Hotline: 1800-FOOD-AID</span></li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
            <div>© 2026 AI-Based Smart Food Donation System. Academic Capstone Prototype.</div>
            <div className="mt-2 sm:mt-0">All rights reserved.</div>
          </div>
        </div>
      </footer>

    </div>
  );
};

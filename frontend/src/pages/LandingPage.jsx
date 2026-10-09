import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { donationService } from '../services/api';
import { AnnamLogo } from '../components/AnnamLogo';
import { FoodDetailsModal } from '../components/FoodDetailsModal';
import { 
  Sparkles, 
  ArrowRight, 
  Search, 
  Bell, 
  Users, 
  Clock, 
  MapPin, 
  ChevronRight, 
  Plus, 
  CheckCircle2, 
  Truck, 
  ShieldCheck, 
  BrainCircuit, 
  Award, 
  HeartHandshake, 
  Soup, 
  Building2, 
  PartyPopper, 
  Briefcase, 
  Flame, 
  Compass,
  ArrowUpRight
} from 'lucide-react';

const CATEGORIES = [
  { id: 'ALL', name: 'All Functions', icon: Compass },
  { id: 'Wedding', name: 'Wedding', icon: HeartHandshake },
  { id: 'Birthday', name: 'Birthday', icon: PartyPopper },
  { id: 'Temple', name: 'Temple', icon: Flame },
  { id: 'Office', name: 'Office', icon: Briefcase },
];

export const LandingPage = () => {
  const { user, loginAsDemo } = useAuth();
  const navigate = useNavigate();

  const [activeCategory, setActiveCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Default mockup items from the user's screenshot
  const defaultItems = [
    {
      id: 101,
      donation_code: '4821',
      food_name: 'Veg biryani and raita',
      category: 'Wedding',
      event_type: 'Wedding reception, 0.8 km',
      pickup_address: 'Hall B, Grand Palace, Anna Salai',
      number_of_packets: 40,
      quantity: 20,
      food_type: 'Cooked Meals',
      available_until: '10:30 pm',
      prepared_time: 'Cooked 2 hours ago',
      distance: '0.8 km away',
      icon_type: 'bowl',
      is_veg: true,
      priority: 'HIGH',
    },
    {
      id: 102,
      donation_code: '5192',
      food_name: 'Chapati and kurma',
      category: 'Birthday',
      event_type: 'Birthday party, 1.2 km',
      pickup_address: 'Kalyan Nagar Community Hall',
      number_of_packets: 25,
      quantity: 12,
      food_type: 'Chapati',
      available_until: '9:45 pm',
      prepared_time: 'Cooked 1.5 hours ago',
      distance: '1.2 km away',
      icon_type: 'leaf',
      is_veg: true,
      priority: 'MEDIUM',
    },
    {
      id: 103,
      donation_code: '6740',
      food_name: 'Sambar rice & sweet pongal',
      category: 'Temple',
      event_type: 'Temple festival, 1.5 km',
      pickup_address: 'Mylapore Temple Hall',
      number_of_packets: 60,
      quantity: 30,
      food_type: 'Rice',
      available_until: '11:00 pm',
      prepared_time: 'Cooked 1 hour ago',
      distance: '1.5 km away',
      icon_type: 'bowl',
      is_veg: true,
      priority: 'URGENT',
    },
    {
      id: 104,
      donation_code: '8204',
      food_name: 'Buffet meals & pasta',
      category: 'Office',
      event_type: 'Corporate tech event, 2.1 km',
      pickup_address: 'Cyber Tech Park, Tidel',
      number_of_packets: 35,
      quantity: 18,
      food_type: 'Cooked Meals',
      available_until: '10:00 pm',
      prepared_time: 'Cooked 2.5 hours ago',
      distance: '2.1 km away',
      icon_type: 'bowl',
      is_veg: false,
      priority: 'MEDIUM',
    }
  ];

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const res = await donationService.getAll({});
      if (res.data && res.data.length > 0) {
        // Map backend donations to mockup schema
        const mapped = res.data.map(d => ({
          ...d,
          category: d.food_description?.includes('Wedding') ? 'Wedding' : 
                    d.food_description?.includes('Birthday') ? 'Birthday' : 
                    d.food_description?.includes('Temple') ? 'Temple' : 'Wedding',
          event_type: d.pickup_address ? `${d.pickup_address.split(',')[0]}, 0.9 km` : 'Function Hall, 0.9 km',
          distance: '0.8 km away',
          icon_type: d.food_type === 'Rice' || d.food_type === 'Cooked Meals' ? 'bowl' : 'leaf'
        }));
        setDonations([...mapped, ...defaultItems]);
      } else {
        setDonations(defaultItems);
      }
    } catch (err) {
      console.warn("Backend not active or empty, showing default Annam items", err);
      setDonations(defaultItems);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (role) => {
    await loginAsDemo(role);
    if (role === 'DONOR') navigate('/donor/dashboard');
    else if (role === 'NGO') navigate('/ngo/dashboard');
    else if (role === 'VOLUNTEER') navigate('/volunteer/dashboard');
    else if (role === 'ADMIN') navigate('/admin/dashboard');
  };

  const handleCardClick = (item) => {
    setSelectedDonation(item);
    setIsModalOpen(true);
  };

  const filteredDonations = donations.filter(item => {
    const matchesCategory = activeCategory === 'ALL' || item.category === activeCategory;
    const matchesSearch = !searchQuery || 
      item.food_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.event_type?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#f3f7f0] bg-annam-doodle selection:bg-[#0f3825] selection:text-white pb-24">
      
      {/* ========================================================
          SCREEN 1: WELCOME & SPLASH HERO (From Mockup Screen 1)
          ======================================================== */}
      <section className="relative overflow-hidden bg-[#0d3822] bg-annam-doodle-dark text-white pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-[#1b4b32]">
        
        {/* Soft Radial Ambient Lights */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
          
          {/* Circular Annam Emblem Badge */}
          <div className="flex justify-center">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#fdf8ee] shadow-2xl flex items-center justify-center border-4 border-[#246142] relative overflow-hidden transition-transform duration-300 hover:scale-105">
              <svg viewBox="0 0 40 40" className="w-16 h-16 fill-none" xmlns="http://www.w3.org/2000/svg">
                {/* Sprout leaf */}
                <path d="M20 6 C 20 6 25 10 25 14 C 21 14 19 12 20 6 Z" fill="#15803d" />
                <path d="M19 7 C 19 7 15 11 15 14 C 18 14.5 19 12 19 7 Z" fill="#22c55e" />
                {/* Outer bowl / avocado */}
                <path d="M20 13 C 27.5 13 32 18.5 32 25 C 32 32 26.5 36 20 36 C 13.5 36 8 32 8 25 C 8 18.5 12.5 13 20 13 Z" fill="#15803d" />
                <path d="M20 15.8 C 26 15.8 29.2 20 29.2 25.2 C 29.2 30.5 25 33.5 20 33.5 C 15 33.5 10.8 30.5 10.8 25.2 C 10.8 20 14 15.8 20 15.8 Z" fill="#fdfbf7" />
                {/* Golden heart */}
                <path d="M20 21.5 C 22.5 19 25.5 20.5 25 23.5 C 24.5 26 20 29.5 20 29.5 C 20 29.5 15.5 26 15 23.5 C 14.5 20.5 17.5 19 20 21.5 Z" fill="#f59e0b" />
              </svg>
            </div>
          </div>

          {/* Typography */}
          <div className="space-y-1">
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white">
              Annam
            </h1>
            <p className="text-xs sm:text-sm font-black uppercase tracking-[0.25em] text-[#86efac]">
              GREEN FAMILY
            </p>
          </div>

          <p className="text-base sm:text-lg text-emerald-100/90 font-medium max-w-md mx-auto leading-relaxed">
            Every leftover plate can become someone's dinner
          </p>

          {/* Action Buttons Matching Screen 1 */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 max-w-sm mx-auto w-full">
            <Link
              to={user ? "/donor/donate" : "/login"}
              className="w-full sm:w-auto flex-1 py-3.5 px-7 rounded-full bg-[#f29913] hover:bg-[#d97706] active:scale-95 text-[#0a291b] font-black text-sm sm:text-base tracking-wide shadow-lg shadow-[#f29913]/30 transition text-center"
            >
              Get started
            </Link>

            <Link
              to="/login"
              className="w-full sm:w-auto flex-1 py-3.5 px-7 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 active:scale-95 text-white font-bold text-sm sm:text-base tracking-wide transition text-center"
            >
              I already have an account
            </Link>
          </div>

          {/* Quick Demo Switcher Bar */}
          <div className="pt-4 max-w-xl mx-auto">
            <div className="p-3 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-md">
              <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider block mb-2">
                ⚡ Instant College Demo Mode:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <button
                  onClick={() => handleQuickDemo('DONOR')}
                  className="py-1.5 px-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold transition"
                >
                  🍕 Donor
                </button>
                <button
                  onClick={() => handleQuickDemo('NGO')}
                  className="py-1.5 px-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold transition"
                >
                  🏢 NGO
                </button>
                <button
                  onClick={() => handleQuickDemo('VOLUNTEER')}
                  className="py-1.5 px-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold transition"
                >
                  🛵 Volunteer
                </button>
                <button
                  onClick={() => handleQuickDemo('ADMIN')}
                  className="py-1.5 px-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold transition"
                >
                  📊 Admin
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================
          SCREEN 2: HOME FEED (From Mockup Screen 2)
          ======================================================== */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6">
        
        {/* Top Header Greeting Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#fdf8ee] border border-[#d5e5cf] flex items-center justify-center shadow-xs">
              <svg viewBox="0 0 40 40" className="w-6 h-6 fill-none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 7 C 20 7 24 10 24 14 C 21 14 19 12 20 7 Z" fill="#15803d" />
                <path d="M19 8 C 19 8 16 11 16 14 C 18.5 14.5 19.5 12 19 8 Z" fill="#22c55e" />
                <path d="M20 14 C 27 14 31 19 31 25 C 31 31.5 26 35 20 35 C 14 35 9 31.5 9 25 C 9 19 13 14 20 14 Z" fill="#15803d" />
                <path d="M20 16.5 C 25.5 16.5 28.5 20.5 28.5 25.2 C 28.5 30 24.5 32.8 20 32.8 C 15.5 32.8 11.5 30 11.5 25.2 C 11.5 20.5 14.5 16.5 20 16.5 Z" fill="#fdfbf7" />
                <path d="M20 22 C 22 19.5 25 21 24.5 23.5 C 24 25.5 20 29 20 29 C 20 29 16 25.5 15.5 23.5 C 15 21 18 19.5 20 22 Z" fill="#f59e0b" />
              </svg>
            </div>
            <div>
              <span className="text-xs text-slate-500 font-medium block">Good morning</span>
              <span className="text-base font-extrabold text-[#0f3825]">
                {user?.full_name || 'Annam Member'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => {
                const el = document.getElementById('search-input');
                if (el) el.focus();
              }}
              className="w-10 h-10 rounded-full bg-white border border-[#d6e5d1] text-[#0f3825] flex items-center justify-center shadow-xs hover:bg-[#eaf3e7] transition"
              title="Search"
            >
              <Search className="w-4 h-4" />
            </button>
            <button 
              onClick={() => navigate('/notifications')}
              className="w-10 h-10 rounded-full bg-white border border-[#d6e5d1] text-[#0f3825] flex items-center justify-center shadow-xs hover:bg-[#eaf3e7] transition relative"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#f29913]" />
            </button>
          </div>
        </div>

        {/* Emerald Hero Banner Card (Screen 2 Hero) */}
        <div className="p-6 sm:p-7 rounded-[32px] bg-[#0d3822] text-white shadow-lg relative overflow-hidden flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          {/* Decorative Background Doodles */}
          <div className="absolute right-0 top-0 w-48 h-48 bg-white/5 rounded-full blur-xl pointer-events-none" />

          <div className="space-y-2 relative z-10 max-w-sm">
            <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-snug">
              Food left after a function?
            </h2>
            <p className="text-xs sm:text-sm text-emerald-200/90 font-medium">
              Share it with families in need
            </p>
            <div className="pt-2">
              <Link
                to={user ? "/donor/donate" : "/donor/donate"}
                className="inline-flex items-center gap-2 py-2.5 px-6 rounded-full bg-[#f29913] hover:bg-[#d97706] text-[#0a291b] font-black text-xs tracking-wider uppercase shadow-md shadow-[#f29913]/30 transition active:scale-95"
              >
                Donate now
              </Link>
            </div>
          </div>

          {/* Large Emblem Graphic */}
          <div className="relative z-10 self-center sm:self-auto shrink-0">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#fdf8ee] border-4 border-white/20 shadow-xl flex items-center justify-center">
              <svg viewBox="0 0 40 40" className="w-14 h-14 fill-none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 7 C 20 7 24 10 24 14 C 21 14 19 12 20 7 Z" fill="#15803d" />
                <path d="M19 8 C 19 8 16 11 16 14 C 18.5 14.5 19.5 12 19 8 Z" fill="#22c55e" />
                <path d="M20 14 C 27 14 31 19 31 25 C 31 31.5 26 35 20 35 C 14 35 9 31.5 9 25 C 9 19 13 14 20 14 Z" fill="#15803d" />
                <path d="M20 16.5 C 25.5 16.5 28.5 20.5 28.5 25.2 C 28.5 30 24.5 32.8 20 32.8 C 15.5 32.8 11.5 30 11.5 25.2 C 11.5 20.5 14.5 16.5 20 16.5 Z" fill="#fdfbf7" />
                <path d="M20 22 C 22 19.5 25 21 24.5 23.5 C 24 25.5 20 29 20 29 C 20 29 16 25.5 15.5 23.5 C 15 21 18 19.5 20 22 Z" fill="#f59e0b" />
              </svg>
            </div>
          </div>
        </div>

        {/* Quick Function Categories (Screen 2 Category Bar) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Filter by Function
            </span>
          </div>

          <div className="flex items-center gap-2.5 overflow-x-auto pb-1 no-scrollbar">
            {CATEGORIES.map(cat => {
              const Icon = cat.icon;
              const isSelected = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2.5 rounded-2xl flex items-center gap-2 shrink-0 border transition-all text-xs font-bold ${
                    isSelected 
                      ? 'bg-[#0f3825] text-white border-[#0f3825] shadow-sm' 
                      : 'bg-white hover:bg-[#eaf3e7] text-[#0f3825] border-[#d6e5d1]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-[#f59e0b]' : 'text-[#15803d]'}`} />
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            id="search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by food name, wedding hall, or location..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-[#d6e5d1] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0f3825] shadow-xs"
          />
        </div>

        {/* "Fresh near you" Section (Screen 2 Donation Cards) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-black text-[#0f3825] tracking-tight">
              Fresh near you
            </h3>
            <button 
              onClick={() => setActiveCategory('ALL')} 
              className="text-xs font-bold text-[#15803d] hover:underline flex items-center gap-1"
            >
              See all <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {filteredDonations.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-3xl border border-[#d6e5d1] space-y-2">
              <Soup className="w-10 h-10 text-slate-400 mx-auto" />
              <p className="text-sm font-bold text-slate-700">No leftover food listed under this filter</p>
              <p className="text-xs text-slate-500">Be the first to post a donation from your event!</p>
              <Link 
                to="/donor/donate" 
                className="inline-block mt-2 px-5 py-2 rounded-full bg-[#f29913] text-[#0a291b] font-bold text-xs"
              >
                Post Donation
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredDonations.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleCardClick(item)}
                  className="p-4 rounded-3xl bg-white border border-[#d6e5d1] hover:border-[#0f3825] shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3.5">
                    {/* Rounded Green Icon Container */}
                    <div className="w-14 h-14 rounded-2xl bg-[#0d3822] text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                      {item.icon_type === 'bowl' ? (
                        <svg viewBox="0 0 32 32" className="w-7 h-7 fill-none stroke-emerald-300 stroke-[1.8] stroke-linecap-round stroke-linejoin-round" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6 15 C6 23 11 27 16 27 C21 27 26 23 26 15 Z" />
                          <path d="M12 9 C12 7 13 6 13 4" />
                          <path d="M16 10 C16 8 17 7 17 4" />
                          <path d="M20 9 C20 7 21 6 21 4" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 32 32" className="w-7 h-7 fill-none stroke-emerald-300 stroke-[1.8] stroke-linecap-round stroke-linejoin-round" xmlns="http://www.w3.org/2000/svg">
                          <path d="M16 26 V12" />
                          <path d="M16 14 C16 14 22 14 24 8 C18 8 16 14 16 14 Z" />
                          <path d="M16 18 C16 18 10 18 8 12 C14 12 16 18 16 18 Z" />
                        </svg>
                      )}
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-sm font-black text-[#0f3825] tracking-tight group-hover:text-emerald-800 transition">
                        {item.food_name}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium line-clamp-1">
                        {item.event_type}
                      </p>
                      
                      {/* Pill Badges Matching Screenshot */}
                      <div className="flex items-center gap-2 pt-0.5">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#eaf3e7] text-[#0f3825] text-[10px] font-bold">
                          {item.number_of_packets ? `${item.number_of_packets} servings` : (item.quantity ? `${Math.round(item.quantity * 2)} servings` : '40 servings')}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-[#fef3c7] text-[#b45309] text-[10px] font-bold">
                          {item.available_until || '10:30 pm'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 p-2 text-slate-300 group-hover:text-[#0f3825] transition">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Live Volunteer Status Quick-Launcher (Direct Link to Screen 5) */}
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-[#0d3822] to-[#154c31] text-white shadow-md flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
              <Truck className="w-6 h-6 text-[#f59e0b]" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-300 tracking-wider block">Live Volunteer Tracking</span>
              <h4 className="text-sm font-bold">View Active Delivery #4821</h4>
              <p className="text-xs text-emerald-100/80">Volunteer en route • ETA 12 min</p>
            </div>
          </div>

          <Link
            to="/track/4821"
            className="py-2.5 px-4 rounded-xl bg-[#f29913] hover:bg-[#d97706] text-[#0a291b] font-black text-xs shrink-0 shadow-md transition flex items-center gap-1.5"
          >
            Track Status <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </section>

      {/* Interactive Food Details / Claim Modal (Screen 4 from mockup) */}
      <FoodDetailsModal
        donation={selectedDonation}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onClaimSuccess={(claimed) => {
          // claimed callback
        }}
      />

    </div>
  );
};

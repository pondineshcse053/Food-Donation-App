import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  Heart, 
  Plus, 
  Clock, 
  User, 
  MapPin, 
  Layers,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const BottomDock = ({ onOpenDonate }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const currentPath = location.pathname;

  const handleCenterAction = () => {
    if (onOpenDonate) {
      onOpenDonate();
    } else {
      navigate('/donor/donate');
    }
  };

  const getProfileLink = () => {
    if (!user) return '/login';
    if (user.role === 'DONOR') return '/donor/dashboard';
    if (user.role === 'NGO') return '/ngo/dashboard';
    if (user.role === 'VOLUNTEER') return '/volunteer/dashboard';
    if (user.role === 'ADMIN') return '/admin/dashboard';
    return '/donor/dashboard';
  };

  return (
    <div className="fixed bottom-4 inset-x-0 z-40 flex justify-center px-4 pointer-events-none">
      <nav 
        aria-label="Mobile Navigation Dock"
        className="pointer-events-auto bg-white/95 backdrop-blur-md rounded-full px-5 py-2.5 shadow-xl border border-[#d6e5d1] flex items-center gap-6 sm:gap-8 max-w-md w-full justify-around"
      >
        {/* 1. Home */}
        <button
          onClick={() => navigate('/')}
          className={`flex flex-col items-center gap-1 transition-colors ${
            currentPath === '/' ? 'text-[#0f3825] font-bold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <div className={`p-1.5 rounded-full ${currentPath === '/' ? 'bg-[#eaf3e7]' : ''}`}>
            <Home className="w-5 h-5" />
          </div>
          <span className="text-[10px]">Home</span>
        </button>

        {/* 2. Claims / NGO Feed */}
        <button
          onClick={() => navigate(user?.role === 'NGO' ? '/ngo/dashboard' : '/ngo/dashboard')}
          className={`flex flex-col items-center gap-1 transition-colors ${
            currentPath.includes('ngo') ? 'text-[#0f3825] font-bold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <div className={`p-1.5 rounded-full ${currentPath.includes('ngo') ? 'bg-[#eaf3e7]' : ''}`}>
            <Heart className="w-5 h-5" />
          </div>
          <span className="text-[10px]">Claims</span>
        </button>

        {/* 3. Center FAB: Donate (+) */}
        <button
          onClick={handleCenterAction}
          className="w-13 h-13 -mt-6 rounded-full bg-[#f29913] hover:bg-[#d97706] active:scale-95 text-[#0a291b] flex items-center justify-center shadow-lg shadow-[#f29913]/40 border-4 border-[#f3f7f0] transition group"
          title="Donate Leftover Food"
        >
          <Plus className="w-6 h-6 stroke-[3] group-hover:rotate-90 transition-transform duration-300" />
        </button>

        {/* 4. History / Tracking */}
        <button
          onClick={() => navigate(user?.role === 'VOLUNTEER' ? '/volunteer/dashboard' : '/donor/dashboard')}
          className={`flex flex-col items-center gap-1 transition-colors ${
            currentPath.includes('track') || currentPath.includes('volunteer') ? 'text-[#0f3825] font-bold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <div className={`p-1.5 rounded-full ${currentPath.includes('track') ? 'bg-[#eaf3e7]' : ''}`}>
            <Clock className="w-5 h-5" />
          </div>
          <span className="text-[10px]">History</span>
        </button>

        {/* 5. Profile */}
        <button
          onClick={() => navigate(getProfileLink())}
          className={`flex flex-col items-center gap-1 transition-colors ${
            currentPath.includes('dashboard') || currentPath === '/login' ? 'text-[#0f3825] font-bold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <div className={`p-1.5 rounded-full ${currentPath.includes('dashboard') ? 'bg-[#eaf3e7]' : ''}`}>
            <User className="w-5 h-5" />
          </div>
          <span className="text-[10px]">Profile</span>
        </button>
      </nav>
    </div>
  );
};

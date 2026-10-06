import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { notificationService } from '../services/api';
import { 
  HeartHandshake, 
  Bell, 
  LogOut, 
  User, 
  Menu, 
  X, 
  ShieldCheck, 
  Truck, 
  Building2, 
  Gift, 
  BarChart3, 
  Compass,
  CheckCircle2,
  Clock
} from 'lucide-react';

export const Navbar = () => {
  const { user, logout, loginAsDemo } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const res = await notificationService.getAll();
      setNotifications(res.data);
      const unread = res.data.filter(n => !n.is_read).length;
      setUnreadCount(unread);
    } catch (err) {
      console.error("Failed to load notifications:", err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 15000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllRead();
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  const handleNotificationClick = async (notif) => {
    try {
      if (!notif.is_read) {
        await notificationService.markRead(notif.id);
        setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, is_read: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      setNotificationsOpen(false);
      if (notif.link) {
        navigate(notif.link);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'DONOR': return '/donor/dashboard';
      case 'NGO': return '/ngo/dashboard';
      case 'VOLUNTEER': return '/volunteer/dashboard';
      case 'ADMIN': return '/admin/dashboard';
      default: return '/dashboard';
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-green-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-green-600/20">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
                FoodBridge AI
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Redistribution OS
              </span>
            </div>
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 font-medium text-sm text-slate-600">
            <Link to="/" className="px-3 py-2 rounded-lg hover:text-green-600 hover:bg-slate-50 transition">
              Home
            </Link>
            <Link to="/impact" className="px-3 py-2 rounded-lg hover:text-green-600 hover:bg-slate-50 transition">
              Impact
            </Link>
            <Link to="/government" className="px-3 py-2 rounded-lg hover:text-green-600 hover:bg-slate-50 transition">
              Gov Authority
            </Link>
            
            {user && (
              <Link to={getDashboardLink()} className="px-3 py-2 rounded-lg font-semibold text-green-700 bg-green-50/70 border border-green-200/60 hover:bg-green-100/60 transition">
                My Dashboard
              </Link>
            )}

            {user?.role === 'DONOR' && (
              <Link to="/donor/donate" className="px-3 py-2 rounded-lg text-emerald-600 hover:bg-emerald-50 transition flex items-center gap-1">
                <Gift className="w-4 h-4" /> Donate Food
              </Link>
            )}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Quick Demo Switcher Menu (College Presentation Ready) */}
            <div className="hidden lg:flex items-center gap-1 px-2 py-1 bg-slate-100 rounded-lg text-xs font-medium text-slate-600">
              <span className="text-[11px] text-slate-400 font-semibold px-1">Demo:</span>
              <button 
                onClick={async () => { await loginAsDemo('DONOR'); navigate('/donor/dashboard'); }}
                className={`px-2 py-1 rounded transition ${user?.role === 'DONOR' ? 'bg-green-600 text-white font-bold' : 'hover:bg-slate-200'}`}
              >
                Donor
              </button>
              <button 
                onClick={async () => { await loginAsDemo('NGO'); navigate('/ngo/dashboard'); }}
                className={`px-2 py-1 rounded transition ${user?.role === 'NGO' ? 'bg-blue-600 text-white font-bold' : 'hover:bg-slate-200'}`}
              >
                NGO
              </button>
              <button 
                onClick={async () => { await loginAsDemo('VOLUNTEER'); navigate('/volunteer/dashboard'); }}
                className={`px-2 py-1 rounded transition ${user?.role === 'VOLUNTEER' ? 'bg-amber-600 text-white font-bold' : 'hover:bg-slate-200'}`}
              >
                Volunteer
              </button>
              <button 
                onClick={async () => { await loginAsDemo('ADMIN'); navigate('/admin/dashboard'); }}
                className={`px-2 py-1 rounded transition ${user?.role === 'ADMIN' ? 'bg-purple-600 text-white font-bold' : 'hover:bg-slate-200'}`}
              >
                Admin
              </button>
            </div>

            {/* Notification Bell */}
            {user && (
              <div className="relative">
                <button
                  id="notifications-bell-btn"
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="relative p-2 text-slate-600 hover:text-green-700 hover:bg-slate-100 rounded-xl transition"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50">
                    <div className="p-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-800">Notifications</span>
                        <span className="text-xs px-2 py-0.5 bg-emerald-100 text-emerald-700 font-semibold rounded-full">
                          {unreadCount} new
                        </span>
                      </div>
                      {unreadCount > 0 && (
                        <button 
                          onClick={handleMarkAllRead}
                          className="text-xs font-medium text-emerald-600 hover:underline"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>

                    <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-sm text-slate-400">
                          No notifications yet
                        </div>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            onClick={() => handleNotificationClick(n)}
                            className={`p-3.5 hover:bg-slate-50 cursor-pointer transition flex items-start gap-3 ${
                              !n.is_read ? 'bg-emerald-50/40' : ''
                            }`}
                          >
                            <div className="mt-0.5">
                              {n.type === 'SUCCESS' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                              {n.type === 'ALERT' && <Clock className="w-4 h-4 text-rose-500" />}
                              {n.type === 'ACTION' && <Truck className="w-4 h-4 text-amber-500" />}
                              {n.type === 'INFO' && <Bell className="w-4 h-4 text-blue-500" />}
                            </div>
                            <div className="flex-1">
                              <p className={`text-xs ${!n.is_read ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>
                                {n.title}
                              </p>
                              <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                                {n.message}
                              </p>
                              <span className="text-[10px] text-slate-400 mt-1 block">
                                {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            {!n.is_read && (
                              <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5" />
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Authenticated User / Login button */}
            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  to={getDashboardLink()}
                  className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-xl transition text-slate-700 text-xs font-semibold"
                >
                  <div className="w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center text-[11px] font-bold">
                    {user.full_name?.charAt(0) || 'U'}
                  </div>
                  <span className="hidden sm:inline max-w-[110px] truncate">{user.full_name}</span>
                  <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                    user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                    user.role === 'NGO' ? 'bg-blue-100 text-blue-700' :
                    user.role === 'VOLUNTEER' ? 'bg-amber-100 text-amber-700' :
                    'bg-emerald-100 text-emerald-700'
                  }`}>
                    {user.role}
                  </span>
                </Link>

                <button
                  onClick={() => { logout(); navigate('/'); }}
                  title="Logout"
                  className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-green-700 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-xl shadow-sm shadow-green-600/30 transition"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-100 space-y-2">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
            >
              Home
            </Link>
            <Link
              to="/impact"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
            >
              Impact Dashboard
            </Link>
            <Link
              to="/government"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
            >
              Government Support Authority
            </Link>
            {user && (
              <Link
                to={getDashboardLink()}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-bold text-green-700 bg-green-50 rounded-lg"
              >
                Go to {user.role} Dashboard
              </Link>
            )}
            <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-2">
              <span className="w-full text-xs text-slate-400 font-semibold">Switch Demo Persona:</span>
              <button 
                onClick={async () => { await loginAsDemo('DONOR'); setMobileMenuOpen(false); navigate('/donor/dashboard'); }}
                className="px-2.5 py-1 text-xs rounded bg-green-100 text-green-800 font-semibold"
              >
                Donor
              </button>
              <button 
                onClick={async () => { await loginAsDemo('NGO'); setMobileMenuOpen(false); navigate('/ngo/dashboard'); }}
                className="px-2.5 py-1 text-xs rounded bg-blue-100 text-blue-800 font-semibold"
              >
                NGO
              </button>
              <button 
                onClick={async () => { await loginAsDemo('VOLUNTEER'); setMobileMenuOpen(false); navigate('/volunteer/dashboard'); }}
                className="px-2.5 py-1 text-xs rounded bg-amber-100 text-amber-800 font-semibold"
              >
                Volunteer
              </button>
              <button 
                onClick={async () => { await loginAsDemo('ADMIN'); setMobileMenuOpen(false); navigate('/admin/dashboard'); }}
                className="px-2.5 py-1 text-xs rounded bg-purple-100 text-purple-800 font-semibold"
              >
                Admin
              </button>
            </div>
          </div>
        )}

      </div>
    </header>
  );
};

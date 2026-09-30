import React, { useState } from 'react';
import {
  Compass,
  PlusCircle,
  Sparkles,
  Bell,
  User as UserIcon,
  LogOut,
  Shield,
  Menu,
  X,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
  HelpCircle,
  ChevronDown,
  Sun,
  Moon,
  Building2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenReportModal?: (type: 'lost' | 'found') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab }) => {
  const { user, logout, switchDemo, openAuthModal } = useAuth();
  const { unreadCount, notifications, markAsRead, markAllAsRead } = useNotifications();
  const { theme, toggleTheme } = useTheme();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);

  const handleNav = (tab: string) => {
    setCurrentTab(tab);
    setMobileMenuOpen(false);
    setNotifDropdownOpen(false);
    setUserMenuOpen(false);
    setDemoMenuOpen(false);
  };

  return (
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0b0f19]/95 backdrop-blur-md border-b border-slate-200/90 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Brand Wordmark */}
          <button
            onClick={() => handleNav('landing')}
            className="flex items-center gap-2.5 text-left group transition-transform focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm font-bold text-base">
              LF
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors block leading-tight">
                Lost & Found
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block">
                Pragati Engineering College
              </span>
            </div>
          </button>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
            <button
              onClick={() => handleNav('browse')}
              className={`hover:text-blue-600 dark:hover:text-blue-400 transition-colors whitespace-nowrap ${
                currentTab === 'browse' ? 'text-blue-600 dark:text-blue-400 font-semibold' : ''
              }`}
            >
              Browse Directory
            </button>
            <button
              onClick={() => handleNav('report_lost')}
              className={`hover:text-blue-600 dark:hover:text-blue-400 transition-colors whitespace-nowrap ${
                currentTab === 'report_lost' ? 'text-blue-600 dark:text-blue-400 font-semibold' : ''
              }`}
            >
              Report Lost
            </button>
            <button
              onClick={() => handleNav('report_found')}
              className={`hover:text-blue-600 dark:hover:text-blue-400 transition-colors whitespace-nowrap ${
                currentTab === 'report_found' ? 'text-blue-600 dark:text-blue-400 font-semibold' : ''
              }`}
            >
              Report Found
            </button>
            <button
              onClick={() => handleNav('matches')}
              className={`flex items-center gap-1.5 hover:text-blue-600 dark:hover:text-blue-400 transition-colors whitespace-nowrap ${
                currentTab === 'matches' ? 'text-blue-600 dark:text-blue-400 font-semibold' : ''
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
              <span>Matches</span>
            </button>
            <button
              onClick={() => handleNav('how_it_works')}
              className={`hover:text-blue-600 dark:hover:text-blue-400 transition-colors whitespace-nowrap ${
                currentTab === 'how_it_works' ? 'text-blue-600 dark:text-blue-400 font-semibold' : ''
              }`}
            >
              How It Works
            </button>
            {user?.role === 'admin' && (
              <button
                onClick={() => handleNav('admin')}
                className={`flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors whitespace-nowrap text-indigo-700 dark:text-indigo-300 font-medium ${
                  currentTab === 'admin' ? 'font-bold underline' : ''
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                Admin Console
              </button>
            )}
          </nav>

          {/* Zone 3: Actions (Theme Toggle, Persona Switcher, Notifications, User) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Light / Dark Mode Toggle Switch */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all focus:outline-none"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle Light and Dark Mode"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400 transition-transform rotate-0 hover:rotate-90 duration-300" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700 transition-transform rotate-0 hover:-rotate-12 duration-300" />
              )}
            </button>

            {/* Quick Demo Persona Switcher */}
            <div className="relative">
              <button
                onClick={() => {
                  setDemoMenuOpen(!demoMenuOpen);
                  setNotifDropdownOpen(false);
                  setUserMenuOpen(false);
                }}
                className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors whitespace-nowrap"
                title="Switch demo persona instantly"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Role: {user ? user.name.split(' ')[0] : 'Demo'}</span>
                <ChevronDown className="w-3 h-3 text-slate-500 dark:text-slate-400" />
              </button>

              {demoMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#131b2e] rounded-xl shadow-xl dark:shadow-black/60 border border-slate-200 dark:border-slate-800 py-1.5 z-50 text-left">
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Fast Demo Role Switch
                  </div>
                  <button
                    onClick={() => {
                      switchDemo('sarah');
                      setDemoMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between text-slate-700 dark:text-slate-300"
                  >
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">Sarah Connor (Student)</div>
                      <div className="text-slate-500 dark:text-slate-400">Reports lost belongings & claims</div>
                    </div>
                    {user?.email === 'student@lostandfound.edu' && (
                      <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    )}
                  </button>
                  <button
                    onClick={() => {
                      switchDemo('david');
                      setDemoMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between text-slate-700 dark:text-slate-300"
                  >
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">David Miller (Finder)</div>
                      <div className="text-slate-500 dark:text-slate-400">Reports found items & reviews claims</div>
                    </div>
                    {user?.email === 'finder@lostandfound.edu' && (
                      <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    )}
                  </button>
                  <button
                    onClick={() => {
                      switchDemo('admin');
                      setDemoMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between text-slate-700 dark:text-slate-300"
                  >
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">Campus Administrator</div>
                      <div className="text-slate-500 dark:text-slate-400">Full audit, claims moderation</div>
                    </div>
                    {user?.role === 'admin' && (
                      <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Notifications Dropdown */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => {
                    setNotifDropdownOpen(!notifDropdownOpen);
                    setUserMenuOpen(false);
                    setDemoMenuOpen(false);
                  }}
                  className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 relative transition-colors"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full ring-2 ring-white dark:ring-slate-900"></span>
                  )}
                </button>

                {notifDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#131b2e] rounded-xl shadow-xl dark:shadow-black/60 border border-slate-200 dark:border-slate-800 py-2 z-50 text-left">
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        Notifications ({unreadCount})
                      </span>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>

                    <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-xs text-slate-400">
                          No notifications yet
                        </div>
                      ) : (
                        notifications.slice(0, 5).map(n => (
                          <div
                            key={n.notification_id}
                            onClick={() => {
                              markAsRead(n.notification_id);
                              if (n.link) {
                                const tab = n.link.replace('/', '');
                                handleNav(tab || 'dashboard');
                              }
                            }}
                            className={`p-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors ${
                              !n.is_read ? 'bg-blue-50/50 dark:bg-blue-950/20' : ''
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              <span
                                className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                                  !n.is_read ? 'bg-blue-600' : 'bg-transparent'
                                }`}
                              />
                              <div className="flex-1">
                                <div className="text-xs font-semibold text-slate-900 dark:text-white">
                                  {n.title}
                                </div>
                                <div className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 line-clamp-2">
                                  {n.message}
                                </div>
                                <div className="text-[10px] text-slate-400 mt-1 font-mono tabular-nums">
                                  {new Date(n.created_at).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 text-center">
                      <button
                        onClick={() => handleNav('notifications')}
                        className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        View all notifications
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* User Account / Sign In */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => {
                    setUserMenuOpen(!userMenuOpen);
                    setNotifDropdownOpen(false);
                    setDemoMenuOpen(false);
                  }}
                  className="flex items-center gap-2 p-1 pl-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
                >
                  <img
                    src={user.profile_image || 'https://api.dicebear.com/7.x/initials/svg?seed=User'}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover border border-slate-300 dark:border-slate-700"
                  />
                  <div className="hidden sm:block">
                    <div className="text-xs font-semibold text-slate-900 dark:text-white leading-tight">
                      {user.name}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 capitalize">{user.role}</div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#131b2e] rounded-xl shadow-xl dark:shadow-black/60 border border-slate-200 dark:border-slate-800 py-1.5 z-50 text-left">
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                      <div className="text-xs font-semibold text-slate-900 dark:text-white">{user.name}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</div>
                    </div>

                    <button
                      onClick={() => handleNav('dashboard')}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                    >
                      <Layers className="w-4 h-4 text-slate-500" />
                      Dashboard
                    </button>
                    <button
                      onClick={() => handleNav('my_reports')}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                    >
                      <Clock className="w-4 h-4 text-slate-500" />
                      My Reported Items
                    </button>
                    <button
                      onClick={() => handleNav('my_claims')}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4 text-slate-500" />
                      My Claims
                    </button>
                    <button
                      onClick={() => handleNav('profile')}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                    >
                      <UserIcon className="w-4 h-4 text-slate-500" />
                      Profile & Settings
                    </button>

                    {user.role === 'admin' && (
                      <button
                        onClick={() => handleNav('admin')}
                        className="w-full text-left px-4 py-2 text-xs text-indigo-700 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 flex items-center gap-2 font-medium border-t border-slate-100 dark:border-slate-800"
                      >
                        <Shield className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        Admin Dashboard
                      </button>
                    )}

                    <div className="border-t border-slate-100 dark:border-slate-800 mt-1">
                      <button
                        onClick={async () => {
                          await logout();
                          setUserMenuOpen(false);
                          handleNav('landing');
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4 text-red-500" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openAuthModal('login')}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Log In
                </button>
                <button
                  onClick={() => openAuthModal('register')}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm"
                >
                  Register
                </button>
              </div>
            )}

            {/* Mobile menu hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-slate-200 dark:border-slate-800 space-y-1">
            <div className="px-3 py-1.5 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>Theme</span>
              <button
                onClick={toggleTheme}
                className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold"
              >
                {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
                <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
              </button>
            </div>
            <button
              onClick={() => handleNav('browse')}
              className="w-full text-left px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md"
            >
              Browse Directory
            </button>
            <button
              onClick={() => handleNav('report_lost')}
              className="w-full text-left px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md"
            >
              Report Lost Item
            </button>
            <button
              onClick={() => handleNav('report_found')}
              className="w-full text-left px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md"
            >
              Report Found Item
            </button>
            <button
              onClick={() => handleNav('matches')}
              className="w-full text-left px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md flex items-center justify-between"
            >
              <span>Potential Matches</span>
              <Sparkles className="w-4 h-4 text-blue-600" />
            </button>
            <button
              onClick={() => handleNav('how_it_works')}
              className="w-full text-left px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md"
            >
              How It Works
            </button>
            {user && (
              <>
                <button
                  onClick={() => handleNav('dashboard')}
                  className="w-full text-left px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => handleNav('my_reports')}
                  className="w-full text-left px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md"
                >
                  My Reports
                </button>
                <button
                  onClick={() => handleNav('my_claims')}
                  className="w-full text-left px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md"
                >
                  My Claims
                </button>
              </>
            )}
            {user?.role === 'admin' && (
              <button
                onClick={() => handleNav('admin')}
                className="w-full text-left px-3 py-2 text-sm font-semibold text-indigo-700 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-md"
              >
                Admin Console
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

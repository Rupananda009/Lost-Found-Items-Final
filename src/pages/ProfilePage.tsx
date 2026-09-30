import React, { useState, useEffect } from 'react';
import {
  User as UserIcon,
  Mail,
  Phone,
  Calendar,
  Lock,
  Shield,
  CheckCircle2,
  LogOut,
  Edit,
  Save
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { api } from '../services/api';

interface ProfilePageProps {
  onNav: (tab: string) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onNav }) => {
  const { user, updateProfile, logout } = useAuth();
  const { showToast } = useNotifications();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [profileImage, setProfileImage] = useState(user?.profile_image || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [stats, setStats] = useState({ reports: 0, claims: 0, returned: 0 });

  useEffect(() => {
    if (!user) return;
    setName(user.name);
    setPhone(user.phone || '');
    setProfileImage(user.profile_image || '');

    const loadStats = async () => {
      try {
        const [itemsRes, claimsRes] = await Promise.all([
          api.getItems({ userId: user.user_id }),
          api.getClaims(),
        ]);
        const returned = itemsRes.items.filter(i => i.status === 'returned').length;
        setStats({
          reports: itemsRes.items.length,
          claims: claimsRes.claims.length,
          returned,
        });
      } catch (err) {
        console.warn('Failed to load user stats:', err);
      }
    };
    loadStats();
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-3">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Please Sign In</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">Sign in to access your profile settings.</p>
        <button
          onClick={() => onNav('browse')}
          className="mt-4 px-4 py-2 text-xs font-bold text-white bg-blue-600 rounded-lg shadow-xs"
        >
          Browse Directory
        </button>
      </div>
    );
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password && password !== confirmPassword) {
      showToast('New passwords do not match.', 'error');
      return;
    }
    if (password && password.length < 6) {
      showToast('Password must be at least 6 characters.', 'error');
      return;
    }

    try {
      setLoading(true);
      await updateProfile({
        name,
        phone,
        profile_image: profileImage,
        password: password || undefined,
      });
      showToast('Profile updated successfully!', 'success');
      setPassword('');
      setConfirmPassword('');
      setEditing(false);
    } catch (err: any) {
      showToast(err.message || 'Failed to update profile.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          User Profile & Security
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage your account credentials, contact coordinates, and privacy settings.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Column: Profile Card & Activity Stats */}
        <div className="md:col-span-4 bg-white dark:bg-[#111a2e] p-6 rounded-2xl border border-slate-200/90 dark:border-[#202f4d] shadow-xs dark:shadow-xl dark:shadow-black/50 space-y-6 text-slate-800 dark:text-slate-200">
          <div className="text-center space-y-3">
            <div className="relative inline-block">
              <img
                src={user.profile_image || 'https://api.dicebear.com/7.x/initials/svg?seed=User'}
                alt={user.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-slate-100 dark:border-[#202f4d] mx-auto"
              />
              <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-[#070b14] rounded-full"></span>
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">{user.name}</h2>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">{user.email}</div>
              <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 capitalize border border-transparent dark:border-blue-900/40">
                {user.role} Account
              </span>
            </div>
          </div>

          <div className="border-t border-slate-100 dark:border-[#1d2b47] pt-4 space-y-3 text-xs">
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
              <span>Account Status</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400 capitalize">{user.status}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
              <span>Member Since</span>
              <span className="font-mono tabular-nums">
                {new Date(user.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Activity Metrics */}
          <div className="border-t border-slate-100 dark:border-[#1d2b47] pt-4 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2 bg-slate-50 dark:bg-[#0c1221] rounded-lg border border-transparent dark:border-[#1d2b47]">
              <div className="text-lg font-bold text-slate-900 dark:text-white font-mono tabular-nums">
                {stats.reports}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase mt-0.5">Reports</div>
            </div>
            <div className="p-2 bg-slate-50 dark:bg-[#0c1221] rounded-lg border border-transparent dark:border-[#1d2b47]">
              <div className="text-lg font-bold text-purple-700 dark:text-purple-400 font-mono tabular-nums">
                {stats.claims}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase mt-0.5">Claims</div>
            </div>
            <div className="p-2 bg-slate-50 dark:bg-[#0c1221] rounded-lg border border-transparent dark:border-[#1d2b47]">
              <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums">
                {stats.returned}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase mt-0.5">Returned</div>
            </div>
          </div>

          <div className="border-t border-slate-100 dark:border-[#1d2b47] pt-4">
            <button
              onClick={async () => {
                await logout();
                onNav('landing');
              }}
              className="w-full py-2.5 px-3 text-xs font-bold text-red-600 dark:text-red-400 hover:text-red-700 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-lg transition-colors flex items-center justify-center gap-2 border border-transparent dark:border-red-900/40"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Right Column: Edit Profile & Password Form */}
        <div className="md:col-span-8 bg-white dark:bg-[#111a2e] p-6 sm:p-8 rounded-2xl border border-slate-200/90 dark:border-[#202f4d] shadow-xs dark:shadow-xl dark:shadow-black/50 space-y-6 text-slate-800 dark:text-slate-200">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-[#1d2b47]">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Personal Information</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Update your public profile and recovery contact</p>
            </div>
            {!editing ? (
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="px-3 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-950/60 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
              >
                Cancel
              </button>
            )}
          </div>

          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                disabled={!editing}
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full p-2.5 text-xs sm:text-sm border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:opacity-70 disabled:bg-slate-50 dark:disabled:bg-slate-900/40"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
              <input
                type="email"
                disabled
                value={user.email}
                className="w-full p-2.5 text-xs sm:text-sm border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 text-slate-500 dark:text-slate-400 rounded-lg cursor-not-allowed"
              />
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                Your campus email is verified and cannot be altered directly.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Contact Phone (For Handover Coordination)
              </label>
              <input
                type="tel"
                disabled={!editing}
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full p-2.5 text-xs sm:text-sm border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:opacity-70 disabled:bg-slate-50 dark:disabled:bg-slate-900/40"
              />
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                Never shared publicly on listings. Used only when you accept a claim.
              </p>
            </div>

            {editing && (
              <>
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-1.5">
                    <Lock className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                    <span>Change Password (Leave blank to keep current)</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full p-2.5 text-xs sm:text-sm border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full p-2.5 text-xs sm:text-sm border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs flex items-center gap-2"
                  >
                    {loading ? (
                      <span className="inline-block animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent" />
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

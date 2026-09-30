import React, { useState, useEffect } from 'react';
import {
  Shield,
  Users,
  Layers,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Trash2,
  Flag,
  Search,
  Sparkles,
  BarChart3,
  Clock,
  ExternalLink
} from 'lucide-react';
import { Statistics, User, Item, Claim } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { getItemDisplayImage, getCategoryPlaceholderSvg } from '../utils/imageUtils';

export const AdminPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useNotifications();

  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'items' | 'claims'>('overview');
  const [stats, setStats] = useState<Statistics | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminNote, setAdminNote] = useState<Record<string, string>>({});
  const [searchFilter, setSearchFilter] = useState('');

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes, itemsRes, claimsRes] = await Promise.all([
        api.getAdminStats(),
        api.getAdminUsers(),
        api.getAdminItems(),
        api.getAdminClaims(),
      ]);
      setStats(statsRes.stats);
      setUsers(usersRes.users);
      setItems(itemsRes.items);
      setClaims(claimsRes.claims);
    } catch (err: any) {
      showToast(err.message || 'Failed to load administrator data.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      loadAdminData();
    }
  }, [user]);

  if (!user || user.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 mx-auto flex items-center justify-center">
          <Shield className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Access Restricted</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          This section requires campus administrator privileges.
        </p>
      </div>
    );
  }

  // Action handlers
  const handleToggleUserStatus = async (userId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'active' ? 'suspended' : 'active';
    try {
      await api.updateAdminUserStatus(userId, nextStatus as any);
      setUsers(prev =>
        prev.map(u => (u.user_id === userId ? { ...u, status: nextStatus as any } : u))
      );
      showToast(`User status updated to ${nextStatus}`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to update user', 'error');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to permanently delete this user?')) return;
    try {
      await api.deleteAdminUser(userId);
      setUsers(prev => prev.filter(u => u.user_id !== userId));
      showToast('User removed.', 'info');
    } catch (err: any) {
      showToast(err.message || 'Cannot delete user', 'error');
    }
  };

  const handleToggleFlagItem = async (itemId: string, currentFlagged?: boolean) => {
    try {
      await api.flagAdminItem(itemId, !currentFlagged);
      setItems(prev =>
        prev.map(i => (i.item_id === itemId ? { ...i, is_flagged: !currentFlagged } : i))
      );
      showToast(`Listing flagged status updated.`, 'info');
    } catch (err) {
      showToast('Failed to update flag.', 'error');
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm('Permanently remove this item listing?')) return;
    try {
      await api.deleteAdminItem(itemId);
      setItems(prev => prev.filter(i => i.item_id !== itemId));
      showToast('Item listing removed by administrator.', 'info');
    } catch (err) {
      showToast('Failed to delete item.', 'error');
    }
  };

  const handleClaimDecision = async (claimId: string, status: 'approved' | 'rejected' | 'completed') => {
    const notes = adminNote[claimId] || (status === 'approved' ? 'Verified with department security records.' : 'Proof details did not match found item characteristics.');
    try {
      await api.updateClaim(claimId, { status, admin_notes: notes });
      setClaims(prev =>
        prev.map(c => (c.claim_id === claimId ? { ...c, status, admin_notes: notes } : c))
      );
      showToast(`Claim has been ${status}.`, 'success');
      loadAdminData();
    } catch (err: any) {
      showToast(err.message || 'Failed to update claim.', 'error');
    }
  };

  const handleResetDemoSeed = async () => {
    if (!confirm('Reset application to original demo seed state? All test edits will be restored to initial sample data.')) return;
    try {
      await api.resetSeedData();
      showToast('Database reset to fresh demo state.', 'success');
      loadAdminData();
    } catch (err) {
      showToast('Failed to reset demo data.', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Campus Administration Console
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
              AUDIT PRIVILEGES
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            System metrics, user management, report moderation, and ownership claim resolution.
          </p>
        </div>

        <button
          onClick={handleResetDemoSeed}
          className="px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-[#131b2e] hover:bg-slate-50 dark:hover:bg-[#18223a] border border-slate-200/90 dark:border-slate-800 rounded-lg shadow-xs transition-colors flex items-center gap-1.5 self-start md:self-auto"
          title="Reset sample data for clean demonstration"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
          <span>Reset Demo Seed Data</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-[#0c1221] border border-slate-200/60 dark:border-[#1d2b47] rounded-xl max-w-lg">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
            activeTab === 'overview'
              ? 'bg-white dark:bg-[#18243e] text-slate-900 dark:text-white shadow-xs border border-transparent dark:border-[#2a3c5e]'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('claims')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
            activeTab === 'claims'
              ? 'bg-white dark:bg-[#18243e] text-slate-900 dark:text-white shadow-xs border border-transparent dark:border-[#2a3c5e]'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Claims ({claims.filter(c => c.status === 'pending').length})
        </button>
        <button
          onClick={() => setActiveTab('items')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
            activeTab === 'items'
              ? 'bg-white dark:bg-[#18243e] text-slate-900 dark:text-white shadow-xs border border-transparent dark:border-[#2a3c5e]'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Listings ({items.length})
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
            activeTab === 'users'
              ? 'bg-white dark:bg-[#18243e] text-slate-900 dark:text-white shadow-xs border border-transparent dark:border-[#2a3c5e]'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Users ({users.length})
        </button>
      </div>

      {/* TAB 1: OVERVIEW & ANALYTICS */}
      {activeTab === 'overview' && stats && (
        <div className="space-y-6">
          {/* Key Stat Counters */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="p-4 bg-white dark:bg-[#111a2e] rounded-xl border border-slate-200/90 dark:border-[#202f4d] shadow-xs">
              <div className="text-[11px] font-semibold text-slate-400 dark:text-slate-400 uppercase">Total Users</div>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 font-mono tabular-nums">
                {stats.totalUsers}
              </div>
            </div>
            <div className="p-4 bg-white dark:bg-[#111a2e] rounded-xl border border-slate-200/90 dark:border-[#202f4d] shadow-xs">
              <div className="text-[11px] font-semibold text-slate-400 dark:text-slate-400 uppercase">Lost Reports</div>
              <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 mt-1 font-mono tabular-nums">
                {stats.totalLost}
              </div>
            </div>
            <div className="p-4 bg-white dark:bg-[#111a2e] rounded-xl border border-slate-200/90 dark:border-[#202f4d] shadow-xs">
              <div className="text-[11px] font-semibold text-slate-400 dark:text-slate-400 uppercase">Found Reports</div>
              <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 font-mono tabular-nums">
                {stats.totalFound}
              </div>
            </div>
            <div className="p-4 bg-white dark:bg-[#111a2e] rounded-xl border border-slate-200/90 dark:border-[#202f4d] shadow-xs">
              <div className="text-[11px] font-semibold text-slate-400 dark:text-slate-400 uppercase">Matches</div>
              <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 mt-1 font-mono tabular-nums">
                {stats.totalMatches}
              </div>
            </div>
            <div className="p-4 bg-white dark:bg-[#111a2e] rounded-xl border border-slate-200/90 dark:border-[#202f4d] shadow-xs">
              <div className="text-[11px] font-semibold text-slate-400 dark:text-slate-400 uppercase">Total Claims</div>
              <div className="text-2xl font-extrabold text-purple-600 dark:text-purple-400 mt-1 font-mono tabular-nums">
                {stats.totalClaims}
              </div>
            </div>
            <div className="p-4 bg-white dark:bg-[#111a2e] rounded-xl border border-slate-200/90 dark:border-[#202f4d] shadow-xs">
              <div className="text-[11px] font-semibold text-slate-400 dark:text-slate-400 uppercase">Returned Items</div>
              <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 font-mono tabular-nums">
                {stats.totalReturned}
              </div>
            </div>
          </div>

          {/* Breakdown Charts / Visual Distribution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category Distribution Chart */}
            <div className="bg-white dark:bg-[#111a2e] p-6 rounded-2xl border border-slate-200/90 dark:border-[#202f4d] shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Reports by Category</h3>
                <span className="text-xs text-slate-400 font-mono">Volume Breakdown</span>
              </div>

              <div className="space-y-3 pt-2">
                {Object.entries(stats.categoryBreakdown).map(([cat, count]) => {
                  const total = stats.totalLost + stats.totalFound || 1;
                  const pct = Math.round((count / total) * 100);
                  return (
                    <div key={cat} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{cat}</span>
                        <span className="font-mono tabular-nums text-slate-500 dark:text-slate-400">
                          {count} ({pct}%)
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 dark:bg-[#0c1221] rounded-full overflow-hidden border border-transparent dark:border-[#1d2b47]">
                        <div
                          className="h-full bg-blue-600 rounded-full transition-all duration-500"
                          style={{ width: `${Math.max(8, pct)}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Location Distribution Chart */}
            <div className="bg-white dark:bg-[#111a2e] p-6 rounded-2xl border border-slate-200/90 dark:border-[#202f4d] shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Reports by Campus Location</h3>
                <span className="text-xs text-slate-400 font-mono">Hotspot Activity</span>
              </div>

              <div className="space-y-3 pt-2">
                {Object.entries(stats.locationBreakdown).map(([loc, count]) => {
                  const total = stats.totalLost + stats.totalFound || 1;
                  const pct = Math.round((count / total) * 100);
                  return (
                    <div key={loc} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[200px]">{loc}</span>
                        <span className="font-mono tabular-nums text-slate-500 dark:text-slate-400">
                          {count} ({pct}%)
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 dark:bg-[#0c1221] rounded-full overflow-hidden border border-transparent dark:border-[#1d2b47]">
                        <div
                          className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                          style={{ width: `${Math.max(8, pct)}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CLAIMS REVIEW */}
      {activeTab === 'claims' && (
        <div className="bg-white dark:bg-[#111a2e] rounded-2xl border border-slate-200/90 dark:border-[#202f4d] shadow-xs dark:shadow-xl dark:shadow-black/50 overflow-hidden space-y-4 p-6 text-slate-800 dark:text-slate-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#1d2b47]">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Ownership Claims Verification Queue</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Compare claimant's answers with item details before approving pickup authorization.
              </p>
            </div>
          </div>

          {claims.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 dark:text-slate-400">No claims submitted yet.</div>
          ) : (
            <div className="space-y-4">
              {claims.map(c => {
                const targetItem = items.find(i => i.item_id === c.item_id);
                return (
                  <div
                    key={c.claim_id}
                    className="p-5 bg-slate-50 dark:bg-[#0c1221] rounded-xl border border-slate-200 dark:border-[#1d2b47] space-y-4 text-xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-[#1d2b47] pb-3">
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white text-sm">
                          Claim by {c.user_name || 'Claimant'} ({c.user_email})
                        </div>
                        <div className="text-slate-500 dark:text-slate-400 text-[11px] font-mono">
                          Claim ID: {c.claim_id} · Submitted {new Date(c.created_at).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          c.status === 'approved'
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                            : c.status === 'rejected'
                            ? 'bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-300'
                            : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                        }`}>
                          {c.status.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* Associated Item summary */}
                    {targetItem && (
                      <div className="p-3 bg-white dark:bg-[#141e34] rounded-lg border border-slate-200 dark:border-[#22314e] flex items-start gap-3">
                        <img
                          src={getItemDisplayImage(targetItem)}
                          alt={targetItem.item_name}
                          className="w-12 h-12 rounded object-cover border border-slate-200 dark:border-slate-700"
                        />
                        <div>
                          <div className="font-bold text-slate-800 dark:text-white">{targetItem.item_name} ({targetItem.category})</div>
                          <div className="text-slate-500 dark:text-slate-400 text-[11px]">
                            Found at {targetItem.location} on {targetItem.date} by {targetItem.user_name}
                          </div>
                          <div className="text-slate-600 dark:text-slate-300 mt-0.5 line-clamp-1 italic">
                            Private description: "{targetItem.description}"
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Claimant answers */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white dark:bg-[#141e34] p-3 rounded-lg border border-slate-200 dark:border-[#22314e]">
                      <div>
                        <span className="font-bold text-slate-700 dark:text-slate-300 block">Claimant Unique Feature:</span>
                        <span className="text-slate-600 dark:text-slate-400">{c.unique_feature}</span>
                      </div>
                      <div>
                        <span className="font-bold text-slate-700 dark:text-slate-300 block">Claimant Interior Items:</span>
                        <span className="text-slate-600 dark:text-slate-400">{c.inside_items || 'None specified'}</span>
                      </div>
                      <div>
                        <span className="font-bold text-slate-700 dark:text-slate-300 block">Reported Loss Location:</span>
                        <span className="text-slate-600 dark:text-slate-400">{c.exact_location}</span>
                      </div>
                      <div>
                        <span className="font-bold text-slate-700 dark:text-slate-300 block">Proof Notes:</span>
                        <span className="text-slate-600 dark:text-slate-400">{c.proof_notes || 'None'}</span>
                      </div>
                    </div>

                    {/* Admin review decision tools */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                      <input
                        type="text"
                        placeholder="Add review feedback note or security pickup instructions..."
                        value={adminNote[c.claim_id] || ''}
                        onChange={e => setAdminNote({ ...adminNote, [c.claim_id]: e.target.value })}
                        className="flex-1 p-2 text-xs border border-slate-300 dark:border-[#22314e] rounded-lg bg-white dark:bg-[#070b14] text-slate-900 dark:text-white"
                      />

                      <div className="flex items-center gap-2 shrink-0">
                        {c.status !== 'approved' && (
                          <button
                            onClick={() => handleClaimDecision(c.claim_id, 'approved')}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors"
                          >
                            Approve & Release
                          </button>
                        )}
                        {c.status !== 'rejected' && (
                          <button
                            onClick={() => handleClaimDecision(c.claim_id, 'rejected')}
                            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors"
                          >
                            Reject Claim
                          </button>
                        )}
                        {c.status === 'approved' && (
                          <button
                            onClick={() => handleClaimDecision(c.claim_id, 'completed')}
                            className="px-3 py-1.5 bg-slate-900 hover:bg-black text-white font-bold rounded-lg transition-colors"
                          >
                            Mark Completed
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: LISTINGS MODERATION */}
      {activeTab === 'items' && (
        <div className="bg-white dark:bg-[#111a2e] rounded-2xl border border-slate-200/90 dark:border-[#202f4d] shadow-xs dark:shadow-xl dark:shadow-black/50 overflow-hidden p-6 space-y-4 text-slate-800 dark:text-slate-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#1d2b47]">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">All Reported Listings</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Monitor campus entries, flag suspicious posts, or remove inappropriate listings.</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-[#0c1221] border-b border-slate-200 dark:border-[#1d2b47] text-slate-500 dark:text-slate-400 font-semibold uppercase text-[11px]">
                  <th className="py-3 px-3">Item</th>
                  <th className="py-3 px-3">Type</th>
                  <th className="py-3 px-3">Location</th>
                  <th className="py-3 px-3">Reporter</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#1d2b47]">
                {items.map(i => (
                  <tr key={i.item_id} className="hover:bg-slate-50/80 dark:hover:bg-[#16223d] transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900 dark:text-white">{i.item_name}</div>
                      <div className="text-[11px] text-slate-400">{i.category}</div>
                    </td>
                    <td className="py-3 px-3 font-semibold uppercase text-[10px]">
                      <span className={i.type === 'lost' ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}>
                        {i.type}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-400">{i.location}</td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-400">{i.user_name}</td>
                    <td className="py-3 px-3 font-medium text-slate-700 dark:text-slate-300 capitalize">{i.status}</td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleFlagItem(i.item_id, i.is_flagged)}
                          className={`p-1.5 rounded transition-colors ${
                            i.is_flagged
                              ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                              : 'text-slate-400 hover:text-amber-600'
                          }`}
                          title={i.is_flagged ? 'Unflag listing' : 'Flag suspicious listing'}
                        >
                          <Flag className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(i.item_id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 rounded transition-colors"
                          title="Delete listing"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: USERS MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="bg-white dark:bg-[#111a2e] rounded-2xl border border-slate-200/90 dark:border-[#202f4d] shadow-xs dark:shadow-xl dark:shadow-black/50 overflow-hidden p-6 space-y-4 text-slate-800 dark:text-slate-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#1d2b47]">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">User Accounts Management</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Manage member privileges, roles, and disciplinary suspensions.</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-[#0c1221] border-b border-slate-200 dark:border-[#1d2b47] text-slate-500 dark:text-slate-400 font-semibold uppercase text-[11px]">
                  <th className="py-3 px-3">User</th>
                  <th className="py-3 px-3">Email</th>
                  <th className="py-3 px-3">Role</th>
                  <th className="py-3 px-3">Registered</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#1d2b47]">
                {users.map(u => (
                  <tr key={u.user_id} className="hover:bg-slate-50/80 dark:hover:bg-[#16223d] transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <img
                          src={u.profile_image || 'https://api.dicebear.com/7.x/initials/svg?seed=User'}
                          alt={u.name}
                          className="w-7 h-7 rounded-full object-cover"
                        />
                        <span className="font-bold text-slate-900 dark:text-white">{u.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-400 font-mono text-[11px]">{u.email}</td>
                    <td className="py-3 px-3 capitalize font-semibold text-slate-700 dark:text-slate-300">{u.role}</td>
                    <td className="py-3 px-3 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                          u.status === 'active'
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                            : 'bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-300'
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {u.user_id !== 'usr_admin' && (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleToggleUserStatus(u.user_id, u.status)}
                            className="px-2.5 py-1 rounded text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                          >
                            {u.status === 'active' ? 'Suspend' : 'Activate'}
                          </button>
                          <button
                            onClick={() => handleDeleteUser(u.user_id)}
                            className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 rounded"
                            title="Delete user"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

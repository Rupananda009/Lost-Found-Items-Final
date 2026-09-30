import React, { useState, useEffect } from 'react';
import {
  PlusCircle,
  Calendar,
  MapPin,
  CheckCircle,
  Trash2,
  Building2,
  RefreshCw,
  HelpCircle,
  Eye
} from 'lucide-react';
import { Item, ItemType } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { getItemDisplayImage, getCategoryPlaceholderSvg } from '../utils/imageUtils';

interface MyReportsPageProps {
  onNav: (tab: string) => void;
  onViewItem: (item: Item) => void;
  onReport: (type: ItemType) => void;
}

export const MyReportsPage: React.FC<MyReportsPageProps> = ({
  onNav,
  onViewItem,
  onReport,
}) => {
  const { user } = useAuth();
  const { showToast } = useNotifications();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMyItems = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await api.getItems({ userId: user.user_id });
      setItems(res.items);
    } catch (err) {
      console.error('Failed to load my items:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyItems();
  }, [user]);

  const handleMarkReturned = async (itemId: string) => {
    try {
      await api.updateItem(itemId, { status: 'returned' });
      showToast('Item marked as returned and recovered!', 'success');
      fetchMyItems();
    } catch (err) {
      showToast('Failed to update status.', 'error');
    }
  };

  const handleDelete = async (itemId: string) => {
    if (!confirm('Are you sure you want to remove this report?')) return;
    try {
      await api.deleteItem(itemId);
      showToast('Report deleted successfully.', 'info');
      setItems(prev => prev.filter(i => i.item_id !== itemId));
    } catch (err) {
      showToast('Failed to delete report.', 'error');
    }
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-3">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Please Sign In</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Sign in or register to view and manage your submitted lost and found reports.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            My Submitted Reports
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your reported lost and found belongings, track status, and coordinate recovery.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onReport('lost')}
            className="px-3.5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors shadow-xs"
          >
            + Report Lost
          </button>
          <button
            onClick={() => onReport('found')}
            className="px-3.5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs"
          >
            + Report Found
          </button>
          <button
            onClick={fetchMyItems}
            title="Refresh reports"
            className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="bg-white dark:bg-[#111a2e] rounded-xl border border-slate-200/90 dark:border-[#202f4d] p-8 text-center text-xs text-slate-400">
          Loading your reports...
        </div>
      ) : items.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-[#111a2e] rounded-2xl border border-slate-200/90 dark:border-[#202f4d] max-w-lg mx-auto space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
            <HelpCircle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No Reports Submitted Yet</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            You haven't posted any lost or found items under this account yet.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => onReport('lost')}
              className="px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xs"
            >
              Report Lost Belonging
            </button>
            <button
              onClick={() => onReport('found')}
              className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs"
            >
              Report Found Belonging
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#111a2e] rounded-2xl border border-slate-200/90 dark:border-[#202f4d] shadow-xs dark:shadow-xl dark:shadow-black/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-[#0c1221] border-b border-slate-200 dark:border-[#1d2b47] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4">Item</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#1d2b47]">
                {items.map(item => {
                  const isLost = item.type === 'lost';
                  const displayImage = getItemDisplayImage(item);

                  return (
                    <tr key={item.item_id} className="hover:bg-slate-50/80 dark:hover:bg-[#16223d] transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={displayImage}
                            alt={item.item_name}
                            className="w-12 h-12 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = getCategoryPlaceholderSvg(item.category, item.item_name);
                            }}
                          />
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white line-clamp-1">
                              {item.item_name}
                            </div>
                            <div className="text-[11px] text-slate-400 line-clamp-1">
                              {item.description}
                            </div>
                            {item.dropoff_location && (
                              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-0.5">
                                <Building2 className="w-3 h-3" />
                                <span>Custody: {item.dropoff_location}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`font-semibold px-2 py-0.5 rounded text-[11px] ${
                            isLost ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300' : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                          }`}
                        >
                          {isLost ? 'LOST' : 'FOUND'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-medium text-slate-700 dark:text-slate-300">
                        {item.category}
                      </td>

                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 truncate max-w-[160px]">
                        {item.location}
                      </td>

                      <td className="py-3.5 px-4 font-mono tabular-nums text-slate-500 dark:text-slate-400 text-[11px]">
                        {item.date}
                      </td>

                      <td className="py-3.5 px-4">
                        {item.status === 'returned' && (
                          <span className="font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5" />
                            Recovered
                          </span>
                        )}
                        {item.status === 'potential_match' && (
                          <button
                            onClick={() => onNav('matches')}
                            className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            Match Found &rarr;
                          </button>
                        )}
                        {item.status === 'claim_pending' && (
                          <button
                            onClick={() => onNav('my_claims')}
                            className="font-semibold text-purple-600 dark:text-purple-400 hover:underline"
                          >
                            Claim Pending &rarr;
                          </button>
                        )}
                        {item.status === 'active' && (
                          <span className="text-slate-500 dark:text-slate-400 font-medium">
                            Active Search
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => onViewItem(item)}
                            className="p-1.5 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 rounded-md transition-colors"
                            title="View item details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {item.status !== 'returned' && (
                            <button
                              onClick={() => handleMarkReturned(item.item_id)}
                              className="px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 rounded-md transition-colors"
                            >
                              Mark Returned
                            </button>
                          )}

                          <button
                            onClick={() => handleDelete(item.item_id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 rounded-md transition-colors"
                            title="Delete report"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

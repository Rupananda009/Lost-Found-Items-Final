import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Calendar,
  MapPin,
  Building2,
  CheckCircle,
  XCircle,
  HelpCircle,
  AlertCircle,
  RefreshCw,
  Search
} from 'lucide-react';
import { Match, Item } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { getItemDisplayImage, getCategoryPlaceholderSvg } from '../utils/imageUtils';

interface MatchesPageProps {
  onViewItem: (item: Item) => void;
  onClaimItem: (item: Item) => void;
  onNav: (tab: string) => void;
}

export const MatchesPage: React.FC<MatchesPageProps> = ({
  onViewItem,
  onClaimItem,
  onNav,
}) => {
  const { user } = useAuth();
  const { showToast } = useNotifications();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [filterMode, setFilterMode] = useState<'all' | 'mine'>('all');

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const res = await api.getMatches({ filter: filterMode });
      setMatches(res.matches);
    } catch (err) {
      console.error('Failed to load matches:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, [filterMode]);

  const handleScanMatches = async () => {
    try {
      setScanning(true);
      const res = await api.scanMatches();
      showToast(res.message || 'Smart match scan completed!', 'success');
      fetchMatches();
    } catch (err: any) {
      showToast(err.message || 'Scan failed. Please try again.', 'error');
    } finally {
      setScanning(false);
    }
  };

  const handleDismiss = async (matchId: string) => {
    try {
      await api.updateMatchStatus(matchId, 'dismissed');
      setMatches(prev => prev.filter(m => m.match_id !== matchId));
      showToast('Match dismissed from your view.', 'info');
    } catch (err) {
      showToast('Failed to dismiss match.', 'error');
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800';
    if (score >= 50) return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800';
    return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              Potential Item Matches
            </h1>
            <span className="p-1 px-2 text-[11px] font-semibold bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 rounded-md flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-blue-600 dark:text-blue-400" />
              <span>Smart Correlation Engine</span>
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Automated correlation between reported lost and found belongings across Pragati Engineering College.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Smart Scan Trigger Button */}
          <button
            onClick={handleScanMatches}
            disabled={scanning}
            className="px-3.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${scanning ? 'animate-spin' : ''}`} />
            <span>{scanning ? 'Scanning All Items...' : 'Re-Run Smart Scan'}</span>
          </button>

          {/* Filter buttons */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                filterMode === 'all'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All Matches
            </button>
            {user && (
              <button
                onClick={() => setFilterMode('mine')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  filterMode === 'mine'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                For My Items
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Critical Responsible Disclaimer Banner */}
      <div className="p-4 bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl text-xs text-amber-900 dark:text-amber-300 flex items-start gap-3">
        <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-bold">System Generated Estimate:</span> Similarity percentages and
          match explanations are suggestions to help discover matching items. Ownership must always be verified
          through the official claim review process before release.
        </div>
      </div>

      {/* Match Cards List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white dark:bg-[#131b2e] rounded-xl border border-slate-200/90 dark:border-slate-800 p-6 animate-pulse space-y-4">
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/4"></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-24 bg-slate-200 dark:bg-slate-800 rounded"></div>
                <div className="h-24 bg-slate-200 dark:bg-slate-800 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : matches.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-[#131b2e] rounded-2xl border border-slate-200/90 dark:border-slate-800 max-w-lg mx-auto space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No Potential Matches Right Now</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Click "Re-Run Smart Scan" above to scan all items, or browse the directory manually.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={handleScanMatches}
              className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs"
            >
              Scan for Matches Now
            </button>
            <button
              onClick={() => onNav('browse')}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              Browse Directory Manually
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {matches.map(m => {
            const lost = m.lost_item;
            const found = m.found_item;
            if (!lost || !found) return null;

            const lostImg = getItemDisplayImage(lost);
            const foundImg = getItemDisplayImage(found);

            return (
              <div
                key={m.match_id}
                className="bg-white dark:bg-[#111a2e] rounded-2xl border border-slate-200/90 dark:border-[#202f4d] hover:border-slate-300 dark:hover:border-[#314670] shadow-xs hover:shadow-xl dark:shadow-black/50 transition-all overflow-hidden"
              >
                {/* Match Header Bar */}
                <div className="px-6 py-3.5 bg-slate-50 dark:bg-[#0c1221] border-b border-slate-100 dark:border-[#1d2b47] flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      Similarity Score:
                    </span>
                    <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-md border font-mono tabular-nums ${getScoreColor(m.similarity_score)}`}>
                      {m.similarity_score}% Match
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      (System-Generated Estimate)
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDismiss(m.match_id)}
                      className="text-xs text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 font-medium px-2 py-1"
                    >
                      Dismiss
                    </button>
                    {found.status !== 'returned' && (
                      <button
                        onClick={() => onClaimItem(found)}
                        className="px-3.5 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs"
                      >
                        Claim This Item
                      </button>
                    )}
                  </div>
                </div>

                {/* Match Explanation Text */}
                <div className="px-6 py-3 bg-blue-50/60 dark:bg-[#0f1b33] border-b border-blue-100/60 dark:border-blue-900/50 text-xs text-blue-900 dark:text-blue-200 flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <div className="leading-relaxed">
                    <span className="font-semibold">Match Details: </span>{m.match_reason}
                  </div>
                </div>

                {/* Side-by-Side Comparison Container */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-[#1d2b47]">
                  {/* Left Column: Reported Lost Item */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded">
                        REPORTED LOST
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono tabular-nums">
                        {lost.date}
                      </span>
                    </div>

                    <div className="flex items-start gap-3">
                      <img
                        src={lostImg}
                        alt={lost.item_name}
                        className="w-16 h-16 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = getCategoryPlaceholderSvg(lost.category, lost.item_name);
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                          {lost.item_name}
                        </h4>
                        <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5 truncate">
                          {lost.category} · {lost.location}
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">
                          {lost.description}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={() => onViewItem(lost)}
                        className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        View Lost Report Details &rarr;
                      </button>
                    </div>
                  </div>

                  {/* Right Column: Counter Found Item */}
                  <div className="space-y-3 pt-6 md:pt-0 md:pl-6">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                        REPORTED FOUND
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono tabular-nums">
                        {found.date}
                      </span>
                    </div>

                    <div className="flex items-start gap-3">
                      <img
                        src={foundImg}
                        alt={found.item_name}
                        className="w-16 h-16 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = getCategoryPlaceholderSvg(found.category, found.item_name);
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                          {found.item_name}
                        </h4>
                        <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5 truncate">
                          {found.category} · {found.location}
                        </div>
                        {found.dropoff_location && (
                          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-0.5 truncate">
                            <Building2 className="w-3 h-3 shrink-0" />
                            <span>Custody: {found.dropoff_location}</span>
                          </div>
                        )}
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">
                          {found.description}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <button
                        onClick={() => onViewItem(found)}
                        className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        View Found Report Details &rarr;
                      </button>

                      {found.status !== 'returned' && (
                        <button
                          onClick={() => onClaimItem(found)}
                          className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          Submit Ownership Claim &rarr;
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

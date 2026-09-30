import React, { useState, useEffect } from 'react';
import {
  PlusCircle,
  Search,
  Sparkles,
  ShieldCheck,
  Clock,
  ArrowRight,
  Layers,
  FileCheck,
  AlertCircle,
  Bell
} from 'lucide-react';
import { Item, Match, Claim } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ItemCard } from '../components/ItemCard';

interface DashboardPageProps {
  onNav: (tab: string) => void;
  onViewItem: (item: Item) => void;
  onClaimItem: (item: Item) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNav,
  onViewItem,
  onClaimItem,
}) => {
  const { user } = useAuth();
  const [myItems, setMyItems] = useState<Item[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [myClaims, setMyClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const loadDashboard = async () => {
      try {
        setLoading(true);
        const [itemsRes, matchesRes, claimsRes] = await Promise.all([
          api.getItems({ userId: user.user_id }),
          api.getMatches({ filter: 'mine' }),
          api.getClaims(),
        ]);
        setMyItems(itemsRes.items);
        setMatches(matchesRes.matches);
        setMyClaims(claimsRes.claims);
      } catch (err) {
        console.warn('Dashboard load error:', err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-3">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Please Sign In</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Access your personal recovery dashboard, submitted claims, and alerts.
        </p>
        <button
          onClick={() => onNav('browse')}
          className="mt-4 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs"
        >
          Browse Directory
        </button>
      </div>
    );
  }

  const lostCount = myItems.filter(i => i.type === 'lost').length;
  const foundCount = myItems.filter(i => i.type === 'found').length;
  const returnedCount = myItems.filter(i => i.status === 'returned').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-white dark:bg-[#131b2e] p-6 sm:p-8 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={user.profile_image || 'https://api.dicebear.com/7.x/initials/svg?seed=User'}
            alt={user.name}
            className="w-14 h-14 rounded-full object-cover border-2 border-slate-200 dark:border-slate-700"
          />
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Welcome, {user.name}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Member since {new Date(user.created_at).toLocaleDateString()} · Campus Network Verified
            </p>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onNav('report_lost')}
            className="px-4 py-2.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Report Lost Item</span>
          </button>
          <button
            onClick={() => onNav('report_found')}
            className="px-4 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Report Found Item</span>
          </button>
          <button
            onClick={() => onNav('browse')}
            className="px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Search className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <span>Search Items</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div
          onClick={() => onNav('my_reports')}
          className="p-5 bg-white dark:bg-[#131b2e] rounded-xl border border-slate-200/90 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-500 shadow-xs hover:shadow-md transition-all cursor-pointer"
        >
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-400">
            Lost Items
          </div>
          <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 mt-1 font-mono tabular-nums">
            {lostCount}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Submitted reports</div>
        </div>

        <div
          onClick={() => onNav('my_reports')}
          className="p-5 bg-white dark:bg-[#131b2e] rounded-xl border border-slate-200/90 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-500 shadow-xs hover:shadow-md transition-all cursor-pointer"
        >
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-400">
            Found Items
          </div>
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 font-mono tabular-nums">
            {foundCount}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Turned in reports</div>
        </div>

        <div
          onClick={() => onNav('matches')}
          className="p-5 bg-white dark:bg-[#131b2e] rounded-xl border border-slate-200/90 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 shadow-xs hover:shadow-md transition-all cursor-pointer"
        >
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-400 flex items-center justify-between">
            <span>Potential Matches</span>
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
          </div>
          <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 mt-1 font-mono tabular-nums">
            {matches.length}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Suggested correlations</div>
        </div>

        <div
          onClick={() => onNav('my_claims')}
          className="p-5 bg-white dark:bg-[#131b2e] rounded-xl border border-slate-200/90 dark:border-slate-800 hover:border-purple-400 dark:hover:border-purple-500 shadow-xs hover:shadow-md transition-all cursor-pointer"
        >
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-400">
            Claims
          </div>
          <div className="text-2xl font-extrabold text-purple-600 dark:text-purple-400 mt-1 font-mono tabular-nums">
            {myClaims.length}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">In progress & review</div>
        </div>

        <div
          onClick={() => onNav('my_reports')}
          className="p-5 bg-white dark:bg-[#131b2e] rounded-xl border border-slate-200/90 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600 shadow-xs hover:shadow-md transition-all cursor-pointer"
        >
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-400">
            Returned Items
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 font-mono tabular-nums">
            {returnedCount}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Successfully recovered</div>
        </div>
      </div>

      {/* Potential Matches Alert Banner if matches exist */}
      {matches.length > 0 && (
        <div className="p-5 bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                You have {matches.length} potential item correlation{matches.length > 1 ? 's' : ''}!
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                Our smart matching engine identified items matching your reports. Review similarity breakdowns and submit claims.
              </p>
            </div>
          </div>

          <button
            onClick={() => onNav('matches')}
            className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors whitespace-nowrap shadow-xs"
          >
            Review Potential Matches
          </button>
        </div>
      )}

      {/* Recent User Reports */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Your Recent Reports</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Belongings you reported recently</p>
          </div>
          <button
            onClick={() => onNav('my_reports')}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center gap-1"
          >
            <span>View All Reports</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {myItems.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-[#131b2e] rounded-xl border border-slate-200/90 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 space-y-2">
            <p>You haven't reported any lost or found belongings yet.</p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => onNav('report_lost')}
                className="text-xs font-bold text-amber-700 dark:text-amber-400 hover:underline"
              >
                Report Lost Item
              </button>
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <button
                onClick={() => onNav('report_found')}
                className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline"
              >
                Report Found Item
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {myItems.slice(0, 3).map(item => (
              <ItemCard
                key={item.item_id}
                item={item}
                onViewDetails={onViewItem}
                onClaim={onClaimItem}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

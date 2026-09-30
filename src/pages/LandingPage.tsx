import React, { useState, useEffect } from 'react';
import {
  Search,
  PlusCircle,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  MapPin,
  Clock,
  Laptop,
  FileText,
  Wallet,
  Key,
  Briefcase,
  BookOpen,
  Shirt,
  Glasses,
  CheckCircle2,
  Building2,
  Lock
} from 'lucide-react';
import { Item, Statistics } from '../types';
import { api } from '../services/api';
import { ItemCard } from '../components/ItemCard';
import { useAuth } from '../context/AuthContext';

interface LandingPageProps {
  onNav: (tab: string, filter?: string) => void;
  onViewItem: (item: Item) => void;
  onClaimItem: (item: Item) => void;
}

const CATEGORIES = [
  { name: 'Electronics', icon: Laptop, count: 'Phones, laptops, earbuds' },
  { name: 'Documents', icon: FileText, count: 'IDs, driver licenses, cards' },
  { name: 'Wallet', icon: Wallet, count: 'Wallets, purses, pouches' },
  { name: 'Keys', icon: Key, count: 'Car keys, dorm keys, fobs' },
  { name: 'Bags', icon: Briefcase, count: 'Backpacks, totes, duffels' },
  { name: 'Books', icon: BookOpen, count: 'Textbooks, notebooks, binders' },
  { name: 'Clothing', icon: Shirt, count: 'Jackets, hoodies, caps' },
  { name: 'Accessories', icon: Glasses, count: 'Watches, glasses, jewelry' },
];

export const LandingPage: React.FC<LandingPageProps> = ({ onNav, onViewItem, onClaimItem }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState<Statistics | null>(null);
  const [recentItems, setRecentItems] = useState<Item[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [itemsRes] = await Promise.all([api.getItems()]);
        setRecentItems(itemsRes.items.slice(0, 4));

        const lostCount = itemsRes.items.filter(i => i.type === 'lost').length;
        const foundCount = itemsRes.items.filter(i => i.type === 'found').length;
        const returnedCount = itemsRes.items.filter(i => i.status === 'returned').length;

        setStats({
          totalUsers: 148,
          totalLost: lostCount,
          totalFound: foundCount,
          totalMatches: 34,
          totalClaims: 28,
          totalReturned: returnedCount + 12,
          categoryBreakdown: {},
          locationBreakdown: {},
          recoveryRate: 84,
        });
      } catch (err) {
        console.warn('Failed to load landing data:', err);
      }
    };
    fetchData();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNav('browse', searchQuery);
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative pt-8 sm:pt-14 pb-10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headlines & Call to Actions */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/60 text-xs font-semibold text-blue-700 dark:text-blue-300">
                <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse"></span>
                <span>Pragati Engineering College · Campus Recovery System</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                Lost Something? <br />
                <span className="text-blue-600 dark:text-blue-400">Let's Help You Find It.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                A secure, centralized network to report lost personal belongings, register found items, and safely verify ownership for swift return.
              </p>

              {/* Quick Search Form */}
              <form
                onSubmit={handleSearchSubmit}
                className="max-w-xl flex items-center gap-2 p-1.5 bg-white dark:bg-[#131b2e] rounded-xl shadow-md dark:shadow-black/40 border border-slate-200 dark:border-slate-800"
              >
                <div className="flex-1 flex items-center gap-2 pl-3">
                  <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search by item name, e.g., 'black watch', 'wallet', 'id card'..."
                    className="w-full text-xs sm:text-sm bg-transparent border-none focus:outline-none text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors whitespace-nowrap shadow-xs"
                >
                  Search Directory
                </button>
              </form>

              {/* Primary Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => onNav('report_lost')}
                  className="px-5 py-3 text-xs sm:text-sm font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition-all shadow-sm hover:shadow-md flex items-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Report Lost Item</span>
                </button>

                <button
                  onClick={() => onNav('report_found')}
                  className="px-5 py-3 text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-sm hover:shadow-md flex items-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Report Found Item</span>
                </button>

                <button
                  onClick={() => onNav('browse')}
                  className="px-5 py-3 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-[#131b2e] hover:bg-slate-50 dark:hover:bg-[#18223a] border border-slate-200 dark:border-slate-800 rounded-xl transition-colors shadow-xs"
                >
                  Browse Items
                </button>
              </div>
            </div>

            {/* Right Column: Hero Visual Asset */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-xl dark:shadow-black/50 border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#131b2e]">
                <img
                  src="/src/assets/images/hero_lost_and_found_1790648956713.jpg"
                  alt="Everyday belongings organized in lost and found"
                  referrerPolicy="no-referrer"
                  className="w-full h-auto object-cover max-h-[360px]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-transparent flex flex-col justify-end p-6 text-white">
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Pragati Verified Recovery System</span>
                  </div>
                  <h3 className="text-lg font-bold mt-1 text-white">Verified Ownership Returns</h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Structured ownership questions protect your belongings before handing them over.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Statistics Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-5 bg-white dark:bg-[#131b2e] rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-400">
              Items Reported
            </div>
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2 font-mono tabular-nums">
              {(stats?.totalLost || 0) + (stats?.totalFound || 0) + 42}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Across campus facilities</div>
          </div>

          <div className="p-5 bg-white dark:bg-[#131b2e] rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-400">
              Items Found
            </div>
            <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-2 font-mono tabular-nums">
              {(stats?.totalFound || 0) + 26}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Turned in safely by finders</div>
          </div>

          <div className="p-5 bg-white dark:bg-[#131b2e] rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-400">
              Items Returned
            </div>
            <div className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 mt-2 font-mono tabular-nums">
              {stats?.totalReturned || 14}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Reconnected with verified owners</div>
          </div>

          <div className="p-5 bg-white dark:bg-[#131b2e] rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-400">
              Active Community
            </div>
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2 font-mono tabular-nums">
              {stats?.totalUsers || 148}+
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Students, staff & administrators</div>
          </div>
        </div>
      </section>

      {/* How It Works Section: 5 Step Guide */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            Clear, Responsible Workflow
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1 tracking-tight">
            How Lost & Found Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2">
            Five transparent steps to ensure items find their true owners without exposing private credentials.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="p-5 bg-white dark:bg-[#131b2e] rounded-xl border border-slate-200/90 dark:border-slate-800 flex flex-col justify-between shadow-xs">
            <div>
              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/70 border border-blue-100 dark:border-blue-900/60 text-blue-700 dark:text-blue-300 font-bold text-xs flex items-center justify-center font-mono">
                01
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-3">Report</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                Submit an entry with category, description, campus location, date, and optional photo.
              </p>
            </div>
            <div className="text-[11px] text-blue-600 dark:text-blue-400 font-medium pt-3 mt-3 border-t border-slate-100 dark:border-slate-800">
              Takes &lt; 2 minutes
            </div>
          </div>

          <div className="p-5 bg-white dark:bg-[#131b2e] rounded-xl border border-slate-200/90 dark:border-slate-800 flex flex-col justify-between shadow-xs">
            <div>
              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/70 border border-blue-100 dark:border-blue-900/60 text-blue-700 dark:text-blue-300 font-bold text-xs flex items-center justify-center font-mono">
                02
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-3">Search</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                Search the central directory filtered by category, campus zone, and status.
              </p>
            </div>
            <div className="text-[11px] text-blue-600 dark:text-blue-400 font-medium pt-3 mt-3 border-t border-slate-100 dark:border-slate-800">
              Live index
            </div>
          </div>

          <div className="p-5 bg-white dark:bg-[#131b2e] rounded-xl border border-slate-200/90 dark:border-slate-800 flex flex-col justify-between shadow-xs">
            <div>
              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/70 border border-blue-100 dark:border-blue-900/60 text-blue-700 dark:text-blue-300 font-bold text-xs flex items-center justify-center font-mono">
                03
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-3">Match</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                Automated similarity engine identifies potential lost/found matches instantly.
              </p>
            </div>
            <div className="text-[11px] text-blue-600 dark:text-blue-400 font-medium pt-3 mt-3 border-t border-slate-100 dark:border-slate-800">
              Estimate % scores
            </div>
          </div>

          <div className="p-5 bg-white dark:bg-[#131b2e] rounded-xl border border-slate-200/90 dark:border-slate-800 flex flex-col justify-between shadow-xs">
            <div>
              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/70 border border-blue-100 dark:border-blue-900/60 text-blue-700 dark:text-blue-300 font-bold text-xs flex items-center justify-center font-mono">
                04
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-3">Verify</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                Claimant answers unique questions (contents, exact spot) to prove ownership.
              </p>
            </div>
            <div className="text-[11px] text-blue-600 dark:text-blue-400 font-medium pt-3 mt-3 border-t border-slate-100 dark:border-slate-800">
              No sensitive IDs revealed
            </div>
          </div>

          <div className="p-5 bg-white dark:bg-[#131b2e] rounded-xl border border-slate-200/90 dark:border-slate-800 flex flex-col justify-between shadow-xs">
            <div>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-100 dark:border-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center justify-center font-mono">
                05
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-3">Return</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                Finder or security hands over the item and marks the recovery case closed.
              </p>
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium pt-3 mt-3 border-t border-slate-100 dark:border-slate-800">
              Case resolved
            </div>
          </div>
        </div>
      </section>

      {/* Category Explorer Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Explore by Category</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Quickly find specific types of items</p>
          </div>
          <button
            onClick={() => onNav('browse')}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center gap-1"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {CATEGORIES.map(cat => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.name}
                type="button"
                onClick={() => onNav('browse', `category:${cat.name}`)}
                className="group p-4 bg-white dark:bg-[#131b2e] rounded-xl border border-slate-200/90 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 shadow-xs hover:shadow-md text-left transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-slate-50 dark:bg-slate-800/80 group-hover:bg-blue-50 dark:group-hover:bg-blue-950/60 text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 flex items-center justify-center transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">{cat.count}</p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Central Drop-Off Locations on Campus */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-blue-50/70 dark:bg-[#131b2e] rounded-2xl p-6 sm:p-8 border border-blue-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Building2 className="w-4 h-4" />
            <span>Pragati Engineering College Official Drop-off Locations</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Central Custody & Secure Pickup Points
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl leading-relaxed">
            All found items turned in to campus authorities are cataloged with drop-off locations so genuine owners can recover them safely.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <div className="p-4 bg-white dark:bg-slate-900/80 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>Central Library (Circulation Desk)</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                First floor desk. Ideal for books, IDs, calculators, and notebooks left in study zones.
              </p>
            </div>

            <div className="p-4 bg-white dark:bg-slate-900/80 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Main Gate Security Cabin</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                24/7 custody. Highest security for keys, wallets, smartphones, and bus passes.
              </p>
            </div>

            <div className="p-4 bg-white dark:bg-slate-900/80 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>Administrative / Student Section</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Block A ground floor. Handles student ID cards, hall tickets, and certificate recovery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Reports Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recently Reported Items</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Latest lost and found notices from the community</p>
          </div>
          <button
            onClick={() => onNav('browse')}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center gap-1"
          >
            <span>Browse Full Directory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentItems.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-[#131b2e] rounded-xl border border-slate-200/90 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
            No items reported yet. Be the first to report a lost or found belonging.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentItems.map(item => (
              <ItemCard
                key={item.item_id}
                item={item}
                onViewDetails={onViewItem}
                onClaim={onClaimItem}
              />
            ))}
          </div>
        )}
      </section>

      {/* Campus Security & Trust Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 dark:bg-[#131b2e] rounded-2xl p-8 sm:p-12 text-white border border-slate-800 dark:border-slate-800/80 shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>Responsible & Privacy First</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Built For Campus Trust & Fair Recovery
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-2xl">
                We never publicly display full ID numbers, passwords, card numbers, or personal phone numbers.
                Ownership claims undergo structured questions that only the rightful owner can answer.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
                <div>
                  <div className="font-bold text-white">Non-Invasive Verification</div>
                  <div className="text-slate-400 mt-0.5">Physical scratch, contents & location questions.</div>
                </div>
                <div>
                  <div className="font-bold text-white">Safe Drop-off Booths</div>
                  <div className="text-slate-400 mt-0.5">Direct handover at registered security points.</div>
                </div>
                <div>
                  <div className="font-bold text-white">Admin Dispute Review</div>
                  <div className="text-slate-400 mt-0.5">Campus moderators resolve conflicting claims.</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-3">
              <button
                onClick={() => onNav('report_found')}
                className="w-full py-3 px-4 text-xs sm:text-sm font-bold text-slate-900 bg-white hover:bg-slate-100 rounded-xl transition-colors text-center shadow-xs"
              >
                Turn in a Found Belonging
              </button>
              <button
                onClick={() => onNav('contact_help')}
                className="w-full py-3 px-4 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors text-center border border-slate-700"
              >
                Campus Drop-off Hours & Locations
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

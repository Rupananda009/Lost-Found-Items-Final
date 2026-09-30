import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Filter,
  X,
  SlidersHorizontal,
  PlusCircle,
  RotateCcw,
  RefreshCw
} from 'lucide-react';
import { Item, ItemType } from '../types';
import { api } from '../services/api';
import { ItemCard } from '../components/ItemCard';

interface BrowsePageProps {
  initialFilter?: string;
  onViewItem: (item: Item) => void;
  onClaimItem: (item: Item) => void;
  onReport: (type: ItemType) => void;
}

const CATEGORIES = [
  'All Categories',
  'Accessories',
  'Electronics',
  'Wallet',
  'Keys',
  'Bags',
  'Documents',
  'Books',
  'Clothing',
  'Jewelry',
  'Other',
];

const PRAGATI_LOCATIONS = [
  'All Locations',
  'Pragati Engineering College Library',
  'Administrative Block (Block A)',
  'Department of CSE Block (Block B)',
  'Department of ECE / EEE (Block C)',
  'Mechanical & Civil Block (Block D)',
  'Campus Main Canteen',
  'Main Entrance & Security Gate',
  'Student Bus Bay & Parking',
  'Examination Section / Autonomous Cell',
  'Sports Complex / Playground',
  'Science & Humanities Block',
];

export const BrowsePage: React.FC<BrowsePageProps> = ({
  initialFilter = '',
  onViewItem,
  onClaimItem,
  onReport,
}) => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  // Active filters
  const [activeTab, setActiveTab] = useState<'all' | 'lost' | 'found' | 'returned'>('all');
  const [category, setCategory] = useState<string>('All Categories');
  const [location, setLocation] = useState<string>('All Locations');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');

  // Handle initial filter (e.g. from category click or search query from landing)
  useEffect(() => {
    if (initialFilter) {
      if (initialFilter.startsWith('category:')) {
        const cat = initialFilter.replace('category:', '');
        setCategory(cat);
      } else {
        setSearchQuery(initialFilter);
      }
    }
  }, [initialFilter]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await api.getItems({
        type: activeTab === 'all' || activeTab === 'returned' ? undefined : activeTab,
        status: activeTab === 'returned' ? 'returned' : undefined,
      });
      setItems(res.items);
    } catch (err) {
      console.error('Failed to fetch items:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [activeTab]);

  // Client-side filtering & sorting
  const filteredItems = useMemo(() => {
    return items
      .filter(item => {
        // Tab filter (if returned tab selected)
        if (activeTab === 'returned' && item.status !== 'returned') return false;
        if (activeTab === 'lost' && item.type !== 'lost') return false;
        if (activeTab === 'found' && item.type !== 'found') return false;

        // Category filter
        if (category !== 'All Categories' && item.category.toLowerCase() !== category.toLowerCase()) {
          return false;
        }

        // Location filter
        if (location !== 'All Locations') {
          const locFilter = location.toLowerCase();
          const itemLoc = (item.location || '').toLowerCase();
          const itemDropoff = (item.dropoff_location || '').toLowerCase();
          const matchDirect =
            itemLoc.includes(locFilter) ||
            locFilter.includes(itemLoc) ||
            itemDropoff.includes(locFilter) ||
            locFilter.includes(itemDropoff);
          
          // Keyword fallback for campus buildings (e.g. "Library", "Canteen", "Gate", "Block A")
          const cleanKeywords = locFilter
            .replace(/pragati|engineering|college|the|main/gi, '')
            .trim()
            .split(/\s+/)
            .filter(w => w.length > 2);

          const matchKeywords =
            cleanKeywords.length > 0 &&
            cleanKeywords.some(k => itemLoc.includes(k) || itemDropoff.includes(k));

          if (!matchDirect && !matchKeywords) {
            return false;
          }
        }

        // Query search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matches =
            item.item_name.toLowerCase().includes(q) ||
            item.description.toLowerCase().includes(q) ||
            item.location.toLowerCase().includes(q) ||
            item.category.toLowerCase().includes(q) ||
            (item.dropoff_location && item.dropoff_location.toLowerCase().includes(q)) ||
            (item.additional_details && item.additional_details.toLowerCase().includes(q));
          if (!matches) return false;
        }

        return true;
      })
      .sort((a, b) => {
        const timeA = new Date(a.created_at || a.date).getTime();
        const timeB = new Date(b.created_at || b.date).getTime();
        return sortBy === 'newest' ? timeB - timeA : timeA - timeB;
      });
  }, [items, activeTab, category, location, searchQuery, sortBy]);

  const handleResetFilters = () => {
    setActiveTab('all');
    setCategory('All Categories');
    setLocation('All Locations');
    setSearchQuery('');
    setSortBy('newest');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header and Quick Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Browse Belongings Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Search reported lost and found personal belongings across Pragati Engineering College campus.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onReport('lost')}
            className="px-3.5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Report Lost</span>
          </button>
          <button
            onClick={() => onReport('found')}
            className="px-3.5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Report Found</span>
          </button>
          <button
            onClick={fetchItems}
            title="Refresh directory"
            className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filter and Tab Section */}
      <div className="bg-white dark:bg-[#111a2e] rounded-2xl border border-slate-200/90 dark:border-[#202f4d] p-4 sm:p-5 shadow-xs dark:shadow-xl dark:shadow-black/40 space-y-4">
        {/* Status Tabs */}
        <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 dark:bg-[#0c1221] border border-slate-200/60 dark:border-[#1d2b47] rounded-xl max-w-fit">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'all'
                ? 'bg-white dark:bg-[#18243e] text-slate-900 dark:text-white shadow-xs border border-transparent dark:border-[#2a3c5e]'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All Items
          </button>
          <button
            onClick={() => setActiveTab('lost')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'lost'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Lost
          </button>
          <button
            onClick={() => setActiveTab('found')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'found'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Found
          </button>
          <button
            onClick={() => setActiveTab('returned')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'returned'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Recovered & Returned
          </button>
        </div>

        {/* Search & Filter Controls Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Keyword Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by name, description, brand..."
              className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm border border-slate-200 dark:border-[#202f4d] rounded-lg bg-white dark:bg-[#0c1221] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full py-2 px-3 text-xs sm:text-sm border border-slate-200 dark:border-[#202f4d] rounded-lg bg-white dark:bg-[#0c1221] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Location Filter */}
          <div>
            <select
              value={location}
              onChange={e => setLocation(e.target.value)}
              className="w-full py-2 px-3 text-xs sm:text-sm border border-slate-200 dark:border-[#202f4d] rounded-lg bg-white dark:bg-[#0c1221] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              {PRAGATI_LOCATIONS.map(loc => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By Filter */}
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="w-full py-2 px-3 text-xs sm:text-sm border border-slate-200 dark:border-[#202f4d] rounded-lg bg-white dark:bg-[#0c1221] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="newest">Sort: Most Recent First</option>
              <option value="oldest">Sort: Oldest First</option>
            </select>

            {(category !== 'All Categories' ||
              location !== 'All Locations' ||
              searchQuery ||
              activeTab !== 'all') && (
              <button
                onClick={handleResetFilters}
                className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-[#18243e] border border-transparent dark:border-[#202f4d] transition-colors shrink-0"
                title="Reset all filters"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Results Counter and Active Chips */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
          <div>
            Showing <span className="font-bold text-slate-900 dark:text-white">{filteredItems.length}</span> items
            {filteredItems.length !== items.length && (
              <span> (filtered from {items.length} total)</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {category !== 'All Categories' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-medium text-[11px]">
                {category}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setCategory('All Categories')} />
              </span>
            )}
            {location !== 'All Locations' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-medium text-[11px]">
                {location}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setLocation('All Locations')} />
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Item Listings Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div
              key={i}
              className="bg-white dark:bg-[#131b2e] rounded-xl border border-slate-200/90 dark:border-slate-800 p-4 space-y-3 animate-pulse"
            >
              <div className="aspect-4/3 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-2/3"></div>
              <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
            </div>
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-white dark:bg-[#131b2e] rounded-2xl border border-slate-200/90 dark:border-slate-800 p-12 text-center max-w-lg mx-auto space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              No belongings found matching your criteria
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Try adjusting your search terms, changing the category, or selecting "All Locations".
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Reset Filters
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map(item => (
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
  );
};

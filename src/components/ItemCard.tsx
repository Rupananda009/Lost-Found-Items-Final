import React from 'react';
import { MapPin, Calendar, ArrowRight, ShieldCheck, Building2 } from 'lucide-react';
import { Item } from '../types';
import { getItemDisplayImage, getCategoryPlaceholderSvg } from '../utils/imageUtils';

interface ItemCardProps {
  item: Item;
  onViewDetails: (item: Item) => void;
  onClaim?: (item: Item) => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item, onViewDetails, onClaim }) => {
  const isLost = item.type === 'lost';
  const displayImage = getItemDisplayImage(item);

  return (
    <div className="group bg-white dark:bg-[#111a2e] rounded-xl border border-slate-200/90 dark:border-[#202f4d] hover:border-slate-300 dark:hover:border-[#314670] shadow-xs hover:shadow-xl dark:shadow-black/50 transition-all duration-200 overflow-hidden flex flex-col">
      {/* Image container with aspect ratio */}
      <div className="relative aspect-4/3 bg-slate-100 dark:bg-[#0c1221] overflow-hidden border-b border-slate-100 dark:border-[#1d2b47]">
        <img
          src={displayImage}
          alt={item.item_name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
          onError={(e) => {
            (e.target as HTMLImageElement).src = getCategoryPlaceholderSvg(item.category, item.item_name);
          }}
        />

        {/* Quiet type tag top-left */}
        <div className="absolute top-3 left-3">
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-md shadow-xs ${
              isLost
                ? 'bg-amber-600 text-white'
                : 'bg-emerald-600 text-white'
            }`}
          >
            {isLost ? 'LOST' : 'FOUND'}
          </span>
        </div>

        {/* Status indicator if returned or match */}
        {item.status === 'returned' && (
          <div className="absolute top-3 right-3 bg-slate-900/90 dark:bg-slate-950/90 text-white text-[11px] font-semibold px-2 py-0.5 rounded-md backdrop-blur-xs flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>Recovered</span>
          </div>
        )}
        {item.status === 'potential_match' && (
          <div className="absolute top-3 right-3 bg-blue-600/95 text-white text-[11px] font-semibold px-2 py-0.5 rounded-md backdrop-blur-xs">
            Match Found
          </div>
        )}
        {item.status === 'claim_pending' && (
          <div className="absolute top-3 right-3 bg-purple-600/95 text-white text-[11px] font-semibold px-2 py-0.5 rounded-md backdrop-blur-xs">
            Claim Pending
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata line */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium mb-1.5">
            <span className="text-slate-800 dark:text-slate-200 font-semibold">{item.category}</span>
            <span aria-hidden="true">·</span>
            <span className="truncate">{item.location}</span>
          </div>

          <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
            {item.item_name}
          </h3>

          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2 leading-relaxed">
            {item.description}
          </p>

          {/* Central drop-off badge if available for found items */}
          {item.dropoff_location && (
            <div className="mt-2.5 flex items-center gap-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-1 rounded-md">
              <Building2 className="w-3 h-3 shrink-0" />
              <span className="truncate">Drop-off: {item.dropoff_location}</span>
            </div>
          )}
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-[#1e2c47] flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1 font-mono tabular-nums text-[11px]">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{item.date}</span>
          </div>

          <div className="flex items-center gap-2">
            {!isLost && item.status !== 'returned' && onClaim && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onClaim(item);
                }}
                className="px-2.5 py-1 text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 rounded-md transition-colors"
              >
                Claim
              </button>
            )}
            <button
              type="button"
              onClick={() => onViewDetails(item)}
              className="flex items-center gap-1 font-semibold text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <span>Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

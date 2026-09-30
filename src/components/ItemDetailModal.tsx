import React, { useState } from 'react';
import {
  X,
  MapPin,
  Calendar,
  Clock,
  ShieldCheck,
  MessageSquare,
  AlertTriangle,
  Building2,
  CheckCircle,
  Share2
} from 'lucide-react';
import { Item } from '../types';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { api } from '../services/api';
import { getItemDisplayImage, getCategoryPlaceholderSvg } from '../utils/imageUtils';

interface ItemDetailModalProps {
  item: Item | null;
  onClose: () => void;
  onClaim: (item: Item) => void;
  onContact: (item: Item) => void;
  onItemUpdated?: () => void;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
  item,
  onClose,
  onClaim,
  onContact,
  onItemUpdated,
}) => {
  const { user } = useAuth();
  const { showToast } = useNotifications();
  const [updating, setUpdating] = useState(false);

  if (!item) return null;

  const isOwner = user && user.user_id === item.user_id;
  const isAdmin = user && user.role === 'admin';
  const isLost = item.type === 'lost';
  const displayImage = getItemDisplayImage(item);

  const handleMarkReturned = async () => {
    try {
      setUpdating(true);
      await api.updateItem(item.item_id, { status: 'returned' });
      showToast('Item marked as successfully returned & recovered!', 'success');
      if (onItemUpdated) onItemUpdated();
      onClose();
    } catch (err: any) {
      showToast(err.message || 'Failed to update item status', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const handleFlagItem = async () => {
    try {
      if (isAdmin) {
        await api.deleteItem(item.item_id);
        showToast('Item report deleted by admin.', 'info');
        if (onItemUpdated) onItemUpdated();
        onClose();
      } else {
        showToast('Report submitted. Campus moderators will review this listing.', 'info');
      }
    } catch (err: any) {
      showToast('Action failed', 'error');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('Listing link copied to clipboard.', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#131b2e] rounded-2xl shadow-2xl dark:shadow-black/70 border border-slate-200/90 dark:border-slate-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative text-slate-800 dark:text-slate-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white bg-white/90 dark:bg-slate-800/90 rounded-full shadow-sm transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Image */}
        <div className="relative aspect-16/9 bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <img
            src={displayImage}
            alt={item.item_name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = getCategoryPlaceholderSvg(item.category, item.item_name);
            }}
          />

          <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
            <span
              className={`text-xs font-bold px-3 py-1 rounded-md shadow-xs ${
                isLost ? 'bg-amber-600 text-white' : 'bg-emerald-600 text-white'
              }`}
            >
              {isLost ? 'REPORTED LOST' : 'REPORTED FOUND'}
            </span>

            {item.status === 'returned' && (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-900 text-white flex items-center gap-1 shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Case Resolved (Returned)
              </span>
            )}
            {item.status === 'potential_match' && (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-blue-600 text-white shadow-xs">
                Potential Match Detected
              </span>
            )}
            {item.status === 'claim_pending' && (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-purple-600 text-white shadow-xs">
                Claim Under Review
              </span>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 space-y-6">
          {/* Title & Metadata */}
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">
              <span className="text-slate-900 dark:text-white font-semibold">{item.category}</span>
              <span aria-hidden="true">·</span>
              <span>Reported on {new Date(item.created_at).toLocaleDateString()}</span>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              {item.item_name}
            </h2>
          </div>

          {/* Central Drop-off Custody Banner (if available) */}
          {item.dropoff_location && (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-start gap-3">
              <Building2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                  Central Drop-off Custody: {item.dropoff_location}
                </div>
                <p className="text-[11px] text-emerald-800 dark:text-emerald-300 leading-relaxed">
                  This item is deposited at Pragati Engineering College at the specified location. Owners can claim ownership through this app or verify in person with valid college identification.
                </p>
              </div>
            </div>
          )}

          {/* Quick Specification Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800 text-xs">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-slate-700 dark:text-slate-300">Incident Location</div>
                <div className="text-slate-600 dark:text-slate-400 mt-0.5">{item.location}</div>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-slate-700 dark:text-slate-300">Incident Date</div>
                <div className="text-slate-600 dark:text-slate-400 mt-0.5 font-mono tabular-nums">{item.date}</div>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-slate-700 dark:text-slate-300">Approximate Time</div>
                <div className="text-slate-600 dark:text-slate-400 mt-0.5">{item.time || 'Not specified'}</div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
              Description
            </h4>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
              {item.description}
            </p>
          </div>

          {/* Additional details */}
          {item.additional_details && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                Additional Details
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                {item.additional_details}
              </p>
            </div>
          )}

          {/* Privacy protected Reporter Section */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold flex items-center justify-center text-sm">
                {item.user_name ? item.user_name.charAt(0) : 'U'}
              </div>
              <div>
                <div className="font-semibold text-slate-900 dark:text-white">
                  {item.user_name || 'Community Member'}
                </div>
                <div className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Pragati College Verified User · In-App Relay
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyLink}
                className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                title="Share link"
              >
                <Share2 className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleFlagItem}
                className="p-2 text-slate-400 hover:text-amber-600 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors"
                title="Report suspicious listing"
              >
                <AlertTriangle className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {/* Claim button if not owner and not returned */}
              {!isOwner && !isLost && item.status !== 'returned' && (
                <button
                  type="button"
                  onClick={() => onClaim(item)}
                  className="px-4 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Claim This Item
                </button>
              )}

              {/* Safe message button if not owner */}
              {!isOwner && (
                <button
                  type="button"
                  onClick={() => onContact(item)}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <MessageSquare className="w-4 h-4 text-slate-500" />
                  Safe Message {isLost ? 'Owner' : 'Finder'}
                </button>
              )}

              {/* Owner / Admin actions: Mark as returned */}
              {(isOwner || isAdmin) && item.status !== 'returned' && (
                <button
                  type="button"
                  disabled={updating}
                  onClick={handleMarkReturned}
                  className="px-4 py-2.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  Mark as Returned & Recovered
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

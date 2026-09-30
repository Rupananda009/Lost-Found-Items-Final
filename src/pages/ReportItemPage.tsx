import React, { useState, useMemo } from 'react';
import {
  Upload,
  Calendar,
  Clock,
  MapPin,
  Shield,
  Building2,
  CheckCircle2,
  Image as ImageIcon,
  ArrowRight,
  X,
  Sparkles
} from 'lucide-react';
import { ItemType } from '../types';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { api } from '../services/api';
import { getItemDisplayImage, getCategoryPlaceholderSvg } from '../utils/imageUtils';

interface ReportItemPageProps {
  initialType?: ItemType;
  onSuccess: (itemId: string) => void;
  onNav: (tab: string) => void;
}

const CATEGORIES = [
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
  'Other Campus Location',
];

const DROPOFF_LOCATIONS = [
  'Central Library Circulation Desk (First Floor)',
  'Main Gate Security Cabin (Lost & Found Custody)',
  'Administrative Office / Student Section Counter',
  'Department of CSE Office (Staff Room)',
  'Department of ECE Office (Staff Room)',
  'Examination Cell / Autonomous Section',
  'College Canteen Management Counter',
  'Physical Education & Sports Desk',
  'Kept with Finder (Arrange In-App Handover)',
  'Other Campus Location',
];

export const ReportItemPage: React.FC<ReportItemPageProps> = ({
  initialType = 'lost',
  onSuccess,
  onNav,
}) => {
  const { user, openAuthModal } = useAuth();
  const { showToast } = useNotifications();

  const [type, setType] = useState<ItemType>(initialType);
  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState('Accessories');
  const [description, setDescription] = useState('');
  const [locationPreset, setLocationPreset] = useState(PRAGATI_LOCATIONS[0]);
  const [customLocation, setCustomLocation] = useState('');
  const [dropoffPreset, setDropoffPreset] = useState(DROPOFF_LOCATIONS[0]);
  const [customDropoff, setCustomDropoff] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('');
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [customImageUrl, setCustomImageUrl] = useState<string | null>(null);
  const [contactPreference, setContactPreference] = useState('in_app');
  const [loading, setLoading] = useState(false);
  const [submittedItem, setSubmittedItem] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isLost = type === 'lost';

  // Preview image: If custom photo is uploaded, use it. Otherwise, compute dynamic SVG for category and item name.
  const previewImage = useMemo(() => {
    if (customImageUrl) return customImageUrl;
    return getCategoryPlaceholderSvg(category, itemName);
  }, [customImageUrl, category, itemName]);

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('Image size exceeds 5MB limit.', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setCustomImageUrl(reader.result as string);
          showToast('Photo uploaded successfully.', 'success');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeCustomImage = () => {
    setCustomImageUrl(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      openAuthModal('login');
      return;
    }

    if (!itemName.trim()) {
      setError('Please enter an item name.');
      return;
    }
    if (!description.trim()) {
      setError('Please provide an item description.');
      return;
    }

    const finalLocation =
      locationPreset === 'Other Campus Location'
        ? (customLocation.trim() || 'Pragati Engineering College Campus')
        : locationPreset;

    const finalDropoff = !isLost
      ? (dropoffPreset === 'Other Campus Location' ? (customDropoff.trim() || 'Central Custody') : dropoffPreset)
      : '';

    try {
      setLoading(true);
      setError(null);

      // Only send customImageUrl if user uploaded one; otherwise leave blank so server creates category-matched SVG
      const payload = {
        item_name: itemName.trim(),
        category,
        description: description.trim(),
        location: finalLocation,
        dropoff_location: finalDropoff,
        date,
        time: time.trim(),
        additional_details: additionalDetails.trim(),
        image_url: customImageUrl || '',
        contact_preference: contactPreference,
      };

      const res = isLost ? await api.reportLost(payload) : await api.reportFound(payload);

      setSubmittedItem(res.item);
      showToast('Item reported successfully.', 'success');
    } catch (err: any) {
      setError(err.message || 'Failed to submit report. Please check your network and try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submittedItem) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Item Reported Successfully
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
            Your report for <span className="font-semibold text-slate-800 dark:text-slate-200">"{submittedItem.item_name}"</span> has been securely saved to the database.
          </p>
        </div>

        {/* Item Preview Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 text-left max-w-md mx-auto shadow-sm flex items-start gap-4">
          <img
            src={getItemDisplayImage(submittedItem)}
            alt={submittedItem.item_name}
            className="w-20 h-20 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
          />
          <div className="space-y-1 min-w-0">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              {submittedItem.category} · {submittedItem.type.toUpperCase()}
            </span>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
              {submittedItem.item_name}
            </h4>
            <div className="text-xs text-slate-500 dark:text-slate-400 truncate flex items-center gap-1">
              <MapPin className="w-3 h-3 shrink-0" />
              <span>{submittedItem.location}</span>
            </div>
            {submittedItem.dropoff_location && (
              <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium truncate flex items-center gap-1">
                <Building2 className="w-3 h-3 shrink-0" />
                <span>Drop-off: {submittedItem.dropoff_location}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <button
            onClick={() => {
              onSuccess(submittedItem.item_id);
              onNav('my_reports');
            }}
            className="px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-sm"
          >
            Go to My Reports
          </button>
          <button
            onClick={() => onNav('browse')}
            className="px-5 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all"
          >
            Browse Directory
          </button>
          <button
            onClick={() => {
              setSubmittedItem(null);
              setItemName('');
              setDescription('');
              setAdditionalDetails('');
              setCustomImageUrl(null);
            }}
            className="px-5 py-2.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all"
          >
            Report Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          {isLost ? 'Report a Lost Belonging' : 'Report a Found Belonging'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          {isLost
            ? 'Provide key details to help finders and campus security identify your missing item at Pragati Engineering College.'
            : 'Help reconnect this misplaced item with its rightful owner safely and responsibly.'}
        </p>
      </div>

      {/* Type Switcher Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl max-w-sm">
        <button
          type="button"
          onClick={() => setType('lost')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
            isLost
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Lost Item
        </button>
        <button
          type="button"
          onClick={() => setType('found')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
            !isLost
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Found Item
        </button>
      </div>

      {/* Safety Notice for Finders */}
      {!isLost && (
        <div className="p-4 bg-emerald-50 dark:bg-[#0c1c24] border border-emerald-200 dark:border-emerald-800/60 rounded-xl text-xs text-emerald-900 dark:text-emerald-300 flex items-start gap-2.5">
          <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-bold">Finder Security Note:</span> You will also be asked to indicate the Central Drop-off Location where the item is stored or held. Real owners will be verified before release.
          </div>
        </div>
      )}

      {/* Main Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-[#111a2e] p-6 sm:p-8 rounded-2xl border border-slate-200/90 dark:border-[#202f4d] shadow-xs dark:shadow-xl dark:shadow-black/50 space-y-6"
      >
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs rounded-lg">
            {error}
          </div>
        )}

        {/* 1. Item Name & Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Item Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={itemName}
              onChange={e => setItemName(e.target.value)}
              placeholder="e.g. Watch, College ID Card, Black Wallet, Scientific Calculator"
              className="w-full p-2.5 text-xs sm:text-sm border border-slate-300 dark:border-[#202f4d] rounded-lg bg-white dark:bg-[#0c1221] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full p-2.5 text-xs sm:text-sm border border-slate-300 dark:border-[#202f4d] rounded-lg bg-white dark:bg-[#0c1221] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 2. Item Description */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Item Description <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            rows={3}
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Describe color, brand, model, visible condition, distinguishing features..."
            className="w-full p-2.5 text-xs sm:text-sm border border-slate-300 dark:border-[#202f4d] rounded-lg bg-white dark:bg-[#0c1221] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        {/* 3. Incident Location & Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {isLost ? 'Location Lost' : 'Location Found'} <span className="text-red-500">*</span>
            </label>
            <select
              value={locationPreset}
              onChange={e => setLocationPreset(e.target.value)}
              className="w-full p-2.5 text-xs sm:text-sm border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              {PRAGATI_LOCATIONS.map(loc => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>

            {locationPreset === 'Other Campus Location' && (
              <input
                type="text"
                value={customLocation}
                onChange={e => setCustomLocation(e.target.value)}
                placeholder="Specify exact building / room / lab..."
                className="mt-2 w-full p-2.5 text-xs sm:text-sm border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Date <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="date"
                required
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full p-2.5 text-xs sm:text-sm border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
              />
            </div>
          </div>
        </div>

        {/* 4. Central Drop-off Location (for Found items) */}
        {!isLost && (
          <div className="p-4 bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 rounded-xl space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900 dark:text-blue-300">
              <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Central Drop-off Location (Pragati Engineering College) *</span>
            </div>
            <p className="text-[11px] text-blue-700 dark:text-blue-400">
              Where is this item currently deposited or available for retrieval by the owner?
            </p>
            <select
              value={dropoffPreset}
              onChange={e => setDropoffPreset(e.target.value)}
              className="w-full p-2.5 text-xs sm:text-sm border border-blue-200 dark:border-blue-800 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              {DROPOFF_LOCATIONS.map(drop => (
                <option key={drop} value={drop}>
                  {drop}
                </option>
              ))}
            </select>

            {dropoffPreset === 'Other Campus Location' && (
              <input
                type="text"
                value={customDropoff}
                onChange={e => setCustomDropoff(e.target.value)}
                placeholder="Specify exact drop-off desk or custody location..."
                className="mt-2 w-full p-2.5 text-xs sm:text-sm border border-blue-200 dark:border-blue-800 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            )}
          </div>
        )}

        {/* 5. Approximate Time & Additional Identifying Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Approximate Time (Optional)
            </label>
            <input
              type="text"
              value={time}
              onChange={e => setTime(e.target.value)}
              placeholder="e.g. 10:30 AM, Afternoon break"
              className="w-full p-2.5 text-xs sm:text-sm border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Private Identifying Details (Optional)
            </label>
            <input
              type="text"
              value={additionalDetails}
              onChange={e => setAdditionalDetails(e.target.value)}
              placeholder="e.g. Scratch on back dial, orange strap, sticker"
              className="w-full p-2.5 text-xs sm:text-sm border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>

        {/* 6. Item Photo & Image Handling (NO MISMATCHED WALLET IMAGES) */}
        <div className="space-y-3 pt-1">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
            Item Image / Representative Visual
          </label>

          <div className="flex flex-col sm:flex-row items-center gap-5 p-4 bg-slate-50 dark:bg-[#0c1221] rounded-xl border border-slate-200 dark:border-[#202f4d]">
            {/* Live Preview Box */}
            <div className="relative w-36 h-28 rounded-lg overflow-hidden border border-slate-300 dark:border-[#2b3c5e] shrink-0 bg-slate-100 dark:bg-[#070b14]">
              <img
                src={previewImage}
                alt="Item visual preview"
                className="w-full h-full object-cover"
              />
              {customImageUrl && (
                <button
                  type="button"
                  onClick={removeCustomImage}
                  className="absolute top-1.5 right-1.5 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 shadow-xs"
                  title="Remove uploaded photo"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Upload Controls & Status */}
            <div className="flex-1 space-y-2 text-center sm:text-left">
              <div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-center sm:justify-start gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>
                    {customImageUrl
                      ? 'Custom Photo Uploaded'
                      : `Automatic Category Badge (${category}${itemName ? ` · ${itemName}` : ''})`}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {customImageUrl
                    ? 'This exact uploaded photo will be displayed for this item.'
                    : 'If you do not upload a photo, a clean category icon tailored to your item is displayed. It will never show an unrelated item photo.'}
                </p>
              </div>

              <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
                <label className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-[#18243e] border border-slate-300 dark:border-[#2b3c5e] hover:bg-slate-100 dark:hover:bg-[#1f2f52] rounded-lg cursor-pointer transition-colors flex items-center gap-1.5 shadow-xs">
                  <Upload className="w-3.5 h-3.5 text-slate-500 dark:text-slate-300" />
                  <span>{customImageUrl ? 'Change Photo' : 'Upload Item Photo'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFile}
                    className="hidden"
                  />
                </label>
                {customImageUrl && (
                  <button
                    type="button"
                    onClick={removeCustomImage}
                    className="px-2.5 py-1.5 text-xs text-red-600 hover:text-red-700 dark:text-red-400 transition-colors"
                  >
                    Use Category Icon Instead
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 7. Communication Channel */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            Preferred Communication Channel
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <label className="flex items-center gap-2.5 p-3 border border-slate-200 dark:border-[#202f4d] rounded-xl text-xs cursor-pointer bg-white dark:bg-[#0c1221] hover:bg-slate-50 dark:hover:bg-[#141e34] transition-colors">
              <input
                type="radio"
                name="pref"
                value="in_app"
                checked={contactPreference === 'in_app'}
                onChange={e => setContactPreference(e.target.value)}
                className="text-blue-600"
              />
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200">In-App Safe Messaging (Recommended)</span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Protects your phone number and email.</p>
              </div>
            </label>
            <label className="flex items-center gap-2.5 p-3 border border-slate-200 dark:border-[#202f4d] rounded-xl text-xs cursor-pointer bg-white dark:bg-[#0c1221] hover:bg-slate-50 dark:hover:bg-[#141e34] transition-colors">
              <input
                type="radio"
                name="pref"
                value="email"
                checked={contactPreference === 'email'}
                onChange={e => setContactPreference(e.target.value)}
                className="text-blue-600"
              />
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200">Campus Email Relay</span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Relayed securely via college portal.</p>
              </div>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-white transition-all shadow-sm flex items-center justify-center gap-2 ${
              isLost
                ? 'bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400'
                : 'bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400'
            }`}
          >
            {loading ? (
              <span>Submitting report to database...</span>
            ) : (
              <>
                <span>{isLost ? 'Submit Lost Item Report' : 'Submit Found Item Report'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

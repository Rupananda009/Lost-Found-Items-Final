import React, { useState } from 'react';
import { X, Send, ShieldCheck, Lock } from 'lucide-react';
import { Item } from '../types';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { api } from '../services/api';

interface ContactModalProps {
  item: Item | null;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ item, onClose }) => {
  const { user, openAuthModal } = useAuth();
  const { showToast } = useNotifications();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!item) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      openAuthModal('login');
      return;
    }

    if (!message.trim()) {
      setError('Please type a message.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await api.sendContactRequest(item.item_id, message);
      showToast('Message sent safely! The member received an alert.', 'success');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to send message.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#131b2e] rounded-2xl shadow-2xl dark:shadow-black/70 border border-slate-200/90 dark:border-slate-800 w-full max-w-lg overflow-hidden relative text-slate-800 dark:text-slate-200">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Safe Messaging</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Regarding: <span className="font-semibold text-slate-700 dark:text-slate-300">{item.item_name}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
          <Lock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>
            Private in-app thread. Your email and phone remain confidential.
          </span>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Your Message
            </label>
            <textarea
              required
              rows={4}
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Hi! I saw your post regarding this item. Let me know when you are available to coordinate pickup with campus security..."
              className="w-full p-3 text-xs sm:text-sm border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900/90 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm disabled:opacity-50 flex items-center gap-1.5"
            >
              {loading ? (
                <span className="inline-block animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Private Message</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

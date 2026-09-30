import React, { useState } from 'react';
import { Bell, CheckCircle2, Clock, Sparkles, Shield, Trash2, ArrowRight } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';

interface NotificationsPageProps {
  onNav: (tab: string) => void;
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({ onNav }) => {
  const { user } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead, loading } = useNotifications();
  const [filterUnreadOnly, setFilterUnreadOnly] = useState(false);

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-3">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Please Sign In</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Sign in to view your notification center.</p>
      </div>
    );
  }

  const displayedNotifications = filterUnreadOnly
    ? notifications.filter(n => !n.is_read)
    : notifications;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>Notification Center</span>
            {unreadCount > 0 && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-mono tabular-nums">
                {unreadCount} unread
              </span>
            )}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time updates regarding your reports, potential matches, and claim status.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 font-medium cursor-pointer">
            <input
              type="checkbox"
              checked={filterUnreadOnly}
              onChange={e => setFilterUnreadOnly(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <span>Unread Only</span>
          </label>

          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-3 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 rounded-lg transition-colors"
            >
              Mark all as read
            </button>
          )}
        </div>
      </div>

      {displayedNotifications.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-[#111a2e] rounded-2xl border border-slate-200/90 dark:border-[#202f4d] space-y-2">
          <Bell className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No Notifications</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {filterUnreadOnly
              ? 'You have caught up with all notifications.'
              : 'You have no alerts at this time.'}
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#111a2e] rounded-2xl border border-slate-200/90 dark:border-[#202f4d] divide-y divide-slate-100 dark:divide-[#1d2b47] overflow-hidden shadow-xs dark:shadow-xl dark:shadow-black/50">
          {displayedNotifications.map(n => {
            const isMatch = n.type === 'match_found';
            const isClaim = n.type.startsWith('claim');

            return (
              <div
                key={n.notification_id}
                onClick={() => {
                  markAsRead(n.notification_id);
                  if (n.link) {
                    if (n.link === '/matches') onNav('matches');
                    else if (n.link === '/claims') onNav('my_claims');
                    else onNav('dashboard');
                  }
                }}
                className={`p-4 sm:p-5 flex items-start justify-between gap-4 cursor-pointer hover:bg-slate-50/80 dark:hover:bg-[#16223d] transition-colors ${
                  !n.is_read ? 'bg-blue-50/40 dark:bg-[#0f1d38]' : ''
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                      isMatch
                        ? 'bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300'
                        : isClaim
                        ? 'bg-purple-100 dark:bg-purple-900/60 text-purple-600 dark:text-purple-300'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {isMatch ? (
                      <Sparkles className="w-4 h-4" />
                    ) : isClaim ? (
                      <Shield className="w-4 h-4" />
                    ) : (
                      <Bell className="w-4 h-4" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{n.title}</h4>
                      {!n.is_read && (
                        <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400"></span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                      {n.message}
                    </p>
                    <div className="text-[11px] text-slate-400 font-mono tabular-nums pt-1">
                      {new Date(n.created_at).toLocaleDateString()} at{' '}
                      {new Date(n.created_at).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center gap-1">
                    <span>View</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

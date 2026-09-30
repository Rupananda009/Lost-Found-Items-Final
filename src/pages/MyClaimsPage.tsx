import React, { useState, useEffect } from 'react';
import {
  Shield,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  MessageSquare,
  Building2,
  RefreshCw,
  HelpCircle,
  Check,
  X
} from 'lucide-react';
import { Claim, Item } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';

interface MyClaimsPageProps {
  onNav: (tab: string) => void;
  onViewItemById: (itemId: string) => void;
  onContactItemById: (itemId: string) => void;
}

export const MyClaimsPage: React.FC<MyClaimsPageProps> = ({
  onNav,
  onViewItemById,
  onContactItemById,
}) => {
  const { user } = useAuth();
  const { showToast } = useNotifications();

  const [activeTab, setActiveTab] = useState<'submitted' | 'received'>('submitted');
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchClaims = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await api.getClaims({ mode: activeTab });
      setClaims(res.claims);
    } catch (err) {
      console.error('Failed to load claims:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, [user, activeTab]);

  const handleUpdateClaimStatus = async (claimId: string, status: Claim['status'], notes?: string) => {
    try {
      setActionLoading(claimId);
      await api.updateClaim(claimId, { status, admin_notes: notes });
      showToast(
        status === 'approved'
          ? 'Claim approved! The owner has been notified with handover details.'
          : status === 'rejected'
          ? 'Claim declined.'
          : 'Claim updated.',
        'success'
      );
      fetchClaims();
    } catch (err: any) {
      showToast(err.message || 'Failed to update claim.', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-3">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Please Sign In</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Sign in to view submitted ownership claims or review incoming claims for items you found.
        </p>
      </div>
    );
  }

  const getStatusBadge = (status: Claim['status']) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded text-xs">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 font-semibold text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/60 px-2.5 py-1 rounded text-xs">
            <XCircle className="w-3.5 h-3.5" />
            Declined
          </span>
        );
      case 'under_review':
        return (
          <span className="inline-flex items-center gap-1 font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded text-xs">
            <Clock className="w-3.5 h-3.5" />
            Under Verification
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 font-semibold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded text-xs">
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
            Case Completed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 rounded text-xs">
            <Clock className="w-3.5 h-3.5" />
            Pending Verification
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Ownership Claims
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track ownership verification requests and coordinate safe handover of recovered belongings.
          </p>
        </div>

        <button
          onClick={fetchClaims}
          title="Refresh claims"
          className="p-2 self-start sm:self-auto text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Tabs: My Filed Claims vs Received Claims */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-[#0c1221] border border-slate-200/60 dark:border-[#1d2b47] rounded-xl max-w-md">
        <button
          onClick={() => setActiveTab('submitted')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
            activeTab === 'submitted'
              ? 'bg-white dark:bg-[#18243e] text-slate-900 dark:text-white shadow-xs border border-transparent dark:border-[#2a3c5e]'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          My Filed Claims
        </button>
        <button
          onClick={() => setActiveTab('received')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
            activeTab === 'received'
              ? 'bg-white dark:bg-[#18243e] text-slate-900 dark:text-white shadow-xs border border-transparent dark:border-[#2a3c5e]'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Claims for My Found Items
        </button>
      </div>

      {loading ? (
        <div className="bg-white dark:bg-[#111a2e] rounded-xl border border-slate-200/90 dark:border-[#202f4d] p-8 text-center text-xs text-slate-400">
          Loading claims...
        </div>
      ) : claims.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-[#111a2e] rounded-2xl border border-slate-200/90 dark:border-[#202f4d] max-w-lg mx-auto space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
            <Shield className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {activeTab === 'submitted'
              ? "You haven't submitted any claims yet"
              : "No incoming claims for your found items yet"}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {activeTab === 'submitted'
              ? 'If you identify a found item in the directory that belongs to you, click "Claim This Item" to submit ownership proof.'
              : 'When someone claims an item you reported found at Pragati Engineering College, their verification details will appear here for your review.'}
          </p>
          {activeTab === 'submitted' && (
            <div className="pt-2">
              <button
                onClick={() => onNav('browse')}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs"
              >
                Browse Found Belongings
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {claims.map(claim => (
            <div
              key={claim.claim_id}
              className="bg-white dark:bg-[#111a2e] rounded-2xl border border-slate-200/90 dark:border-[#202f4d] p-5 sm:p-6 shadow-xs dark:shadow-xl dark:shadow-black/50 space-y-4 text-slate-800 dark:text-slate-200"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-[#1d2b47] pb-3">
                <div>
                  <div className="text-xs text-slate-400 font-mono tabular-nums">
                    Claim ID: {claim.claim_id} · Submitted {new Date(claim.created_at).toLocaleDateString()}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                    {activeTab === 'submitted' ? (
                      <>Claim for Item #{claim.item_id}</>
                    ) : (
                      <>Claim by {claim.user_name || 'Student'} for Item #{claim.item_id}</>
                    )}
                  </h3>
                </div>

                <div>{getStatusBadge(claim.status)}</div>
              </div>

              {/* Status Stepper Progression */}
              <div className="py-2">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium max-w-xl">
                  <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-semibold">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">
                      1
                    </span>
                    <span>Submitted</span>
                  </div>
                  <div className="w-12 h-0.5 bg-blue-200 dark:bg-blue-800"></div>
                  <div
                    className={`flex items-center gap-1.5 ${
                      claim.status !== 'pending' ? 'text-blue-600 dark:text-blue-400 font-semibold' : 'text-slate-400'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                        claim.status !== 'pending'
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      2
                    </span>
                    <span>Review</span>
                  </div>
                  <div className="w-12 h-0.5 bg-slate-200 dark:bg-slate-800"></div>
                  <div
                    className={`flex items-center gap-1.5 ${
                      claim.status === 'approved' || claim.status === 'completed'
                        ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                        : claim.status === 'rejected'
                        ? 'text-red-600 dark:text-red-400 font-semibold'
                        : 'text-slate-400'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                        claim.status === 'approved' || claim.status === 'completed'
                          ? 'bg-emerald-600 text-white'
                          : claim.status === 'rejected'
                          ? 'bg-red-600 text-white'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      3
                    </span>
                    <span>{claim.status === 'rejected' ? 'Declined' : 'Approved'}</span>
                  </div>
                </div>
              </div>

              {/* Submitted Details Snapshot */}
              <div className="p-4 bg-slate-50 dark:bg-[#0c1221] rounded-xl border border-slate-100 dark:border-[#1d2b47] text-xs space-y-2">
                <div>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Unique Feature Provided: </span>
                  <span className="text-slate-600 dark:text-slate-400">{claim.unique_feature}</span>
                </div>
                {claim.inside_items && (
                  <div>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Internal Contents Described: </span>
                    <span className="text-slate-600 dark:text-slate-400">{claim.inside_items}</span>
                  </div>
                )}
                <div>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Reported Loss Location & Time: </span>
                  <span className="text-slate-600 dark:text-slate-400">{claim.exact_location}</span>
                </div>
                {claim.proof_notes && (
                  <div>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Proof Notes: </span>
                    <span className="text-slate-600 dark:text-slate-400">{claim.proof_notes}</span>
                  </div>
                )}
                {claim.admin_notes && (
                  <div className="p-2.5 bg-blue-50/70 dark:bg-[#0f1b33] border border-blue-100 dark:border-blue-900/50 rounded text-blue-900 dark:text-blue-200 mt-2">
                    <span className="font-bold">Reviewer Note: </span>
                    <span>{claim.admin_notes}</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-100 dark:border-[#1d2b47]">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onViewItemById(claim.item_id)}
                    className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    View Associated Listing &rarr;
                  </button>

                  <button
                    onClick={() => onContactItemById(claim.item_id)}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                    <span>{activeTab === 'submitted' ? 'Message Finder' : 'Message Claimant'}</span>
                  </button>
                </div>

                {/* Finder review controls when reviewing incoming claims */}
                {activeTab === 'received' && (
                  <div className="flex items-center gap-2">
                    {claim.status === 'pending' || claim.status === 'under_review' ? (
                      <>
                        <button
                          disabled={actionLoading === claim.claim_id}
                          onClick={() => handleUpdateClaimStatus(claim.claim_id, 'approved', 'Ownership verified by finder. Contact or visit custody desk for handover.')}
                          className="px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-1 shadow-xs"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve Claim</span>
                        </button>
                        <button
                          disabled={actionLoading === claim.claim_id}
                          onClick={() => handleUpdateClaimStatus(claim.claim_id, 'under_review', 'Please message finder with further details or physical verification.')}
                          className="px-3 py-1.5 text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                          Request Proof
                        </button>
                        <button
                          disabled={actionLoading === claim.claim_id}
                          onClick={() => handleUpdateClaimStatus(claim.claim_id, 'rejected', 'Details provided do not match the found item characteristics.')}
                          className="px-3 py-1.5 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors"
                        >
                          Decline
                        </button>
                      </>
                    ) : (
                      <span className="text-xs text-slate-500 dark:text-slate-400 italic">
                        {claim.status === 'approved' ? 'Claim verified & approved' : 'Claim closed'}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

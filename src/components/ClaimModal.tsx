import React, { useState, useEffect } from 'react';
import { X, Shield, AlertTriangle, ArrowRight, HelpCircle, CheckCircle2 } from 'lucide-react';
import { Item } from '../types';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { api } from '../services/api';

interface ClaimModalProps {
  item: Item | null;
  onClose: () => void;
  onClaimSubmitted?: () => void;
}

export const ClaimModal: React.FC<ClaimModalProps> = ({ item, onClose, onClaimSubmitted }) => {
  const { user, openAuthModal } = useAuth();
  const { showToast } = useNotifications();

  const [uniqueFeature, setUniqueFeature] = useState('');
  const [insideItems, setInsideItems] = useState('');
  const [exactLocation, setExactLocation] = useState('');
  const [proofNotes, setProofNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<string[]>([]);
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!item) return;
    const loadQuestions = async () => {
      try {
        setQuestionsLoading(true);
        const res = await api.getClaimQuestions(item.item_id);
        setQuestions(res.questions || []);
      } catch (err) {
        console.warn('Failed to load questions:', err);
      } finally {
        setQuestionsLoading(false);
      }
    };
    loadQuestions();
  }, [item]);

  if (!item) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      openAuthModal('login');
      return;
    }

    if (!uniqueFeature.trim() || !exactLocation.trim()) {
      setError('Please provide the unique feature and exact location where it was lost.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await api.submitClaim({
        item_id: item.item_id,
        unique_feature: uniqueFeature,
        inside_items: insideItems,
        exact_location: exactLocation,
        proof_notes: proofNotes,
      });

      showToast('Claim submitted successfully! The finder and administrator will review your details.', 'success');
      if (onClaimSubmitted) onClaimSubmitted();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Unable to submit claim. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#131b2e] rounded-2xl shadow-2xl dark:shadow-black/70 border border-slate-200/90 dark:border-slate-800 w-full max-w-xl max-h-[90vh] overflow-y-auto relative text-slate-800 dark:text-slate-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Submit Ownership Claim
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Claiming: <span className="font-semibold text-slate-700 dark:text-slate-300">{item.item_name}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Security Warning Notice */}
        <div className="mx-6 mt-4 p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl text-xs text-amber-900 dark:text-amber-300 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-bold">Protect Your Privacy:</span> Never submit complete credit
            card numbers, passwords, PIN codes, or government secret IDs. Describe physical
            characteristics, compartment contents, or marks that only the genuine owner would know.
          </div>
        </div>

        {/* Verification guidance */}
        {questions.length > 0 && (
          <div className="mx-6 mt-3 p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 rounded-xl text-xs text-blue-900 dark:text-blue-300">
            <div className="font-semibold text-blue-800 dark:text-blue-300 mb-1 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5" />
              Suggested Verification Points:
            </div>
            <ul className="list-disc list-inside space-y-0.5 text-blue-700 dark:text-blue-400">
              {questions.map((q, idx) => (
                <li key={idx}>{q}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Claim Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              1. Unique Distinguishing Feature <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={2}
              value={uniqueFeature}
              onChange={e => setUniqueFeature(e.target.value)}
              placeholder="e.g. A small scrape on the lower left corner, a silver star charm, specific sticker or pattern..."
              className="w-full p-2.5 text-xs sm:text-sm border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              2. What was inside or with the item?
            </label>
            <textarea
              rows={2}
              value={insideItems}
              onChange={e => setInsideItems(e.target.value)}
              placeholder="e.g. Student ID with initials 'S.C.', gym locker token, bus pass..."
              className="w-full p-2.5 text-xs sm:text-sm border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              3. Exact Location & Time you lost it <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={exactLocation}
              onChange={e => setExactLocation(e.target.value)}
              placeholder="e.g. Pragati Central Library 2nd floor silent zone around 2:30 PM"
              className="w-full p-2.5 text-xs sm:text-sm border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              4. Proof of Ownership Notes
            </label>
            <textarea
              rows={2}
              value={proofNotes}
              onChange={e => setProofNotes(e.target.value)}
              placeholder="e.g. I can unlock device with PIN in front of security, or provide college ID card matching the name."
              className="w-full p-2.5 text-xs sm:text-sm border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
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
              className="px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm disabled:opacity-50 flex items-center gap-1.5"
            >
              {loading ? (
                <span className="inline-block animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Submit Claim for Review</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

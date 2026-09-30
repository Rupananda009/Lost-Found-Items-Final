import React from 'react';
import {
  FileText,
  Search,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Lock,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

interface HowItWorksPageProps {
  onNav: (tab: string) => void;
}

export const HowItWorksPage: React.FC<HowItWorksPageProps> = ({ onNav }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-[#0f1b33] border border-blue-100 dark:border-[#1d2b47] text-blue-700 dark:text-blue-300 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>Transparent & Secure Recovery Lifecycle</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          How Lost & Found Works
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          Our 5-step process ensures lost belongings are reported swiftly, matched accurately, verified through private ownership questions, and returned safely.
        </p>
      </div>

      {/* 5-Step Process Breakdown */}
      <div className="space-y-6">
        {/* Step 1 */}
        <div className="p-6 bg-white dark:bg-[#111a2e] rounded-2xl border border-slate-200/90 dark:border-[#202f4d] shadow-xs dark:shadow-xl dark:shadow-black/50 flex flex-col md:flex-row items-start gap-6">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-[#0c1221] border border-blue-100 dark:border-[#1d2b47] text-blue-700 dark:text-blue-300 font-extrabold text-lg flex items-center justify-center shrink-0 font-mono">
            01
          </div>
          <div className="space-y-2 flex-1">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Step 1 — Report</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Whether you have lost a wallet, smartphone, keys, or bag, or discovered an unattended item across campus, create a simple report. Provide the category, approximate loss/found time, campus zone, and identifying features.
            </p>
            <div className="text-xs text-blue-600 dark:text-blue-400 font-semibold pt-1">
              Finders are never asked to reveal sensitive credentials or full card numbers publicly.
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="p-6 bg-white dark:bg-[#111a2e] rounded-2xl border border-slate-200/90 dark:border-[#202f4d] shadow-xs dark:shadow-xl dark:shadow-black/50 flex flex-col md:flex-row items-start gap-6">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-[#0c1221] border border-blue-100 dark:border-[#1d2b47] text-blue-700 dark:text-blue-300 font-extrabold text-lg flex items-center justify-center shrink-0 font-mono">
            02
          </div>
          <div className="space-y-2 flex-1">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Step 2 — Search & Directory Discovery</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Explore the centralized directory in real-time. Use instant multi-faceted filters by category, location (Library, Cafeteria, Science Hall, Bus Stop), date range, and keyword text search.
            </p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="p-6 bg-white dark:bg-[#111a2e] rounded-2xl border border-slate-200/90 dark:border-[#202f4d] shadow-xs dark:shadow-xl dark:shadow-black/50 flex flex-col md:flex-row items-start gap-6">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-[#0c1221] border border-blue-100 dark:border-[#1d2b47] text-blue-700 dark:text-blue-300 font-extrabold text-lg flex items-center justify-center shrink-0 font-mono">
            03
          </div>
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Step 3 — Smart Matching Engine</h3>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-transparent dark:border-blue-900/40">
                Rule-Based Correlation
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              When a new item is submitted, our system checks candidate counter-reports. It calculates a similarity score based on category, description token overlap, location proximity, and timestamp deltas. Potential matches are notified to both parties with side-by-side previews.
            </p>
            <div className="text-xs text-amber-600 dark:text-amber-400 font-medium">
              * Similarity scores are approximate estimates; ownership is never confirmed automatically.
            </div>
          </div>
        </div>

        {/* Step 4 */}
        <div className="p-6 bg-white dark:bg-[#111a2e] rounded-2xl border border-slate-200/90 dark:border-[#202f4d] shadow-xs dark:shadow-xl dark:shadow-black/50 flex flex-col md:flex-row items-start gap-6">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-[#0c1221] border border-blue-100 dark:border-[#1d2b47] text-blue-700 dark:text-blue-300 font-extrabold text-lg flex items-center justify-center shrink-0 font-mono">
            04
          </div>
          <div className="space-y-2 flex-1">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Step 4 — Ownership Verification</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              To prevent fraudulent claims, the claimant answers questions that only the authentic owner would know: distinguishing physical marks, hidden interior contents, and exact spot lost. The finder or campus administrator audits these answers before authorizing handover.
            </p>
          </div>
        </div>

        {/* Step 5 */}
        <div className="p-6 bg-white dark:bg-[#111a2e] rounded-2xl border border-slate-200/90 dark:border-[#202f4d] shadow-xs dark:shadow-xl dark:shadow-black/50 flex flex-col md:flex-row items-start gap-6">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-[#0c1221] border border-emerald-100 dark:border-[#1d2b47] text-emerald-700 dark:text-emerald-300 font-extrabold text-lg flex items-center justify-center shrink-0 font-mono">
            05
          </div>
          <div className="space-y-2 flex-1">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Step 5 — Safe Return & Case Closure</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Connect via safe in-app messaging or meet at official campus security drop-off hubs (Main Security Booth or Library Desk). Once the item is reunited with its owner, the case is marked Returned, updating campus statistics.
            </p>
          </div>
        </div>
      </div>

      {/* Safety & Responsible Design Principles */}
      <div className="bg-slate-900 dark:bg-[#111a2e] rounded-2xl p-8 text-white border border-slate-800 dark:border-[#202f4d] space-y-4 shadow-xl dark:shadow-black/60">
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
          <Lock className="w-4 h-4" />
          <span>Responsible Design Principles</span>
        </div>
        <h3 className="text-xl font-bold text-white">Privacy & Fraud Prevention Safeguards</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-300 pt-2">
          <div className="space-y-1">
            <div className="font-bold text-white">No Public Exposure of Phone/Email</div>
            <p className="leading-relaxed text-slate-300">
              User listings never reveal raw phone numbers or personal email addresses to visitors. All initial contact happens through sandboxed in-app messaging.
            </p>
          </div>
          <div className="space-y-1">
            <div className="font-bold text-white">Zero Credential Solicitation</div>
            <p className="leading-relaxed text-slate-300">
              We prohibit any request for passwords, card CVVs, full debit/credit numbers, or OTP codes. Physical verification relies on visible characteristics.
            </p>
          </div>
          <div className="space-y-1">
            <div className="font-bold text-white">Administrator Dispute Escalation</div>
            <p className="leading-relaxed text-slate-300">
              If two parties claim the same item, campus security can review physical documentation or student records in person.
            </p>
          </div>
          <div className="space-y-1">
            <div className="font-bold text-white">Pragati Campus Custody</div>
            <p className="leading-relaxed text-slate-300">
              Lost items may be deposited at the Central Library Circulation Desk or Main Security Gate for verified custody.
            </p>
          </div>
        </div>

        <div className="pt-4 flex justify-center">
          <button
            onClick={() => onNav('browse')}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2"
          >
            <span>Explore Campus Directory</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

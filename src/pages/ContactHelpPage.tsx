import React, { useState } from 'react';
import {
  HelpCircle,
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  ChevronDown,
  ShieldAlert,
  Building2
} from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';

const FAQS = [
  {
    q: 'How does ownership verification work when I submit a claim?',
    a: 'When you claim a found item, you are asked questions that only the genuine owner would know — such as a specific scratch, sticker, exact pocket contents, or the exact spot where it was left. The finder and campus administrator review these answers before approving release.'
  },
  {
    q: 'Why does the finder not list full card numbers or secret credentials?',
    a: 'For personal safety and fraud prevention, sensitive items like credit cards or ID cards are masked. A genuine owner is required to specify their name or matching identifier to claim it, preventing impostors from guessing.'
  },
  {
    q: 'Where can I turn in an item I found on Pragati campus?',
    a: 'You can deliver any found item directly to the Central Library Circulation Desk on the first floor or the Main Gate Security Cabin (open 24/7).'
  },
  {
    q: 'What should I do if I suspect an item listing is fraudulent or inappropriate?',
    a: 'Click the report/flag icon on any listing to send an alert directly to campus administrators, or visit the Security Desk with the item reference ID.'
  },
  {
    q: 'How long are unclaimed items held?',
    a: 'Per campus regulations, items are held safely for 60 days. Unclaimed personal belongings of low value are donated to campus community charity; valuable electronics and IDs are archived with central administration.'
  }
];

export const ContactHelpPage: React.FC = () => {
  const { showToast } = useNotifications();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    showToast('Your inquiry has been submitted to campus lost & found support.', 'success');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Help Center & Campus Support
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
          Find answers to common questions or reach out to the Pragati Engineering College recovery team.
        </p>
      </div>

      {/* Campus Hubs Contact Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white dark:bg-[#111a2e] rounded-2xl border border-slate-200/90 dark:border-[#202f4d] shadow-xs dark:shadow-xl dark:shadow-black/50 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-[#0f1b33] text-blue-600 dark:text-blue-400 flex items-center justify-center border border-transparent dark:border-[#1d2b47]">
            <Building2 className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Main Security Cabin</h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Main Gate Entrance. Central 24/7 intake for valuable electronics, wallets, watches, and keys.
          </p>
          <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 pt-1">
            Open 24 Hours / 7 Days
          </div>
        </div>

        <div className="p-6 bg-white dark:bg-[#111a2e] rounded-2xl border border-slate-200/90 dark:border-[#202f4d] shadow-xs dark:shadow-xl dark:shadow-black/50 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-[#0f1b33] text-blue-600 dark:text-blue-400 flex items-center justify-center border border-transparent dark:border-[#1d2b47]">
            <MapPin className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Central Library Desk</h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            First Floor Circulation Counter. Primary custody for notebooks, textbooks, IDs, and stationery.
          </p>
          <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 pt-1">
            Mon - Sat: 8:00 AM - 7:00 PM
          </div>
        </div>

        <div className="p-6 bg-white dark:bg-[#111a2e] rounded-2xl border border-slate-200/90 dark:border-[#202f4d] shadow-xs dark:shadow-xl dark:shadow-black/50 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-[#0f1b33] text-blue-600 dark:text-blue-400 flex items-center justify-center border border-transparent dark:border-[#1d2b47]">
            <Mail className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Email Assistance</h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Administrative queries, dispute reviews, or verified proof submission.
          </p>
          <div className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 pt-1">
            lostandfound@pragati.ac.in
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Frequently Asked Questions</h2>
        <div className="bg-white dark:bg-[#111a2e] rounded-2xl border border-slate-200/90 dark:border-[#202f4d] divide-y divide-slate-100 dark:divide-[#1d2b47] overflow-hidden shadow-xs dark:shadow-xl dark:shadow-black/50">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="p-5">
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full text-left flex items-center justify-between text-sm font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform ${
                      isOpen ? 'rotate-180 text-blue-600 dark:text-blue-400' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-2.5 leading-relaxed animate-in fade-in duration-150">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Contact Support Form */}
      <div className="bg-white dark:bg-[#111a2e] p-6 sm:p-8 rounded-2xl border border-slate-200/90 dark:border-[#202f4d] shadow-xs dark:shadow-xl dark:shadow-black/50 space-y-6 text-slate-800 dark:text-slate-200">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Send an Inquiry to Campus Staff</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Need help recovering an item or have a special request? We respond within 1 business day.
          </p>
        </div>

        {submitted ? (
          <div className="p-6 bg-emerald-50 dark:bg-[#0c1c24] rounded-xl border border-emerald-200 dark:border-emerald-800/60 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto" />
            <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">Message Received</h4>
            <p className="text-xs text-emerald-700 dark:text-emerald-300">
              Thank you for contacting Pragati Lost & Found. Our desk officers will follow up via your email.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Jordan Smith"
                  className="w-full p-2.5 text-xs sm:text-sm border border-slate-300 dark:border-[#202f4d] rounded-lg bg-white dark:bg-[#0c1221] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Campus Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@pragati.ac.in"
                  className="w-full p-2.5 text-xs sm:text-sm border border-slate-300 dark:border-[#202f4d] rounded-lg bg-white dark:bg-[#0c1221] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Your Message</label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Describe your inquiry, item details, or concern..."
                className="w-full p-2.5 text-xs sm:text-sm border border-slate-300 dark:border-[#202f4d] rounded-lg bg-white dark:bg-[#0c1221] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs flex items-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Inquiry</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

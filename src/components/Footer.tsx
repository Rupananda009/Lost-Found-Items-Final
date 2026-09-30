import React from 'react';
import { Shield, MapPin, Phone, Mail, Clock, ExternalLink } from 'lucide-react';

interface FooterProps {
  onNav: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNav }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand & Mission */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <div className="w-7 h-7 rounded-md bg-blue-600 flex items-center justify-center text-xs">
                LF
              </div>
              <span>Lost & Found</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              A centralized campus and community platform connecting misplaced belongings with their rightful owners safely, responsibly, and efficiently.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-400 pt-1">
              <Shield className="w-3.5 h-3.5" />
              <span>Campus Verified & Privacy-Preserving</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
              Explore
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNav('browse')}
                  className="hover:text-white transition-colors"
                >
                  Browse Reported Items
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNav('report_lost')}
                  className="hover:text-white transition-colors"
                >
                  Report Lost Belonging
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNav('report_found')}
                  className="hover:text-white transition-colors"
                >
                  Report Found Belonging
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNav('matches')}
                  className="hover:text-white transition-colors"
                >
                  Smart Matching System
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNav('how_it_works')}
                  className="hover:text-white transition-colors"
                >
                  How It Works & Verification
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Safe Drop-off Points */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
              Central Drop-off Hubs
            </h4>
            <div className="space-y-2.5">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                <span>Main Campus Security Desk (Building A, Lobby)</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                <span>University Library Circulation Desk (Level 1)</span>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                <span>Operating Hours: Mon–Sat, 8:00 AM – 8:00 PM</span>
              </div>
            </div>
          </div>

          {/* Col 4: Trust, Safety & Help */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
              Help & Policies
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNav('contact_help')}
                  className="hover:text-white transition-colors"
                >
                  Help Center & FAQs
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNav('contact_help')}
                  className="hover:text-white transition-colors"
                >
                  Privacy Protection Standard
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNav('contact_help')}
                  className="hover:text-white transition-colors"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <span className="text-slate-500 text-[11px] block pt-1">
                  Emergency Desk: +1 (555) 019-2834
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} Lost & Found Centralized Recovery System. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Zero-Pill Accessibility Compliant</span>
            <span aria-hidden="true">·</span>
            <span>Security Audited</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

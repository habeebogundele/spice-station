'use client';

import { Phone, Mail, MapPin } from 'lucide-react';

interface FooterProps {
  onShowLegal?: (type: 'terms' | 'privacy' | 'shipping') => void;
}

export default function Footer({ onShowLegal }: FooterProps) {
  return (
    <footer id="contact" className="bg-brand-off-white border-t border-brand-purple/10 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-12 mb-16">
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <img 
              referrerPolicy="no-referrer"
              src="/logo.png" 
              alt="Temmy's Logo" 
              className="h-12 w-auto object-contain" 
            />
            <span className="font-serif text-lg font-bold tracking-tight text-brand-purple uppercase">
              TEMMY'S <span className="text-brand-gold">SPICE STATION</span>
            </span>
          </div>
          <p className="text-gray-500 text-sm leading-relaxed font-serif italic">
            "Satisfy Your Cravings" with authentic, hygienically prepared Nigerian delicacies and drinks.
          </p>
          <div className="flex gap-4">
            <a 
              href="https://www.tiktok.com/@temmy_spice_station" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full border border-brand-purple/10 flex items-center justify-center text-brand-purple hover:bg-brand-purple hover:text-white transition-all group"
              title="Follow us on TikTok"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z"/>
              </svg>
            </a>
          </div>
        </div>

        <div className="space-y-6">
          <h4 className="font-bold text-brand-purple uppercase tracking-widest text-xs">Quick Links</h4>
          <ul className="space-y-3 text-sm text-gray-600">
            <li><a href="#" className="hover:text-brand-purple transition-colors">Home</a></li>
            <li><a href="#products" className="hover:text-brand-purple transition-colors">Our Products</a></li>
            <li><a href="#about" className="hover:text-brand-purple transition-colors">About Us</a></li>
            <li><a href="#contact" className="hover:text-brand-purple transition-colors">Contact</a></li>
          </ul>
        </div>

        <div className="space-y-6">
          <h4 className="font-bold text-brand-purple uppercase tracking-widest text-xs">Legal</h4>
          <ul className="space-y-3 text-sm text-gray-600">
            <li>
              <button 
                onClick={() => onShowLegal?.('terms')}
                className="hover:text-brand-purple transition-colors cursor-pointer"
              >
                Terms of Service
              </button>
            </li>
            <li>
              <button 
                onClick={() => onShowLegal?.('privacy')}
                className="hover:text-brand-purple transition-colors cursor-pointer"
              >
                Privacy Policy
              </button>
            </li>
            <li>
              <button 
                onClick={() => onShowLegal?.('shipping')}
                className="hover:text-brand-purple transition-colors cursor-pointer"
              >
                Shipping Info
              </button>
            </li>
          </ul>
        </div>

        <div className="space-y-6">
          <h4 className="font-bold text-brand-purple uppercase tracking-widest text-xs">Contact Us</h4>
          <ul className="space-y-4 text-sm text-gray-600">
            <li className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-brand-gold flex-shrink-0" />
              <span>07013323223, 08106249018</span>
            </li>
            <li className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-brand-gold flex-shrink-0" />
              <span>temmysspice@gmail.com</span>
            </li>
            <li className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-brand-gold flex-shrink-0" />
              <span>Lagos, Nigeria</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 pt-10 border-t border-brand-purple/5 text-center flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-[0.2em] text-gray-400">
        <p>© {new Date().getFullYear()} Temmy's Spice Station. All Rights Reserved.</p>
        <p>Built for Authenticity</p>
      </div>
    </footer>
  );
}

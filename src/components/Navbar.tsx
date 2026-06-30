'use client';

import { ShoppingBag, Menu, X, Phone, Mail } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
}

export default function Navbar({ cartCount, onOpenCart }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'Products', href: '#products' },
    { name: 'Track', href: '#track' },
    { name: 'FAQ', href: '#faq' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-brand-off-white/80 backdrop-blur-md border-b border-brand-purple/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-2">
            <img 
              referrerPolicy="no-referrer"
              src="/logo.png" 
              alt="Temmy's Logo" 
              className="h-14 w-auto object-contain" 
            />
            <span className="font-serif text-xl font-bold tracking-tight text-brand-purple hidden sm:inline">
              TEMMY'S <span className="text-brand-gold">SPICE STATION</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-xs font-bold text-gray-700 hover:text-brand-purple transition-colors uppercase tracking-[0.2em]"
              >
                {link.name}
              </a>
            ))}
            <button
              onClick={onOpenCart}
              className="relative p-2 text-brand-purple hover:bg-brand-purple/5 rounded-full transition-colors"
            >
              <ShoppingBag className="w-6 h-6" />
              {cartCount > 0 && (
                <motion.span 
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  key={cartCount}
                  className="absolute top-0 right-0 bg-brand-gold text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white"
                >
                  {cartCount}
                </motion.span>
              )}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={onOpenCart}
              className="relative p-2 text-brand-purple"
            >
              <ShoppingBag className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-brand-gold text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-brand-purple"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-brand-off-white border-b border-brand-purple/10 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block text-lg font-serif text-brand-purple py-2 border-b border-brand-purple/5"
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-4 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4" /> 07013323029
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" /> temmysspice@gmail.com
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus, HelpCircle } from 'lucide-react';
import { FAQS } from '@/constants';
import { cn } from '@/lib/utils';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 px-4 bg-white">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/10 text-brand-gold text-xs font-bold uppercase tracking-widest">
            <HelpCircle className="w-3 h-3" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-serif font-bold text-brand-purple">Common Questions</h2>
          <p className="text-gray-500 font-serif italic text-lg">Everything you need to know about our products and service.</p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => (
            <div 
              key={idx}
              className={cn(
                "border rounded-2xl transition-all duration-300",
                openIndex === idx ? "border-brand-purple bg-brand-purple/5 shadow-md" : "border-gray-100 bg-white"
              )}
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full text-left p-6 flex justify-between items-center group"
              >
                <span className={cn(
                  "font-serif font-bold text-lg transition-colors",
                  openIndex === idx ? "text-brand-purple" : "text-gray-700 group-hover:text-brand-purple"
                )}>
                  {faq.question}
                </span>
                <div className={cn(
                  "p-2 rounded-full transition-colors",
                  openIndex === idx ? "bg-brand-purple text-white" : "bg-gray-50 text-gray-400 group-hover:bg-brand-purple/10 group-hover:text-brand-purple"
                )}>
                  {openIndex === idx ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                </div>
              </button>
              
              <AnimatePresence>
                {openIndex === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 pt-0 text-gray-600 leading-relaxed font-serif text-lg">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

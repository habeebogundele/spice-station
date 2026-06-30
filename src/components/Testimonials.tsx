'use client';

import { Star, Quote } from 'lucide-react';
import { motion } from 'motion/react';
import { TESTIMONIALS } from '@/constants';

export default function Testimonials() {
  return (
    <section className="py-24 bg-brand-purple overflow-hidden relative">
      <Quote className="absolute top-10 left-10 w-48 h-48 text-white/5 -rotate-12" />
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16 space-y-4">
           <h2 className="text-brand-gold font-serif text-lg tracking-[0.2em] uppercase font-bold">What they say</h2>
           <p className="text-4xl lg:text-5xl font-serif font-bold text-white">Trust from Our Community</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t, idx) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-[2rem] space-y-6"
            >
              <div className="flex gap-1 text-brand-gold">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={t.rating > i ? "w-4 h-4 fill-current" : "w-4 h-4"} />
                ))}
              </div>
              <p className="text-lg text-white/80 font-serif italic leading-relaxed">
                "{t.text}"
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                <div className="w-10 h-10 rounded-full bg-brand-gold/20 flex items-center justify-center text-brand-gold font-bold">
                  {t.name[0]}
                </div>
                <span className="font-bold text-white tracking-wide">{t.name}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

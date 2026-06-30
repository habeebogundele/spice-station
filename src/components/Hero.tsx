'use client';

import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

const SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1615485925828-568eb2a66e40?auto=format&fit=crop&q=80&w=1200",
    title: "Nourish Your Soul",
    accent: "Natural & Pure"
  },
  {
    image: "/smoked_fish.jpg",
    title: "The Perfect Umami",
    accent: "Naturally Smoked"
  },
  {
    image: "/dried_ponmo.jpg",
    title: "Authentic Chews",
    accent: "Traditional Prep"
  }
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden px-4">
      {/* Background patterns */}
      <div className="absolute top-0 right-0 -z-10 opacity-10">
        <div className="w-96 h-96 bg-brand-gold rounded-full blur-3xl" />
      </div>
      <div className="absolute bottom-0 left-0 -z-10 opacity-10">
        <div className="w-96 h-96 bg-brand-purple rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        <div className="lg:w-1/2 space-y-8 relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-purple/5 border border-brand-purple/10 text-brand-purple text-sm font-medium"
          >
            <Star className="w-4 h-4 fill-brand-gold text-brand-gold" />
            <span>Authentic Nigerian Flavours</span>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl lg:text-7xl font-serif font-bold text-brand-purple leading-tight">
                Taste Tradition, <br />
                <span className="italic text-brand-gold">{SLIDES[currentSlide].title}</span>
              </h1>
              <p className="text-lg lg:text-xl text-gray-600 max-w-xl mt-6 leading-relaxed">
                {SLIDES[currentSlide].accent}: At Temmy's Spice Station, we bring the rich flavours of tradition straight to your table with no preservatives.
              </p>
            </motion.div>
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap gap-4"
          >
            <a
              href="#products"
              className="px-8 py-4 bg-brand-purple text-white rounded-full font-bold hover:bg-brand-purple-light transition-all flex items-center gap-2 group shadow-lg shadow-brand-purple/20"
            >
              Shop Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#about"
              className="px-8 py-4 bg-transparent border-2 border-brand-purple text-brand-purple rounded-full font-bold hover:bg-brand-purple/5 transition-all"
            >
              Our Story
            </a>
          </motion.div>
        </div>

        <div className="lg:w-1/2 relative">
          <div className="relative z-10 rounded-[2rem] overflow-hidden shadow-2xl border-4 border-brand-gold/20 aspect-[4/5] lg:aspect-square bg-gray-100">
            <AnimatePresence mode="wait">
              <motion.img
                referrerPolicy="no-referrer"
                key={currentSlide}
                src={SLIDES[currentSlide].image}
                alt={SLIDES[currentSlide].title}
                initial={{ opacity: 0, x: 50, scale: 1.1 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -50, scale: 0.9 }}
                transition={{ duration: 0.8, ease: "anticipate" }}
                className="w-full h-full object-cover"
              />
            </AnimatePresence>
            
            {/* Slider Controls */}
            <div className="absolute bottom-6 right-6 flex gap-2 z-30">
               <button 
                onClick={() => setCurrentSlide(prev => (prev - 1 + SLIDES.length) % SLIDES.length)}
                className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-brand-purple transition-all border border-white/30"
               >
                 <ChevronLeft className="w-5 h-5" />
               </button>
               <button 
                onClick={() => setCurrentSlide(prev => (prev + 1) % SLIDES.length)}
                className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-brand-purple transition-all border border-white/30"
               >
                 <ChevronRight className="w-5 h-5" />
               </button>
            </div>
          </div>
          
          <div className="absolute -bottom-6 -left-6 z-20 bg-white p-6 rounded-2xl shadow-xl border border-brand-purple/5 flex items-center gap-4 hidden sm:flex">
             <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                <Star className="w-6 h-6 fill-current" />
             </div>
             <div>
                <p className="font-bold text-brand-purple uppercase tracking-widest text-[10px]">100% Natural</p>
                <p className="text-xs text-gray-500 italic font-serif">Made without preservatives</p>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}

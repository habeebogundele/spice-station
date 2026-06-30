'use client';

import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Package, Search, Truck, CheckCircle2, Clock, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { TrackingResult } from '@/types';

export default function OrderTracking() {
  const [orderId, setOrderId] = useState('');
  const [trackingData, setTrackingData] = useState<TrackingResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e: FormEvent) => {
    e.preventDefault();
    const id = orderId.trim();
    if (!id) return;

    setLoading(true);
    setError('');
    setTrackingData(null);

    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(id)}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Order ID not found.');
      }
      setTrackingData(data.tracking as TrackingResult);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Order ID not found. Please check your confirmation message.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="track" className="py-24 px-4 bg-brand-off-white">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-purple/10 text-brand-purple text-xs font-bold uppercase tracking-widest">
            <Truck className="w-3 h-3" />
            <span>Real-time Updates</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-serif font-bold text-brand-purple">
            Track Your Order
          </h2>
          <p className="text-gray-500 font-serif italic text-lg max-w-2xl mx-auto">
            Stay updated on your fresh delivery. Enter the Order ID from your confirmation (e.g., TM-12345).
          </p>
        </div>

        <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-brand-purple/5">
          <form onSubmit={handleTrack} className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gold w-5 h-5" />
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="Enter Order ID"
                className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-brand-purple outline-none transition-all font-bold tracking-widest text-brand-purple"
              />
            </div>
            <button
              disabled={loading}
              className={cn(
                'px-8 py-4 bg-brand-purple text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-brand-purple/20',
                loading ? 'cursor-wait' : 'hover:bg-brand-purple-light'
              )}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Search className="w-5 h-5" />
              )}
              {loading ? 'Searching...' : 'Track Now'}
            </button>
          </form>

          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-red-500 text-sm font-bold mt-4 text-center"
              >
                {error}
              </motion.p>
            )}

            {trackingData && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-12 pt-12 border-t border-gray-100 space-y-8"
              >
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                      Order Status
                    </p>
                    <p className="text-2xl font-serif font-black text-brand-purple">
                      {trackingData.status}
                    </p>
                  </div>
                  <div className="space-y-1 md:text-right">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                      Current Location
                    </p>
                    <div className="flex md:justify-end items-center gap-2 text-brand-gold font-bold">
                      <MapPin className="w-4 h-4" />
                      {trackingData.location}
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-brand-purple rounded-2xl text-white flex items-center gap-4">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Clock className="w-5 h-5" />
                  </div>
                  <p className="text-sm font-medium">{trackingData.lastUpdate}</p>
                </div>

                <div className="relative space-y-8 pl-8">
                  <div className="absolute left-3.5 top-2 bottom-2 w-0.5 bg-gray-100" />
                  {trackingData.steps.map((step, i) => (
                    <div key={i} className="relative">
                      <div
                        className={cn(
                          'absolute -left-[2.15rem] w-8 h-8 rounded-full border-4 border-white flex items-center justify-center transition-colors',
                          step.status === 'completed'
                            ? 'bg-green-500 text-white'
                            : step.status === 'active'
                              ? 'bg-brand-purple text-white animate-pulse'
                              : 'bg-gray-200 text-gray-400'
                        )}
                      >
                        {step.status === 'completed' ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-current" />
                        )}
                      </div>
                      <div className="flex justify-between items-start">
                        <div>
                          <p
                            className={cn(
                              'font-bold',
                              step.status === 'pending'
                                ? 'text-gray-400'
                                : 'text-brand-purple'
                            )}
                          >
                            {step.label}
                          </p>
                          {step.date && (
                            <p className="text-xs text-gray-400">{step.date}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

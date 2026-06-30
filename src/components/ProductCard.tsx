'use client';

import { useState } from 'react';
import { ShoppingCart, Plus, Minus, ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, ProductVariant } from '@/types';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, variant: ProductVariant, quantity: number) => void;
  key?: string | number | null;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -5 }}
        className="bg-white rounded-3xl overflow-hidden shadow-sm border border-brand-purple/5 flex flex-col h-full group"
      >
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          {/* Main Image */}
          <AnimatePresence mode="wait">
            <motion.img
              key={currentImageIndex}
              referrerPolicy="no-referrer"
              src={product.images[currentImageIndex]}
              alt={`${product.name} - ${currentImageIndex + 1}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 cursor-pointer"
              onClick={() => setIsLightboxOpen(true)}
            />
          </AnimatePresence>

          {/* Lightbox Trigger Button */}
          <button 
             onClick={() => setIsLightboxOpen(true)}
             className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-md rounded-full text-brand-purple opacity-0 group-hover:opacity-100 transition-opacity z-20 hover:bg-white"
          >
             <Maximize2 className="w-4 h-4" />
          </button>

          {/* Navigation Arrows */}
          {product.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-md rounded-full text-brand-purple opacity-0 group-hover:opacity-100 transition-opacity z-20 hover:bg-white"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-md rounded-full text-brand-purple opacity-0 group-hover:opacity-100 transition-opacity z-20 hover:bg-white"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Indicators */}
          {product.images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
              {product.images.map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "w-1.5 h-1.5 rounded-full transition-all duration-300",
                    currentImageIndex === i ? "bg-white w-4" : "bg-white/50"
                  )}
                />
              ))}
            </div>
          )}

          <div className="absolute top-4 left-4 z-10">
            <span className="px-3 py-1 bg-brand-purple text-white text-[10px] font-bold rounded-full uppercase tracking-widest shadow-lg">
              {product.category}
            </span>
          </div>
        </div>

        <div className="p-6 flex flex-col flex-grow space-y-4">
          <div>
            <h3 className="text-xl font-serif font-bold text-brand-purple">{product.name}</h3>
            <p className="text-sm text-gray-500 line-clamp-2 mt-1">{product.description}</p>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Select Size</p>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariant(v)}
                  className={cn(
                    "px-3 py-1.5 text-xs rounded-full border transition-all",
                    selectedVariant.id === v.id
                      ? "bg-brand-purple text-white border-brand-purple"
                      : "bg-white text-gray-600 border-gray-200 hover:border-brand-purple/30"
                  )}
                >
                  {v.size}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 mt-auto flex items-center justify-between border-t border-brand-purple/5">
            <div className="text-2xl font-serif font-black text-brand-purple">
              ₦{selectedVariant.price.toLocaleString()}
            </div>
            
            <div className="flex items-center gap-3 bg-brand-off-white rounded-full p-1 border border-brand-purple/5">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-1 hover:bg-white rounded-full transition-colors text-brand-purple"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-sm font-bold w-4 text-center">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="p-1 hover:bg-white rounded-full transition-colors text-brand-purple"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <button
            onClick={() => onAddToCart(product, selectedVariant, quantity)}
            className="w-full py-3 bg-brand-purple text-white font-bold rounded-xl hover:bg-brand-purple-light transition-all flex items-center justify-center gap-2 group/btn"
          >
            <ShoppingCart className="w-5 h-5 group-hover/btn:-translate-y-0.5 transition-transform" />
            Add to Cart
          </button>
        </div>
      </motion.div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLightboxOpen(false)}
              className="absolute inset-0 bg-black/95 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-5xl aspect-square lg:aspect-video flex items-center justify-center pointer-events-none"
            >
              <img
                referrerPolicy="no-referrer"
                src={product.images[currentImageIndex]}
                alt={product.name}
                className="max-w-full max-h-full object-contain pointer-events-auto shadow-2xl"
              />
              
              <div className="absolute top-4 right-4 flex gap-4 pointer-events-auto">
                <button
                  onClick={() => setIsLightboxOpen(false)}
                  className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                >
                  <X />
                </button>
              </div>

              {/* Lightbox Nav */}
              {product.images.length > 1 && (
                <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
                  <button
                    onClick={prevImage}
                    className="p-4 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors pointer-events-auto"
                  >
                    <ChevronLeft className="w-8 h-8" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="p-4 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors pointer-events-auto"
                  >
                    <ChevronRight className="w-8 h-8" />
                  </button>
                </div>
              )}

              {/* Thumbnails */}
              <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 flex gap-4 pointer-events-auto">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImageIndex(i)}
                    className={cn(
                      "w-12 h-12 rounded-lg overflow-hidden border-2 transition-all",
                      currentImageIndex === i ? "border-brand-gold scale-110" : "border-white/20 opacity-50 hover:opacity-100"
                    )}
                  >
                    <img referrerPolicy="no-referrer" src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

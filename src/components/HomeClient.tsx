'use client';

import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, ChevronRight, Info, CheckCircle2, X } from 'lucide-react';
import Navbar from './Navbar';
import Hero from './Hero';
import ProductCard from './ProductCard';
import CartSidebar from './CartSidebar';
import Testimonials from './Testimonials';
import OrderTracking from './OrderTracking';
import FAQ from './FAQ';
import Footer from './Footer';
import { WHATSAPP_NUMBER } from '@/lib/whatsapp';
import type { Product, ProductVariant, CartItem } from '@/types';

interface HomeClientProps {
  products: Product[];
}

export default function HomeClient({ products }: HomeClientProps) {
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [legalModal, setLegalModal] = useState<'terms' | 'privacy' | 'shipping' | null>(null);

  const cartCount = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.quantity, 0),
    [cartItems]
  );

  const handleAddToCart = useCallback(
    (product: Product, variant: ProductVariant, quantity: number) => {
      const itemId = `${product.id}-${variant.id}`;
      setCartItems((prev) => {
        const existing = prev.find((item) => item.id === itemId);
        if (existing) {
          return prev.map((item) =>
            item.id === itemId
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }
        return [
          ...prev,
          { id: itemId, productId: product.id, variantId: variant.id, quantity },
        ];
      });
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    },
    []
  );

  const handleUpdateQuantity = useCallback((id: string, delta: number) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  }, []);

  const handleRemoveItem = useCallback((id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const handleClearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const drinkProducts = products.filter((p) => p.category === 'Drinks');
  const delicacyProducts = products.filter((p) => p.category === 'Delicacies');
  const noProducts = products.length === 0;

  return (
    <div className="min-h-screen">
      <Navbar cartCount={cartCount} onOpenCart={() => setCartOpen(true)} />

      <main>
        <Hero />

        {/* Featured Products */}
        <section id="products" className="py-24 px-4 bg-white">
          <div className="max-w-7xl mx-auto space-y-24">
            {noProducts && (
              <div className="text-center py-16 bg-brand-off-white rounded-3xl border border-dashed border-brand-purple/20">
                <p className="text-brand-purple font-serif text-xl italic">
                  Products could not be loaded.
                </p>
                <p className="text-gray-500 mt-2 text-sm max-w-lg mx-auto">
                  Set a MongoDB Atlas <code className="font-mono">MONGODB_URI</code> in Vercel
                  Environment Variables, then seed the catalogue.
                </p>
              </div>
            )}

            {/* Drinks Category */}
            {drinkProducts.length > 0 && (
              <div className="space-y-12">
                <div className="flex items-end justify-between border-b border-gray-100 pb-8">
                  <div className="space-y-4">
                    <span className="text-brand-gold font-serif text-sm tracking-[0.3em] uppercase font-bold">
                      Category
                    </span>
                    <h2 className="text-4xl lg:text-5xl font-serif font-bold text-brand-purple">
                      Refreshing Drinks
                    </h2>
                  </div>
                  <div className="hidden sm:flex items-center gap-2 text-brand-purple font-medium group cursor-pointer">
                    <span>View Price List</span>
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {drinkProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Delicacies Category */}
            {delicacyProducts.length > 0 && (
              <div className="space-y-12">
                <div className="flex items-end justify-between border-b border-gray-100 pb-8">
                  <div className="space-y-4">
                    <span className="text-brand-gold font-serif text-sm tracking-[0.3em] uppercase font-bold">
                      Category
                    </span>
                    <h2 className="text-4xl lg:text-5xl font-serif font-bold text-brand-purple">
                      Authentic Delicacies
                    </h2>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {delicacyProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={handleAddToCart}
                    />
                  ))}

                  {/* Promo Card for "Available on order" items */}
                  <div className="bg-brand-purple/5 border border-dashed border-brand-purple/20 rounded-3xl p-10 flex flex-col justify-center items-center text-center space-y-6">
                    <div className="w-16 h-16 bg-brand-purple/10 rounded-full flex items-center justify-center text-brand-purple">
                      <ShoppingBag className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-serif font-bold text-brand-purple">
                      Custom Orders
                    </h3>
                    <p className="text-gray-500 font-serif italic">
                      Peppered Ponmo and Peppered Catfish is also available on special order.
                    </p>
                    <a
                      href={`https://wa.me/${WHATSAPP_NUMBER}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-6 py-3 bg-brand-purple text-white rounded-full font-bold hover:bg-brand-purple-light transition-all"
                    >
                      Chat on WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-24 px-4 bg-brand-off-white">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
            <div className="lg:w-1/2 relative group">
              <div className="rounded-[4rem] overflow-hidden shadow-2xl border-2 border-brand-gold/10">
                <img
                  referrerPolicy="no-referrer"
                  src="https://images.unsplash.com/photo-1547517023-7ca0c162f816?auto=format&fit=crop&q=80&w=1200"
                  alt="Authentic Prep"
                  className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
                />
              </div>
              <div className="absolute -top-8 -right-8 w-40 h-40 bg-brand-gold rounded-full flex flex-col items-center justify-center text-white border-8 border-brand-off-white shadow-xl rotate-12">
                <span className="text-sm font-bold uppercase tracking-widest">Quality</span>
                <span className="text-3xl font-serif font-black">100%</span>
              </div>
            </div>

            <div className="lg:w-1/2 space-y-8">
              <div className="space-y-4">
                <h2 className="text-brand-gold font-serif text-lg tracking-[0.2em] uppercase font-bold">
                  Our Story
                </h2>
                <p className="text-4xl lg:text-5xl font-serif font-bold text-brand-purple leading-tight">
                  Tradition Meets <br /> Excellence in Every Bite
                </p>
              </div>

              <div className="space-y-6 text-gray-600 leading-relaxed font-serif text-lg">
                <p>
                  At Temmy&rsquo;s Spice Station, we bring the rich flavours of tradition straight to your table.
                  We specialise in the production and sale of nourishing Tigernut Drink, refreshing Zobo Drink,
                  and authentic Nigerian delicacies like Ponmo (dried cow skin) and Smoked Catfish.
                </p>
                <p>
                  Our mission is simple: to deliver quality, hygienically prepared products that celebrate culture and taste.
                  Every item we produce is crafted with care, ensuring freshness, flavour, and satisfaction in every sip and bite.
                </p>
              </div>

              <div className="pt-6 grid grid-cols-2 gap-8 border-t border-brand-purple/10">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-brand-purple/5 rounded-lg text-brand-purple">
                    <Info className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-brand-purple">Hygienic</p>
                    <p className="text-xs text-gray-500 font-serif italic">
                      Prepared in clean environment
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-brand-purple/5 rounded-lg text-brand-purple">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-brand-purple">Fresh</p>
                    <p className="text-xs text-gray-500 font-serif italic">
                      Crafted daily for richness
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <OrderTracking />

        <Testimonials />

        <FAQ />

        {/* CTA Section */}
        <section className="py-24 px-4 text-center">
          <div className="max-w-5xl mx-auto rounded-[3rem] bg-brand-purple p-12 lg:p-20 space-y-8 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/20 rounded-full blur-3xl opacity-50" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl opacity-50" />

            <h2 className="text-4xl lg:text-6xl font-serif font-bold text-white leading-tight relative z-10">
              Ready to Experience the <br />
              <span className="italic text-brand-gold">Rich Flavours of Tradition?</span>
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto font-serif text-lg relative z-10 leading-relaxed">
              Order now and get fresh, authentic delicacies delivered straight to your doorstep across Lagos.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4 relative z-10">
              <a
                href="#products"
                className="px-10 py-5 bg-brand-gold text-brand-purple font-black rounded-full hover:bg-white transition-all shadow-xl hover:scale-105 active:scale-95 uppercase tracking-widest text-sm"
              >
                Shop All Products
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer onShowLegal={setLegalModal} />

      {/* Cart Toast Confirmation */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 100, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 100, x: '-50%' }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] bg-brand-purple text-white px-8 py-4 rounded-full flex items-center gap-4 shadow-2xl border border-white/20"
          >
            <div className="bg-green-500 rounded-full p-1">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <span className="font-bold whitespace-nowrap text-sm text-white">
              Added to Basket!
            </span>
            <button
              onClick={() => {
                setCartOpen(true);
                setShowToast(false);
              }}
              className="text-brand-gold font-black uppercase text-xs tracking-widest pl-4 border-l border-white/20 ml-2 cursor-pointer"
            >
              View
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <CartSidebar
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        products={products}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />

      {/* Legal Modal */}
      <AnimatePresence>
        {legalModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLegalModal(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-brand-off-white w-full max-w-2xl rounded-[3rem] p-8 lg:p-12 relative z-10 shadow-2xl border border-brand-purple/5 overflow-y-auto max-h-[80vh]"
            >
              <button
                onClick={() => setLegalModal(null)}
                className="absolute top-6 right-6 p-2 text-brand-purple hover:bg-brand-purple/5 rounded-full transition-colors"
              >
                <X />
              </button>

              <h3 className="text-3xl font-serif font-black text-brand-purple mb-6 capitalize leading-none">
                {legalModal.replace('-', ' ')}
              </h3>

              <div className="space-y-6 text-gray-600 font-serif text-lg leading-relaxed">
                <p>
                  Welcome to Temmy&apos;s Spice Station. Our {legalModal} are designed to provide you with a transparent and high-quality shopping experience.
                </p>
                <p>
                  At Temmy&apos;s, we prioritise the hygiene and authenticity of every product we sell. By choosing our service, you agree to our processing standards which include careful sourcing of natural ingredients and 100% preservative-free production.
                </p>
                <p>
                  For shipping information, we provide delivery across Lagos with variable rates based on distance. Orders are typically processed within 24 hours to ensure maximum freshness.
                </p>
              </div>

              <div className="mt-12 pt-8 border-t border-brand-purple/10 text-center">
                <button
                  onClick={() => setLegalModal(null)}
                  className="px-8 py-3 bg-brand-purple text-white font-bold rounded-full hover:bg-brand-purple-light transition-all"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

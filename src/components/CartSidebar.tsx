'use client';

import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Trash2,
  ShoppingBag,
  ArrowRight,
  CheckCircle2,
  ArrowLeft,
  Loader2,
} from 'lucide-react';
import { useState } from 'react';
import { Product, CartItem, Order } from '@/types';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  products: Product[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
}

type View = 'cart' | 'form' | 'receipt';

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 0 1 8.413 3.488 11.82 11.82 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.51 5.26l-.999 3.648 3.978-1.607zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
  </svg>
);

export default function CartSidebar({
  isOpen,
  onClose,
  items,
  products,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}: CartSidebarProps) {
  const [view, setView] = useState<View>('cart');
  const [order, setOrder] = useState<Order | null>(null);
  const [whatsappUrl, setWhatsappUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', phone: '', address: '', note: '' });

  const getProduct = (id: string) => products.find((p) => p.id === id);
  const getVariant = (product: Product | undefined, variantId: string) =>
    product?.variants.find((v) => v.id === variantId);

  const total = items.reduce((sum, item) => {
    const product = getProduct(item.productId);
    const variant = getVariant(product, item.variantId);
    return sum + (variant?.price || 0) * item.quantity;
  }, 0);

  const resetAndClose = () => {
    onClose();
    // Delay reset so the closing animation isn't interrupted visually.
    setTimeout(() => {
      setView('cart');
      setOrder(null);
      setWhatsappUrl('');
      setError('');
      setForm({ name: '', phone: '', address: '', note: '' });
    }, 300);
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setError('');

    if (!form.name.trim() || !form.phone.trim()) {
      setError('Please enter your name and phone number.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.productId,
            variantId: i.variantId,
            quantity: i.quantity,
          })),
          customer: {
            name: form.name,
            phone: form.phone,
            address: form.address,
          },
          note: form.note,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Could not place your order. Please try again.');
      }

      setOrder(data.order as Order);
      setWhatsappUrl(data.whatsappUrl as string);
      setView('receipt');
      onClearCart();

      // Open WhatsApp so the customer can complete the transaction.
      if (typeof window !== 'undefined' && data.whatsappUrl) {
        window.open(data.whatsappUrl, '_blank', 'noopener,noreferrer');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={resetAndClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-brand-off-white z-[70] shadow-2xl flex flex-col"
          >
            {view === 'cart' && (
              <>
                <div className="p-6 border-b border-brand-purple/10 flex items-center justify-between bg-white">
                  <div className="flex items-center gap-2 text-brand-purple">
                    <ShoppingBag className="w-6 h-6" />
                    <h2 className="text-xl font-serif font-bold">Your Basket</h2>
                  </div>
                  <button
                    onClick={resetAndClose}
                    className="p-2 hover:bg-brand-purple/5 rounded-full transition-colors text-brand-purple"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="flex-grow overflow-y-auto p-6 space-y-6">
                  {items.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
                      <ShoppingBag className="w-16 h-16 text-brand-purple/20" />
                      <p className="font-serif italic text-lg text-brand-purple">
                        Your basket is empty.
                      </p>
                      <button
                        onClick={resetAndClose}
                        className="text-brand-purple font-bold underline decoration-brand-gold/30 underline-offset-4"
                      >
                        Start Shopping
                      </button>
                    </div>
                  ) : (
                    items.map((item) => {
                      const product = getProduct(item.productId);
                      const variant = getVariant(product, item.variantId);
                      if (!product || !variant) return null;

                      return (
                        <motion.div
                          key={item.id}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex gap-4 p-4 bg-white rounded-2xl border border-brand-purple/5 shadow-sm"
                        >
                          <img
                            referrerPolicy="no-referrer"
                            src={product.images[0]}
                            alt={product.id}
                            className="w-20 h-20 rounded-xl object-cover"
                          />
                          <div className="flex-grow flex flex-col justify-between">
                            <div>
                              <div className="flex justify-between items-start">
                                <h3 className="font-serif font-bold text-brand-purple">
                                  {product.name}
                                </h3>
                                <button
                                  onClick={() => onRemoveItem(item.id)}
                                  className="text-red-400 hover:text-red-600 p-1"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                              <p className="text-[10px] text-gray-500 uppercase tracking-widest">
                                {variant.size}
                              </p>
                            </div>

                            <div className="flex justify-between items-center">
                              <p className="font-black text-brand-purple">
                                &#8358;{variant.price.toLocaleString()}
                              </p>
                              <div className="flex items-center gap-2 bg-brand-off-white rounded-lg p-1 text-xs">
                                <button
                                  onClick={() => onUpdateQuantity(item.id, -1)}
                                  className="px-2 py-1 hover:bg-white rounded transition-colors"
                                >
                                  -
                                </button>
                                <span className="font-bold w-4 text-center">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => onUpdateQuantity(item.id, 1)}
                                  className="px-2 py-1 hover:bg-white rounded transition-colors"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                </div>

                {items.length > 0 && (
                  <div className="p-6 bg-white border-t border-brand-purple/10 space-y-4">
                    <div className="flex justify-between items-center text-lg">
                      <span className="font-serif text-gray-600">Subtotal</span>
                      <span className="font-black text-brand-purple text-2xl">
                        &#8358;{total.toLocaleString()}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setError('');
                        setView('form');
                      }}
                      className="w-full py-4 bg-brand-purple text-white font-bold rounded-2xl hover:bg-brand-purple-light transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-purple/20"
                    >
                      Proceed to Checkout
                      <ArrowRight className="w-5 h-5" />
                    </button>
                    <p className="text-[10px] text-center text-gray-400 uppercase tracking-[0.2em]">
                      Complete your order on WhatsApp
                    </p>
                  </div>
                )}
              </>
            )}

            {view === 'form' && (
              <>
                <div className="p-6 border-b border-brand-purple/10 flex items-center justify-between bg-white">
                  <button
                    onClick={() => setView('cart')}
                    className="flex items-center gap-2 text-brand-purple font-bold"
                  >
                    <ArrowLeft className="w-5 h-5" /> Back
                  </button>
                  <button
                    onClick={resetAndClose}
                    className="p-2 hover:bg-brand-purple/5 rounded-full transition-colors text-brand-purple"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form
                  onSubmit={handlePlaceOrder}
                  className="flex-grow overflow-y-auto p-6 space-y-5"
                >
                  <div className="space-y-1">
                    <h2 className="text-2xl font-serif font-bold text-brand-purple">
                      Delivery Details
                    </h2>
                    <p className="text-sm text-gray-500 font-serif italic">
                      We&apos;ll send your order summary to WhatsApp to confirm payment and delivery.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Ada Obi"
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-purple outline-none transition-all"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="e.g. 0801 234 5678"
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-purple outline-none transition-all"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                      Delivery Address
                    </label>
                    <textarea
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      placeholder="Street, area, landmark, Lagos"
                      rows={2}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-purple outline-none transition-all resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                      Note (optional)
                    </label>
                    <input
                      type="text"
                      value={form.note}
                      onChange={(e) => setForm({ ...form, note: e.target.value })}
                      placeholder="Any special request?"
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-purple outline-none transition-all"
                    />
                  </div>

                  <div className="bg-white rounded-2xl p-4 border border-brand-purple/5 space-y-2">
                    {items.map((item) => {
                      const product = getProduct(item.productId);
                      const variant = getVariant(product, item.variantId);
                      return (
                        <div key={item.id} className="flex justify-between text-sm text-gray-600">
                          <span className="font-serif italic">
                            {item.quantity}x {product?.name} ({variant?.size})
                          </span>
                          <span className="font-bold text-brand-purple">
                            &#8358;{((variant?.price || 0) * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      );
                    })}
                    <div className="flex justify-between items-center pt-2 border-t border-dashed border-gray-200">
                      <span className="font-serif text-gray-600">Total</span>
                      <span className="font-black text-brand-purple text-xl">
                        &#8358;{total.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {error && (
                    <p className="text-red-500 text-sm font-bold text-center">{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={submitting || items.length === 0}
                    className="w-full py-4 bg-green-600 text-white font-bold rounded-2xl hover:bg-green-700 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" /> Placing order...
                      </>
                    ) : (
                      <>
                        <WhatsAppIcon className="w-5 h-5" /> Place Order & Open WhatsApp
                      </>
                    )}
                  </button>
                </form>
              </>
            )}

            {view === 'receipt' && order && (
              <div className="flex flex-col h-full bg-brand-purple text-white p-8 overflow-y-auto">
                <div className="flex justify-between items-start mb-12">
                  <img
                    referrerPolicy="no-referrer"
                    src="/logo.png"
                    alt="Temmy's Logo"
                    className="h-16 w-auto object-contain"
                  />
                  <button
                    onClick={resetAndClose}
                    className="p-2 hover:bg-white/10 rounded-full"
                  >
                    <X />
                  </button>
                </div>

                <div className="text-center space-y-4 mb-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-gold rounded-full mb-4">
                    <CheckCircle2 className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-3xl font-serif font-bold">Order Created!</h2>
                  <p className="text-white/60 font-serif italic">
                    Complete your purchase on WhatsApp to confirm.
                  </p>
                </div>

                <div className="bg-white text-brand-purple rounded-3xl p-8 space-y-6 shadow-2xl relative">
                  <div className="absolute -top-3 left-6 right-6 flex justify-between">
                    {[...Array(12)].map((_, i) => (
                      <div key={i} className="w-3 h-3 rounded-full bg-brand-purple" />
                    ))}
                  </div>

                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    <span>Order ID: {order.trackingId}</span>
                    <span>Date: {new Date(order.createdAt).toLocaleDateString('en-GB')}</span>
                  </div>

                  <div className="space-y-4 py-4 border-y border-dashed border-gray-200">
                    {order.items.map((item) => (
                      <div
                        key={`${item.productId}-${item.variantId}`}
                        className="flex justify-between text-sm"
                      >
                        <div className="font-serif italic capitalize">
                          {item.quantity}x {item.productName} ({item.size})
                        </div>
                        <span className="font-bold">
                          &#8358;{(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <span className="text-lg font-serif">Total Amount</span>
                    <span className="text-2xl font-black">
                      &#8358;{order.total.toLocaleString()}
                    </span>
                  </div>

                  <div className="rounded-xl bg-brand-off-white p-3 text-center">
                    <p className="text-[11px] text-gray-500 uppercase tracking-widest font-bold">
                      Track with your Order ID
                    </p>
                    <p className="font-mono font-black text-brand-purple text-lg tracking-widest">
                      {order.trackingId}
                    </p>
                  </div>
                </div>

                <div className="mt-auto pt-12 space-y-4">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-4 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all"
                  >
                    <WhatsAppIcon className="w-5 h-5" />
                    Complete Order on WhatsApp
                  </a>
                  <button
                    onClick={resetAndClose}
                    className="w-full py-4 bg-brand-gold text-brand-purple font-black rounded-2xl hover:bg-white transition-all shadow-xl"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

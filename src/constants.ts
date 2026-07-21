import { Product } from './types';

/**
 * Seed catalogue. This is the source of truth used by `npm run seed` to
 * populate MongoDB. At runtime the app reads products from the database.
 */
export const PRODUCTS: Product[] = [
  {
    id: 'tigernut-drink',
    name: 'Tigernut Drink',
    description:
      'Nourishing and rich, made from natural tigernuts and dates. Carefully processed to retain its nutritional benefits.',
    category: 'Drinks',
    images: [
      'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=800',
    ],
    variants: [
      { id: 'tn-35cl', size: '35cl', price: 1200 },
      { id: 'tn-50cl', size: '50cl', price: 2000 },
      { id: 'tn-100cl', size: '100cl', price: 3500 },
    ],
  },
  {
    id: 'zobo-drink',
    name: 'Zobo Drink',
    description:
      'Refreshing hibiscus drink infused with ginger and natural spices. A traditional Nigerian classic.',
    category: 'Drinks',
    images: [
      'https://images.unsplash.com/photo-1497534547324-0ebb3f052e88?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?auto=format&fit=crop&q=80&w=800',
    ],
    variants: [
      { id: 'zb-35cl', size: '35cl', price: 500 },
      { id: 'zb-50cl', size: '50cl', price: 1000 },
      { id: 'zb-100cl', size: '100cl', price: 2000 },
    ],
  },
  {
    id: 'dry-ponmo',
    name: 'Dried Ponmo (Cow Skin)',
    description:
      'Authentically prepared, chewy, and rich in flavour. The perfect addition to your soups and stews.',
    category: 'Delicacies',
    images: [
      'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1606787366850-de6330128bfc?auto=format&fit=crop&q=80&w=800',
    ],
    variants: [
      { id: 'pm-small', size: 'Small pack (26 pieces)', price: 2000 },
      { id: 'pm-big', size: 'Big pack (12 large pieces)', price: 2000 },
    ],
  },
  {
    id: 'smoked-catfish',
    name: 'Smoked Catfish',
    description:
      'Naturally smoked and sun-dried for a deep, authentic umami flavour. Hygienically packed.',
    category: 'Delicacies',
    images: [
      'https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=800',
    ],
    variants: [
      { id: 'cf-small', size: 'Small pack (6 pieces)', price: 7000 },
      { id: 'cf-big', size: 'Big pack (6 large pieces)', price: 15000 },
    ],
  },
];

export const FAQS = [
  {
    question: 'How long do the drinks last?',
    answer:
      'Our Tigernut and Zobo drinks are fresh and preservative-free. They last up to 3 days when refrigerated and up to 1 week when frozen.',
  },
  {
    question: 'Where do you deliver to?',
    answer:
      'We currently deliver across Lagos. Delivery fees vary based on your specific location.',
  },
  {
    question: 'Are your products hygienically prepared?',
    answer:
      'Absolutely. We pride ourselves on maintaining the highest standards of cleanliness in our production process, from sourcing ingredients to packaging.',
  },
  {
    question: 'Do you take bulk orders for events?',
    answer:
      'Yes, we do! Please contact us via WhatsApp at least 48 hours in advance for bulk orders for parties, weddings, or corporate events.',
  },
];

export const TESTIMONIALS = [
  {
    id: '1',
    name: 'Adebayo T.',
    text: "The Tigernut drink is the best I've tasted in Lagos. So rich and creamy!",
    rating: 5,
  },
  {
    id: '2',
    name: 'Chioma E.',
    text: 'Hygienic and well-packaged. The smoked catfish is properly dried and very tasty.',
    rating: 5,
  },
  {
    id: '3',
    name: 'Olumide S.',
    text: 'Quick delivery and great customer service. Their Zobo is refreshing without being too sweet.',
    rating: 4,
  },
];

import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: "Temmy's Spice Station | Authentic Nigerian Drinks & Delicacies",
  description:
    'Authentic Nigerian delicacies, refreshing Tigernut & Zobo drinks, and premium smoked catfish and ponmo. Hygienically prepared and delivered across Lagos.',
  icons: {
    icon: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

// app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BookIt - Book Experiences & Adventures',
  description: 'Book travel experiences, adventures, and activities with HighwayWalks',
  keywords: 'booking, experiences, travel, adventures, activities',
  authors: [{ name: 'BookIt' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body className="bg-white">
        {children}
      </body>
    </html>
  );
}

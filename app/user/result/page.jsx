// app/(user)/result/page.jsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, Loader } from 'lucide-react';

export default function ResultPage() {
  const router = useRouter();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const data = sessionStorage.getItem('bookingResult');
    if (!data) {
      router.push('/');
      return;
    }
    setBooking(JSON.parse(data));
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!booking) {
    return <div className="text-center py-20">Booking not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/" className="text-gray-600 hover:text-gray-900">
            <span className="text-sm font-semibold">← Back</span>
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-16">
        <div className="bg-white p-8 rounded-lg shadow text-center">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-12 h-12 text-white" />
            </div>
          </div>

          {/* Message */}
          <h1 className="text-3xl font-bold mb-2">Booking Confirmed</h1>
          <p className="text-gray-600 text-lg mb-8">
            Ref ID: <span className="font-bold text-gray-900">{booking.refId}</span>
          </p>

          {/* Booking Details */}
          <div className="bg-gray-50 p-6 rounded-lg mb-8 text-left space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Experience</span>
              <span className="font-semibold">{booking.experienceTitle}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Name</span>
              <span className="font-semibold">{booking.fullName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Email</span>
              <span className="font-semibold">{booking.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date</span>
              <span className="font-semibold">
                {new Date(booking.date + 'T00:00:00').toLocaleDateString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Time</span>
              <span className="font-semibold">{booking.time}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Quantity</span>
              <span className="font-semibold">{booking.quantity}</span>
            </div>
          </div>

          {/* Price Summary */}
          <div className="bg-yellow-50 p-6 rounded-lg mb-8 text-left space-y-3">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>₹{booking.subtotal}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Taxes</span>
              <span>₹{booking.taxes}</span>
            </div>
            {booking.discountAmount > 0 && (
              <div className="flex justify-between text-sm text-green-600 border-t pt-3">
                <span>Discount ({booking.promoCode})</span>
                <span>-₹{booking.discountAmount}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg border-t pt-3">
              <span>Total</span>
              <span>₹{booking.total}</span>
            </div>
          </div>

          {/* Action Button */}
          <Link
            href="/"
            className="block w-full bg-yellow-400 text-black font-bold py-3 rounded hover:bg-yellow-500 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
}
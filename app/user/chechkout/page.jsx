// app/(user)/checkout/page.jsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [bookingData, setBookingData] = useState(null);
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [promoLoading, setPromoLoading] = useState(false);
  const [error, setError] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  useEffect(() => {
    const data = sessionStorage.getItem('bookingData');
    if (!data) {
      router.push('/');
      return;
    }
    setBookingData(JSON.parse(data));
  }, [router]);

  const validatePromoCode = async () => {
    if (!promoCode.trim()) {
      setError('Please enter a promo code');
      return;
    }

    setPromoLoading(true);
    setError('');

    try {
      const res = await fetch('/api/promo/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: promoCode,
          totalAmount: subtotal,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Invalid promo code');
        setAppliedPromo(null);
      } else {
        setAppliedPromo(data);
        setError('');
      }
    } catch (err) {
      setError('Failed to validate promo code');
      setAppliedPromo(null);
    } finally {
      setPromoLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!termsAccepted) {
      alert('Please accept terms and conditions');
      return;
    }

    if (!bookingData) return;

    setLoading(true);
    setError('');

    try {
      const bookingPayload = {
        fullName,
        email,
        experienceId: bookingData.experienceId,
        experienceTitle: bookingData.experienceTitle,
        date: bookingData.date,
        time: bookingData.time,
        quantity: bookingData.quantity,
        subtotal,
        taxes,
        promoCode: appliedPromo?.code || null,
        discountAmount: appliedPromo?.discountAmount || 0,
        total: finalTotal,
      };

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingPayload),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Booking failed');
        return;
      }

      const booking = await res.json();

      sessionStorage.setItem('bookingResult', JSON.stringify(booking));
      sessionStorage.removeItem('bookingData');

      router.push('/result');
    } catch (err) {
      setError('Failed to complete booking' ,err);
    } finally {
      setLoading(false);
    }
  };

  if (!bookingData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  const subtotal = bookingData.pricePerPerson * bookingData.quantity;
  const taxes = Math.round(subtotal * 0.1);
  const discountAmount = appliedPromo?.discountAmount || 0;
  const finalTotal = subtotal + taxes - discountAmount;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/" className="text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <span className="text-sm font-semibold">Checkout</span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left - Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 rounded-lg shadow">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name & Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Full name</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="w-full px-4 py-2 border rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-4 py-2 border rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      placeholder="test@test.com"
                    />
                  </div>
                </div>

                {/* Promo Code */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Promo code</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      disabled={appliedPromo}
                      className="flex-1 px-4 py-2 border rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:bg-gray-200"
                      placeholder="Enter promo code"
                    />
                    <button
                      type="button"
                      onClick={validatePromoCode}
                      disabled={promoLoading || appliedPromo}
                      className="px-6 py-2 bg-black text-white rounded font-semibold hover:bg-gray-800 disabled:bg-gray-400"
                    >
                      {promoLoading ? 'Validating...' : 'Apply'}
                    </button>
                  </div>

                  {appliedPromo && (
                    <div className="mt-2 p-3 bg-green-100 border border-green-400 rounded text-sm text-green-800">
                      ✓ Promo code applied! Discount: ₹{appliedPromo.discountAmount}
                    </div>
                  )}

                  {error && (
                    <div className="mt-2 p-3 bg-red-100 border border-red-400 rounded text-sm text-red-800">
                      {error}
                    </div>
                  )}
                </div>

                {/* Terms */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-600">
                    I agree to the terms and safety policy
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-yellow-400 text-black font-bold py-3 rounded hover:bg-yellow-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Processing...' : 'Pay and Confirm'}
                </button>
              </form>
            </div>
          </div>

          {/* Right - Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow sticky top-4">
              <h3 className="font-bold text-lg mb-4">Experience</h3>

              <div className="space-y-3 mb-6 pb-6 border-b">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Experience</span>
                  <span className="font-semibold">{bookingData.experienceTitle}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Date</span>
                  <span className="font-semibold">
                    {new Date(bookingData.date + 'T00:00:00').toLocaleDateString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Time</span>
                  <span className="font-semibold">{bookingData.time}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Qty</span>
                  <span className="font-semibold">{bookingData.quantity}</span>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Taxes</span>
                  <span>₹{taxes}</span>
                </div>
                {appliedPromo && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount ({appliedPromo.code})</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total</span>
                  <span>₹{finalTotal}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
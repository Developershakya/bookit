// app/(user)/details/[id]/page.jsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, IndianRupee, Loader, Minus, Plus } from 'lucide-react';

export default function DetailsPage() {
  const router = useRouter();
  const params = useParams();
  
  const [experience, setExperience] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [quantity, setQuantity] = useState(1);

useEffect(() => {
  const id = params?.id;
  
  if (!id) {
    setLoading(false);
    return;
  }

  if (id === 'new') {
    setLoading(false);
    return;
  }

  fetchExperience();
  // ✅ Empty dependency array - runs only once!
}, []);

  const fetchExperience = async () => {
    try {
      setLoading(true);
      setError('');
      
      const experienceId = params.id;
      console.log('Fetching experience with ID:', experienceId);
      
      const res = await fetch(`/api/experiences/${experienceId}`, {
        cache: 'no-store'
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch experience: ${res.status}`);
      }

      const data = await res.json();
      console.log('Experience data:', data);
      
      setExperience(data);
      if (data.availableDates && data.availableDates.length > 0) {
        setSelectedDate(data.availableDates[0].date);
      }
    } catch (error) {
      console.error('Error fetching experience:', error);
      setError('Failed to load experience. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (delta) => {
    const newQuantity = quantity + delta;
    if (newQuantity > 0) {
      setQuantity(newQuantity);
    }
  };

  const handleConfirm = () => {
    if (!selectedDate || !selectedTime) {
      alert('Please select date and time');
      return;
    }

    sessionStorage.setItem(
      'bookingData',
      JSON.stringify({
        experienceId: params.id,
        experienceTitle: experience.title,
        date: selectedDate,
        time: selectedTime,
        quantity,
        pricePerPerson: experience.price,
      })
    );

    router.push('/user/checkout');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading experience...</p>
        </div>
      </div>
    );
  }

  if (error || !experience) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg font-semibold mb-4">
            {error || 'Experience not found'}
          </p>
          <Link href="/" className="text-blue-600 hover:text-blue-700 underline">
            Go back home
          </Link>
        </div>
      </div>
    );
  }

  const currentDateSlots = experience.availableDates.find(
    (d) => d.date === selectedDate
  )?.slots || [];

  const subtotal = experience.price * quantity;
  const taxes = Math.round(subtotal * 0.1);
  const total = subtotal + taxes;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/" className="text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <span className="text-sm font-semibold">Details</span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left - Experience Info */}
          <div className="lg:col-span-2">
            {/* Image */}
            <div className="w-full h-64 md:h-80 rounded-lg overflow-hidden bg-gray-200 mb-6">
              <img
                src={experience.imageUrl}
                alt={experience.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src =
                    'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=500';
                }}
              />
            </div>

            {/* Title & Location */}
            <h1 className="text-3xl font-bold mb-2">{experience.title}</h1>
            <p className="text-gray-600 mb-6">{experience.location}</p>

            {/* Date Selection */}
            <div className="mb-8">
              <h2 className="font-bold text-lg mb-3">Choose date</h2>
              <div className="flex gap-2 flex-wrap">
                {experience.availableDates.map((dateObj) => (
                  <button
                    key={dateObj.date}
                    onClick={() => {
                      setSelectedDate(dateObj.date);
                      setSelectedTime('');
                    }}
                    className={`px-4 py-2 rounded font-semibold text-sm transition-colors ${
                      selectedDate === dateObj.date
                        ? 'bg-yellow-400 text-black'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {new Date(dateObj.date + 'T00:00:00').toLocaleDateString('en-IN', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Selection */}
            <div className="mb-8">
              <h2 className="font-bold text-lg mb-3">Choose time</h2>
              <div className="flex gap-2 flex-wrap">
                {currentDateSlots.map((slot) => {
                  const available = slot.available - slot.booked;
                  const isSoldOut = available <= 0;

                  return (
                    <button
                      key={slot.time}
                      onClick={() => !isSoldOut && setSelectedTime(slot.time)}
                      disabled={isSoldOut}
                      className={`px-4 py-2 rounded font-semibold text-sm transition-colors ${
                        selectedTime === slot.time && !isSoldOut
                          ? 'bg-yellow-400 text-black'
                          : isSoldOut
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {slot.time} {isSoldOut && <span className="text-xs">Sold-out</span>}
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                All times are in IST (GMT +5:30)
              </p>
            </div>

            {/* About */}
            <div>
              <h2 className="font-bold text-lg mb-3">About</h2>
              <p className="text-gray-600">{experience.about}</p>
            </div>
          </div>

          {/* Right - Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow sticky top-4">
              <div className="mb-6">
                <div className="text-sm text-gray-600 mb-1">Starts at</div>
                <div className="text-2xl font-bold flex items-center">
                  <IndianRupee className="w-6 h-6" />
                  {experience.price}
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-6">
                <div className="text-sm font-semibold mb-3">Quantity</div>
                <div className="flex items-center gap-4 border rounded px-4 py-2">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className="hover:bg-gray-100 p-1"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-bold">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="hover:bg-gray-100 p-1"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 mb-6 border-t pt-4">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span className="font-semibold">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Taxes</span>
                  <span className="font-semibold">₹{taxes}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>

              <button
                onClick={handleConfirm}
                disabled={!selectedDate || !selectedTime}
                className="w-full bg-yellow-400 text-black font-bold py-3 rounded hover:bg-yellow-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
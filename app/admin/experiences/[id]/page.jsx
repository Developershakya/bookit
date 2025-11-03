// app/admin/experiences/[id]/page.jsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader, Trash2 } from 'lucide-react';

export default function EditExperiencePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  const isNew = id === 'new';

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    imageUrl: '',
    price: 0,
    about: '',
    includesText: '',
    availableDates: [],
  });

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newSlots, setNewSlots] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isNew) {
      fetchExperience();
    }
  }, [id, isNew]);

  const fetchExperience = async () => {
    try {
      const res = await fetch(`/api/experiences/${id}`);
      const data = await res.json();
      setFormData(data);
    } catch (error) {
      console.error('Failed to fetch:', error);
      setError('Failed to load experience');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addSlotToDate = () => {
    if (!newDate || !newTime || !newSlots) {
      alert('Please fill all slot fields');
      return;
    }

    const dateObj = formData.availableDates.find((d) => d.date === newDate);
    if (dateObj) {
      dateObj.slots.push({ time: newTime, available: parseInt(newSlots) });
    } else {
      formData.availableDates.push({
        date: newDate,
        slots: [{ time: newTime, available: parseInt(newSlots) }],
      });
    }

    setFormData({ ...formData });
    setNewDate('');
    setNewTime('');
    setNewSlots('');
  };

  const removeSlot = (dateIndex, slotIndex) => {
    formData.availableDates[dateIndex].slots.splice(slotIndex, 1);
    if (formData.availableDates[dateIndex].slots.length === 0) {
      formData.availableDates.splice(dateIndex, 1);
    }
    setFormData({ ...formData });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const method = isNew ? 'POST' : 'PUT';
      const endpoint = isNew ? '/api/experiences' : `/api/experiences/${id}`;

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert(isNew ? 'Experience created successfully!' : 'Experience updated successfully!');
        router.push('/admin/experiences');
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to save');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error saving experience');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center gap-4">
          <Link href="/admin/experiences" className="text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-3xl font-bold">
            {isNew ? 'Add Experience' : 'Edit Experience'}
          </h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div>
              <label className="block text-sm font-semibold mb-2">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                required
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="e.g., Kayaking Adventure"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                required
                rows={3}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Short description of the experience"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Location *</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  required
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="e.g., Ubai, Karnataka"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Price (₹) *</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', parseInt(e.target.value) || 0)}
                  required
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="999"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Image URL *</label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                required
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="https://images.unsplash.com/..."
              />
              {formData.imageUrl && (
                <div className="mt-3">
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="h-40 w-full object-cover rounded"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=500';
                    }}
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">About *</label>
              <textarea
                value={formData.about}
                onChange={(e) => handleInputChange('about', e.target.value)}
                required
                rows={3}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Detailed description about the experience"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">What's Included</label>
              <input
                type="text"
                value={formData.includesText}
                onChange={(e) => handleInputChange('includesText', e.target.value)}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="e.g., Safety gear included, Expert guide"
              />
            </div>

            {/* Slots Management */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-bold mb-4">Available Slots</h3>

              <div className="space-y-3 mb-6 p-4 bg-gray-50 rounded">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold mb-1">Date</label>
                    <input
                      type="date"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1">Time</label>
                    <input
                      type="time"
                      value={newTime}
                      onChange={(e) => setNewTime(e.target.value)}
                      className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1">Available Slots</label>
                    <input
                      type="number"
                      placeholder="10"
                      value={newSlots}
                      onChange={(e) => setNewSlots(e.target.value)}
                      className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={addSlotToDate}
                  className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors font-semibold"
                >
                  + Add Slot
                </button>
              </div>

              {/* Display Slots */}
              <div className="space-y-4">
                {formData.availableDates.map((dateObj, dateIdx) => (
                  <div key={dateIdx} className="p-4 bg-gray-50 rounded border">
                    <p className="font-semibold mb-3">
                      📅 {new Date(dateObj.date + 'T00:00:00').toLocaleDateString('en-IN', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                    <div className="space-y-2">
                      {dateObj.slots.map((slot, slotIdx) => (
                        <div
                          key={slotIdx}
                          className="flex items-center justify-between bg-white p-3 rounded border"
                        >
                          <span className="text-sm">
                            🕐 {slot.time} - {slot.available} slots available
                          </span>
                          <button
                            type="button"
                            onClick={() => removeSlot(dateIdx, slotIdx)}
                            className="text-red-600 hover:bg-red-50 p-1 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-6 border-t">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-blue-600 text-white font-bold py-3 rounded hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
              >
                {saving ? 'Saving...' : isNew ? '✨ Create Experience' : '💾 Update Experience'}
              </button>
              <Link
                href="/admin/experiences"
                className="flex-1 bg-gray-300 text-gray-700 font-bold py-3 rounded hover:bg-gray-400 text-center transition-colors"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
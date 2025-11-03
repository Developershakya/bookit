// app/admin/promo-codes/page.jsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Trash2, Plus, Loader, Calendar } from 'lucide-react';

export default function AdminPromoCodesPage() {
  const [promoCodes, setPromoCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState('');

  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: 0,
    maxDiscount: '',
    minPurchaseAmount: '',
    expiryDate: '',
    usageLimit: '',
  });

  useEffect(() => {
    fetchPromoCodes();
  }, []);

  const fetchPromoCodes = async () => {
    try {
      const res = await fetch('/api/admin/promo-codes');
      const data = await res.json();
      setPromoCodes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch promo codes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      code: '',
      discountType: 'percentage',
      discountValue: 0,
      maxDiscount: '',
      minPurchaseAmount: '',
      expiryDate: '',
      usageLimit: '',
    });
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.code || !formData.discountValue || !formData.expiryDate) {
      setFormError('Please fill all required fields');
      return;
    }

    try {
      const payload = {
        code: formData.code.toUpperCase(),
        discountType: formData.discountType,
        discountValue: parseInt(formData.discountValue),
        maxDiscount: formData.maxDiscount ? parseInt(formData.maxDiscount) : undefined,
        minPurchaseAmount: formData.minPurchaseAmount ? parseInt(formData.minPurchaseAmount) : 0,
        expiryDate: new Date(formData.expiryDate).toISOString(),
        usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : undefined,
      };

      const res = await fetch('/api/admin/promo-codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const newPromo = await res.json();
        setPromoCodes([newPromo, ...promoCodes]);
        resetForm();
        setShowForm(false);
        alert('Promo code created successfully!');
      } else {
        const error = await res.json();
        setFormError(error.error || 'Failed to create promo code');
      }
    } catch (error) {
      console.error('Error:', error);
      setFormError('Error creating promo code');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this promo code?')) return;

    try {
      const res = await fetch(`/api/admin/promo-codes/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setPromoCodes(promoCodes.filter((p) => p._id !== id));
        alert('Promo code deleted successfully');
      } else {
        alert('Failed to delete promo code');
      }
    } catch (error) {
      console.error('Failed to delete:', error);
      alert('Error deleting promo code');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Admin Panel</h1>
            <p className="text-gray-600">Manage Promo Codes</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Promo Code
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-2xl font-bold mb-6">Create New Promo Code</h2>

            {formError && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-red-700">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Code & Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Promo Code *</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => handleInputChange('code', e.target.value.toUpperCase())}
                    placeholder="SAVE10"
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                  <p className="text-xs text-gray-500 mt-1">Will be auto-converted to uppercase</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Discount Type *</label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => handleInputChange('discountType', e.target.value)}
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="flat">Flat Amount (₹)</option>
                  </select>
                </div>
              </div>

              {/* Discount Value & Max */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Discount Value {formData.discountType === 'percentage' ? '(%)' : '(₹)'} *
                  </label>
                  <input
                    type="number"
                    value={formData.discountValue}
                    onChange={(e) => handleInputChange('discountValue', e.target.value)}
                    placeholder={formData.discountType === 'percentage' ? '10' : '100'}
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>

                {formData.discountType === 'percentage' && (
                  <div>
                    <label className="block text-sm font-semibold mb-2">Max Discount Cap (₹)</label>
                    <input
                      type="number"
                      value={formData.maxDiscount}
                      onChange={(e) => handleInputChange('maxDiscount', e.target.value)}
                      placeholder="Optional - e.g., 500"
                      className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  </div>
                )}
              </div>

              {/* Min Purchase & Expiry */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Min Purchase Amount (₹)</label>
                  <input
                    type="number"
                    value={formData.minPurchaseAmount}
                    onChange={(e) => handleInputChange('minPurchaseAmount', e.target.value)}
                    placeholder="0 - No minimum"
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Expiry Date *</label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>
              </div>

              {/* Usage Limit */}
              <div>
                <label className="block text-sm font-semibold mb-2">Usage Limit</label>
                <input
                  type="number"
                  value={formData.usageLimit}
                  onChange={(e) => handleInputChange('usageLimit', e.target.value)}
                  placeholder="Leave empty for unlimited usage"
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  ✨ Create Promo Code
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 font-bold py-2 rounded hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Promo Codes Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b flex gap-4">
            <Link
              href="/admin/experiences"
              className="font-semibold text-gray-600 hover:text-gray-900 pb-2"
            >
              Experiences
            </Link>
            <div className="font-semibold text-blue-600 border-b-2 border-blue-600 pb-2">
              Promo Codes
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader className="w-8 h-8 animate-spin" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Code</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Type</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Value</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Min Purchase</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Expires</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Used / Limit</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {promoCodes.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                        No promo codes yet. Create one to get started!
                      </td>
                    </tr>
                  ) : (
                    promoCodes.map((promo) => {
                      const expiryDate = new Date(promo.expiryDate);
                      const isExpired = expiryDate < new Date();

                      return (
                        <tr
                          key={promo._id}
                          className={`border-b hover:bg-gray-50 transition-colors ${
                            isExpired ? 'bg-red-50' : ''
                          }`}
                        >
                          <td className="px-6 py-4 font-bold">{promo.code}</td>
                          <td className="px-6 py-4">
                            <span
                              className={`text-xs font-semibold px-2 py-1 rounded ${
                                promo.discountType === 'percentage'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-green-100 text-green-800'
                              }`}
                            >
                              {promo.discountType === 'percentage' ? '%' : '₹'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {promo.discountValue}
                            {promo.discountType === 'percentage' && promo.maxDiscount
                              ? ` (Cap: ₹${promo.maxDiscount})`
                              : ''}
                          </td>
                          <td className="px-6 py-4">₹{promo.minPurchaseAmount || '0'}</td>
                          <td className="px-6 py-4 text-sm flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span className={isExpired ? 'text-red-600 font-semibold' : ''}>
                              {expiryDate.toLocaleDateString('en-IN')}
                              {isExpired && ' (Expired)'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {promo.usageCount}/{promo.usageLimit || '∞'}
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => handleDelete(promo._id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
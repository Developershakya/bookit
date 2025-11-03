// app/admin/experiences/page.jsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Trash2, Edit, Plus, Loader } from 'lucide-react';

export default function AdminExperiencesPage() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const res = await fetch('/api/experiences');
      const data = await res.json();
      setExperiences(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch experiences:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this experience?')) return;

    try {
      const res = await fetch(`/api/experiences/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setExperiences(experiences.filter((e) => e._id !== id));
        alert('Experience deleted successfully');
      } else {
        alert('Failed to delete experience');
      }
    } catch (error) {
      console.error('Failed to delete:', error);
      alert('Error deleting experience');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Admin Panel</h1>
            <p className="text-gray-600">Manage Experiences</p>
          </div>
          <Link
            href="/admin/experiences/new"
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Experience
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b flex gap-4">
            <Link
              href="/admin/experiences"
              className="font-semibold text-blue-600 border-b-2 border-blue-600 pb-2"
            >
              Experiences
            </Link>
            <Link
              href="/admin/promo-codes"
              className="font-semibold text-gray-600 hover:text-gray-900 pb-2"
            >
              Promo Codes
            </Link>
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
                    <th className="px-6 py-3 text-left text-sm font-semibold">Title</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Location</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Price</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {experiences.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                        No experiences found. Create one to get started!
                      </td>
                    </tr>
                  ) : (
                    experiences.map((exp) => (
                      <tr key={exp._id} className="border-b hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-medium">{exp.title}</td>
                        <td className="px-6 py-4">{exp.location}</td>
                        <td className="px-6 py-4">₹{exp.price.toLocaleString('en-IN')}</td>
                        <td className="px-6 py-4 flex gap-2">
                          <Link
                            href={`/admin/experiences/${exp._id}`}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-5 h-5" />
                          </Link>
                          <button
                            onClick={() => handleDelete(exp._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))
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

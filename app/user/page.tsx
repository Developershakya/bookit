// app/(user)/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MapPin, IndianRupee, Loader } from 'lucide-react';

interface Experience {
  _id: string;
  title: string;
  description: string;
  location: string;
  imageUrl: string;
  price: number;
}

export default function HomePage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const res = await fetch('/api/experiences');
      const data = await res.json();
      setExperiences(data);
    } catch (error) {
      console.error('Failed to fetch experiences:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredExperiences = experiences.filter(
    (exp) =>
      exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between gap-8">
            <div className="flex items-center gap-2">
              <MapPin className="w-6 h-6" />
              <span className="text-lg font-bold">HighwayWalks</span>
            </div>

            <div className="flex-1 flex gap-3">
              <input
                type="text"
                placeholder="Search experiences"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-2 bg-gray-200 rounded text-sm focus:outline-none"
              />
              <button className="bg-yellow-400 px-6 py-2 font-semibold rounded hover:bg-yellow-500">
                Search
              </button>
            </div>

            <Link
              href="/admin/experiences"
              className="text-sm bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Admin
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader className="w-8 h-8 animate-spin" />
          </div>
        ) : filteredExperiences.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No experiences found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredExperiences.map((experience) => (
              <Link
                key={experience._id}
                href={`/details/${experience._id}`}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow"
              >
                {/* Image */}
                <div className="relative h-40 w-full overflow-hidden bg-gray-200">
                  <img
                    src={experience.imageUrl}
                    alt={experience.title}
                    className="w-full h-full object-cover hover:scale-110 transition-transform"
                  />
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-bold text-sm mb-1">{experience.title}</h3>
                  <p className="text-xs text-gray-600 mb-2">{experience.location}</p>
                  <p className="text-xs text-gray-500 line-clamp-2 mb-3">
                    {experience.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-gray-600">From</span>
                      <span className="font-bold text-sm flex items-center">
                        <IndianRupee className="w-3 h-3" />
                        {experience.price}
                      </span>
                    </div>
                    <button className="bg-yellow-400 text-black text-xs font-semibold px-3 py-1 rounded hover:bg-yellow-500">
                      View Details
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

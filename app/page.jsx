// app/(user)/page.jsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MapPin, IndianRupee, Loader, Search } from 'lucide-react';

export default function HomePage() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await fetch('/api/experiences');

      if (!res.ok) {
        throw new Error('Failed to fetch experiences');
      }

      const data = await res.json();
      setExperiences(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch experiences:', error);
      setError('Failed to load experiences. Please try again.');
      setExperiences([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim() === '') {
      fetchExperiences();
    }
  };

  const filteredExperiences = experiences.filter(
    (exp) =>
      exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gray-50 border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                <MapPin className="w-5 h-5 text-black" />
              </div>
              <div className="hidden md:block">
                <div className="font-bold text-sm">HighwayWalks</div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex-1 flex gap-2 max-w-md">
              <input
                type="text"
                placeholder="Search experiences"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="flex-1 px-4 py-2 bg-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              <button
                onClick={handleSearch}
                className="bg-yellow-400 hover:bg-yellow-500 px-4 py-2 font-semibold rounded text-black transition-colors flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                <span className="hidden md:inline">Search</span>
              </button>
            </div>

            {/* Admin Link */}
            <Link
              href="/admin/experiences"
              className="text-sm bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors whitespace-nowrap"
            >
              Admin
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {error}
            <button
              onClick={fetchExperiences}
              className="ml-2 underline font-semibold hover:no-underline"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="text-center">
              <Loader className="w-12 h-12 animate-spin mx-auto mb-4 text-yellow-400" />
              <p className="text-gray-600">Loading experiences...</p>
            </div>
          </div>
        ) : filteredExperiences.length === 0 ? (
          <div className="text-center py-24">
            <MapPin className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-600 text-lg font-semibold">
              {searchQuery ? 'No experiences found matching your search' : 'No experiences available'}
            </p>
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  fetchExperiences();
                }}
                className="mt-4 text-blue-600 hover:text-blue-700 underline"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Search Results Count */}
            {searchQuery && (
              <div className="mb-6 text-sm text-gray-600">
                Found {filteredExperiences.length} experience{filteredExperiences.length !== 1 ? 's' : ''}
              </div>
            )}

            {/* Experiences Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {filteredExperiences.map((experience) => (
                <Link
                  key={experience._id}
                  href={`/details/${experience._id}`}
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 hover:translate-y-[-4px]"
                >
                  {/* Image Container */}
                  <div className="relative w-full h-40 bg-gray-200 overflow-hidden">
                    {experience.imageUrl ? (
                      <img
                        src={experience.imageUrl}
                        alt={experience.title}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src =
                            'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=500';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-300">
                        <MapPin className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    {/* Title */}
                    <h3 className="font-bold text-sm mb-1 line-clamp-2 text-gray-900">
                      {experience.title}
                    </h3>

                    {/* Location */}
                    <div className="flex items-center gap-1 mb-2">
                      <MapPin className="w-3 h-3 text-gray-500" />
                      <p className="text-xs text-gray-600">{experience.location}</p>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-gray-500 line-clamp-2 mb-3">
                      {experience.description}
                    </p>

                    {/* Footer - Price & Button */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-600">From</span>
                        <span className="font-bold text-sm flex items-center text-gray-900">
                          <IndianRupee className="w-3 h-3" />
                          {experience.price.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <button className="bg-yellow-400 hover:bg-yellow-500 text-black text-xs font-semibold px-3 py-1 rounded transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-600">
          <p>&copy; 2025 HighwayWalks. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
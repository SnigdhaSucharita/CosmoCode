import { useState, useEffect } from 'react';
import { searchPhotosByTag } from '../api/api';
import { useAuth } from '../context/AuthContext';

const Collection = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTag, setSearchTag] = useState('');
  const [sortOrder, setSortOrder] = useState('DESC');
  const { user } = useAuth();

  const handleSearch = async () => {
    if (!searchTag.trim()) return;

    setLoading(true);
    try {
      const response = await searchPhotosByTag(searchTag, sortOrder, user?.id);
      setPhotos(response.photos || []);
    } catch (error) {
      console.error('Failed to fetch photos:', error);
      setPhotos([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">My Collection</h1>
        <p className="text-gray-600">Search your saved photos by tag</p>
      </div>

      <div className="mb-8 flex gap-4 flex-wrap">
        <div className="flex-1 min-w-[300px]">
          <input
            type="text"
            value={searchTag}
            onChange={(e) => setSearchTag(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search by tag..."
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none"
          />
        </div>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none bg-white"
        >
          <option value="DESC">Newest First</option>
          <option value="ASC">Oldest First</option>
        </select>

        <button
          onClick={handleSearch}
          disabled={loading || !searchTag.trim()}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {photos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 bg-white"
            >
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  src={photo.imageUrl}
                  alt={photo.altDescription || photo.description}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <p className="text-sm font-medium mb-3 line-clamp-2">
                    {photo.description || photo.altDescription || 'Beautiful photo'}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {photo.tags?.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-gray-300 mt-3">
                    Saved {new Date(photo.dateSaved).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No photos found</h3>
          <p className="text-gray-600">
            {searchTag ? 'Try searching with a different tag' : 'Search by tag to view your collection'}
          </p>
        </div>
      )}
    </div>
  );
};

export default Collection;

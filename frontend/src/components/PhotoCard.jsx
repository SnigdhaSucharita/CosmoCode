import { useState } from 'react';

const PhotoCard = ({ photo, onSave, isSaved = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [tags, setTags] = useState('');
  const [showTagInput, setShowTagInput] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const tagArray = tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    await onSave(photo, tagArray);
    setSaving(false);
    setShowTagInput(false);
    setTags('');
  };

  return (
    <div
      className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 animate-scale-in bg-white"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="aspect-[3/4] overflow-hidden">
        <img
          src={photo.imageUrl}
          alt={photo.altDescription || photo.description}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
      </div>

      <div
        className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform transition-transform duration-300">
          <p className="text-sm font-medium mb-3 line-clamp-2">
            {photo.description || photo.altDescription || 'Beautiful photo'}
          </p>

          {!isSaved && !showTagInput && (
            <button
              onClick={() => setShowTagInput(true)}
              className="w-full bg-white/90 backdrop-blur-sm text-gray-900 px-4 py-2.5 rounded-xl font-medium hover:bg-white transition-all duration-200 flex items-center justify-center gap-2 shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              Save to Collection
            </button>
          )}

          {showTagInput && (
            <div className="space-y-2 animate-slide-up">
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Add tags (comma separated, max 5)"
                className="w-full px-4 py-2 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={() => {
                    setShowTagInput(false);
                    setTags('');
                  }}
                  className="flex-1 bg-white/90 text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-white transition-colors text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {isSaved && (
            <div className="flex items-center justify-center gap-2 text-emerald-400 font-medium">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              Saved
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PhotoCard;

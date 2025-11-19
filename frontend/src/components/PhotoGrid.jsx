import PhotoCard from './PhotoCard';

const PhotoGrid = ({ photos, onSavePhoto, savedPhotos = [] }) => {
  if (!photos || photos.length === 0) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Search Results</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {photos.map((photo, index) => (
          <PhotoCard
            key={`${photo.imageUrl}-${index}`}
            photo={photo}
            onSave={onSavePhoto}
            isSaved={savedPhotos.some(saved => saved.imageUrl === photo.imageUrl)}
          />
        ))}
      </div>
    </div>
  );
};

export default PhotoGrid;

import { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { searchPhotos, savePhoto } from './api/api';
import Header from './components/Header';
import Hero from './components/Hero';
import PhotoGrid from './components/PhotoGrid';
import AuthModal from './components/AuthModal';
import Collection from './components/Collection';
import SearchHistory from './components/SearchHistory';

function App() {
  const { user, loading: authLoading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [savedPhotos, setSavedPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentView, setCurrentView] = useState('home');

  useEffect(() => {
    if (!authLoading && !user) {
      setShowAuthModal(true);
    }
  }, [authLoading, user]);

  const handleSearch = async (query) => {
    setLoading(true);
    try {
      const response = await searchPhotos(query);
      setPhotos(response.photos || []);
    } catch (error) {
      console.error('Search failed:', error);
      setPhotos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePhoto = async (photo, tags) => {
    if (!user?.id) {
      setShowAuthModal(true);
      return;
    }

    try {
      await savePhoto({
        imageUrl: photo.imageUrl,
        description: photo.description,
        altDescription: photo.altDescription,
        tags: tags,
        userId: user.id,
      });

      setSavedPhotos([...savedPhotos, photo]);
    } catch (error) {
      console.error('Failed to save photo:', error);
    }
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
    if (view === 'home') {
      setPhotos([]);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse shadow-xl">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-gray-600 font-medium">Loading Picstoria...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      {user && <Header onViewChange={handleViewChange} currentView={currentView} />}

      {currentView === 'home' && (
        <>
          <Hero onSearch={handleSearch} loading={loading} />
          <PhotoGrid
            photos={photos}
            onSavePhoto={handleSavePhoto}
            savedPhotos={savedPhotos}
          />
        </>
      )}

      {currentView === 'collection' && <Collection />}
      {currentView === 'history' && <SearchHistory />}

      {showAuthModal && !user && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
    </div>
  );
}

export default App;

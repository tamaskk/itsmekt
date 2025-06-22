import React, { useState, useEffect } from 'react';
import SoundCloudPlayer from './SoundCloudPlayer';
import YouTubePlayer from './YouTubePlayer';

interface MusicLink {
  title: string;
  url: string;
}

interface SystemSettings {
  soundcloudLinks: MusicLink[];
  youtubeLink: string;
}

const MusicSection: React.FC = () => {
  const [settings, setSettings] = useState<SystemSettings>({
    soundcloudLinks: [],
    youtubeLink: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/get-public-settings');
        if (response.ok) {
          const data = await response.json();
          setSettings(data.settings);
        } else {
          setError('Failed to load music settings');
        }
      } catch (error) {
        setError('Error loading music settings');
        console.error('Error fetching music settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  if (loading) {
    return (
      <div className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading music...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // Check if there are any music links
  const hasSoundCloudLinks = settings.soundcloudLinks.some(link => link.url);
  const hasYouTubeLink = settings.youtubeLink;

  if (!hasSoundCloudLinks && !hasYouTubeLink) {
    return null; // Don't render anything if no music links
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Music</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Listen to my latest tracks and performances
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* SoundCloud Players */}
          {settings.soundcloudLinks.map((link, index) => (
            link.url && (
              <div key={`soundcloud-${index}`} className="w-full">
                <SoundCloudPlayer 
                  title={link.title} 
                  url={link.url} 
                />
              </div>
            )
          ))}

          {/* YouTube Player */}
          {settings.youtubeLink && (
            <div className="w-full md:col-span-2 lg:col-span-3">
              <YouTubePlayer url={settings.youtubeLink} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default MusicSection; 
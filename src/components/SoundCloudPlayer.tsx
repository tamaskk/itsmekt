import React from 'react';

interface SoundCloudPlayerProps {
  title: string;
  url: string;
}

const SoundCloudPlayer: React.FC<SoundCloudPlayerProps> = ({ title, url }) => {
  if (!url) return null;

  // Extract the track path from SoundCloud URL
  const extractTrackPath = (soundcloudUrl: string): string | null => {
    try {
      // Remove protocol and domain, keep the path
      const urlObj = new URL(soundcloudUrl);
      if (urlObj.hostname === 'soundcloud.com') {
        return urlObj.pathname;
      }
      return null;
    } catch (error) {
      console.error('Error extracting SoundCloud track path:', error);
      return null;
    }
  };

  const trackPath = extractTrackPath(url);
  
  if (!trackPath) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-600 text-sm">Invalid SoundCloud URL</p>
      </div>
    );
  }

  // Create the embed URL using w.soundcloud.com
  const embedUrl = `https://w.soundcloud.com/player/?url=https://soundcloud.com${trackPath}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true`;

  return (
    <div className="w-full">
      {/* Title */}
      {title && (
        <h4 className="text-sm font-semibold text-gray-800 mb-2 text-center">
          {title}
        </h4>
      )}
      
      {/* Player */}
      <div className="relative" style={{ paddingBottom: '20%' }}>
        <iframe
          width="100%"
          height="166"
          scrolling="no"
          frameBorder="no"
          allow="autoplay"
          src={embedUrl}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%'
          }}
        />
      </div>
    </div>
  );
};

export default SoundCloudPlayer; 
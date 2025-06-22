import React from 'react';

interface YouTubePlayerProps {
  url: string;
}

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({ url }) => {
  if (!url) return null;

  // Extract video ID from YouTube URL
  const extractVideoId = (youtubeUrl: string): string | null => {
    try {
      const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
        /youtube\.com\/watch\?.*v=([^&\n?#]+)/
      ];
      
      for (const pattern of patterns) {
        const match = youtubeUrl.match(pattern);
        if (match && match[1]) {
          return match[1];
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error extracting YouTube video ID:', error);
      return null;
    }
  };

  const videoId = extractVideoId(url);
  
  if (!videoId) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-600 text-sm">Invalid YouTube URL</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Title */}
      <h4 className="text-sm font-semibold text-gray-800 mb-2 text-center">
        Latest Performance
      </h4>
      
      {/* Player */}
      <div className="relative" style={{ paddingBottom: '56.25%' }}>
        <iframe
          width="100%"
          height="315"
          src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&showinfo=0`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
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

export default YouTubePlayer; 
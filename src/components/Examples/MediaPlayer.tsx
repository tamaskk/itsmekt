import React from 'react';
import SoundCloudPlayer from '../SoundCloudPlayer';
import YouTubePlayer from '../YouTubePlayer';

const MediaPlayer = ({ links, youtubeLink }: { links: { title: string, url: string }[], youtubeLink?: string }) => {
  // Filter out empty links
  const validLinks = links.filter(link => link.url && link.url.trim() !== '');
  const hasValidLinks = validLinks.length > 0;
  const hasYouTubeLink = youtubeLink && youtubeLink.trim() !== '';

  if (!hasValidLinks && !hasYouTubeLink) {
    return (
      <div className="w-full h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 overflow-hidden relative">
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-6">
          <h2 
            style={{
              fontFamily: "Caprasimo",
              fontWeight: 400,
              fontStyle: "normal",
            }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight text-center"
          >
            Listen & Watch
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl text-center">
            No music tracks available yet. Check back soon!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 overflow-hidden relative">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-200 to-purple-200"></div>
      </div>
      
      {/* Content overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6">
        {/* Title */}
        <h2 
          style={{
            fontFamily: "Caprasimo",
            fontWeight: 400,
            fontStyle: "normal",
          }}
          className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight text-center"
        >
          Listen & Watch
        </h2>
        
        {/* Subtitle */}
        <p className="text-lg text-gray-600 mb-8 max-w-2xl text-center">
          Experience the latest tracks and performances
        </p>
        
        {/* Media Grid - Compact Layout */}
        <div className="grid grid-cols-1 gap-6 max-w-4xl w-full">
          {/* SoundCloud Section */}
          {hasValidLinks && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
                Latest Tracks
              </h3>
              
              {/* SoundCloud Players - Using our new component */}
              {validLinks.map((link, index) => (
                <div key={index} className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-gray-200 hover:bg-white hover:shadow-md transition-all duration-300 max-w-2xl mx-auto">
                  <SoundCloudPlayer 
                    title={link.title} 
                    url={link.url} 
                  />
                </div>
              ))}
            </div>
          )}

          {/* YouTube Section */}
          {hasYouTubeLink && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
                Latest Performance
              </h3>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-gray-200 hover:bg-white hover:shadow-md transition-all duration-300 max-w-2xl mx-auto">
                <YouTubePlayer url={youtubeLink} />
              </div>
            </div>
          )}
        </div>
        
        {/* Call to Action - Smaller */}
        <div className="mt-8 text-center">
          <button 
          onClick={() => {
            window.open('https://soundcloud.com/tamas-krisztian-kalman', '_blank');
          }}
          className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-md text-sm">
            View All Tracks
          </button>
        </div>
      </div>
    </div>
  );
};

export default MediaPlayer; 
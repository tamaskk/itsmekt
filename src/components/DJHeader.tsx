import React from 'react';
import Image from 'next/image';

const DJHeader: React.FC = () => {
  const scrollToContact = () => {
    // Use the global scroll function from the main page
    if (typeof window !== 'undefined' && window.scrollToContact) {
      window.scrollToContact();
    }
  };

  return (
    <div className="bg-black text-white p-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="relative w-16 h-16">
            <Image
              src="/dj-1-svgrepo-com.svg"
              alt="DJ Logo"
              width={64}
              height={64}
              className="w-full h-full"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold">DJ Kálmán Tamás</h1>
            <p className="text-gray-300">Professional DJ Services</p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-2xl font-mono">
            {new Date().toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: false 
            })}
          </div>
          <div className="text-sm text-gray-300">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>
        
        <button
          onClick={scrollToContact}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
        >
          Contact
        </button>
      </div>
    </div>
  );
};

export default DJHeader;
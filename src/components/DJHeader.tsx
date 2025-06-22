import React from 'react';
import bg from '../assets/Tamás Krisztián Kálmán_image_1.jpeg'

const DJHeader = () => {
  const scrollToContact = () => {
    // Use the global scroll function from the main page
    if ((window as any).scrollToContact) {
      (window as any).scrollToContact();
    }
  };

  return (
    <div className="w-full h-screen bg-gradient-to-bl pt-10! from-blue-100 via-white to-blue-100 flex flex-col items-center justify-start relative overflow-hidden">
      {/* Subtle background pattern */}
      {/* <div className="absolute inset-0 opacity-5">
        <div 
          className="absolute top-0 left-0 w-full h-full"
          style={{
            backgroundImage: `url(${bg.src})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        ></div>
      </div> */}
      
      {/* Main content */}
      <div className="relative z-10 flex flex-col justify-center items-center text-center px-6 max-w-4xl mt-4">
        {/* DJ Image */}
        <div className="mb-10">
          <div className="sm:w-96 sm:h-96 w-56 h-56 mx-auto rounded-xl bg-gradient-to-r from-blue-400 to-purple-400 p-1 shadow-xl">
            <div className="w-full h-full rounded-xl bg-white flex items-center justify-center overflow-hidden">
              {/* <svg className="w-28 h-28 text-gray-800" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg> */}
              <img src={bg.src} alt="DJ" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
        
        {/* DJ Name */}
        <h1 
          style={{
            fontFamily: "Caprasimo",
            fontWeight: 400,
            fontStyle: "normal",
          }}
          className="text-8xl md:text-6xl font-extrabold text-gray-900 mb-4 tracking-tight">
          KT
        </h1>
        
        {/* Tagline */}
        <div className="flex flex-row items-center justify-center gap-4">

        <p className="text-lg md:text-xl text-gray-600 italic mb-8 font-thin">
          House
        </p>
        <p className="text-lg md:text-xl text-gray-600 italic mb-8 font-thin">
          -
        </p>
        <p className="text-lg md:text-xl text-gray-600 italix mb-8 font-thin">
          Afro House
        </p>
        </div>
        {/* Call to action */}
        <div className="flex flex-row sm:flex-row gap-8 justify-center mt-20!">
          <button className="relative text-gray-900 font-medium text-lg hover:text-gray-700 transition-colors duration-300 group">
            Listen Now
            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-900 group-hover:w-full transition-all duration-300 ease-out"></div>
          </button>
          <button className="relative text-gray-900 font-medium text-lg hover:text-gray-700 transition-colors duration-300 group">
            Book Now
            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-900 group-hover:w-full transition-all duration-300 ease-out"></div>
          </button>
          <button 
          onClick={scrollToContact}
          className="relative text-gray-900 font-medium text-lg hover:text-gray-700 transition-colors duration-300 group">
            Contact
            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-900 group-hover:w-full transition-all duration-300 ease-out"></div>
          </button>
          <button className="relative text-gray-900 font-medium text-lg hover:text-gray-700 transition-colors duration-300 group">
            Events
            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-900 group-hover:w-full transition-all duration-300 ease-out"></div>
          </button>
        </div>
      </div>
      
      {/* Animated scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-gray-600 text-center">
        <div className="animate-bounce flex flex-col items-center justify-center">
          <svg className="w-5 h-5 mx-auto" fill="currentColor" viewBox="0 0 24 24">
            <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
          </svg>
          <p className="text-xs mt-2 font-medium">Scroll to explore</p>
        </div>
      </div>
    </div>
  );
};

export default DJHeader;
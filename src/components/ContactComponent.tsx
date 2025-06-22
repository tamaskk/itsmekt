// import React, { useState, useEffect, useRef } from 'react';
// import ScreenComponent from '../components/ScreenComponent';
// import RunningText from '../components/Examples/RunningText';
// import DJHeader from '../components/DJHeader';
// import ContactComponent from '../components/ContactComponent';
// import NiceText from '../components/Examples/NiceText';
// import MediaPlayer from '@/components/Examples/MediaPlayer';
// import Contact from '@/components/Contact';

// export default function Home() {
//   const [scrollY, setScrollY] = useState(0);
//   const [windowHeight, setWindowHeight] = useState(0);
//   const [isScrolling, setIsScrolling] = useState(false);
//   const scrollTimeoutRef = useRef<number | undefined>(undefined);

//   // Add scroll to contact function
//   const scrollToContact = () => {
//     const targetScrollY = windowHeight * 4; // Scroll to the fourth screen
//     window.scrollTo({
//       top: targetScrollY,
//       behavior: 'smooth'
//     });
//   };

//   // Make scrollToContact available globally
//   useEffect(() => {
//     (window as any).scrollToContact = scrollToContact;
//     return () => {
//       delete (window as any).scrollToContact;
//     };
//   }, [windowHeight]);

//   useEffect(() => {
//     const handleScroll = () => {
//       setScrollY(window.scrollY);
//       setIsScrolling(true);
      
//       // Clear existing timeout
//       if (scrollTimeoutRef.current) {
//         clearTimeout(scrollTimeoutRef.current);
//       }
      
//       // Set scrolling to false after scroll ends
//       scrollTimeoutRef.current = window.setTimeout(() => {
//         setIsScrolling(false);
//       }, 150);
//     };

//     const handleResize = () => {
//       // Use visual viewport for mobile compatibility
//       const height = window.visualViewport?.height || window.innerHeight;
//       setWindowHeight(height);
//     };

//     // Set initial values
//     setScrollY(window.scrollY);
//     handleResize();

//     window.addEventListener('scroll', handleScroll, { passive: true });
//     window.addEventListener('resize', handleResize);
    
//     // Listen for visual viewport changes (mobile address bar)
//     if (window.visualViewport) {
//       window.visualViewport.addEventListener('resize', handleResize);
//     }
    
//     return () => {
//       window.removeEventListener('scroll', handleScroll);
//       window.removeEventListener('resize', handleResize);
//       if (window.visualViewport) {
//         window.visualViewport.removeEventListener('resize', handleResize);
//       }
//       if (scrollTimeoutRef.current) {
//         clearTimeout(scrollTimeoutRef.current);
//       }
//     };
//   }, []);

//   // Calculate overlay positions based on scroll with smoother transitions
//   const screen10Offset = Math.max(0, Math.min(windowHeight, scrollY - windowHeight * 1));
//   const screen20Offset = Math.max(0, Math.min(windowHeight, scrollY - windowHeight * 2));
//   const screen30Offset = Math.max(0, Math.min(windowHeight, scrollY - windowHeight * 3));
//   const screen40Offset = Math.max(0, Math.min(windowHeight, scrollY - windowHeight * 4));
//   const screen50Offset = Math.max(0, Math.min(windowHeight, scrollY - windowHeight * 4.5));


//   return (
//     <div className="relative pt-20">
//       {/* Spacer div to enable scrolling - 5 screen heights to allow full visibility */}
//       <div style={{ height: `${windowHeight * 5}px` }}>
//         {/* First Screen - DJ Header */}
//         <div className="fixed inset-0 z-0">
//           <DJHeader />
//         </div>

//         <ScreenComponent
//           isScrolling={isScrolling}
//           windowHeight={windowHeight}
//           screenOffset={screen10Offset}
//         >
//           <RunningText />
//         </ScreenComponent>

//         <ScreenComponent
//           isScrolling={isScrolling}
//           windowHeight={windowHeight}
//           screenOffset={screen20Offset}
//         >
//           <NiceText />
//         </ScreenComponent>

//         <ScreenComponent
//           isScrolling={isScrolling}
//           windowHeight={windowHeight}
//           screenOffset={screen30Offset}
//         >
//           <MediaPlayer />
//         </ScreenComponent>

//         <ScreenComponent
//           isScrolling={isScrolling}
//           windowHeight={windowHeight}
//           screenOffset={screen40Offset}
//         >
//           <Contact
//           />
//         </ScreenComponent>
//       </div>
//     </div>
//   );
// }

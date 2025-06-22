import React, { useState, useEffect, useRef } from 'react';
import ScreenComponent from '../components/ScreenComponent';
import RunningText from '../components/Examples/RunningText';
import DJHeader from '../components/DJHeader';
import NiceText from '../components/Examples/NiceText';
import MediaPlayer from '@/components/Examples/MediaPlayer';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import Loading from '../assets/dj-1-svgrepo-com.svg';

// Extend Window interface to include scrollToContact
declare global {
  interface Window {
    scrollToContact?: () => void;
  }
}

interface Event {
  _id: string;
  name: string;
  address: string;
  date: string;
  startTime: string;
  endTime: string;
  concept: string;
  image: File | string;
  type: string;
}

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<number | null>(null);
  const [screenAmount, setScreenAmount] = useState(6);
  const [events, setEvents] = useState<Event[]>([]);
  const [links, setLinks] = useState<{ title: string, url: string }[] | null>(null);
  const [youtubeLink, setYoutubeLink] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  // Scroll to contact function, adjusted to show full contact section
  const scrollToContact = () => {
    const targetScrollY = windowHeight * events.length + 2.3; // Slightly overscroll to ensure full visibility
    window.scrollTo({
      top: targetScrollY,
      behavior: 'smooth'
    });
  };

  // Make scrollToContact available globally
  useEffect(() => {
    window.scrollToContact = scrollToContact;
    return () => {
      delete window.scrollToContact;
    };
  }, [windowHeight]);

  useEffect(() => {
    try {
      const fetchEvents = async () => {
        const response = await fetch('/api/get-events');
        const data = await response.json();
        setEvents(data.events);
        setLinks(data.systemSettings.soundcloudLinks);
        setYoutubeLink(data.systemSettings.youtubeLink);
        setScreenAmount(data.events.length + 5);
      };
      fetchEvents();
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setTimeout(() => {
        setFadeOut(true);
        setTimeout(() => {
          setLoading(false);
        }, 500); // Wait for fade animation to complete
      }, 1000);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      setIsScrolling(true);
      
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      
      scrollTimeoutRef.current = window.setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };

    const handleResize = () => {
      const height = window.visualViewport?.height || window.innerHeight;
      setWindowHeight(height);
    };

    setScrollY(window.scrollY);
    handleResize();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);
    
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize);
    }
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleResize);
      }
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // Calculate overlay positions
  // const screen10Offset = Math.max(0, Math.min(windowHeight, scrollY - windowHeight * 1));
  // const screen20Offset = Math.max(0, Math.min(windowHeight, scrollY - windowHeight * 2));
  // const screen30Offset = Math.max(0, Math.min(windowHeight, scrollY - windowHeight * 3));
  // const screen40Offset = Math.max(0, Math.min(windowHeight, scrollY - windowHeight * 4));

  // I want to generate these offsets dynamically based on the screenAmount
  const screenOffsets = Array.from({ length: screenAmount }, (_, index) => {
    return Math.max(0, Math.min(windowHeight, scrollY - windowHeight * (index + 0.5)));
  });

  if (loading) {
    return (
      <div 
        className={`w-screen h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-50 transition-opacity duration-500 ${
          fadeOut ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <img 
          src={Loading.src} 
          alt="Loading" 
          className="w-1/2 h-1/2 animate-spin" 
          style={{ animationDuration: '3s' }}
        />
        <h1 className="text-4xl font-bold mt-20 text-black animate-bounce" style={{ fontFamily: "Caprasimo", animationDuration: '5s' }}>
          Loading...
        </h1>
      </div>
    );
  }

  return (
    <div className="relative pt-20">
      {/* Spacer div - increased height to ensure full scrollability */}
      <div style={{ height: `${windowHeight * (screenAmount + 0.5)}px` }}>
        {/* First Screen - DJ Header */}
        <div className="fixed inset-0 z-0">
          <DJHeader />
        </div>

        {events.map((event, index) => (
          <ScreenComponent
            key={event._id}
            isScrolling={isScrolling}
            windowHeight={windowHeight}
            screenOffset={screenOffsets[index + 1]}
          >
            {
              event.type === 'niceText' ? (
                <NiceText 
                  name={event.name}
                  address={event.address}
                  date={event.date}
                  startTime={event.startTime}
                  endTime={event.endTime}
                  concept={event.concept}
                  image={event.image as string}
                />
              ) : event.type === 'runningText' ? (
                <RunningText 
                  name={event.name}
                  address={event.address}
                  date={event.date}
                  startTime={event.startTime}
                  endTime={event.endTime}
                  concept={event.concept}
                  image={event.image as string}
                />
              ) : (
                null
              )
            }
          </ScreenComponent>
        ))}
        {
          links && links.length > 0 && (
          <ScreenComponent
          isScrolling={isScrolling}
          windowHeight={windowHeight}
          screenOffset={screenOffsets[events.length + 1]}
          >
          <MediaPlayer
            links={links}
            youtubeLink={youtubeLink}
            />
        </ScreenComponent>
          )
        }

        {/* Contact */}
        <ScreenComponent
          isScrolling={isScrolling}
          windowHeight={windowHeight}
          screenOffset={screenOffsets[events.length + 2]}
        >
          <Contact />
        </ScreenComponent>

        <ScreenComponent
          isScrolling={isScrolling}
          windowHeight={windowHeight}
          screenOffset={screenOffsets[events.length + 3]}
        >
          <Footer />
        </ScreenComponent>
      </div>
    </div>
  );
}
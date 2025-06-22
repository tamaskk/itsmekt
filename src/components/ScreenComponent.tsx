import React, { useEffect, useState } from 'react'

interface ScreenComponentProps {
  isScrolling: boolean;
  windowHeight: number;
  screenOffset: number;
  children: React.ReactNode;
}

const text = "Dummy text ";

const ScreenComponent: React.FC<ScreenComponentProps> = ({ isScrolling, windowHeight, screenOffset, children }) => {
  const [component, setComponent] = useState<React.ReactNode>(children);

  useEffect(() => {
    setComponent(children);
  }, [children]);

  return (
    <div 
    className={`fixed inset-0 z-10 transition-transform ${
      isScrolling ? 'duration-0' : 'duration-300 ease-out'
    }`}
    style={{
      transform: `translateY(${windowHeight - screenOffset}px)`
    }}
  >
    <div className="w-full h-screen overflow-y-auto">
      {
        children
      }
    </div>
  </div>
  )
}

export default ScreenComponent

import React from 'react'
import { motion } from 'framer-motion'
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

const NiceText = ({
    name,
    address,
    date,
    startTime,
    endTime,
    concept,
    image
}: {
    name: string;
    address: string;
    date: string;
    startTime: string;
    endTime: string;
    concept: string;
    image: string;
}) => {
  return (
    <div className="w-full h-screen bg-white overflow-hidden relative">
      {/* Blurry background image */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: `url(${image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          filter: 'blur(8px)',
          opacity: 0.7,
          transform: 'translateZ(0)', // Force hardware acceleration
          willChange: 'transform', // Optimize for animations
          backfaceVisibility: 'hidden', // Prevent flickering
        }}
      ></div>
      
      {/* Content overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full" style={{ perspective: '1000px' }}>
        <motion.h2 
          className="text-[60px] sm:text-[150px] font-bold"
          style={{
              fontFamily: 'Caprasimo',
              color: 'white',
              textAlign: 'center',
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
          }}
          animate={{ 
            rotateY: 360,
            scale: [1, 4, 1]
          }}
          transition={{
              duration: 5,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "loop",
              scale: {
                duration: 2.5,
                times: [0, 0.5, 1]
              }
          }}
        >
            {name}
        </motion.h2>

        <h2 className="text-5xl font-bold flex flex-row items-center justify-center gap-2 text-white mt-20">
            <span className="text-2xl font-bold">
                {concept}
            </span>
        </h2>

        <h2 className="text-5xl font-bold flex flex-row items-center justify-center gap-2 text-white mt-20">
            <LocationOnIcon />
            <span className="text-2xl font-bold">
                {address}
            </span>
        </h2>

        <h2 className="text-5xl font-bold flex flex-row items-center justify-center gap-2 text-white mt-2">
            <CalendarMonthIcon />
            <span className="text-2xl font-bold">
                {date}
            </span>
        </h2>

        <h2 className="text-5xl font-bold flex flex-row items-center justify-center gap-2 text-white mt-2">
            <AccessTimeIcon />
            <span className="text-2xl font-bold">
                {startTime} - {endTime}
            </span>
        </h2>

      </div>
    </div>
  )
}

export default NiceText

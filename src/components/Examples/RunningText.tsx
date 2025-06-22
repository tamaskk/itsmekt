import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

const RunningText = ({
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
    <div className="w-full h-screen bg-white overflow-hidden">
      {/* Top running text */}
      <div className="fixed left-0 top-0 w-full overflow-hidden whitespace-nowrap py-2 bg-gradient-to-b from-gray-200 via-gray-100 to-gray-200" style={{ marginTop: '20px' }}>
        <div className="relative">
          {/* Fade effect on left */}
          <div className="absolute left-0 top-0 w-5 h-full bg-gradient-to-r from-gray-100 to-transparent z-10"></div>
          {/* Fade effect on right */}
          <div className="absolute right-0 top-0 w-5 h-full bg-gradient-to-l from-gray-100 to-transparent z-10"></div>
          {/* Text content */}
          <div className="inline-block animate-marquee text-black text-2xl font-bold px-2">
          {name} {name} {name} {name} {name} {name} {name} {name} {name} {name} {name} {name} {name} {name} {name} {name} {name} {name} {name}
          </div>
          <div className="inline-block animate-marquee text-black text-2xl font-bold px-2" aria-hidden="true">
          {name} {name} {name} {name} {name} {name} {name} {name} {name} {name} {name} {name} {name} {name} {name} {name} {name} {name} {name}
          </div>
        </div>
      </div>
      <motion.div 
        animate={{ 
          y: [0, -20, 0],
          scale: [1, 1.05, 1]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
          repeatType: "reverse"
        }}
        className="flex flex-col items-center justify-center h-screen px-6"
      >
        {/* Event Card Container */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl max-w-md w-full">
          {/* Event Image */}
          <div className="mb-6">
            <Image
              src={image}
              alt="Event"
              width={300}
              height={150}
              className="w-full h-48 object-cover rounded-xl shadow-lg"
            />
          </div>
          
          {/* Event Details */}
          <div className="space-y-4">
            {/* Venue Name */}
            <div className="text-center">
              <h2 className='text-black text-3xl font-bold mb-1'
                  style={{
                    fontFamily: "Caprasimo",
                    fontWeight: 400,
                    fontStyle: "normal",
                  }}>
                {name}
              </h2>
            </div>
            
            {/* Genre Badge */}
            <div className="flex justify-center">
              <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                {concept}
              </span>
            </div>
            
            {/* Event Info Grid */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              {/* Date */}
              <div className="bg-white/10 rounded-lg p-3 text-center">
                <div className="text-black text-lg font-bold">{date}</div>
              </div>
              
              {/* Time */}
              <div className="bg-white/10 rounded-lg p-3 text-center">
                <div className="text-black text-lg font-bold">{startTime} - {endTime}</div>
              </div>
            </div>
            
            {/* Location */}
            <div className="bg-white/10 rounded-lg p-4 text-center">
              <div className="text-black text-base font-semibold">
                {address}
              </div>
              <div className="text-black/90 text-sm">
                {address}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      {/* Bottom running text */}
      <div className="fixed left-0 bottom-0 w-full overflow-hidden whitespace-nowrap py-2 bg-gradient-to-b from-gray-200 via-gray-100 to-gray-200" style={{ marginBottom: '20px' }}>
        <div className="relative">
          {/* Fade effect on left */}
          <div className="absolute left-0 top-0 w-5 h-full bg-gradient-to-r from-gray-100 to-transparent z-10"></div>
          {/* Fade effect on right */}
          <div className="absolute right-0 top-0 w-5 h-full bg-gradient-to-l from-gray-100 to-transparent z-10"></div>
          {/* Text content */}
          <div className="inline-block animate-marquee2 text-black text-2xl font-bold px-2">
            {name} {name} {name} {name} {name} {name} {name} {name} {name} {name} {name} {name} {name} {name} {name} {name} {name} {name} {name}
          </div>
          <div className="inline-block animate-marquee2 text-black text-2xl font-bold px-2" aria-hidden="true">
          {name} {name} {name} {name} {name} {name} {name} {name} {name} {name} {name} {name} {name} {name} {name} {name} {name} {name} {name}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RunningText


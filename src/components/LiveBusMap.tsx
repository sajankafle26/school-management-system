import React from 'react';
import type { Bus } from '../types';
import { BusIcon } from './icons';

interface LiveBusMapProps {
    bus: Bus;
}

const LiveBusMap: React.FC<LiveBusMapProps> = ({ bus }) => {
    return (
        <div className="relative w-full h-48 bg-green-100 rounded-lg overflow-hidden border-2 border-green-200 p-4">
            <div className="absolute top-1/2 left-8 right-8 h-1 border-t-2 border-dashed border-gray-400" style={{ transform: 'translateY(-50%)' }}></div>
            
            <div className="absolute top-1/2 left-4 text-center" style={{ transform: 'translateY(-50%)' }}>
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold shadow-md">H</div>
                <span className="text-xs font-semibold mt-1 block">Home</span>
            </div>
            
            <div className="absolute top-1/2 right-4 text-center" style={{ transform: 'translateY(-50%)' }}>
                <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold shadow-md">S</div>
                <span className="text-xs font-semibold mt-1 block">School</span>
            </div>

            <div 
                className="absolute top-1/2 transition-all duration-1000 ease-linear"
                style={{ 
                    left: `calc(10% + ${bus.currentPosition.x} * 0.8%)`,
                    transform: 'translate(-50%, -50%)' 
                }}
                title={`Bus ${bus.busNumber} driven by ${bus.driverName}`}
            >
                 <div className="relative flex flex-col items-center">
                    <div className="bg-gray-800 text-white text-xs rounded-md px-2 py-1 mb-2 whitespace-nowrap shadow-lg">
                        {bus.busNumber}
                    </div>
                    <BusIcon className="w-10 h-10 text-gray-700" style={{ transform: 'rotate(-90deg)' }}/>
                 </div>
            </div>
        </div>
    );
};

export default LiveBusMap;
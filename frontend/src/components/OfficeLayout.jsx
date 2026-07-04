// frontend/src/components/OfficeLayout.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Fan, Lightbulb } from 'lucide-react';

// সাব-কম্পোনেন্ট: প্রতিটি রুমের ভিজ্যুয়াল লেআউট
const RoomView = ({ roomName, devices }) => {
    const fans = devices.filter(d => d.type === 'fan');
    const lights = devices.filter(d => d.type === 'light');

    return (
        <div className="relative border-4 border-base-300 bg-base-100 min-h-[250px] flex flex-col p-4 rounded-lg shadow-inner">
            {/* রুমের নাম (দরজার মতো লেআউটের জন্য) */}
            <div className="absolute top-0 left-0 bg-base-300 text-base-content text-xs px-3 py-1 rounded-br-lg font-bold uppercase tracking-wider">
                {roomName}
            </div>

            {/* লাইট সেকশন (রুমের ওপরের দিকে) */}
            <div className="flex justify-around mt-8">
                {lights.map(light => (
                    <div key={light.id} className="flex flex-col items-center gap-1">
                        <motion.div
                            animate={{
                                scale: light.status === 'on' ? [1, 1.15, 1] : 1,
                            }}
                            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                            className={`p-2 rounded-full transition-colors duration-300 ${
                                light.status === 'on' 
                                ? 'bg-yellow-100 shadow-[0_0_20px_rgba(250,204,21,0.6)]' 
                                : 'bg-base-200'
                            }`}
                        >
                            <Lightbulb className={`w-5 h-5 ${light.status === 'on' ? 'text-yellow-500' : 'text-gray-400'}`} />
                        </motion.div>
                        <span className="text-[10px] text-gray-500 font-medium">{light.name}</span>
                    </div>
                ))}
            </div>

            {/* ফ্যান সেকশন (রুমের মাঝখানে/নিচের দিকে) */}
            <div className="flex justify-around mt-auto mb-2">
                {fans.map(fan => (
                    <div key={fan.id} className="flex flex-col items-center gap-1">
                        <div className={`p-2 rounded-full transition-colors duration-300 ${
                                fan.status === 'on' ? 'bg-blue-50' : 'bg-base-200'
                            }`}>
                            <motion.div
                                animate={{ rotate: fan.status === 'on' ? 360 : 0 }}
                                transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                            >
                                <Fan className={`w-7 h-7 ${fan.status === 'on' ? 'text-blue-500' : 'text-gray-400'}`} />
                            </motion.div>
                        </div>
                        <span className="text-[10px] text-gray-500 font-medium">{fan.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

// মূল লেআউট কম্পোনেন্ট
const OfficeLayout = ({ devices }) => {
    const rooms = ['Drawing Room', 'Work Room 1', 'Work Room 2'];

    return (
        <div className="card bg-base-100 shadow-xl border-t-4 border-secondary mt-6">
            <div className="card-body">
                <h2 className="card-title text-xl mb-4">Live Office Top-View Map</h2>
                {/* অফিসের ফ্লোর প্ল্যান (৩টি রুমের গ্রিড) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 p-3 bg-base-300 rounded-xl">
                    {rooms.map(room => (
                        <RoomView
                            key={room}
                            roomName={room}
                            devices={devices.filter(d => d.room === room)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OfficeLayout;
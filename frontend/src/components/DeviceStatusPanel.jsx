// frontend/src/components/DeviceStatusPanel.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Fan, Lightbulb } from 'lucide-react';

const DeviceStatusPanel = ({ devices }) => {
    // Group devices by room
    const groupedDevices = devices.reduce((acc, device) => {
        if (!acc[device.room]) acc[device.room] = [];
        acc[device.room].push(device);
        return acc;
    }, {});

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
            {Object.keys(groupedDevices).map((roomName) => (
                <div key={roomName} className="card bg-base-200 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title text-primary">{roomName}</h2>
                        <div className="flex flex-col gap-3 mt-4">
                            {groupedDevices[roomName].map((device) => (
                                <div key={device.id} className="flex items-center justify-between p-3 bg-base-100 rounded-lg shadow-sm">
                                    <div className="flex items-center gap-3">
                                        {device.type === 'fan' ? (
                                            <motion.div
                                                animate={{ rotate: device.status === 'on' ? 360 : 0 }}
                                                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                            >
                                                <Fan className={`w-6 h-6 ${device.status === 'on' ? 'text-blue-500' : 'text-gray-400'}`} />
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                animate={{ 
                                                    scale: device.status === 'on' ? [1, 1.1, 1] : 1,
                                                    opacity: device.status === 'on' ? 1 : 0.5 
                                                }}
                                                transition={{ repeat: Infinity, duration: 1.5 }}
                                            >
                                                <Lightbulb className={`w-6 h-6 ${device.status === 'on' ? 'text-yellow-400 drop-shadow-md' : 'text-gray-400'}`} />
                                            </motion.div>
                                        )}
                                        <span className="font-medium capitalize">{device.name}</span>
                                    </div>
                                    <div className={`badge ${device.status === 'on' ? 'badge-success' : 'badge-ghost'}`}>
                                        {device.status.toUpperCase()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default DeviceStatusPanel;
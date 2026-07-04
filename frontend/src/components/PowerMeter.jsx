// frontend/src/components/PowerMeter.jsx
import React from 'react';
import { Zap } from 'lucide-react';

const PowerMeter = ({ devices }) => {
    // Calculate total power
    const totalPower = devices.reduce((sum, dev) => 
        sum + (dev.status === 'on' ? dev.powerDraw : 0), 0
    );

    // Calculate room-wise power
    const roomPower = devices.reduce((acc, dev) => {
        if (!acc[dev.room]) acc[dev.room] = 0;
        if (dev.status === 'on') {
            acc[dev.room] += dev.powerDraw;
        }
        return acc;
    }, {});

    return (
        <div className="card bg-base-100 shadow-xl border-t-4 border-accent">
            <div className="card-body">
                <div className="flex items-center gap-2 mb-4">
                    <Zap className="w-6 h-6 text-accent" />
                    <h2 className="card-title text-xl">Power Consumption</h2>
                </div>
                
                <div className="flex items-end gap-2 mb-6">
                    <span className="text-5xl font-black text-primary">{totalPower}</span>
                    <span className="text-xl font-semibold text-gray-500 mb-1">Watts</span>
                </div>

                <div className="divider">Room Breakdown</div>

                <div className="flex flex-col gap-3">
                    {Object.entries(roomPower).map(([room, power]) => (
                        <div key={room} className="flex justify-between items-center">
                            <span className="font-medium text-gray-700">{room}</span>
                            <span className="badge badge-neutral">{power} W</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PowerMeter;
// frontend/src/App.jsx
import React, { useEffect } from 'react';
import { useSocket } from './hooks/useSocket';
import DeviceStatusPanel from './components/DeviceStatusPanel';
import PowerMeter from './components/PowerMeter';
import AlertsPanel from './components/AlertsPanel';
import OfficeLayout from './components/OfficeLayout'; // নতুন ইম্পোর্ট

const App = () => {
    const { devices, setDevices } = useSocket();

    // System Admins dummy data 
    const admins = [
        { name: "Nafisa Rahman", email: "nafisa.rahman@yahoo.com", phone: "+8801812345678" },
        { name: "Tanvir Hossain", email: "tanvir.hossain@yahoo.com", phone: "+8801912345678" }
    ];

    // Dummy initial state (until backend is connected)
    useEffect(() => {
        if (devices.length === 0) {
            setDevices([
                { id: 'dr-fan-1', name: 'Fan 1', type: 'fan', room: 'Drawing Room', status: 'on', powerDraw: 60 },
                { id: 'dr-fan-2', name: 'Fan 2', type: 'fan', room: 'Drawing Room', status: 'off', powerDraw: 60 },
                { id: 'dr-light-1', name: 'Light 1', type: 'light', room: 'Drawing Room', status: 'off', powerDraw: 15 },
                { id: 'dr-light-2', name: 'Light 2', type: 'light', room: 'Drawing Room', status: 'on', powerDraw: 15 },
                { id: 'dr-light-3', name: 'Light 3', type: 'light', room: 'Drawing Room', status: 'off', powerDraw: 15 },
                
                { id: 'wr1-fan-1', name: 'Fan 1', type: 'fan', room: 'Work Room 1', status: 'on', powerDraw: 60 },
                { id: 'wr1-fan-2', name: 'Fan 2', type: 'fan', room: 'Work Room 1', status: 'on', powerDraw: 60 },
                { id: 'wr1-light-1', name: 'Light 1', type: 'light', room: 'Work Room 1', status: 'off', powerDraw: 15 },
                { id: 'wr1-light-2', name: 'Light 2', type: 'light', room: 'Work Room 1', status: 'off', powerDraw: 15 },
                { id: 'wr1-light-3', name: 'Light 3', type: 'light', room: 'Work Room 1', status: 'on', powerDraw: 15 },

                { id: 'wr2-fan-1', name: 'Fan 1', type: 'fan', room: 'Work Room 2', status: 'off', powerDraw: 60 },
                { id: 'wr2-fan-2', name: 'Fan 2', type: 'fan', room: 'Work Room 2', status: 'off', powerDraw: 60 },
                { id: 'wr2-light-1', name: 'Light 1', type: 'light', room: 'Work Room 2', status: 'on', powerDraw: 15 },
                { id: 'wr2-light-2', name: 'Light 2', type: 'light', room: 'Work Room 2', status: 'on', powerDraw: 15 },
                { id: 'wr2-light-3', name: 'Light 3', type: 'light', room: 'Work Room 2', status: 'on', powerDraw: 15 },
            ]);
        }
    }, [devices, setDevices]);

    return (
        <div className="min-h-screen bg-base-200 p-4 md:p-8 font-sans">
            <div className="max-w-7xl mx-auto space-y-6">
                
                {/* Header */}
                <header className="bg-base-100 p-6 rounded-2xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black text-primary tracking-tight">Office Energy Monitor</h1>
                        <p className="text-base-content/60 text-sm md:text-base font-medium">Live Dashboard & System Alerts</p>
                    </div>
                    <div className="badge badge-success gap-2 p-4 font-bold shadow-sm">
                        <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse"></span>
                        SYSTEM LIVE
                    </div>
                </header>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column (2/3 width) */}
                    <div className="lg:col-span-2 space-y-6">
                        <DeviceStatusPanel devices={devices} />
                        <OfficeLayout devices={devices} />
                    </div>

                    {/* Right Column (1/3 width) */}
                    <div className="space-y-6">
                        <PowerMeter devices={devices} />
                        <AlertsPanel devices={devices} />
                    </div>
                </div>

                {/* Admins Section */}
                <section className="bg-base-100 p-6 rounded-2xl shadow-sm">
                    <h3 className="text-lg font-bold mb-4 border-b pb-2 text-base-content/80">System Administrators</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {admins.map((admin, idx) => (
                            <div key={idx} className="p-4 bg-base-200/50 rounded-xl hover:bg-base-200 transition-colors border border-base-300">
                                <p className="font-bold text-base-content">{admin.name}</p>
                                <p className="text-sm text-base-content/70">{admin.email}</p>
                                <p className="text-sm text-base-content/70">{admin.phone}</p>
                            </div>
                        ))}
                    </div>
                </section>

            </div>
        </div>
    );
};

export default App;
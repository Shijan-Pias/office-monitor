// frontend/src/components/AlertsPanel.jsx
import React from 'react';
import { AlertTriangle, Clock } from 'lucide-react';

const AlertsPanel = ({ devices }) => {
    // Generate alerts based on current device states
    const generateAlerts = () => {
        const alerts = [];
        const currentHour = new Date().getHours();
        
        // Check for after-hours usage (assume office hours 9 AM - 5 PM)[cite: 1]
        const isAfterHours = currentHour < 9 || currentHour >= 17;

        devices.forEach(dev => {
            if (dev.status === 'on' && isAfterHours) {
                alerts.push({
                    id: `${dev.id}-after-hours`,
                    type: 'warning',
                    message: `${dev.name} in ${dev.room} is ON after office hours!`,
                    time: new Date().toLocaleTimeString()
                });
            }
        });

        return alerts;
    };

    const activeAlerts = generateAlerts();

    return (
        <div className="card bg-base-100 shadow-xl border-t-4 border-error">
            <div className="card-body">
                <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle className="w-6 h-6 text-error" />
                    <h2 className="card-title text-xl">Active Alerts</h2>
                </div>

                {activeAlerts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-6 text-gray-400">
                        <Clock className="w-12 h-12 mb-2 opacity-50" />
                        <p>No active alerts right now.</p>
                        <p className="text-sm">Everything is running smoothly.</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-2">
                        {activeAlerts.map(alert => (
                            <div key={alert.id} className="alert alert-warning shadow-sm">
                                <AlertTriangle className="w-5 h-5 shrink-0" />
                                <div>
                                    <h3 className="font-bold text-sm">{alert.message}</h3>
                                    <div className="text-xs opacity-70">{alert.time}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AlertsPanel;
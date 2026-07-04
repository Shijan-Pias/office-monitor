// frontend/src/hooks/useSocket.js
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SOCKET_SERVER_URL = 'http://localhost:5000';

export const useSocket = () => {
    const [socket, setSocket] = useState(null);
    const [devices, setDevices] = useState([]);

    useEffect(() => {
        const socketInstance = io(SOCKET_SERVER_URL);
        setSocket(socketInstance);

        // Listen for initial device data or updates
        socketInstance.on('device_updated', (updatedDevice) => {
            setDevices((prevDevices) => {
                const exists = prevDevices.find(d => d.id === updatedDevice.id);
                if (exists) {
                    return prevDevices.map(d => d.id === updatedDevice.id ? updatedDevice : d);
                }
                return [...prevDevices, updatedDevice];
            });
        });

        return () => {
            socketInstance.disconnect();
        };
    }, []);

    return { socket, devices, setDevices };
};
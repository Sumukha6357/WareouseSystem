import { useEffect, useRef, useState } from 'react';
import { webSocketService } from '@/lib/websocket';

export const useWebSocket = <T>(topic: string, onMessage: (data: T) => void) => {
    const onMessageRef = useRef(onMessage);
    const [isConnected, setIsConnected] = useState(webSocketService.getStatus());

    useEffect(() => {
        onMessageRef.current = onMessage;
    }, [onMessage]);

    useEffect(() => {
        // Ensure service is active
        webSocketService.activate();

        const unsubscribe = webSocketService.subscribe<T>(topic, (data) => {
            onMessageRef.current(data);
        });

        // Update connection status periodically
        const interval = setInterval(() => {
            setIsConnected(webSocketService.getStatus());
        }, 2000);

        return () => {
            unsubscribe();
            clearInterval(interval);
        };
    }, [topic]);

    return { isConnected };
};

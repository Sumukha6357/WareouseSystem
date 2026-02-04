import { useEffect, useRef, useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const WEBSOCKET_URL = 'http://localhost:8080/ws';

export const useWebSocket = (topic: string, onMessage: (data: any) => void) => {
    const clientRef = useRef<Client | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const client = new Client({
            webSocketFactory: () => new SockJS(WEBSOCKET_URL),
            onConnect: () => {
                console.log(`Connected to WebSocket, subscribing to ${topic}`);
                setIsConnected(true);
                client.subscribe(topic, (message) => {
                    if (message.body) {
                        try {
                            const parsedData = JSON.parse(message.body);
                            onMessage(parsedData);
                        } catch (e) {
                            console.error('Failed to parse WebSocket message:', e);
                        }
                    }
                });
            },
            onDisconnect: () => {
                console.log('Disconnected from WebSocket');
                setIsConnected(false);
            },
            onStompError: (frame) => {
                console.error('Broker reported error: ' + frame.headers['message']);
                console.error('Additional details: ' + frame.body);
            },
        });

        client.activate();
        clientRef.current = client;

        return () => {
            if (clientRef.current) {
                clientRef.current.deactivate();
            }
        };
    }, [topic]);

    return { isConnected };
};

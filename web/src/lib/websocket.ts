import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const WEBSOCKET_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:8080/ws';

class WebSocketService {
    private client: Client;
    private isConnected: boolean = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private subscribers: Map<string, ((data: any) => void)[]> = new Map();

    constructor() {
        this.client = new Client({
            webSocketFactory: () => new SockJS(WEBSOCKET_URL),
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            onConnect: () => {
                console.log('STOMP Connected');
                this.isConnected = true;
                // Resubscribe all active topics
                this.subscribers.forEach((callbacks, topic) => {
                    this.subscribeToTopic(topic);
                });
            },
            onDisconnect: () => {
                console.log('STOMP Disconnected');
                this.isConnected = false;
            },
            onStompError: (frame) => {
                console.error('STOMP Error:', frame.headers['message']);
            }
        });
    }

    public activate() {
        if (!this.client.active) {
            this.client.activate();
        }
    }

    public deactivate() {
        if (this.client.active) {
            this.client.deactivate();
        }
    }

    public subscribe<T>(topic: string, callback: (data: T) => void) {
        if (!this.subscribers.has(topic)) {
            this.subscribers.set(topic, []);
            if (this.isConnected) {
                this.subscribeToTopic(topic);
            }
        }
        this.subscribers.get(topic)?.push(callback);

        return () => this.unsubscribe(topic, callback);
    }

    private subscribeToTopic(topic: string) {
        this.client.subscribe(topic, (message) => {
            if (message.body) {
                try {
                    const data = JSON.parse(message.body);
                    const callbacks = this.subscribers.get(topic);
                    callbacks?.forEach(cb => cb(data));
                } catch (e) {
                    console.error(`Failed to parse message on ${topic}:`, e);
                }
            }
        });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private unsubscribe(topic: string, callback: (data: any) => void) {
        const callbacks = this.subscribers.get(topic);
        if (callbacks) {
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
            if (callbacks.length === 0) {
                this.subscribers.delete(topic);
                // Note: Actual STOMP unsubscribe would need a subscription object, 
                // but for simplicity in this shared model we manage it via topic callbacks.
                // A more robust implementation would track individual STOMP subscriptions.
            }
        }
    }

    public getStatus() {
        return this.isConnected;
    }
}

export const webSocketService = new WebSocketService();

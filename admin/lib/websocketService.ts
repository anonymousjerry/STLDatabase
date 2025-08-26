import { Model } from '../sanity/types';

export interface ScrapingEvent {
  type: 'model_scraped' | 'scraping_started' | 'scraping_completed' | 'scraping_error' | 'connected' | 'disconnected';
  data: {
    model?: Partial<Model>;
    platform?: string;
    message?: string;
    timestamp: string;
  };
}

class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private listeners: Map<string, ((event: ScrapingEvent) => void)[]> = new Map();
  private isConnecting = false;

  constructor() {
    this.connect();
  }

  private connect() {
    if (this.isConnecting || this.ws?.readyState === WebSocket.OPEN) {
      return;
    }

    this.isConnecting = true;
    
    try {
      // Replace with your WebSocket server URL
      const wsUrl = process.env.NEXT_PUBLIC_WS_URL ?? 'ws://localhost:3001/ws';
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        this.emit('connected', { type: 'connected', data: { timestamp: new Date().toISOString() } });
      };

      this.ws.onmessage = (event) => {
        try {
          const data: ScrapingEvent = JSON.parse(event.data);
          this.handleMessage(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.ws.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason);
        this.isConnecting = false;
        this.emit('disconnected', { type: 'disconnected', data: { timestamp: new Date().toISOString() } });
        
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          this.scheduleReconnect();
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.isConnecting = false;
      };

    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
      this.isConnecting = false;
      this.scheduleReconnect();
    }
  }

  private scheduleReconnect() {
    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    console.log(`Scheduling WebSocket reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);
    
    setTimeout(() => {
      this.connect();
    }, delay);
  }

  private handleMessage(event: ScrapingEvent) {
    console.log('Received WebSocket message:', event);
    this.emit(event.type, event);
  }

  // Subscribe to events
  on(eventType: string, callback: (event: ScrapingEvent) => void) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    this.listeners.get(eventType)!.push(callback);
  }

  // Unsubscribe from events
  off(eventType: string, callback: (event: ScrapingEvent) => void) {
    const callbacks = this.listeners.get(eventType);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  // Emit events to listeners
  private emit(eventType: string, event: ScrapingEvent) {
    const callbacks = this.listeners.get(eventType);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(event);
        } catch (error) {
          console.error('Error in WebSocket event callback:', error);
        }
      });
    }
  }

  // Send message to server
  send(message: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not connected');
    }
  }

  // Disconnect
  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.listeners.clear();
  }

  // Check connection status
  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

// Create singleton instance
export const websocketService = new WebSocketService();

// Export for use in components
export default websocketService;

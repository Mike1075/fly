export class WebSocketClient {
  constructor(url) {
    this.url = url;
    this.ws = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 2000;

    this.handlers = {
      open: [],
      close: [],
      error: [],
      message: {},
    };
  }

  connect(playerId, nickname) {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.url);

        this.ws.onopen = () => {
          console.log('Connected to game server');
          this.isConnected = true;
          this.reconnectAttempts = 0;

          // Send join message
          this.send('join', { playerId, nickname });

          this.handlers.open.forEach(handler => handler());
          resolve();
        };

        this.ws.onclose = () => {
          console.log('Disconnected from game server');
          this.isConnected = false;
          this.handlers.close.forEach(handler => handler());

          // Attempt to reconnect
          if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            console.log(`Reconnecting... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
            setTimeout(() => {
              this.connect(playerId, nickname);
            }, this.reconnectDelay);
          }
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          this.handlers.error.forEach(handler => handler(error));
          reject(error);
        };

        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            const handlers = this.handlers.message[data.type];
            if (handlers) {
              handlers.forEach(handler => handler(data.payload));
            }
          } catch (error) {
            console.error('Error parsing message:', error);
          }
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  send(type, payload) {
    if (this.isConnected && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, payload }));
    }
  }

  on(event, handler) {
    if (event === 'open' || event === 'close' || event === 'error') {
      this.handlers[event].push(handler);
    } else {
      // Message handlers
      if (!this.handlers.message[event]) {
        this.handlers.message[event] = [];
      }
      this.handlers.message[event].push(handler);
    }
  }

  disconnect() {
    if (this.ws) {
      this.reconnectAttempts = this.maxReconnectAttempts; // Prevent reconnection
      this.ws.close();
    }
  }
}

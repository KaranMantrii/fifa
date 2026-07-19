// Mock WebSocket implementation using CustomEvents
export class MockWebSocket extends EventTarget {
  private url: string;
  public readyState: number;
  private timer: ReturnType<typeof setInterval> | null = null;
  private minute: number = 0;

  static CONNECTING = 0;
  static OPEN = 1;
  static CLOSING = 2;
  static CLOSED = 3;

  constructor(url: string) {
    super();
    this.url = url;
    this.readyState = MockWebSocket.CONNECTING;
    console.log(`[MockWS] Connecting to ${this.url}`);
    
    // Simulate connection delay
    setTimeout(() => {
      this.readyState = MockWebSocket.OPEN;
      this.dispatchEvent(new Event('open'));
      this.startSimulation();
    }, 500);
  }

  private startSimulation() {
    this.timer = setInterval(() => {
      this.minute++;
      if (this.minute > 95) this.minute = 0; // Reset for demo

      // Push simulated events down to the client
      const data = JSON.stringify({
        type: 'match_update',
        payload: {
          minute: this.minute,
          timestamp: Date.now()
        }
      });
      
      const event = new MessageEvent('message', { data });
      this.dispatchEvent(event);
    }, 2000); // Send an update every 2 seconds
  }

  send(data: string) {
    if (this.readyState !== MockWebSocket.OPEN) {
      throw new Error("WebSocket is not open");
    }
    // Echo back or process commands
    console.log(`[MockWS] Received: ${data}`);
  }

  close() {
    this.readyState = MockWebSocket.CLOSING;
    if (this.timer) {
      clearInterval(this.timer);
    }
    setTimeout(() => {
      this.readyState = MockWebSocket.CLOSED;
      this.dispatchEvent(new Event('close'));
    }, 200);
  }
}

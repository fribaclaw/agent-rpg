import WebSocket, { WebSocketServer } from 'ws';
import { Server } from 'http';
import { WSMessage } from '@agent-rpg/types';

export class WebSocketManager {
  private wss: WebSocketServer;
  private clients: Set<WebSocket> = new Set();

  constructor(server: Server) {
    this.wss = new WebSocketServer({ 
      server,
      path: '/api/ws',
    });

    this.wss.on('connection', (ws: WebSocket) => {
      console.log('WebSocket client connected');
      this.clients.add(ws);

      // Send welcome message
      this.sendToClient(ws, {
        type: 'gateway_status',
        data: {
          status: 'online',
          endpoints: [],
          lastCheck: new Date(),
        },
      });

      ws.on('close', () => {
        console.log('WebSocket client disconnected');
        this.clients.delete(ws);
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        this.clients.delete(ws);
      });

      // Handle ping/pong for keep-alive
      ws.on('ping', () => {
        ws.pong();
      });

      ws.on('message', (data) => {
        try {
          const message = JSON.parse(data.toString());
          this.handleClientMessage(ws, message);
        } catch (error) {
          console.error('Invalid WebSocket message:', error);
          this.sendToClient(ws, {
            type: 'error',
            data: {
              message: 'Invalid message format',
              code: 'INVALID_MESSAGE',
            },
          });
        }
      });
    });
  }

  private handleClientMessage(ws: WebSocket, message: any) {
    // Handle client messages if needed
    // For now, we're primarily server-to-client communication
    console.log('Received client message:', message);
  }

  private sendToClient(ws: WebSocket, message: WSMessage) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
  }

  /**
   * Broadcast message to all connected clients
   */
  public broadcast(message: WSMessage) {
    const messageStr = JSON.stringify(message);
    this.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(messageStr);
      }
    });
  }

  /**
   * Broadcast agent update to all clients
   */
  public broadcastAgentUpdate(agentData: any) {
    this.broadcast({
      type: 'agent_updated',
      data: agentData,
    });
  }

  /**
   * Broadcast config file update to all clients
   */
  public broadcastConfigUpdate(filename: string, content: string) {
    this.broadcast({
      type: 'config_updated',
      data: {
        filename,
        content,
      },
    });
  }

  /**
   * Broadcast gateway status update to all clients
   */
  public broadcastGatewayStatus(status: any) {
    this.broadcast({
      type: 'gateway_status',
      data: status,
    });
  }

  /**
   * Broadcast error to all clients
   */
  public broadcastError(message: string, code?: string) {
    this.broadcast({
      type: 'error',
      data: {
        message,
        code,
      },
    });
  }

  /**
   * Get number of connected clients
   */
  public getClientCount(): number {
    return this.clients.size;
  }

  /**
   * Close all connections and cleanup
   */
  public close() {
    this.clients.forEach((client) => {
      client.terminate();
    });
    this.wss.close();
  }
}
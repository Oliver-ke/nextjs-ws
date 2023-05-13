import {
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { nanoid } from 'nanoid';
import { Server, WebSocket } from 'ws';

const EVENT_TYPE_CHAT = 'chat';
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  private clients: Map<string, WebSocket> = new Map<string, WebSocket>();

  handleConnection(client: WebSocket) {
    // runs when a client connect
    const clientId = nanoid();
    this.clients.set(clientId, client);
    console.log('new client connection');
  }

  private findId(client: WebSocket): string {
    const clientId = Array.from(this.clients.entries()).find(
      ([key, value]) => value === client,
    )?.[0];

    return clientId;
  }

  handleDisconnect(client: WebSocket) {
    const clientId = this.findId(client);

    if (clientId) {
      this.clients.delete(clientId);
    }
    console.log('client disconnect');
  }

  @SubscribeMessage(EVENT_TYPE_CHAT)
  async handleChat(client: WebSocket, data: string) {
    console.log(data);
    this.sendBroadCastMessage(client, EVENT_TYPE_CHAT, data);
    return 'message received';
  }

  private sendBroadCastMessage(sender: WebSocket, event: string, data: string) {
    const senderId = this.findId(sender);
    if (!senderId) return;

    this.clients.forEach((client, clientId) => {
      if (client.readyState === WebSocket.OPEN && clientId !== senderId) {
        client.send(JSON.stringify({ event, data }));
      }
    });
  }
}

import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'ws';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;
}

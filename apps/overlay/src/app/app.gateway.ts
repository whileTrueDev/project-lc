import {
  WebSocketServer,
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { AppService } from './app.service';

@WebSocketGateway({ cors: true })
export class AppGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly appService: AppService) {}

  @SubscribeMessage('events')
  async handleEvent(@MessageBody() data: { data: string }): Promise<boolean> {
    console.log('events data:', data);
    await this.appService.doSomething();
    return this.server.emit('events', data);
  }
}

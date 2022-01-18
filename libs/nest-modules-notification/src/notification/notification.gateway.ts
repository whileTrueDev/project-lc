import { UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { WsGuard } from '@project-lc/nest-modules-authguard';
import {
  CreateNotificationDto,
  NotificationClientToServerEvents,
  NotificationServerToClientEvents,
} from '@project-lc/shared-types';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  namespace: 'notification',
  cors: {
    origin: [
      'http://localhost:4200',
      'http://localhost:4250',
      'http://localhost:4300',
      'http://localhost:3011',
      'https://xn--hp4b17xa.com', // 크크쇼.com

      // 판매자
      'https://seller.xn--hp4b17xa.com', // seller.크크쇼.com
      'https://xn--9z2b23wk2i.xn--hp4b17xa.com', // 판매자.크크쇼.com
      'https://dev-seller.xn--hp4b17xa.com', // dev-seller.크크쇼.com
      // 관리자
      'https://admin.xn--hp4b17xa.com', // admin.크크쇼.com
      'https://dev-admin.xn--hp4b17xa.com', // dev-admin.크크쇼.com
      // 방송인
      'https://broadcaster.xn--hp4b17xa.com', // broadcaster.크크쇼.com
      'https://xn--vh3b23hfsf.xn--hp4b17xa.com', // 방송인.크크쇼.com
      'https://dev-broadcaster.xn--hp4b17xa.com', // dev-broadcaster.크크쇼.com
    ],
    credentials: true,
    exposedHeaders: ['X-wt-Access-Token'],
  },
})
export class NotificationGateway {
  @WebSocketServer()
  socket: Server<NotificationClientToServerEvents, NotificationServerToClientEvents>;

  @UseGuards(WsGuard)
  @SubscribeMessage('subscribe')
  subscribe(@ConnectedSocket() client: Socket, @MessageBody('id') id: number): any {
    const roomId = '1';
    client.join(roomId);
    this.socket.to(roomId).emit('subscribed', true);
  }

  @UseGuards(WsGuard)
  @SubscribeMessage('create')
  create(@MessageBody() data: CreateNotificationDto): any {
    const roomId = '1';
    this.socket.to(roomId).emit('created', { ...data });
  }
}

import { UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { corsOptions, UserInfo, UserPayload } from '@project-lc/nest-core';
import { WsGuard } from '@project-lc/nest-modules-authguard';
import { JwtHelperService } from '@project-lc/nest-modules-jwt-helper';
import {
  CreateNotificationDto,
  NotificationClientToServerEvents,
  NotificationServerToClientEvents,
} from '@project-lc/shared-types';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  namespace: 'notification',
  cors: corsOptions,
})
export class NotificationGateway {
  @WebSocketServer()
  socket: Server<NotificationClientToServerEvents, NotificationServerToClientEvents>;

  @UseGuards(WsGuard)
  @SubscribeMessage('subscribe')
  subscribe(@UserInfo() user: UserPayload, @ConnectedSocket() client: Socket): void {
    const roomId = user.sub;
    client.join(roomId);
    this.socket.to(roomId).emit('subscribed', true);
  }

  @UseGuards(WsGuard)
  @SubscribeMessage('create')
  create(@MessageBody() data: CreateNotificationDto): void {
    const roomId = data.userEmail;
    this.socket.to(roomId).emit('created', { ...data });
  }
}

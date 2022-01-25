import { UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { corsOptions } from '@project-lc/nest-core';
import { WsGuard } from '@project-lc/nest-modules-authguard';
import {
  AdminMessage,
  LiveShoppingStateClientToServerEvents,
  LiveShoppingStateServerToClientEvents,
} from '@project-lc/shared-types';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  namespace: 'live-shopping-state',
  cors: corsOptions,
})
export class LiveShoppingStateGateway {
  @WebSocketServer()
  socket: Server<
    LiveShoppingStateClientToServerEvents,
    LiveShoppingStateServerToClientEvents
  >;

  @UseGuards(WsGuard)
  @SubscribeMessage('subscribe')
  subscribe(
    @MessageBody() liveShoppingId: number,
    @ConnectedSocket() client: Socket,
  ): void {
    const roomId = liveShoppingId.toString();
    client.join(roomId);
    this.socket.to(roomId).emit('subscribed', true);
  }

  @SubscribeMessage('createAdminMessage')
  createAdminMessage(@MessageBody() data: AdminMessage): void {
    const roomId = data.liveShoppingId.toString();
    this.socket.to(roomId).emit('adminMessageCreated', data);
  }

  @SubscribeMessage('createAdminAlert')
  createAdminAlert(@MessageBody() liveShoppingId: number): void {
    const roomId = liveShoppingId.toString();
    this.socket.to(roomId).emit('adminAlertCreated');
  }

  @SubscribeMessage('updatePurchaseMessage')
  purchaseMessageUpdated(@MessageBody() liveShoppingId: number): void {
    const roomId = liveShoppingId.toString();
    this.socket.to(roomId).emit('purchaseMessageUpdated');
  }
}

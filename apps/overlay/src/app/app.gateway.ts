import {
  WebSocketServer,
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayDisconnect,
  OnGatewayConnection,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import {
  SocketInfo,
  SocketIdandDevice,
  PageUrlAndDevice,
  RoomAndDate,
} from '@project-lc/shared-types';
import { OverlayService } from '@project-lc/nest-modules';
@WebSocketGateway({ cors: true, transports: ['websocket'] })
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  socketInfo: SocketInfo = {};
  constructor(private readonly overlayService: OverlayService) {}
  private logger: Logger = new Logger('AppGateway');

  afterInit() {
    this.logger.log('Initialized!');
  }

  handleConnection(socket: Socket) {
    this.logger.log(`Client Connected ${socket.id}`);
  }

  handleDisconnect(socket: Socket) {
    const SOCKET_ID: string = socket.id;
    if (Object.values(this.socketInfo)) {
      const itemToFind = Object.values(this.socketInfo)[0]?.find(
        (item) => item.socketId === SOCKET_ID,
      );
      const idx = Object.values(this.socketInfo)[0]?.indexOf(itemToFind);
      if (idx > -1) {
        return Object.values(this.socketInfo)[0]?.splice(idx, 1);
      }
    }
    return null;
  }

  @SubscribeMessage('new client')
  handleClient(socket: Socket, clientUrlDevice: PageUrlAndDevice): void {
    const { pageUrl } = clientUrlDevice;
    const roomName = pageUrl?.split('/').pop();
    if (roomName) {
      socket.join(roomName);
    }
    const { device } = clientUrlDevice;
    if (this.socketInfo[pageUrl]) {
      const socketIdandDevice: SocketIdandDevice[] = this.socketInfo[pageUrl];
      socketIdandDevice.push({ socketId: socket.id, device });
    } else {
      const socketIdandDevice: SocketIdandDevice[] = [];
      socketIdandDevice.push({ socketId: socket.id, device });
      this.socketInfo[pageUrl] = socketIdandDevice;
    }
  }

  @SubscribeMessage('request creator list')
  handleCreatorList(@MessageBody() roomAndUrl: { roomName: string; url: string }) {
    const advertiseUrl =
      roomAndUrl && roomAndUrl.url ? roomAndUrl.url.split('/')[1] : null;
    const fullUrl: (string | undefined)[] = Object.keys(this.socketInfo)
      .map((url: string) => {
        if (advertiseUrl && url && url.split('/').indexOf(advertiseUrl) !== -1) {
          return url;
        }
        return '';
      })
      .filter((url: string | undefined) => url !== undefined && url !== '');
    if (process.env.NODE_ENV === 'development') {
      this.server
        .to(roomAndUrl.roomName)
        .emit(
          'creator list from server',
          fullUrl[0] ? this.socketInfo[fullUrl[0]] : null,
        );
    }
    if (process.env.NODE_ENV === 'production') {
      this.server
        .to(roomAndUrl.roomName)
        .emit(
          'creator list from server',
          fullUrl[0] ? this.socketInfo[fullUrl[0]] : null,
        );
    }
  }

  @SubscribeMessage('send notification signal')
  async sendNotificationSignal(@MessageBody() roomName: string) {
    const audioBuffer = await this.overlayService.streamStartNotification();
    this.server.to(roomName).emit('get stream start notification tts', audioBuffer);
  }

  @SubscribeMessage('get start time from admin')
  getStartTime(@MessageBody() dateData: RoomAndDate) {
    const { date } = dateData;
    const { roomName } = dateData;
    this.server.to(roomName).emit('get start time from server', date);
  }

  @SubscribeMessage('connection check from admin')
  connectionCheckFromAdmin(@MessageBody() roomName: string) {
    this.server.to(roomName).emit('connection check from server');
  }
}

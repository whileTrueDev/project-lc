import { Logger } from '@nestjs/common';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import {
  PageUrlAndDevice,
  SocketIdandDevice,
  SocketInfo,
  LiveShoppingIdWithProductNameAndRoomName,
  ProductNameAndRoomName,
  RoomNameAndBgmNumber,
  RoomNameAndVolume,
} from '@project-lc/shared-types';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true, transports: ['websocket'] })
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  socketInfo: SocketInfo = {};
  private logger: Logger = new Logger('AppGateway');

  afterInit(): void {
    this.logger.log('Initialized!');
  }

  handleConnection(socket: Socket): void {
    this.logger.log(`Client Connected ${socket.id}`);
  }

  handleDisconnect(socket: Socket): SocketIdandDevice[] {
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
  handleCreatorList(@MessageBody() roomAndUrl: { roomName: string; url: string }): void {
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

  @SubscribeMessage('liveshopping id from admin')
  getLiveShoppingId(
    @MessageBody()
    roomAndLiveShoppingId: LiveShoppingIdWithProductNameAndRoomName,
  ): void {
    const { roomName } = roomAndLiveShoppingId;
    const { liveShoppingId } = roomAndLiveShoppingId;
    const { streamerAndProduct } = roomAndLiveShoppingId;
    this.server
      .to(roomName)
      .emit('get liveshopping id from server', { liveShoppingId, streamerAndProduct });
  }

  @SubscribeMessage('get product name from admin')
  getProductName(
    @MessageBody()
    roomNameAndStreamerAndProduct: ProductNameAndRoomName,
  ): void {
    const { roomName } = roomNameAndStreamerAndProduct;
    const { streamerAndProduct } = roomNameAndStreamerAndProduct;
    this.server.to(roomName).emit('get product name from server', streamerAndProduct);
  }

  @SubscribeMessage('start bgm from admin')
  startBgm(@MessageBody() roomNameAndBgmNumber: RoomNameAndBgmNumber): void {
    const { roomName } = roomNameAndBgmNumber;
    const { bgmNumber } = roomNameAndBgmNumber;

    this.server.to(roomName).emit('start bgm from server', bgmNumber);
  }

  @SubscribeMessage('off bgm from admin')
  offBgm(@MessageBody() roomName: string): void {
    this.server.to(roomName).emit('off bgm from server', roomName);
  }

  @SubscribeMessage('bgm volume from admin')
  bgmVolume(@MessageBody() roomNameAndVolume: RoomNameAndVolume): void {
    const { roomName } = roomNameAndVolume;
    const { volume } = roomNameAndVolume;
    this.server.to(roomName).emit('bgm volume from server', volume);
  }

  @SubscribeMessage('combo reset from admin')
  resetCombo(@MessageBody() roomName: string): void {
    this.server.to(roomName).emit('combo reset from server');
  }
}

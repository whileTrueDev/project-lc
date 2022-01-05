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
  RoomAndDate,
  RoomAndVideoType,
  SocketIdandDevice,
  StartSetting,
} from '@project-lc/shared-types';
import { OverlayService } from '@project-lc/nest-modules-overlay';

@WebSocketGateway({ cors: true, transports: ['websocket'] })
export class AppScreenGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  socketInfo: SocketInfo = {};

  constructor(private readonly overlayService: OverlayService) {}

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

  @SubscribeMessage('get ranking')
  async getRanking(@MessageBody() roomName: string): Promise<void> {
    const nicknameAndPrice = [];
    const rankings = await this.overlayService.getRanking(roomName);
    rankings.forEach((eachNickname) => {
      const price = Object.values(eachNickname._sum).toString();
      const { nickname } = eachNickname;
      nicknameAndPrice.push({ nickname, price: Number(price) });
    });
    nicknameAndPrice.sort((a, b) => {
      return b.price - a.price;
    });

    this.server.to(roomName).emit('get top-left ranking', nicknameAndPrice);
  }

  @SubscribeMessage('get all data')
  async getAllPurchaseMessage(@MessageBody() roomName: string): Promise<void> {
    const nicknameAndPrice = [];
    const bottomAreaTextAndNickname: string[] = [];
    const rankings = await this.overlayService.getRanking(roomName);
    // const totalSold = await this.overlayService.getTotalSoldPrice();
    const messageAndNickname = await this.overlayService.getMessageAndNickname(roomName);

    rankings.forEach((eachNickname) => {
      const price = Object.values(eachNickname._sum).toString();
      const { nickname } = eachNickname;
      nicknameAndPrice.push({ nickname, price: Number(price) });
    });
    nicknameAndPrice.sort((a, b) => {
      return b.price - a.price;
    });

    messageAndNickname.forEach((d: { nickname: string; text: string }) => {
      bottomAreaTextAndNickname.push(`${d.text} - [${d.nickname}]`);
    });

    this.server.to(roomName).emit('get top-left ranking', nicknameAndPrice);
    // this.server.to(roomName).emit('get current quantity', totalSold);
    this.server
      .to(roomName)
      .emit('get bottom purchase message', bottomAreaTextAndNickname);
  }

  @SubscribeMessage('toggle right-top onad logo')
  handleLogo(@MessageBody() roomName: string): void {
    this.server.to(roomName).emit('toggle right-top onad logo from server');
  }

  @SubscribeMessage('toggle bottom area from admin')
  handleBottomMessageArea(@MessageBody() roomName: string): void {
    this.server.to(roomName).emit('handle bottom area to client');
  }

  @SubscribeMessage('show live commerce')
  showLiveCommerce(@MessageBody() roomName: string): void {
    this.server.to(roomName).emit('show screen');
  }

  @SubscribeMessage('quit live commerce')
  hideLiveCommerce(@MessageBody() roomName: string): void {
    this.server.to(roomName).emit('hide screen');
  }

  @SubscribeMessage('get start time from admin')
  getStartTime(
    @MessageBody()
    startSetting: StartSetting,
  ): void {
    const { date } = startSetting;
    const { roomName } = startSetting;
    const { streamerAndProduct } = startSetting;
    this.server
      .to(roomName)
      .emit('get start time from server', { date, streamerAndProduct });
  }

  @SubscribeMessage('get d-day')
  getDday(@MessageBody() roomAndDate: RoomAndDate): void {
    const { date } = roomAndDate;
    const { roomName } = roomAndDate;
    this.server.to(roomName).emit('d-day from server', date);
  }

  @SubscribeMessage('refresh')
  handleRefresh(@MessageBody() roomName: string): void {
    this.server.to(roomName).emit('refresh signal');
  }

  @SubscribeMessage('show video from admin')
  showVideo(@MessageBody() roomAndType: RoomAndVideoType): void {
    const { roomName } = roomAndType;
    const { type } = roomAndType;
    this.server.to(roomName).emit('show video from server', type);
  }

  @SubscribeMessage('clear full video')
  clearVideo(@MessageBody() roomName: string): void {
    this.server.to(roomName).emit('clear full video from server');
  }

  @SubscribeMessage('send notification signal')
  async sendNotificationSignal(
    @MessageBody()
    startSetting: StartSetting,
  ): Promise<void> {
    const text = `잠시 후, ${startSetting.streamerAndProduct.streamerNickname}님의 ${startSetting.streamerAndProduct.productName} 라이브커머스가 시작됩니다`;
    const audioBuffer = await this.overlayService.streamNotification(text);
    this.server
      .to(startSetting.roomName)
      .emit('get stream start notification tts', audioBuffer);
  }

  @SubscribeMessage('send end notification signal')
  async sendEndSignal(@MessageBody() roomName: string): Promise<void> {
    const text = '라이브 커머스 종료까지 5분 남았습니다.';
    const audioBuffer = await this.overlayService.streamNotification(text);
    this.server.to(roomName).emit('get stream end notification tts', audioBuffer);
  }

  @SubscribeMessage('connection check from admin')
  connectionCheckFromAdmin(@MessageBody() roomName: string): void {
    this.server.to(roomName).emit('connection check from server');
  }

  @SubscribeMessage('get soldout signal from admin')
  getSoldoutSignal(@MessageBody() roomName: string): void {
    this.server.to(roomName).emit('get soldout signal from server');
  }

  @SubscribeMessage('remove soldout banner from admin')
  getSoldoutRemove(@MessageBody() roomName: string): void {
    this.server.to(roomName).emit('remove soldout banner from server');
  }

  @SubscribeMessage('get fever date from admin')
  getFeverDate(@MessageBody() roomAndDate: RoomAndDate): void {
    const { date } = roomAndDate;
    const { roomName } = roomAndDate;
    this.server.to(roomName).emit('get fever date from server', date);
  }

  // get notification image from server
  @SubscribeMessage('get notification image from admin')
  getNotification(@MessageBody() data: { roomName: string; type: string }): void {
    const { roomName } = data;
    const { type } = data;
    this.server.to(roomName).emit('get notification image from server', type);
  }

  @SubscribeMessage('remove notification image from admin')
  removeNotification(@MessageBody() roomName: string): void {
    this.server.to(roomName).emit('remove notification image from server');
  }

  @SubscribeMessage('get date from registered liveshopping')
  async getRegisteredTime(
    @MessageBody() shoppingIdAndRoomName: { liveShoppingId: number; roomName: string },
  ): Promise<void> {
    const { liveShoppingId } = shoppingIdAndRoomName;
    const { roomName } = shoppingIdAndRoomName;
    const registeredTime = await this.overlayService.getRegisteredTime(liveShoppingId);
    this.server.to(roomName).emit('get registered date from server', registeredTime);
  }

  @SubscribeMessage('refresh ranking from admin')
  refreshRanking(@MessageBody() roomName: string): void {
    this.server.to(roomName).emit('refresh ranking from server');
  }
}

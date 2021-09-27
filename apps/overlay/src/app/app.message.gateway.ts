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
import { SocketInfo, PurchaseMessage, RoomAndText } from '@project-lc/shared-types';
import { OverlayService } from '@project-lc/nest-modules';

@WebSocketGateway({ cors: true, transports: ['websocket'] })
export class AppMessageGateway
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

  @SubscribeMessage('right top purchase message')
  async getRightTopPurchaseMessage(@MessageBody() purchase: PurchaseMessage) {
    const { roomName } = purchase;
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

    const audioBuffer = await this.overlayService.googleTextToSpeech(purchase);

    this.server
      .to(roomName)
      .emit('get right-top purchase message', [purchase, audioBuffer]);
    this.server.to(roomName).emit('get top-left ranking', nicknameAndPrice);
    // this.server.to(roomName).emit('get current quantity', totalSold);
    this.server
      .to(roomName)
      .emit('get bottom purchase message', bottomAreaTextAndNickname);
  }

  @SubscribeMessage('bottom area message')
  handleBottomAreaReply(@MessageBody() data: RoomAndText) {
    const { roomName } = data;
    const { message } = data;
    this.server.to(roomName).emit('get bottom area message', message);
  }

  @SubscribeMessage('get non client purchase message from admin')
  getNonClientMessage(@MessageBody() data: PurchaseMessage) {
    const { roomName } = data;
    this.server.to(roomName).emit('get non client purchase message', data);
  }
}

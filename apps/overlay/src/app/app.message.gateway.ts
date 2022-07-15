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
  PurchaseMessage,
  RoomAndText,
  SocketIdandDevice,
  ObjectiveMessage,
} from '@project-lc/shared-types';
import { OverlayService } from '@project-lc/nest-modules-overlay';

@WebSocketGateway({ cors: true, transports: ['websocket'] })
export class AppMessageGateway
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

  /**
   * @author M'baku
   * @description 응원메세지를 받아오는 함수
   */
  @SubscribeMessage('right top purchase message')
  async getRightTopPurchaseMessage(
    @MessageBody() purchase: PurchaseMessage,
  ): Promise<void> {
    const { roomName } = purchase;
    const nicknameAndPrice = [];
    /** 하단 띠배너 응원메세지 띄울 때 사용
     const bottomAreaTextAndNickname: string[] = [];
    */
    const { ttsSetting } = purchase;
    const rankings = await this.overlayService.getRanking(roomName);
    let audioBuffer;

    /** 총 금액 오버레이에 띄울 때 필요 현재는 사용안함 
    const totalSold = await this.overlayService.getTotalSoldPrice();
    */

    /** 하단 띠배너 영역에 닉네임과 메세지 띄울 때 사용 현재는 사용안함
     const messageAndNickname = await this.overlayService.getMessageAndNickname(roomName);
     messageAndNickname.forEach((d: { nickname: string; text: string }) => {
       bottomAreaTextAndNickname.push(`${d.text} - [${d.nickname}]`);
     });
     */

    rankings.forEach((eachNickname) => {
      const price = Object.values(eachNickname._sum).toString();
      const { nickname } = eachNickname;
      nicknameAndPrice.push({ nickname, price: Number(price) });
    });

    nicknameAndPrice.sort((a, b) => {
      return b.price - a.price;
    });

    if (
      ttsSetting === 'full' ||
      ttsSetting === 'nick-purchase' ||
      ttsSetting === 'nick-purchase-price' ||
      ttsSetting === 'only-message'
    ) {
      // tts 변환
      audioBuffer = await this.overlayService.googleTextToSpeech(purchase);
    }

    if (ttsSetting === 'no-sound') {
      // 콤보모드 (콤보모드는 응원메세지 이미지 대신 콤보를 사용해서 기존과 다른 이벤트를 사용한다)
      this.server.to(roomName).emit('get right-top pop purchase message', { purchase });
    } else {
      this.server
        .to(roomName)
        .emit('get right-top purchase message', { purchase, audioBuffer });
    }

    this.server.to(roomName).emit('get top-left ranking', nicknameAndPrice);
    /** 총 판매금액 오버레이에 띄울 때 사용
     this.server.to(roomName).emit('get current quantity', totalSold);
     */
    /** 하단 띠배너 응원메세지 띄울 때 사용
    this.server
      .to(roomName)
      .emit('get bottom purchase message', bottomAreaTextAndNickname);
    */

    // 네쇼라 이벤트
    this.server.to(roomName).emit('get nsl donation message from server', {
      nickname: purchase.nickname,
      price: purchase.purchaseNum,
    });
  }

  // 하단 응원메세지 복구
  @SubscribeMessage('bottom area message')
  handleBottomAreaReply(@MessageBody() data: RoomAndText): void {
    const { roomName } = data;
    const { message } = data;
    this.server.to(roomName).emit('get bottom area message', message);
  }

  // 비회원 구매 알림 (오버레이 중앙 상단에 뜸)
  @SubscribeMessage('get non client purchase message from admin')
  getNonClientMessage(@MessageBody() data: PurchaseMessage): void {
    const { roomName } = data;
    this.server.to(roomName).emit('get non client purchase message', data);
    this.server.to(roomName).emit('get nsl donation message from server', {
      nickname: data.nickname,
      price: data.purchaseNum,
    });
  }

  // 중간 금액 알림 (뉴스 배너 형태)
  @SubscribeMessage('get objective message from admin')
  async getObjectiveMessage(
    @MessageBody()
    data: ObjectiveMessage,
  ): Promise<void> {
    const { roomName } = data;
    const users = await this.overlayService.getCustomerIds(data.liveShoppingId);
    const usersToString = users.map((user) => user.nickname).join('\t\t\t\t');
    const toClient = Object.assign(data, { users: usersToString });
    this.server.to(roomName).emit('get objective message', toClient);
  }

  // 중간 금액 알림 (불꽃 놀이 형태)
  @SubscribeMessage('get objective firework from admin')
  async getObjectiveFirework(
    @MessageBody()
    data: ObjectiveMessage,
  ): Promise<void> {
    const { roomName } = data;
    const users = await this.overlayService.getCustomerIds(data.liveShoppingId);
    const toClient = Object.assign(data, { users });
    this.server.to(roomName).emit('get objective firework from server', toClient);
  }

  // 피버메세지
  @SubscribeMessage('get fever signal from admin')
  getFeverMessage(@MessageBody() data: RoomAndText): void {
    const { roomName } = data;
    const { message } = data;
    this.server.to(roomName).emit('get fever signal from server', message);
  }
}

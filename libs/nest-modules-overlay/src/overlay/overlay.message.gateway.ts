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
import { OverlayService } from './overlay.service';

@WebSocketGateway({ cors: true, transports: ['websocket'] })
export class OverlayMessageGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger: Logger = new Logger('OverlayMessageGateway');

  @WebSocketServer() public server: Server;
  socketInfo: SocketInfo = {};

  constructor(private readonly overlayService: OverlayService) {}

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
   * @description 응원메시지 정보를 저장하고, overlay클라이언트로 구매메시지 송출이벤트 전달
   */
  @SubscribeMessage('right top purchase message')
  async getRightTopPurchaseMessage(
    @MessageBody() purchase: PurchaseMessage,
  ): Promise<void> {
    this.overlayService.handlePurchaseMessage(purchase, this.server);
  }

  /**
   * 비회원 구매 알림 (오버레이 중앙 상단에 뜸)
   * @description 응원메시지 정보를 저장하고, overlay클라이언트로 구매메시지 송출이벤트 전달
   */
  @SubscribeMessage('get non client purchase message from admin')
  getNonClientMessage(@MessageBody() data: PurchaseMessage): void {
    this.overlayService.handlePurchaseMessageNonMember(data, this.server);
  }

  // 하단 응원메세지 복구
  @SubscribeMessage('bottom area message')
  handleBottomAreaReply(@MessageBody() data: RoomAndText): void {
    const { roomName, message } = data;
    this.server.to(roomName).emit('get bottom area message', message);
  }

  // 중간 금액 알림 (뉴스 배너 형태)
  @SubscribeMessage('get objective message from admin')
  async getObjectiveMessage(@MessageBody() data: ObjectiveMessage): Promise<void> {
    const { roomName } = data;
    const users = await this.overlayService.getCustomerIds(data.liveShoppingId);
    const usersToString = users.map((user) => user.nickname).join('\t\t\t\t');
    const toClient = Object.assign(data, { users: usersToString });
    this.server.to(roomName).emit('get objective message', toClient);
  }

  // 중간 금액 알림 (불꽃 놀이 형태)
  @SubscribeMessage('get objective firework from admin')
  async getObjectiveFirework(@MessageBody() data: ObjectiveMessage): Promise<void> {
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

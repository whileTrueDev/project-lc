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
  ObjectiveMessage,
  NewsMessage,
  OverlayThemeDataType,
} from '@project-lc/shared-types';
import { OverlayService } from './overlay.service';

@WebSocketGateway({ cors: true, transports: ['websocket'] })
export class OverlayScreenGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger: Logger = new Logger('OverlayScreenGateway');
  constructor(private readonly overlayService: OverlayService) {}

  @WebSocketServer() server: Server;
  socketInfo: SocketInfo = {};

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

  // 랭킹 복구
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

  // 전체 데이터 복구
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

  // 로고 변경 (기본로고와 s3에 등록한 로고 2개 중에서 선택 가능)
  @SubscribeMessage('toggle right-top onad logo')
  handleLogo(@MessageBody() roomName: string): void {
    this.server.to(roomName).emit('toggle right-top onad logo from server');
  }

  // 하단 띠배너 영역 토글
  @SubscribeMessage('toggle bottom area from admin')
  handleBottomMessageArea(@MessageBody() roomName: string): void {
    this.server.to(roomName).emit('handle bottom area to client');
  }

  // 화면 띄우기
  @SubscribeMessage('show live commerce')
  showLiveCommerce(@MessageBody() roomName: string): void {
    this.server.to(roomName).emit('show screen');
  }

  // 화면 숨기기
  @SubscribeMessage('quit live commerce')
  hideLiveCommerce(@MessageBody() roomName: string): void {
    this.server.to(roomName).emit('hide screen');
  }

  // 시작 시간 전송 받기
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

  // 방송 종료 시간 전송 받기
  @SubscribeMessage('get d-day')
  getDday(@MessageBody() roomAndDate: RoomAndDate): void {
    const { date } = roomAndDate;
    const { roomName } = roomAndDate;
    this.server.to(roomName).emit('d-day from server', date);
  }

  // 화면 새로고침
  @SubscribeMessage('refresh')
  handleRefresh(@MessageBody() roomName: string): void {
    this.server.to(roomName).emit('refresh signal');
  }

  // 인트로/아웃트로 비디오 띄우기
  @SubscribeMessage('show video from admin')
  showVideo(@MessageBody() roomAndType: RoomAndVideoType): void {
    const { roomName } = roomAndType;
    const { type } = roomAndType;
    this.server.to(roomName).emit('show video from server', type);
  }

  // 비디오 숨기기
  @SubscribeMessage('clear full video')
  clearVideo(@MessageBody() roomName: string): void {
    this.server.to(roomName).emit('clear full video from server');
  }

  // 중간금액 알림 뉴스배너 tts 변환
  @SubscribeMessage('send objective notification signal')
  async sendObjectiveNotificationSignal(
    @MessageBody()
    data: ObjectiveMessage,
  ): Promise<void> {
    const text = data.objective.nickname
      ? `${data.objective.nickname}님의 구매로 ${data.objective.price}원 돌파했습니다`
      : `판매금액 ${data.objective.price}원 돌파!`;
    const audioBuffer = await this.overlayService.streamObjectiveNotification(text);
    this.server.to(data.roomName).emit('get objective notification tts', audioBuffer);
  }

  // 뉴스 속보 형태 아무 알림 띄우기
  @SubscribeMessage('news message from admin')
  async getNewsMessage(
    @MessageBody()
    data: NewsMessage,
  ): Promise<void> {
    this.server.to(data.roomName).emit('get news message from server', data.message);
  }

  // 방송 시작 알림 TTS
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

  // 종료 5분전 알림 이벤트
  @SubscribeMessage('send end notification signal')
  async sendEndSignal(@MessageBody() roomName: string): Promise<void> {
    const text = '라이브 커머스 종료까지 5분 남았습니다.';
    const audioBuffer = await this.overlayService.streamNotification(text);
    this.server.to(roomName).emit('get stream end notification tts', audioBuffer);
  }

  // 연결체크 (화면 좌하단 1px 짜리 점 토글)
  @SubscribeMessage('connection check from admin')
  connectionCheckFromAdmin(@MessageBody() roomName: string): void {
    this.server.to(roomName).emit('connection check from server');
  }

  // 매진 알림 전송
  @SubscribeMessage('get soldout signal from admin')
  getSoldoutSignal(@MessageBody() roomName: string): void {
    this.server.to(roomName).emit('get soldout signal from server');
  }

  // 매진 표시 제거
  @SubscribeMessage('remove soldout banner from admin')
  getSoldoutRemove(@MessageBody() roomName: string): void {
    this.server.to(roomName).emit('remove soldout banner from server');
  }

  // 피버 종료시간
  @SubscribeMessage('get fever date from admin')
  getFeverDate(@MessageBody() roomAndDate: RoomAndDate): void {
    const { date } = roomAndDate;
    const { roomName } = roomAndDate;
    this.server.to(roomName).emit('get fever date from server', date);
  }

  // 퀴즈 이벤트 이미지, 전화 이벤트 이미지 띄우기
  @SubscribeMessage('get notification image from admin')
  getNotification(@MessageBody() data: { roomName: string; type: string }): void {
    const { roomName } = data;
    const { type } = data;
    this.server.to(roomName).emit('get notification image from server', type);
  }

  // 퀴즈 이벤트 이미지, 전화 이벤트 이미지 제거
  @SubscribeMessage('remove notification image from admin')
  removeNotification(@MessageBody() roomName: string): void {
    this.server.to(roomName).emit('remove notification image from server');
  }

  // db에서 방송 시작 시간 받아오기
  @SubscribeMessage('get date from registered liveshopping')
  async getRegisteredTime(
    @MessageBody() shoppingIdAndRoomName: { liveShoppingId: number; roomName: string },
  ): Promise<void> {
    const { liveShoppingId } = shoppingIdAndRoomName;
    const { roomName } = shoppingIdAndRoomName;
    const registeredTime = await this.overlayService.getRegisteredTime(liveShoppingId);
    this.server.to(roomName).emit('get registered date from server', registeredTime);
  }

  // 랭킹만 새로고침
  @SubscribeMessage('refresh ranking from admin')
  refreshRanking(@MessageBody() roomName: string): void {
    this.server.to(roomName).emit('refresh ranking from server');
  }

  // 세로배너 영역에 버츄얼 캐릭터 띄울 수 있도록 배경 전환
  @SubscribeMessage('get virtual character from admin')
  getVirtualCharacter(@MessageBody() roomName: string): void {
    this.server.to(roomName).emit('get virtual character from server');
  }

  // 버츄얼 캐릭터 오디오 파일 재생
  @SubscribeMessage('get virtual character audio from admin')
  getVirtualCharacterAudio(@MessageBody() roomName: string): void {
    this.server.to(roomName).emit('get virtual character audio from server');
  }

  // 버츄얼 캐릭터 오디오 파일 재생 종료
  @SubscribeMessage('delete virtual character audio from admin')
  deleteVirtualCharacterAudio(@MessageBody() roomName: string): void {
    this.server.to(roomName).emit('delete virtual character audio from server');
  }

  // 오버레이 테마전환 with themeData
  @SubscribeMessage('change theme from admin')
  changeThemeTemp(
    @MessageBody()
    {
      roomName,
      themeType,
      themeData,
    }: {
      roomName: string;
      themeType: string;
      themeData?: OverlayThemeDataType;
    },
  ): void {
    this.server.to(roomName).emit('change theme from server', { themeType, themeData });
  }

  // 치킨 테마 크크쇼 이벤트 알림 애니메이션 전송 (최소 10초 간격 두고 사용)
  @SubscribeMessage('get chicken move from admin')
  getChickenMovement(@MessageBody() roomName: string): void {
    this.server.to(roomName).emit('get chicken move from server');
  }

  // 세로배너 토글
  @SubscribeMessage('hide vertical-banner from admin')
  hideVerticalBanner(@MessageBody() roomName: string): void {
    this.server.to(roomName).emit('hide vertical-banner from server');
  }

  // 버츄얼 캐릭터 동영상 재생
  @SubscribeMessage('play virtual video from admin')
  playVirtualVideo(@MessageBody() roomName: string): void {
    this.server.to(roomName).emit('play virtual video from server');
  }

  // 판매가이드 영역 표시
  @SubscribeMessage('sales guide display from admin')
  async displaySalesGuide(
    @MessageBody()
    { roomName }: { roomName: string },
  ): Promise<void> {
    this.server.to(roomName).emit('sales guide display from server');
  }

  // 판매가이드 영역 숨기기
  @SubscribeMessage('sales guide hide from admin')
  async hideSalesGuide(
    @MessageBody()
    { roomName }: { roomName: string },
  ): Promise<void> {
    this.server.to(roomName).emit('sales guide hide from server');
  }

  // 판매가이드 이미지 인덱스 선택
  @SubscribeMessage('sales guide image index selected from admin')
  async salesGuideImageIndexSelected(
    @MessageBody()
    { roomName, index }: { roomName: string; index: number },
  ): Promise<void> {
    this.server
      .to(roomName)
      .emit('sales guide image index selected from server', { index });
  }
}

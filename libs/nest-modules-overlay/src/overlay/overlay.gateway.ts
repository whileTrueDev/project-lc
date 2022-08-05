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
export class OverlayGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  socketInfo: SocketInfo = {};
  private logger: Logger = new Logger('OverlayGateway');

  afterInit(): void {
    this.logger.log('Initialized!');
  }

  // 소켓 연결시 자동으로 발생하는 이벤트
  handleConnection(socket: Socket): void {
    this.logger.log(`Client Connected ${socket.id}`);
  }

  /**
   * @author M'baku
   * @description 소켓 연결 종료시 자동으로 발생하는 이벤트
   * 소켓 Room에서 접속이 종료된 socket client를 삭제하는 함수
   */
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
   * @description 소켓 연결시 오버레이에서 보내는 이벤트
   * 오버레이 url을 roomName으로 만들어서 해당 room에 동일 url을 사용하는 socket client Id를 넣어준다.
   */
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

  /**
   * @author M'baku
   * @description 특정 url에 연결된 socket client id를 오버레이 컨트롤러로 전송해주는 함수
   * 컨트롤러와 오버레이의 연결시 사용됨
   */
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

  /**
   * @author M'baku
   * @description 오버레이 컨트롤러로부터 liveshoppingId를 전달받는 함수
   * 오버레이가 자동으로 liveshoppingId를 받아오는 것이 정상이나,
   * 에러에 의해 오버레이가 자동으로 liveshoppingId를 받아오지 못하는 경우 비상용으로 사용
   */
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

  /**
   * @author M'baku
   * @description 컨트롤러에서 상품명 전송받는 함수
   * 라이브쇼핑 tts에서 사용될 상품명과 실제 상품명이 다른 경우가 대부분이기 때문에 상품명은 따로 전송받도록 구현했음 (ex. 실제 상품명 : 속초닭강정 명물 예스닭강정-블랙닭강정, TTS용 상품명 : 예스닭강정)
   */
  @SubscribeMessage('get product name from admin')
  getProductName(
    @MessageBody()
    roomNameAndStreamerAndProduct: ProductNameAndRoomName,
  ): void {
    const { roomName } = roomNameAndStreamerAndProduct;
    const { streamerAndProduct } = roomNameAndStreamerAndProduct;
    this.server.to(roomName).emit('get product name from server', streamerAndProduct);
  }

  /**
   * @author M'baku
   * @param roomNameAndBgmNumber roomName과 몇번째 bgm을 틀건지 받아온다
   * @description 오버레이 bgm 재생 함수
   */
  @SubscribeMessage('start bgm from admin')
  startBgm(@MessageBody() roomNameAndBgmNumber: RoomNameAndBgmNumber): void {
    const { roomName } = roomNameAndBgmNumber;
    const { bgmNumber } = roomNameAndBgmNumber;

    this.server.to(roomName).emit('start bgm from server', bgmNumber);
  }

  /**
   * @author M'baku
   * @description 오버레이 bgm 재생 종료 함수
   */
  @SubscribeMessage('off bgm from admin')
  offBgm(@MessageBody() roomName: string): void {
    this.server.to(roomName).emit('off bgm from server', roomName);
  }

  /**
   * @author M'baku
   * @description bgm 볼륨을 조절하는 함수
   */
  @SubscribeMessage('bgm volume from admin')
  bgmVolume(@MessageBody() roomNameAndVolume: RoomNameAndVolume): void {
    const { roomName } = roomNameAndVolume;
    const { volume } = roomNameAndVolume;
    this.server.to(roomName).emit('bgm volume from server', volume);
  }

  /**
   * @author M'baku
   * @description tts 콤보 기능의 콤보 수를 다시 1로 돌릴 때 사용한다
   */
  @SubscribeMessage('combo reset from admin')
  resetCombo(@MessageBody() roomName: string): void {
    this.server.to(roomName).emit('combo reset from server');
  }
}

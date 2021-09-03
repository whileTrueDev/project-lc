import {
  WebSocketServer,
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayDisconnect,
  OnGatewayConnection,
  OnGatewayInit,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { SocketInfo, SocketIdandDevice, PurchaseMessage } from '@project-lc/shared-types';
import { AppService } from './app.service';

@WebSocketGateway({ cors: true, transports: ['websocket'] })
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  socketInfo: SocketInfo = {};

  constructor(private readonly appService: AppService) {}

  private logger: Logger = new Logger('AppGateway');

  afterInit() {
    this.logger.log('Initialized!');
  }

  async handleConnection(socket: Socket) {
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
  handleClient(
    socket: Socket,
    clientUrlDevice: { pageUrl: string; device: string },
  ): void {
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
  handleCreatorList(@ConnectedSocket() socket: Socket, @MessageBody() data) {
    const advertiseUrl = data && data.url ? data.url.split('/')[1] : null;
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
        .to(data.clientId)
        .emit(
          'creator list from server',
          fullUrl[0] ? this.socketInfo[fullUrl[0]] : null,
        );
    }
    if (process.env.NODE_ENV === 'production') {
      this.server
        .to(data.clientId)
        .emit(
          'creator list from server',
          fullUrl[0] ? this.socketInfo[fullUrl[0]] : null,
        );
    }
  }

  @SubscribeMessage('get ranking')
  async getRanking(@ConnectedSocket() socket: Socket, @MessageBody() roomName) {
    const nicknameAndPrice = [];
    const rankings = await this.appService.getRanking();
    rankings.map((eachNickname) => {
      const price = Object.values(eachNickname._sum).toString();
      const { nickname } = eachNickname;
      nicknameAndPrice.push({ nickname, price: Number(price) });
    });
    nicknameAndPrice.sort((a, b) => {
      return b.price - a.price;
    });

    this.server.to(roomName).emit('get top-left ranking', nicknameAndPrice);
  }

  @SubscribeMessage('total sold price')
  async getTotalSold() {
    const totalSold = await this.appService.getTotalSoldPrice();
    // this.server.to().emit('')
    console.log(Object.values(totalSold._sum).toString());
  }

  @SubscribeMessage('get purchase message')
  async getPurchaseMessage() {
    const messageAndNickname = await this.appService.getMessageAndNickname();
    console.log(messageAndNickname);

    // this.server.to().emit('')
    // console.log(Object.values(totalSold._sum).toString());
  }

  @SubscribeMessage('right top purchase message')
  async getRightTopPurchaseMessage(@MessageBody() data: PurchaseMessage) {
    const { roomName } = data;
    const nicknameAndPrice = [];
    const bottomAreaTextAndNickname: string[] = [];
    const rankings = await this.appService.getRanking();
    const totalSold = await this.appService.getTotalSoldPrice();
    const messageAndNickname = await this.appService.getMessageAndNickname();

    rankings.map((eachNickname) => {
      const price = Object.values(eachNickname._sum).toString();
      const { nickname } = eachNickname;
      nicknameAndPrice.push({ nickname, price: Number(price) });
    });
    nicknameAndPrice.sort((a, b) => {
      return b.price - a.price;
    });

    messageAndNickname.map((d: { nickname: string; text: string }) => {
      bottomAreaTextAndNickname.push(`${d.text} - [${d.nickname}]`);
    });

    const audioBuffer = await this.appService.googleTextToSpeech(data);

    this.server.to(roomName).emit('get right-top purchase message', [data, audioBuffer]);
    this.server.to(roomName).emit('get top-left ranking', nicknameAndPrice);
    this.server.to(roomName).emit('get current quantity', totalSold);
    this.server
      .to(roomName)
      .emit('get bottom purchase message', bottomAreaTextAndNickname);
  }

  @SubscribeMessage('get all data')
  async getAllPurchaseMessage(@MessageBody() roomName) {
    const nicknameAndPrice = [];
    const bottomAreaTextAndNickname: string[] = [];
    const rankings = await this.appService.getRanking();
    const totalSold = await this.appService.getTotalSoldPrice();
    const messageAndNickname = await this.appService.getMessageAndNickname();

    rankings.map((eachNickname) => {
      const price = Object.values(eachNickname._sum).toString();
      const { nickname } = eachNickname;
      nicknameAndPrice.push({ nickname, price: Number(price) });
    });
    nicknameAndPrice.sort((a, b) => {
      return b.price - a.price;
    });

    messageAndNickname.map((d: { nickname: string; text: string }) => {
      bottomAreaTextAndNickname.push(`${d.text} - [${d.nickname}]`);
    });

    this.server.to(roomName).emit('get top-left ranking', nicknameAndPrice);
    this.server.to(roomName).emit('get current quantity', totalSold);
    this.server
      .to(roomName)
      .emit('get bottom purchase message', bottomAreaTextAndNickname);
  }

  @SubscribeMessage('toggle right-top onad logo')
  handleLogo(@MessageBody() roomName) {
    this.server.to(roomName).emit('toggle right-top onad logo from server');
  }

  @SubscribeMessage('bottom area message')
  handleBottomAreaReply(@MessageBody() data) {
    const { roomName } = data;
    const { text } = data;
    this.server.to(roomName).emit('get bottom area message', text);
  }

  @SubscribeMessage('clear bottom area from admin')
  handleBottomMessageArea(@MessageBody() data) {
    const { roomName } = data;
    this.server.to(roomName).emit('handle bottom area to client');
  }

  @SubscribeMessage('show live commerce')
  showLiveCommerce(@MessageBody() roomName) {
    this.server.to(roomName).emit('show screen');
  }

  @SubscribeMessage('quit live commerce')
  hideLiveCommerce(@MessageBody() roomName) {
    this.server.to(roomName).emit('hide screen');
  }

  @SubscribeMessage('get d-day')
  getDday(@MessageBody() dateData) {
    const { date } = dateData;
    const { roomName } = dateData;
    this.server.to(roomName).emit('d-day from server', date);
  }

  @SubscribeMessage('refresh')
  handleRefresh(@MessageBody() roomName) {
    this.server.to(roomName).emit('refresh signal');
  }
}

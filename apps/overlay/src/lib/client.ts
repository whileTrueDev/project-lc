import { io } from 'socket.io-client';

const socket: any = io('http://localhost:3002', { transports: ['websocket'] });
console.log('client ts');
socket.emit('new client');

socket.on('msgToClient', (msg) => {
  console.log('Connection');
});

export {};

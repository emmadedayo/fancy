import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import * as admin from 'firebase-admin';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  async handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  async handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { room: string },
  ) {
    client.join(data.room);
    client.emit('joinedRoom', data.room);
  }

  @SubscribeMessage('message')
  async handleMessage(@MessageBody() message: any): Promise<void> {
    const db = admin.firestore();
    await db.collection('chats').doc(message.room).collection('messages').add({
      message_id: message.message_id,
      original_message_id: message.original_message_id,
      message: message.message,
      message_type: message.message_type,
      message_media: message.message_media,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      sender_id: message.sender_id,
      sender_username: message.sender_username,
      sender_profile_picture: message.sender_profile_picture,
      recipient_id: message.recipient_id,
      recipient_username: message.recipient_username,
      recipient_profile_picture: message.recipient_profile_picture,
      is_read: message.is_read,
    });

    this.server.to(message.room).emit('message', message);
  }
}

import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { SocketsMap } from './sockets.map';
import { MessageCreatePayload, TypingPayload } from 'src/utils/types';
@WebSocketGateway({
  cors: {
    origin: [`http://localhost:3001`],
    credentials: true,
  },
})
export class Gateway {
  constructor(private readonly socketMap: SocketsMap) {}

  @WebSocketServer()
  public server: Server;

  handleConnection(@ConnectedSocket() client) {
    this.socketMap.setUserSocket(
      client.request.session.passport.user._id,
      client,
    );
  }

  handleDisconnect(@ConnectedSocket() client) {
    this.socketMap.removeUserSocket(client.request.session.passport.user._id);
  }

  @SubscribeMessage('event:messageCreate')
  handleMessageCreate(@MessageBody() body: MessageCreatePayload) {
    const {
      message: { author },
      conversation: { creator, recipient },
    } = body;

    const authorSocket = this.socketMap.getUserSocket(author._id.toString());
    const recipentSocket =
      author._id.toString() === creator._id.toString()
        ? this.socketMap.getUserSocket(recipient._id.toString())
        : this.socketMap.getUserSocket(creator._id.toString());

    if (authorSocket) authorSocket.emit('onMessage', body);
    if (recipentSocket) recipentSocket.emit('onMessage', body);
  }

  @SubscribeMessage('event:typing')
  handleIsTyping(@MessageBody() { recipient, isTyping }: TypingPayload) {
    const recipientSocket = this.socketMap.getUserSocket(
      recipient._id.toString(),
    );

    if (recipientSocket) recipientSocket.emit('onTyping', { isTyping });
  }
}

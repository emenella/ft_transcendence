import { Logger } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { MessageService } from './Message/Message.service';
import { Message } from './Message/Message.entity';
import { ChanService } from './Chan/Chan.service';
import { Chan } from './Chan/Chan.entity';
import { UserService } from '../Users/service/User.service';
import { User } from '../Users/entity/User.entity';
import { ChatService } from './Chat.service';
import { ChatUser } from './Dto/chatDto';
import { ChanListDTO } from './Dto/chanDto';

@WebSocketGateway(8000, {cors: '*'})
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  constructor(
    private messageService: MessageService,
    private chanService: ChanService,
    private userService: UserService,
    private chatService: ChatService
  ) {}
  @WebSocketServer() server : Server;

  private logger: Logger = new Logger('AppGateway');
  private chans: string[] = [];

  async afterInit(server: Server) {
    const publicChans : ChanListDTO[] = await this.chanService.publicChanList();

    publicChans.forEach((chan) => {
      this.chans.push(chan.title);
    })
    this.logger.log('Initialized');
  }

  async handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    const user : ChatUser | undefined = await this.chatService.connectUserFromSocket(client);

    if (user !== undefined) {
      const chanToJoin : ChanListDTO[] = await this.chanService.chanListOfUser(user.id);

      chanToJoin.forEach(async (chan) => {
        const messages : Message[] = await this.messageService.getMessagesFromChanId(chan.id);
        let sendList : string[] = [];
        
        messages.forEach((message) => {
          sendList.push(" --- " + message.author + ": " + message.content);
        })

        let data : {chan: string, messages: string[]} = {chan : chan.title, messages : sendList};

        client.join(chan.id.toString());
        client.emit('joinedChan', data);
      })
      client.emit('listOfChan', this.chans);
    }
  }

  async handleDisconnect(client: Socket) {
    const user : ChatUser | undefined = await this.chatService.getUserFromSocket(client);

    if (user !== undefined) {
      const chanToLeave : ChanListDTO[] = await this.chanService.chanListOfUser(user.id);
  
      chanToLeave.forEach((chan) => {
        client.leave(chan.id.toString());
      })
      this.chatService.disconnectClient(client);
    }
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('msgToServer')
  async handleMessage(client: Socket, data: {author: string, chan: string, msg: string}): Promise<void> {
    this.logger.log(data);
    const user : ChatUser | undefined = await this.chatService.getUserFromSocket(client);

    if (user !== undefined) {
      const chan: Chan | undefined = await this.chanService.getChanByTitle(data.chan);

      if (chan !== undefined) {
        if (await this.chanService.isInChan(chan, user.id) === false) {
          client.emit('error', 'Not in channel !');
          return;
        } else if (await this.chanService.isMute(chan.id, user.id) === true) {
          client.emit('error', 'Muted in this chan !');
          return;
        }
        if (await this.chatService.handleCommand(this.server, client, user, chan, data.msg) === true) {
          return;
        }

        data.author = user.username;
        this.messageService.createMessage(await this.userService.getUserById(user.id), chan, data.msg);
        this.server.to(chan.id.toString()).emit('msgToClient', data);
      }
      client.emit('error', 'No such channel !');
      return;
    }
  }

  @SubscribeMessage('joinChan')
  async handleJoinChan(client: Socket, data: {chan: string, password: string | null}) {  
    const user : ChatUser | undefined = await this.chatService.getUserFromSocket(client);

    if (user !== undefined) {
      let ret: Chan | string = await this.chanService.joinChanByTitle(data.chan, await this.userService.getUserById(user.id), data.password);

      if (typeof ret === 'string') {
        client.emit('error', ret);
        return;
      }
      
      const messages : Message[] = await this.messageService.getMessagesFromChanTitle(data.chan);
      let sendList : string[] = [];
      
      messages.forEach((message) => {
        sendList.push(" --- " + message.author + ": " + message.content);
      })
      
      let joinData : {chan: string, messages: string[]} = {chan : data.chan, messages : sendList};

      client.join(ret.id.toString());
      client.emit('joinedChan', joinData);
    }
  }

  @SubscribeMessage('leaveChan')
  handleLeaveChan(client: Socket, chan: string) {
    // TO DO : check with chanService
    client.leave(chan);
    client.emit('leftChan', chan);
  }

  @SubscribeMessage('createChan')
  handleCreateChan(client: Socket, chan: string) {
    this.logger.log(chan);
    // TO DO : check with chanService
    if (this.chans.find(c => c === chan) !== undefined) {
      client.emit('error', 'This channel already exist ! You can join it in the joinChan section');
      return;
    }
    this.chans.push(chan);
    this.server.emit('listOfChan', this.chans);
    client.join(chan);
    client.emit('createdChan', chan);
  }

  @SubscribeMessage('check')
  checking(client: Socket, data: string[]) {
    this.logger.log('check');
    this.logger.log(data);
  }
}

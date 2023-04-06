import { Logger } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageService } from './Message/Message.service';
import { Message } from './Message/Message.entity';
import { ChanService } from './Chan/Chan.service';
import { Chan } from './Chan/Chan.entity';
import { UserService } from '../Users/service/User.service';
import { ChatService } from './Chat.service';
import { ChatUser } from './Dto/chatDto';
import { ChanListDTO } from './Dto/chanDto';

@WebSocketGateway(8000, {namespace: 'chat', cors: true})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() server : Server;
  constructor(
    private messageService: MessageService,
    private chanService: ChanService,
    private userService: UserService,
    private chatService: ChatService
  ) {}

  private logger: Logger = new Logger('ChatGateway');
  private chans: string[] = [];

  async afterInit() {
    const publicChans : ChanListDTO[] = await this.chanService.publicChanList();

    publicChans.forEach((chan) => {
      this.chans.push(chan.title);
    })
    console.log('Chat initialized');
  }

  async handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    console.log("CONNECTED CHAT ?")
    const user : ChatUser | undefined = await this.chatService.connectUserFromSocket(client);
    console.log("CONNECTED CHAT YEAH")

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
      if (data.chan[0] !== '#') {
        const dmChan : Chan | undefined = await this.chanService.getDm(await this.userService.getUserById(user.id), await this.userService.getUserById(this.chatService.getUserFromUsername(data.chan)?.id as number))
        if (dmChan !== undefined) {
          data.author = user.username;
          this.messageService.createMessage(await this.userService.getUserById(user.id), dmChan, data.msg);
          this.server.to(dmChan.id.toString()).emit('msgToClient', data);
          return;
        }
        client.emit('error', 'No such DM');
        return;
      }

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

        if (chan.owner.id === user.id) {
          data.author = '[owner] ' + user.username; 
        }
        else if (await this.chanService.isAdmin(chan.id, user.id) === true) {
          data.author = '[admin] ' + user.username;
        }
        else {
          data.author = user.username;
        }
        await this.messageService.createMessage(await this.userService.getUserById(user.id), chan, data.msg);
        this.server.to(chan.id.toString()).emit('msgToClient', data);
        return;
      }
      client.emit('error', 'No such channel !');
      return;
    }
  }

  @SubscribeMessage('joinChan')
  async handleJoinChan(client: Socket, data: {chan: string, password: string | null}) {  
    const user : ChatUser | undefined = await this.chatService.getUserFromSocket(client);

    if (user !== undefined) {
      if (data.password === "") {
        data.password = null;
      }
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
  async handleLeaveChan(client: Socket, chan: string) {
    const user : ChatUser | undefined = await this.chatService.getUserFromSocket(client);

    if (user !== undefined) {
      const chanToLeave : Chan | undefined = await this.chanService.getChanByTitle(chan);

      if (chanToLeave !== undefined) {
        const ret : string | number | undefined = await this.chanService.leaveChanById(chanToLeave.id, user.id);

        if (typeof ret === 'string') {
          client.emit('error', ret);
          return;
        }
        if (ret === undefined && chanToLeave.isPrivate === false) {
          this.chans.splice(this.chans.findIndex((c) => {return c === chanToLeave.title}), 1);
        }
        else if (ret !== undefined) {
          this.server.to(chanToLeave.id.toString()).emit('msgToClient', {author: user.username, chan: chanToLeave.title, msg: ' leaved the channel !'});
        }

        client.leave(chan);
        client.emit('leftChan', chan);
      }
    }
  }

  @SubscribeMessage('createChan')
  async handleCreateChan(client: Socket, data: {title: string, isPrivate: boolean, password: string | undefined}) {
    const user : ChatUser | undefined = await this.chatService.getUserFromSocket(client);

    if (user !== undefined) {
      if (data.password === "") {
        data.password = undefined;
      }

      let ret: Chan | string = await this.chanService.createChan(data.title, await this.userService.getUserById(user.id), data.isPrivate, data.password !== undefined,
                                                                  data.password, false, await this.userService.getUserById(user.id));

      if (typeof ret === 'string') {
        client.emit('error', ret);
        return;
      }

      if (ret.isPrivate === false) {
        this.chans.push(ret.title);
        this.server.emit('listOfChan', this.chans);
      }
      client.join(ret.id.toString());
      client.emit('createdChan', ret.title);
    }
    
  }

  @SubscribeMessage('check')
  async checking(client: Socket, data: string[]) {
    this.logger.log('check');
    this.logger.log((await this.chatService.getUserFromSocket(client))?.username);
    this.logger.log(data);
  }
}

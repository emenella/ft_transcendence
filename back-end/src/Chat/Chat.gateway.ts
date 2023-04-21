import { SubscribeMessage, WebSocketGateway, WebSocketServer, ConnectedSocket, MessageBody } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageService } from './Message/Message.service';
import { Message } from './Message/Message.entity';
import { ChanService } from './Chan/Chan.service';
import { Chan } from './Chan/Chan.entity';
import { UserService } from '../User/service/User.service';
import { ChatService } from './Chat.service';
import { ChatUser } from './Dto/chatDto';
import { ChanListDTO } from './Dto/chanDto';

interface msg {
  date : string;
  authorId : number;
  author : string;
  content : string;
}

@WebSocketGateway(81, {namespace: 'chat', cors: true})
export class ChatGateway {

  @WebSocketServer() server : Server;
  constructor(
    private readonly messageService: MessageService,
    private readonly chanService: ChanService,
    private readonly userService: UserService,
    private readonly chatService: ChatService
  ) {}

  private chans: string[] = [];

  async afterInit() {
    const publicChans : ChanListDTO[] = await this.chanService.publicChanList();

    publicChans.forEach((chan) => {
      this.chans.push(chan.title);
    })
  }

  async handleConnection(@ConnectedSocket() client: Socket) {
    const user : ChatUser | undefined = await this.chatService.connectUserFromSocket(client);
    
    if (user !== undefined) {
      const chanToJoin : ChanListDTO[] = await this.chanService.chanListOfUser(user.id);
      
      chanToJoin.forEach(async (chan) => {
        const messages : Message[] = await this.messageService.getMessagesFromChanId(chan.id);
        let sendList : msg[] = [];
        
        messages.forEach((message) => {
          let hour: number = (message.date.getUTCHours() >= 22 ? message.date.getUTCHours() - 22 : message.date.getUTCHours() + 2 );
          let minute: string | number = (message.date.getMinutes() >= 10 ? message.date.getMinutes() : "0" + message.date.getMinutes());
          let month: string | number = (message.date.getMonth() + 1 >= 10 ? (message.date.getMonth() + 1) : "0" + (message.date.getMonth() + 1))
         
          let newMessage : msg = {
            date: "(" + message.date.getDate() + "/" + month + ") " + hour + ":" + minute,
            authorId: message.authorId,
            author: message.authorName,
            content: message.content
          };
          sendList.push(newMessage);
        })
        
        let data : {chan: string, messages: msg[]} = {chan : chan.title, messages : sendList};
        
        client.join(chan.id.toString());
        client.emit('joinedChan', data);
      })
      client.emit('listOfChan', this.chans);
    }
  }

  async handleDisconnect(@ConnectedSocket() client: Socket) {
    const user : ChatUser | undefined = await this.chatService.getUserFromSocket(client);

    if (user !== undefined) {
      const chanToLeave : ChanListDTO[] = await this.chanService.chanListOfUser(user.id);
  
      chanToLeave.forEach((chan) => {
        client.leave(chan.id.toString());
      })
      this.chatService.disconnectClient(client);
    }
  }

  @SubscribeMessage('msgToServer')
  async handleMessage(@ConnectedSocket() client: Socket, @MessageBody() data: {chan: string, msg: string}): Promise<void> {
    const user : ChatUser | undefined = await this.chatService.getUserFromSocket(client);

    if (user !== undefined) {
      if (data.chan[0] !== '#') {
        let user1 = await this.userService.getUserById(user.id);
        let user2 = await this.userService.getUserById(this.chatService.getUserFromUsername(data.chan)?.id as number);
        const dmChan : Chan | undefined = await this.chanService.getDm(user1, user2);
        if (dmChan !== undefined) {
          let ret = await this.messageService.createMessage(await this.userService.getUserById(user.id), user.username, dmChan, data.msg);
          let hour: number = (ret.date.getUTCHours() >= 22 ? ret.date.getUTCHours() - 22 : ret.date.getUTCHours() + 2 );
          let minute: string | number = (ret.date.getMinutes() >= 10 ? ret.date.getMinutes() : "0" + ret.date.getMinutes());
          let month: string | number = (ret.date.getMonth() + 1 >= 10 ? (ret.date.getMonth() + 1) : "0" + (ret.date.getMonth() + 1))
          
          let newMessage : any = {
            date: "(" + ret.date.getDate() + "/" + month + ") " + hour + ":" + minute,
            authorId: ret.authorId,
            author: ret.authorName,
            chan: data.chan,
            msg: ret.content
          };
          client.emit('msgToClient', newMessage);
          newMessage.chan = user.username;
          let userChat2 = this.chatService.getUserFromID(user2.id);
          userChat2?.socket.emit('msgToClient', newMessage);
          // this.server.to(dmChan.id.toString()).emit('msgToClient', newMessage);
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

        let ret = await this.messageService.createMessage(await this.userService.getUserById(user.id), user.username, chan, data.msg);
        let hour: number = (ret.date.getUTCHours() >= 22 ? ret.date.getUTCHours() - 22 : ret.date.getUTCHours() + 2 );
        let minute: string | number = (ret.date.getMinutes() >= 10 ? ret.date.getMinutes() : "0" + ret.date.getMinutes());
        let month: string | number = (ret.date.getMonth() + 1 >= 10 ? (ret.date.getMonth() + 1) : "0" + (ret.date.getMonth() + 1))
        
        let newMessage : any = {
          date: "(" + ret.date.getDate() + "/" + month + ") " + hour + ":" + minute,
          authorId: ret.authorId,
          author: ret.authorName,
          chan: chan.title,
          msg: ret.content
        };
        if (chan.ownerId === user.id) {
          newMessage.author = '[owner] ' + user.username; 
        }
        else if (await this.chanService.isAdmin(chan.id, user.id) === true) {
          newMessage.author = '[admin] ' + user.username;
        }
        else {
          newMessage.author = user.username;
        }
        this.server.to(chan.id.toString()).emit('msgToClient', newMessage);
        return;
      }
      client.emit('error', 'No such channel !');
      return;
    }
  }

  @SubscribeMessage('joinChan')
  async handleJoinChan(@ConnectedSocket() client: Socket, @MessageBody() data: {chan: string, password: string | null}) {  
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
      let sendList : msg[] = [];
        
      messages.forEach((message) => {
        let hour: number = (message.date.getUTCHours() >= 22 ? message.date.getUTCHours() - 22 : message.date.getUTCHours() + 2 );
        let minute: string | number = (message.date.getMinutes() >= 10 ? message.date.getMinutes() : "0" + message.date.getMinutes());
        let month: string | number = (message.date.getMonth() + 1 >= 10 ? (message.date.getMonth() + 1) : "0" + (message.date.getMonth() + 1))
       
        let newMessage : msg = {
          date: "(" + message.date.getDate() + "/" + month + ") " + hour + ":" + minute,
          authorId: message.authorId,
          author: message.authorName,
          content: message.content
        };
        sendList.push(newMessage);
      })
      
      let joinData : {chan: string, messages: msg[]} = {chan : data.chan, messages : sendList};

      client.join(ret.id.toString());
      client.emit('joinedChan', joinData);
    }
  }

  @SubscribeMessage('leaveChan')
  async handleLeaveChan(@ConnectedSocket() client: Socket, @MessageBody() chan: string) {
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
          this.server.emit('listOfChan', this.chans);
        }
        else if (ret !== undefined) {
          this.server.to(chanToLeave.id.toString()).emit('msgToClient', {author: user.username, chan: chanToLeave.title, msg: ' leaved the channel !'});
        }
        
        client.leave(chanToLeave.id.toString());
        client.emit('leftChan', chan);
      }
    }
  }

  @SubscribeMessage('createChan')
  async handleCreateChan(@ConnectedSocket() client: Socket, @MessageBody() data: {title: string, isPrivate: boolean, password: string | undefined}) {
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
}

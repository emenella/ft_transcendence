// import { WebSocketGateway, WebSocketServer, SubscribeMessage, ConnectedSocket } from "@nestjs/websockets";
// import { Socket, Server } from 'socket.io';
// import { User } from "./entity/User.entity";
// import { HttpException } from "@nestjs/common";
// import { AuthService } from "../Auth/Auth.service";
// import { UserService } from "./service/User.service";

// @WebSocketGateway(81, { namespace: 'front', cors: true})
// export class FrontGateway {
//     @WebSocketServer()
//     server: Server;

//     constructor(private readonly authService: AuthService, private readonly userService: UserService) {}

//     async handleConnection(@ConnectedSocket() client: Socket) {
//         const user : User = await this.authentificate(client);
//         if (!user) {
//             client.disconnect();
//         }
//         user.socket = client;
//     }

//     async handleDisconnect(@ConnectedSocket() client: Socket) {
//         const user = await this.authentificate(client);
//         if (user) {
//             user.socket = null;
//         }
//         client.disconnect();
//     }

//     // cote client
//     // globalSocket.emit('friend:request', {targetId: clickedUser.id});
//     // globalSocket.on('friend:incoming', data => openPopupFriendRequest(data.requester)));
//     // globalSocket.on('friend:requestSent', _ => showMessage("The request has been sent!")));

//     @SubscribeMessage('friend:request')
//     async onFriendRequest(@ConnectedSocket() client: Socket, data: any): Promise<any> {
//         const user: User = await this.authentificate(client);
//         if (user && data.targetId) {
//             try {
//                 // Get user or throw an exception if not found
//                 let target: User = await this.userService.getUserById(data.targetId);

//                 // Check if the user can be added as friend and store the request in the database or throw an exception if not found
//                 await this.userService.inviteFriend(user, target);

//                 // Get the socket of the target and send him a message if he is online
//                 let targetSocket: Socket | null = target.socket;
//                 if (targetSocket) {
//                     targetSocket.emit("friend:incoming", {requester: user.id});
//                 }

//                 // Confirm to the user the request has been sent
//                 client.emit("friend:requestSent");
//             } catch (error) {
//                 // If any error occurs, get the message of the HttpException (sent by getUserById and inviteFriend), and send the error to the user.
//                 client.emit("error", {
//                     message: error.getResponse()
//                 });
//                 return;
//             }
//         }
//     }

//     @SubscribeMessage('friend:remove')
//     async onFriendRemove(@ConnectedSocket() client: Socket, data: any): Promise<any> {
//         const user: User = await this.authentificate(client);
//         if (user && data.targetId) {
//             // try {
//             //     // Get user or throw an exception if not found
//             //     let target: User = await this.userService.getUserById(data.targetId);

//             //     // Check if the user can be added as friend and store the request in the database or throw an exception if not found
//             //     await this.userService.removeFriend(user, target);

//             //     // Get the socket of the target and send him a message if he is online
//             //     let targetSocket: Socket | null = target.socket;
//             //     if (targetSocket) {
//             //         targetSocket.emit("friend:incoming", {requester: user.id});
//             //     }

//             //     // Confirm to the user the request has been sent
//             //     client.emit("friend:requestSent");
//             // } catch (error) {
//             //     // If any error occurs, get the message of the HttpException (sent by getUserById and removeFriend), and send the error to the user.
//             //     client.emit("error", {
//             //         message: error.getResponse()
//             //     });
//             //     return;
//             // }
//         }
//     }
    
//     @SubscribeMessage('friend:accept')
//     async onFriendAccept(@ConnectedSocket() client: Socket, data: any): Promise<any> {
//         const user: User = await this.authentificate(client);
//         if (user && data.targetId) {
//             // try {
//             //     // Get user or throw an exception if not found
//             //     let target: User = await this.userService.getUserById(data.targetId);

//             //     // Check if the user can be added as friend and store the request in the database or throw an exception if not found
//             //     await this.userService.acceptFriend(user, target);

//             //     // Get the socket of the target and send him a message if he is online
//             //     let targetSocket: Socket | null = target.socket;
//             //     if (targetSocket) {
//             //         targetSocket.emit("friend:incoming", {requester: user.id});
//             //     }

//             //     // Confirm to the user the request has been sent
//             //     client.emit("friend:requestSent");
//             // } catch (error) {
//             //     // If any error occurs, get the message of the HttpException (sent by getUserById and acceptFriend), and send the error to the user.
//             //     client.emit("error", {
//             //         message: error.getResponse()
//             //     });
//             //     return;
//             // }
//         }
//     }

//     @SubscribeMessage('friend:deny')
//     async onFriendDeny(@ConnectedSocket() client: Socket, data: any): Promise<any> {
//         const user: User = await this.authentificate(client);
//         if (user && data.targetId) {
//             // try {
//             //     // Get user or throw an exception if not found
//             //     let target: User = await this.userService.getUserById(data.targetId);

//             //     // Check if the user can be added as friend and store the request in the database or throw an exception if not found
//             //     await this.userService.denyFriend(user, target);

//             //     // Get the socket of the target and send him a message if he is online
//             //     let targetSocket: Socket | null = target.socket;
//             //     if (targetSocket) {
//             //         targetSocket.emit("friend:incoming", {requester: user.id});
//             //     }

//             //     // Confirm to the user the request has been sent
//             //     client.emit("friend:requestSent");
//             // } catch (error) {
//             //     // If any error occurs, get the message of the HttpException (sent by getUserById and denyFriend), and send the error to the user.
//             //     client.emit("error", {
//             //         message: error.getResponse()
//             //     });
//             //     return;
//             // }
//         }
//     }

//     @SubscribeMessage('match:request')
//     async onMatchAccept(@ConnectedSocket() client: Socket, data: any): Promise<any> {
//         const user: User = await this.authentificate(client);
//         if (user && data.targetId) {
//             // try {
//             //     // Get user or throw an exception if not found
//             //     let target: User = await this.userService.getUserById(data.targetId);

//             //     // Check if the user can be added in game or throw an exception if not found
//             //     await this.userService.inviteGame(user, target);

//             //     // Get the socket of the target and send him a message if he is online
//             //     let targetSocket: Socket | null = target.socket;
//             //     if (targetSocket) {
//             //         targetSocket.emit("match:incoming", {requester: user.id});
//             //     }

//             //     // Confirm to the user the request has been sent
//             //     client.emit("match:requestSent");
//             // } catch (error) {
//             //     // If any error occurs, get the message of the HttpException (sent by getUserById and inviteGame), and send the error to the user.
//             //     client.emit("error", {
//             //         message: error.getResponse()
//             //     });
//             //     return;
//             // }
//         }
//     }

//     @SubscribeMessage('match:accept')
//     async onMatchRequest(@ConnectedSocket() client: Socket, data: any): Promise<any> {
//         const user: User = await this.authentificate(client);
//         if (user && data.targetId) {
//             // try {
//             //     // Get user or throw an exception if not found
//             //     let target: User = await this.userService.getUserById(data.targetId);

//             //     // Check if the user can be added in game or throw an exception if not found
//             //     await this.userService.acceptGame(user, target);

//             //     // Get the socket of the target and send him a message if he is online
//             //     let targetSocket: Socket | null = target.socket;
//             //     if (targetSocket) {
//             //         targetSocket.emit("match:incoming", {requester: user.id});
//             //     }

//             //     // Confirm to the user the request has been sent
//             //     client.emit("match:requestSent");
//             // } catch (error) {
//             //     // If any error occurs, get the message of the HttpException (sent by getUserById and acceptGame), and send the error to the user.
//             //     client.emit("error", {
//             //         message: error.getResponse()
//             //     });
//             //     return;
//             // }
//         }
//     }

//     @SubscribeMessage('match:deny')
//     async onMatchDeny(@ConnectedSocket() client: Socket, data: any): Promise<any> {
//         const user: User = await this.authentificate(client);
//         if (user && data.targetId) {
//             // try {
//             //     // Get user or throw an exception if not found
//             //     let target: User = await this.userService.getUserById(data.targetId);

//             //     // Check if the user can be added in game or throw an exception if not found
//             //     await this.userService.denyGame(user, target);

//             //     // Get the socket of the target and send him a message if he is online
//             //     let targetSocket: Socket | null = target.socket;
//             //     if (targetSocket) {
//             //         targetSocket.emit("match:incoming", {requester: user.id});
//             //     }

//             //     // Confirm to the user the request has been sent
//             //     client.emit("match:requestSent");
//             // } catch (error) {
//             //     // If any error occurs, get the message of the HttpException (sent by getUserById and denyGame), and send the error to the user.
//             //     client.emit("error", {
//             //         message: error.getResponse()
//             //     });
//             //     return;
//             // }
//         }
//     }

//     async authentificate(client: Socket): Promise<User> {
//         if (client.handshake.headers.authorization) {
//             const payload: any = await this.authService.verifyJWT(client.handshake.headers.authorization);
//             let user = await this.userService.getUserByConnectionId(payload.connectionId);
//             if (user) {
//                 return user;
//             }
//         }
//         // client.disconnect();
//         throw new HttpException('Unauthorized', 401);
//     }
// }

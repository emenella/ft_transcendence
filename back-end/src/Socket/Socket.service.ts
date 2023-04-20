import { Injectable } from "@nestjs/common";
import { Socket } from 'socket.io'
import { User } from "../User/entity/User.entity";

@Injectable()
export class SocketService {

	private users: { [socket: string]: User } = {}

	constructor() {}

	addUser(socket: Socket, user: User): void {
		this.users[socket.id] = user;
		user.socket = socket;
	}

	removeUser(socket: Socket, user: User): void {
		user;
		this.users[socket.id].socket = undefined;
		delete this.users[socket.id];
	}

	getUserById(id: number): User | undefined {
		console.log(Object.values(this.users).find(user => user.id === id));
		return Object.values(this.users).find(user => user.id === id);
	}

	getUserByUsername(username: string): User | undefined {
		return Object.values(this.users).find(user => user.username === username);
	}

}
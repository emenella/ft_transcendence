import { Injectable } from "@nestjs/common";
import { Socket } from "socket.io"
import { User } from "../User/entity/User.entity";

@Injectable()
export class SocketService {

	private	users: Map<Socket, User> = new Map();

	constructor() {}

	addUser(socket: Socket, user: User): void {
		this.users.set(socket, user);
	}

	removeUser(socket: Socket): void {
		this.users.delete(socket)
	}

	getUserById(id: number): User | undefined {
		return [...this.users.values()].find(e => e.id == id)
	}

	getSocketByUserId(id: number): Socket | undefined {
		let found = undefined;
		for (let [key, value] of this.users.entries()) {
			if (value.id == id) {
				found = key;
				break ;
			}
		}
		return found;
	}
}

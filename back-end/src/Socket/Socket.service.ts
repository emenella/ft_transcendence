import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { Socket } from "socket.io"
import { User } from "../User/entity/User.entity";
import { UserService } from "../User/service/User.service";

@Injectable()
export class SocketService {

	private	users: Map<Socket, number> = new Map();

	constructor(@Inject(forwardRef(() => UserService)) readonly userService: UserService) {}

	addUser(socket: Socket, user: number): void {
		this.users.set(socket, user);
	}

	removeUser(socket: Socket): void {
		this.users.delete(socket)
	}

	async getUserById(id: number): Promise<User | undefined> {
		const ret = [...this.users.values()].find(e => e == id);
		if (ret)
		{
			return await this.userService.getUserById(ret);
		}
		return undefined;
	}

	async getUserBySocketId(id: string): Promise<User | undefined> {
		const ret = this.users.get([...this.users.keys()].find(e => e.id == id));
		if (ret)
		{
			return await this.userService.getUserById(ret);
		}
		return undefined;
	}

	getSocketByUserId(id: number): Socket | undefined {
		let found = undefined;
		for (let [key, value] of this.users.entries()) {
			if (value == id) {
				found = key;
				break ;
			}
		}
		return found;
	}
}

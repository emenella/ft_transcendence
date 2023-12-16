import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { Socket } from "socket.io"
import { User } from "../User/entity/User.entity";
import { UserService } from "src/User/service/User.service";

@Injectable()
export class SocketService {

	private users: { [socket: string]: User } = {}

	constructor(@Inject(forwardRef(() => UserService)) private readonly userService: UserService) {}

	addUser(socket: Socket, user: User): void {
		this.users[socket.id] = user;
		user.socket = socket;
	}

	removeUser(socket: Socket): void {
		this.users[socket.id].socket = undefined;
		delete this.users[socket.id];
	}

	async getUserById(id: number): Promise<User | undefined> {
		let user : User = Object.values(this.users).find(user => user.id === id)
		let tmp = user?.socket;
		user = await this.userService.getUserById(user?.id);
		user.socket = tmp;
		return user;
	}

	async getUserBySocketId(id: string): Promise<User | undefined> {
		const ret = this.users[id];
		if (ret)
		{
			return await this.userService.getUserById(ret.id);
		}
		return undefined;
	}

	getSocketByUserId(id: number): Socket | undefined {
		return Object.values(this.users).find(user => user.id === id)?.socket;
	}
}
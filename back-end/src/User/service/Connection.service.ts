import { Injectable, HttpException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Connection } from "../entity/Connection.entity";
import { User } from "../entity/User.entity";

@Injectable()
export class ConnectionService {
	constructor(@InjectRepository(Connection) private readonly connectionRepository: Repository<Connection>) {}
	
	async createConnection(connection: Connection, user: User, id42: number): Promise<Connection> {
		connection.user = user;
		connection.id42 = id42;
		return await this.connectionRepository.save(connection);
	}
	
	async updateConnection(id: number, updatedConnection: Connection): Promise<Connection> {
		const connectionToUpdate = await this.connectionRepository.findOneBy({ id: id });
		if (!connectionToUpdate)
			throw new HttpException(`Connection with ID ${id} not found.`, 404);
		const connection = { ...connectionToUpdate, ...updatedConnection };
		return await this.connectionRepository.save(connection);
	}

	async getConnectionById(id: number): Promise<Connection> {
		const connection = await this.connectionRepository.findOneBy({ id: id });
		if (!connection)
			throw new HttpException(`Connection with ID ${id} not found.`, 404);
		return connection;
	}

	async getConnectionByUserId(id: number): Promise<Connection> {
		const connection = await this.connectionRepository.findOne({ where : { user: { id: id } }, relations: ["user"] });
		if (!connection)
			throw new HttpException(`Connection with user ID ${id} not found.`, 404);
		return connection;
	}

	async getConnectionById42(id: number): Promise<Connection> {
		const connection = await this.connectionRepository.findOne({ where : { id42: id }, relations: ["user"] });
		if (!connection)
			throw new HttpException(`Connection with 42 ID ${id} not found.`, 404);
		return connection;
	}
}

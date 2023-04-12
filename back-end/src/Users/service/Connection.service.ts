import { Injectable, HttpException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Connection } from "../entity/Connection.entity";

@Injectable()
export class ConnectionService {
    constructor(
        @InjectRepository(Connection)
        private readonly connectionRepository: Repository<Connection>
    ) {}

    async getConnectionByUserId(userId: number): Promise<Connection> {
        const user = await this.connectionRepository.findOne({ relations: ["user"], where : { user: {id: userId} } });
        if (!user)
            throw new HttpException(`Connection with ID ${userId} not found.`, 404);
        return user;
    }

    async getConnectionById42(id: number): Promise<Connection> {
        const user = await this.connectionRepository.findOne({relations: ["user"],  where : { id42: id } });
        if (!user)
            throw new HttpException(`Connection with ID ${id} not found.`, 404);
        return user;
    }

    async getConnectionById(id: number): Promise<Connection> {
        const user = await this.connectionRepository.findOne({ where : { id: id } });
        if (!user)
            throw new HttpException(`Connection with ID ${id} not found.`, 404);
        return user;
    }

    async createConnection(connection: Connection): Promise<Connection> {
        return this.connectionRepository.save(connection);
    }

    async updateConnection(id: number, secret: string | undefined, iv: string | undefined): Promise<Connection> {
        let connection = await this.getConnectionByUserId(id);
        if (!connection) {
            throw new HttpException(`Connection with ID ${id} not found.`, 404);
        }
        connection.otp = secret;
        connection.iv = iv;
        return await this.connectionRepository.save(connection);
    }

}

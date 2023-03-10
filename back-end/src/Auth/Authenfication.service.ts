import { Injectable, HttpException } from '@nestjs/common';
import { UserService } from '../Users/service/User.service';
import { JwtService } from '@nestjs/jwt';
import { API } from './Authenfication.constants';
import * as speakeasy from 'speakeasy';
import * as qrcode from 'qrcode';
import { ConnectionService } from '../Users/service/Connection.service';
import { User } from '../Users/entity/User.entity';
import { Connection } from '../Users/entity/Connection.entity';

interface IToken {
    connectionId: number;
    otp: boolean;
}

@Injectable()
export class AuthenticationService {
    
    private secret: Map<number, string> = new Map<number, string>();
    
    constructor(private readonly userService: UserService, private readonly connectionService: ConnectionService,private readonly jwtService: JwtService) { }
    
    async getUrl42() {
        return "https://api.intra.42.fr/oauth/authorize?client_id=" + API.UID + "&redirect_uri=" + API.URL + "&response_type=code";
    }
    
    async login(user: any) {
        let connection;
        try {
            connection = await this.connectionService.getConnectionById42(user.id);
        }
        catch (e) {
            const newUser = new User();
            let foundUser = await this.userService.createUser(newUser);
            
            connection = new Connection();
            connection.user = foundUser;
            connection.id42 = user.id;
            connection = await this.connectionService.createConnection(connection);
            
            foundUser.connection = connection;
            foundUser = await this.userService.updateUser(foundUser.id, foundUser);
        }
        const payload: IToken = { connectionId: connection.id, otp: !connection.otp };
            return {
                access_token: this.jwtService.sign(payload),
            };
    }
    
    
    async generateQR(user: User) {

        const connection = await this.connectionService.getConnectionByUserId(user.id);
        if (connection.otp) {
            throw new HttpException('OTP already set', 401);
        }
        if (!this.secret.get(connection.id)) {
            const secret = speakeasy.generateSecret({ name: "ft_pong" });
            this.secret.set(connection.id, secret.base32); 
        }
        const secret = this.secret.get(connection.id);
        if (!secret) {
            throw new HttpException('Secret not found', 404);
        }
        const url = speakeasy.otpauthURL({ secret: secret , encoding: 'base32', label: "ft_pong" });
        const qr = await qrcode.toDataURL(url);
        return qr;
    }
    
    async verifyQR(connectionId: number, code: string) {
        const secret = this.secret.get(connectionId);
        if (!secret) {
            return false;
        }
        const verified = speakeasy.totp.verify({
            secret: secret,
            encoding: 'base32',
            token: code,
        });
        if (!verified) {
            return false;
        }
        return verified;
    }
    
    async saveSecret(user: User, code: string): Promise<any> {
        const connection = await this.connectionService.getConnectionByUserId(user.id);
        const verified = await this.verifyQR(connection.id, code);
        if (connection.otp) {
            throw new HttpException("Connection already has a secret", 400);
        }
        if (!verified) {
            throw new HttpException("Code is not valid", 401);
        }
        if (!connection) {
            throw new HttpException("Connection does not exist", 404);
        }
        if (this.secret.has(connection.id)) {
            connection.otp = this.secret.get(connection.id) as string;
            await this.connectionService.updateConnection(connection.id, connection.otp);
            this.secret.delete(connection.id);
            return await this.otp(connection, code);
        }
        else
        {
            throw new HttpException("Secret not found", 404);
        }
    }
    
    async verify(connectionId: number, code: string)
    {
        const connection = await this.connectionService.getConnectionById(connectionId);
        if (!connection) {
            throw new HttpException("Connection does not exist", 404);
        }
        if (!connection.otp) {
            throw new HttpException("Connection does not have a secret", 400);
        }
        const verified = speakeasy.totp.verify({
            secret: connection.otp,
            encoding: 'base32',
            token: code,
        });
        if (!verified) {
            return false;
        }
        return verified;
    }
    
    async otp(connection: Connection, code: string) {
        if (!connection) {
            throw new HttpException("Connection does not exist", 404);
        }
        if (!connection.otp) {
            throw new HttpException("Connection does not have a secret", 400);
        }
        const verified = await this.verify(connection.id, code);
        if (!verified) {
            throw new HttpException("Code is not valid", 401);
        }
        const payload = { connectionId: connection.id, otp: true};
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
    
    async deleteSecret(user: User) {
        const connection = await this.connectionService.getConnectionByUserId(user.id);
        if (!connection) {
            throw new Error("Connection does not exist");
        }
        if (!connection.otp) {
            throw new Error("User is not otp");
        }
        await this.connectionService.updateConnection(connection.id, undefined);
    }

    async verifyJWT(token: string): Promise<IToken> {
        let ret = this.jwtService.decode(token);
        if (!ret) {
            throw new HttpException('Invalid token', 401);
        }
        return ret as IToken;
    }
}


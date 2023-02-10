import { Injectable, Param, HttpException } from '@nestjs/common';
import { UserService } from 'src/Users/service/User.service';
import { JwtService } from '@nestjs/jwt';
import { API } from './Authenfication.constants';
import * as speakeasy from 'speakeasy';
import * as qrcode from 'qrcode';
import { ConnectionService } from 'src/Users/service/Connection.service';
import { User } from 'src/Users/entity/User.entity';
import { Connection } from 'src/Users/entity/Connection.entity';

@Injectable()
export class AuthenticationService {
    
    private secret: Map<number, string> = new Map<number, string>();
    
    constructor(private readonly userService: UserService, private readonly connectionService: ConnectionService,private readonly jwtService: JwtService) { }
    
    async login(user: any) {
        let connection = await this.connectionService.getConnectionById42(user.id);
        if (!connection) {
            const newUser = new User();
            newUser.login = user.login;
            newUser.username = "";
            let foundUser = await this.userService.createUser(newUser);
            
            connection = new Connection();
            connection.user = foundUser;
            connection.id42 = user.id;
            connection = await this.connectionService.createConnection(connection);
            
            foundUser.connection = connection;
            foundUser = await this.userService.updateUser(foundUser.id, foundUser);
        }
        const payload = { userId: connection.id, otp: connection.otp };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
    
    
    async generateQR(connectionId: number) {
        const secret = speakeasy.generateSecret( { name: "ft_pong" });
        this.secret.set(connectionId, secret.base32);
        const otpauth_url = await qrcode.toDataURL(secret.otpauth_url);
        return "<img src='" + otpauth_url + "' />";
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
    
    async saveSecret(user: any, code: string): Promise<any> {
        const connection = await this.connectionService.getConnectionById(user.userId);
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
        connection.otp = this.secret.get(connection.id);
        await this.connectionService.updateConnection(connection.id, connection.otp);
        return await this.otp(user, code);
    }
    
    async verify(connectionId: number, code: string)
    {
        const connection = await this.connectionService.getConnectionById(connectionId);
        if (!connection) {
            return false;
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
    
    async otp(user: any, code: string) {
        const connection = await this.connectionService.getConnectionById(user.userId);
        if (!connection) {
            throw new HttpException("Connection does not exist", 404);
        }
        const verified = await this.verify(user.id, code);
        if (!verified) {
            throw new HttpException("Code is not valid", 401);
        }
        console.log("User " + user + " is now online");
        const payload = { userId: user.userId, otp: true};
        console.log(user.userId);
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
    
    async deleteSecret(user: any) {
        const connection = await this.connectionService.getConnectionById(user.connection);
        if (!connection) {
            throw new Error("Connection does not exist");
        }
        if (!user.otp) {
            throw new Error("User is not otp");
        }
        await this.connectionService.updateConnection(user.id, null);
    }
}


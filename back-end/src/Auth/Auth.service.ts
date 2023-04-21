import { Injectable, Inject, HttpException, forwardRef } from '@nestjs/common';
import { UserService } from '../User/service/User.service';
import { JwtService } from '@nestjs/jwt';
import { API } from './Auth.constants';
import * as speakeasy from 'speakeasy';
import * as qrcode from 'qrcode';
import { ConnectionService } from '../User/service/Connection.service';
import { User } from '../User/entity/User.entity';
import { Connection } from '../User/entity/Connection.entity';
import * as crypto from 'crypto-js';
import { passPhrase } from './Auth.constants';


interface IToken {
    connectionId: number;
    otp: boolean;
}

interface secretEncrypted {
    secret: string;
    iv: string;
}

@Injectable()
export class AuthService {
    
    private secret: Map<number, secretEncrypted> = new Map<number, secretEncrypted>();
    
    constructor(@Inject(forwardRef(() => UserService)) private readonly userService: UserService,
                private readonly connectionService: ConnectionService,
                private readonly jwtService: JwtService) {}
    
    async get42URL() {
        return "https://api.intra.42.fr/oauth/authorize?client_id=" + API.UID + "&redirect_uri=" + API.URL + "&response_type=code";
    }
    
    async login(student: any) {
        let connection;
        try {
            connection = await this.connectionService.getConnectionById42(student.id);
        }
        catch (e) {
            let user = new User();
            connection = new Connection();
            user = await this.userService.createUser(user, connection);
            connection = await this.connectionService.createConnection(connection, user, student.id);
        }
        const payload: IToken = { connectionId: connection.id, otp: !connection.otp };
            return { access_token: this.jwtService.sign(payload), };
    }
    
    
    async generateQR(user: User) {

        const connection = await this.connectionService.getConnectionByUserId(user.id);
        if (!passPhrase.secret)
            throw new HttpException('Passphrase not set', 500);
        if (connection.otp) {
            throw new HttpException('OTP already set', 401);
        }
        if (!this.secret.get(connection.id)) {
            const iv = crypto.lib.WordArray.random(32);
            const secret = speakeasy.generateSecret({ length: 20 });
            const encrypted = crypto.AES.encrypt(secret.base32, passPhrase.secret, { iv: iv });
            this.secret.set(connection.id, { secret: encrypted.toString(), iv: iv.toString() });
        }
        const decode = this.secret.get(connection.id);
        if (!decode) {
            throw new HttpException('Secret not found', 404);
        }
        const secret = await this.decodeSecret(decode.secret, decode.iv);
        if (!secret) {
            throw new HttpException('Secret not found', 404);
        }
        const url = speakeasy.otpauthURL({ secret: secret , encoding: 'base32', label: "ft_pong" });
        const qr = await qrcode.toDataURL(url);
        return qr;
    }

    async decodeSecret(secret: string, iv: string) {
        const encryptIv = crypto.enc.Hex.parse(iv);
        if (!passPhrase.secret)
            throw new HttpException('Passphrase not set', 500);
        const res = crypto.AES.decrypt(secret, passPhrase.secret, { iv: encryptIv });
        return res.toString(crypto.enc.Utf8);
    }
    
    async verifyQR(connectionId: number, code: string) {
        const decode = this.secret.get(connectionId);
        if (!passPhrase.secret)
            throw new HttpException('Passphrase not set', 500);
        if (!decode) {
            throw new HttpException('Secret not found', 404);
        }
        const secret = await this.decodeSecret(decode.secret, decode.iv);
        if (!secret) {
            throw new HttpException('Secret not decrypt', 500);
        }
        const verified = speakeasy.totp.verify({
            secret: secret,
            encoding: 'base32',
            token: code,
        });
        if (!verified) {
            throw new HttpException('Code not valid', 401);
        }
        return verified;
    }
    
    async saveSecret(user: User, code: string): Promise<any> {
        const connection = await this.connectionService.getConnectionByUserId(user.id);
        if (connection.otp) {
            throw new HttpException("Connection already has a secret", 400);
        }
        const verified = await this.verifyQR(connection.id, code);
        if (!verified) {
            throw new HttpException("Code is not valid", 401);
        }
        if (!connection) {
            throw new HttpException("Connection does not exist", 404);
        }
        let decode = this.secret.get(connection.id);
        if (!decode) {
            throw new HttpException('Secret not found', 404);
        }
        connection.otp = decode.secret;
        connection.iv = decode.iv;
        console.log(connection);
        this.secret.delete(connection.id);
        await this.userService.change2FA(user, true);
        const updateConnection = await this.connectionService.updateConnection(connection.id, connection);
        const ret = await this.otp(updateConnection, code);
        return ret;
    }
    
    async verify(connection: Connection, code: string)
    {
        if (!passPhrase.secret)
            throw new HttpException('Passphrase not set', 500);
        if (!connection) {
            throw new HttpException("Connection does not exist", 404);
        }
        if (!connection.otp) {
            throw new HttpException("Connection does not have a secret", 400);
        }
        if (!connection.iv) {
            throw new HttpException("Connection does not have a iv", 400);
        }
        const secret = await this.decodeSecret(connection.otp, connection.iv);
        const verified = speakeasy.totp.verify({
            secret: secret.toString(),
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
        const verified = await this.verify(connection, code);
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
            throw new HttpException("Connection does not exist", 404);
        }
        if (!connection.otp) {
            throw new HttpException("User is not otp", 401);
        }
        connection.otp = null;
        connection.iv = null;
        await this.connectionService.updateConnection(connection.id, connection);
		this.userService.change2FA(user, true);
    }

    async verifyJWT(token: string): Promise<IToken> {
        let ret = this.jwtService.decode(token);
        if (!ret) {
            throw new HttpException('Invalid token', 401);
        }
        return ret as IToken;
    }
}


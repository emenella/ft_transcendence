import { Injectable, Param } from '@nestjs/common';
import { UserService } from 'src/Users/User.service';
import { JwtService } from '@nestjs/jwt';
import { API } from './constants';

@Injectable()
export class AuthenticationService {
    constructor(private readonly userService: UserService,
        private readonly jwtService: JwtService) {}

    async login(code: string) {
        const token = await this.getToken(code);
        let req = await fetch('https://api.intra.42.fr/v2/me', {
            headers: {
                'Authorization': 'Bearer ' + token,
            }
        });
        const res = await req.json();
        const userDB = await this.userService.getUserByLogin(res.login);
        if (!userDB) {
            const user: any = { login: res.login, username: "" };
            await this.userService.createUser(user);
        }
        const payload = { login: res.login };
        return {
            acces_token: this.jwtService.sign(payload),
        }
    }

    async getToken(code: string) {
        let req = await fetch('https://api.intra.42.fr/oauth/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'grant_type=authorization_code&client_id=' + API.UID + '&client_secret=' + API.KEY + '&code=' + code + '&redirect_uri=http://localhost/auth',
        });
        const res = await req.json();
        return res.access_token;
    }
}
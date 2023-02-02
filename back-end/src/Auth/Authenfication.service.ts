import { Injectable, Param } from '@nestjs/common';
import { UserService } from 'src/Users/User.service';
import { JwtService } from '@nestjs/jwt';
import { Client42ApiService } from 'src/Interface-42/Client42Api.service';

@Injectable()
export class AuthenticationService {
    constructor(private readonly userService: UserService, private readonly jwtService: JwtService, private readonly Client42ApiService: Client42ApiService) { }

    async redirectUrl(): Promise<string> {
        return await this.Client42ApiService.redirectUrl();
    }

    async login(code: string): Promise<any | { status: number }> {
        const accessToken = await this.Client42ApiService.getAccessToken(code);
        const userInfo = await this.Client42ApiService.getUserInfo(accessToken);
        const user = await this.userService.getUserByLogin(userInfo.login);
        if (!user) {
            const newUser: any = {
                login: userInfo.login,
                username: userInfo.displayname
            }
            await this.userService.createUser(newUser);
        }
        const payload = { login: userInfo.login};
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}


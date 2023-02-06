import { Injectable, Param } from '@nestjs/common';
import { UserService } from 'src/Users/User.service';
import { JwtService } from '@nestjs/jwt';
import { API } from './Authenfication.constants';

@Injectable()
export class AuthenticationService {
    constructor(private readonly userService: UserService, private readonly jwtService: JwtService) { }

    async login(user: any) {
        const userDB = await this.userService.getUserByLogin(user.login);
        if (!userDB) {
            const newUser: any = {login: user.login, username: ""}
            await this.userService.createUser(newUser);
        }
        const payload = { login: user.login};
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}


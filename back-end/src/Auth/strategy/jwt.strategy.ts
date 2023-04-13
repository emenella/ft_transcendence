import { ExtractJwt, Strategy, } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable,  } from '@nestjs/common';
import { UserService } from '../../User/service/User.service';
import { jwtConstants } from '../Authenfication.constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly usersService: UserService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtConstants.secret,
        });
    }

    async validate(payload: any) {
        if (!payload.otp) {
            throw new HttpException('OTP required', HttpStatus.UNAUTHORIZED);
        }
        return await this.usersService.getUserFromConnectionId(payload.connectionId);
    }
}
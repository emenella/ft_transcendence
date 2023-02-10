import { ExtractJwt, Strategy, } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable,  } from '@nestjs/common';
import { UserService } from 'src/Users/service/User.service';
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
        console.log(payload);
        if (payload.otp) {
            throw new HttpException("OTP not verified", HttpStatus.UNAUTHORIZED);
        }
        return { userId: payload.userId};
    }
}
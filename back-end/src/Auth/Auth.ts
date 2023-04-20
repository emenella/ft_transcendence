import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './Auth.service';
import { AuthController } from './Auth.controller';
import { JwtStrategy } from './strategy/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './Auth.constants';
import { FortyTwoStrategy } from './strategy/42.strategy';
import { UserModule } from '../User/User.module';

@Module({
    imports: [
        PassportModule,
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '10000s' },
        }),
        forwardRef(() => UserModule)
    ],
    providers: [AuthService, JwtStrategy, FortyTwoStrategy],
    controllers: [AuthController],
    exports: [AuthService],
})
export class AuthModule {}
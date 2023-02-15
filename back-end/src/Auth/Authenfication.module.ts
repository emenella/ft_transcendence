import { Module } from '@nestjs/common';
import { AuthenticationService } from './Authenfication.service';
import { AuthenticationController } from './Authenfication.controller';
import { JwtStrategy } from './strategy/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './Authenfication.constants';
import { FortyTwoStrategy } from './strategy/42.strategy';
import { UserModule } from 'src/Users/Users.module';

@Module({
    imports: [
        PassportModule,
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '10000s' },
        }),
        UserModule,
    ],
    providers: [AuthenticationService, JwtStrategy, FortyTwoStrategy],
    controllers: [AuthenticationController],
    exports: [AuthenticationService],
})
export class AuthenticationModule {}

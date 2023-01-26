import { Module } from '@nestjs/common';
import { AuthenticationService } from './Authenfication.service';
import { AuthenticationController } from './Authenfication.controller';
import { JwtStrategy } from './Authenfication.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/Users/Users.module';
import { jwtConstants } from './constants';

@Module({
    imports: [
        UserModule,
        PassportModule,
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '60s' },
        }),
    ],
    providers: [AuthenticationService, JwtStrategy],
    controllers: [AuthenticationController],
    exports: [AuthenticationService],
})
export class AuthenticationModule {}

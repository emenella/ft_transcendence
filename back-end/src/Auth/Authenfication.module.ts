import { Module } from '@nestjs/common';
import { AuthenticationService } from './Authenfication.service';
import { AuthenticationController } from './Authenfication.controller';
import { JwtStrategy } from './Authenfication.strategy';
import { UserModule } from 'src/Users/Users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './Authenfication.constants';
import { Client42ApiModule } from 'src/Interface-42/Client42Api.module';

@Module({
    imports: [
        UserModule,
        PassportModule,
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '60s' },
        }),
        Client42ApiModule,
        UserModule,
    ],
    providers: [AuthenticationService, JwtStrategy],
    controllers: [AuthenticationController],
    exports: [AuthenticationService],
})
export class AuthenticationModule {}

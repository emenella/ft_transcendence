import { Module } from '@nestjs/common';
import { AuthenticationService } from './Authenfication.service';
import { AuthenticationController } from './Authenfication.controller';
import { JwtStrategy } from './strategy/jwt.strategy';
import { UserModule } from 'src/Users/Users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './Authenfication.constants';
import { FortyTwoGuard } from './guard/42.guard';
import { JwtGuard } from './guard/jwt.guard';
import { FortyTwoStrategy } from './strategy/42.strategy';

@Module({
    imports: [
        UserModule,
        PassportModule,
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '60s' },
        }),
        UserModule,
    ],
    providers: [AuthenticationService, JwtStrategy, FortyTwoStrategy, FortyTwoGuard, JwtGuard],
    controllers: [AuthenticationController],
    exports: [AuthenticationService],
})
export class AuthenticationModule {}

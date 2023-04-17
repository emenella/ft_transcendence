import { Get, Post, Controller, UseGuards, Req, Res, Delete, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthenticationService } from './Authenfication.service';
import { FortyTwoGuard } from './guard/42.guard';
import { Public } from './decorators/public.decoration';
import { ConnectionService } from '../User/service/Connection.service';
import { User } from '../User/entity/User.entity';
import { UserService } from "../User/service/User.service";
import { serverOption } from './Authenfication.constants';

@Controller('auth')
export class AuthenticationController {

    constructor(private readonly authenticationService: AuthenticationService,
				private readonly connectionService: ConnectionService,
				private readonly userService: UserService) {}
    
    @Public()
    @Get('')
    async getUrl42() {
        return await this.authenticationService.getUrl42();
    }
    
    @Public()
    @UseGuards(FortyTwoGuard)
    @Get('callback')
    async postAuth(@Req() req: Request, @Res() res: Response) {
        let token = await this.authenticationService.login(req.user);
        let payload = await this.authenticationService.verifyJWT(token.access_token);
        if (!payload.otp) {
            return res.redirect(serverOption.protocole + "://" + serverOption.hostname + ":" + serverOption.port + "/secret?token=" + token.access_token);
            
        }
        else {
            return res.redirect(serverOption.protocole + "://" + serverOption.hostname + ":" + serverOption.port + "/auth?token=" + token.access_token);
        }
    }
    
    // Sign up without 42
    @Public()
    @Post('admin')
    async getAdmin(@Req() req: Request) {
        return await this.authenticationService.login(req.body.user);
    }
    
    @Get('2fa/qrcode')
    async getQrCode(@Req() req: Request) {
        return await this.authenticationService.generateQR(req.user as User);
    }

    @Post('2fa/save')
    async saveSecret(@Req() req: Request) {
		this.userService.change2FA(req.user as User, true);
        return await this.authenticationService.saveSecret(req.user as User, req.body.code);
    }

    @Public()
    @Post('2fa/login')
    async Af2Login(@Req() req: Request) {
        if (!req.headers.authorization) {
            return false;
        }
        let payload = await this.authenticationService.verifyJWT(req.headers.authorization.split(' ')[1]);
        if (!payload) {
            throw new HttpException('Invalid token', 401);
        }
        let connection = await this.connectionService.getConnectionById(payload.connectionId);
        return await this.authenticationService.otp(connection, req.body.code);
    }

    @Delete('2fa/delete')
    async deleteSecret(@Req() req: Request) {
		await this.userService.change2FA(req.user as User, false);
        return await this.authenticationService.deleteSecret(req.user as User);
    }

}
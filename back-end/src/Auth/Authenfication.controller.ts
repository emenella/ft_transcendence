import { Get, Post, Controller, UseGuards, Req, Res, Delete, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthenticationService } from './Authenfication.service';
import { FortyTwoGuard } from './guard/42.guard';
import { Public } from './decorators/public.decoration';
import { ConnectionService } from '../Users/service/Connection.service';

@Controller('auth')
export class AuthenticationController {

    constructor(private readonly authenticationService: AuthenticationService, private readonly connectionService: ConnectionService) {}
    
    @Public()
    @Get('')
    async getUrl42() {
        return await this.authenticationService.getUrl42();
    }
    
    @Public()
    @UseGuards(FortyTwoGuard)
    @Get('callback')
    async postAuth(@Req() req: Request, @Res() res: Response) {
        let token = await this.authenticationService.login(req.body.user);
        res.redirect('http://localhost/auth?token=' + token.access_token);
    }

    // Sign up without 42
    @Public()
    @Post('admin')
    async getAdmin(@Req() req: Request) {
        return await this.authenticationService.login(req.body.user);
    }
    
    @Get('2fa/qrcode')
    async getQrCode(@Req() req: Request) {
        return await this.authenticationService.generateQR(req.body.user);
    }

    @Post('2fa/save')
    async saveSecret(@Req() req: Request) {
        return await this.authenticationService.saveSecret(req.body.user, req.body.code);
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
        return await this.authenticationService.deleteSecret(req.body.user);
    }

}
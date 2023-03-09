import { Get, Post, Controller, Param, Redirect, Body, Query, UseGuards, Req, Res, Delete } from '@nestjs/common';
import { AuthenticationService } from './Authenfication.service';
import { FortyTwoGuard } from './guard/42.guard';
import { Public } from './decorators/public.decoration';
import { ConnectionService } from 'src/Users/service/Connection.service';

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
    async postAuth(@Req() req, @Res() res) {
        let token = await this.authenticationService.login(req.user);
        res.redirect('http://localhost/auth?token=' + token.access_token);
    }

    // Sign up without 42
    @Public()
    @Post('admin')
    async getAdmin(@Body() body) {
        return await this.authenticationService.login(body.user);
    }
    
    @Get('2fa/qrcode')
    async getQrCode(@Req() req) {
        return await this.authenticationService.generateQR(req.user);
    }

    @Post('2fa/save')
    async saveSecret(@Req() req, @Body() body) {
        return await this.authenticationService.saveSecret(req.user, body.code);
    }

    @Public()
    @Post('2fa/login')
    async Af2Login(@Req() req, @Body() body) {
        if (!req.headers.authorization) {
            return false;
        }
        let payload = await this.authenticationService.verifyJWT(req.headers.authorization.split(' ')[1]);
        let connection = await this.connectionService.getConnectionById(payload['connectionId']);
        return await this.authenticationService.otp(connection, body.code);
    }

    @Delete('2fa/delete')
    async deleteSecret(@Req() req) {
        return await this.authenticationService.deleteSecret(req.user);
    }

}
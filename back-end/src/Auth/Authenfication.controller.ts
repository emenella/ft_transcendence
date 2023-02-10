import { Get, Post, Controller, Param, Redirect, Body, Query, UseGuards, Req, Res, Delete } from '@nestjs/common';
import { AuthenticationService } from './Authenfication.service';
import { FortyTwoGuard } from './guard/42.guard';
import { JwtGuard } from './guard/jwt.guard';

@Controller('auth')
export class AuthenticationController {

    constructor(private readonly authenticationService: AuthenticationService) {}
    
    @UseGuards(FortyTwoGuard)
    @Get('')
    async getAuth() {}
    
    @UseGuards(FortyTwoGuard)
    @Get('callback')
    async postAuth(@Req() req) {
        console.log("Req", req);
        return await this.authenticationService.login(req.user)
    }

    @Get('admin')
    async getAdmin(@Body() body) {
        return await this.authenticationService.login(body.user);
    }

    @UseGuards(JwtGuard)
    @Get('user')
    async getUser(@Req() req) {
        return req.user;
    }

    @UseGuards(JwtGuard)
    @Get('2fa/qrcode')
    async getQrCode(@Req() req) {
        console.log(req.user);
        return await this.authenticationService.generateQR(req.user.userId);
    }

    @UseGuards(JwtGuard)
    @Post('2fa/save')
    async saveSecret(@Req() req, @Body() body) {
        console.log(req.user);
        return await this.authenticationService.saveSecret(req.user, body.code);
    }

    @UseGuards(JwtGuard)
    @Post('2fa/login')
    async Af2Login(@Req() req, @Body() body) {
        return await this.authenticationService.otp(req.user, body.code);
    }

    @UseGuards(JwtGuard)
    @Delete('2fa/delete')
    async deleteSecret(@Req() req) {
        return await this.authenticationService.deleteSecret(req.user);
    }

}
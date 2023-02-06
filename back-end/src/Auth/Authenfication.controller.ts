import { Get, Post, Controller, Param, Redirect, Body, Query, UseGuards, Req } from '@nestjs/common';
import { AuthenticationService } from './Authenfication.service';
import { FortyTwoGuard } from './guard/42.guard';

@Controller('auth')
export class AuthenticationController {

    constructor(private readonly authenticationService: AuthenticationService) {}
    
    @UseGuards(FortyTwoGuard)
    @Get('')
    async getAuth() {}
    
    @UseGuards(FortyTwoGuard)
    @Get('callback')
    async postAuth(@Req() req) {
        return req;
    }
}
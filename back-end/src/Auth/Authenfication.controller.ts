import { Get, Post, Controller, Param, Redirect } from '@nestjs/common';
import { AuthenticationService } from './Authenfication.service';
import { API } from '../Interface-42/constants';

@Controller('auth')
export class AuthenticationController {

    constructor(private readonly authenticationService: AuthenticationService) {}
    // get auth, redirect to auth provider
    @Get()
    @Redirect('https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-ffc043a95d17b7b224f6d45cdc3b8162984dc79925bc801f9ec686e8c36aa425&redirect_uri=http%3A%2F%2Flocalhost%2Fapi%2Fauth%2Fcallback&response_type=code')	
    async getAuth() {
    }

    @Get('callback')
    async postAuth(@Param('code') code: string) {
        return await this.authenticationService.login(code);
    }
}
import { Get, Post, Controller, Param, Redirect } from '@nestjs/common';
import { AuthenticationService } from './Authenfication.service';
import { API } from './constants';

@Controller('auth')
export class AuthenticationController {

    constructor(private readonly authenticationService: AuthenticationService) {}
    // get auth, redirect to auth provider
    @Get()
    @Redirect('https://api.intra.42.fr/oauth/authorize?client_id=' + API.UID +'&redirect_uri=http://localhost/auth')	
    async getAuth() {
    }

    @Post()
    async postAuth(@Param('code') code: string) {
        return await this.authenticationService.login(code);
    }
}
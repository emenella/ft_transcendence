import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { serverOptions } from "../Auth.constants";

@Injectable()
export class FortyTwoGuard extends AuthGuard("42") {

    constructor() {
        super();
    }

    handleRequest(err, user, info, context): any {
        const response = context.switchToHttp().getResponse();

        if ( info && info.message === 'The resource owner or authorization server denied the request.')
        {
            response.redirect(serverOptions.protocole + "://" + serverOptions.hostname + ":" + serverOptions.port + "/");
            throw new HttpException("No code provided", HttpStatus.UNAUTHORIZED);
        }
        if (err || !user) {
            response.redirect(serverOptions.protocole + "://" + serverOptions.hostname + ":" + serverOptions.port + "/");
            throw err || new HttpException("Invalid callback", HttpStatus.UNAUTHORIZED,);
        } 
        return user; 
    }
}
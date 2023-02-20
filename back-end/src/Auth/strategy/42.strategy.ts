import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';
import { API } from '../Authenfication.constants';
import { AuthenticationService } from '../Authenfication.service';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
    constructor(private readonly authService: AuthenticationService) {
        super({
            clientID: API.UID,
            clientSecret: API.KEY,
            callbackURL: API.URL,
            profileFields: {
                'id': function (obj) { return String(obj.id); },
                'username': 'login',
                'displayName': 'displayname',
                'name.familyName': 'last_name',
                'name.givenName': 'first_name',
                'profileUrl': 'url',
                'emails.0.value': 'email',
                'phoneNumbers.0.value': 'phone',
                'photos.0.value': 'image_url'
            }});
    }

    async validate(accessToken: string, refreshToken: string, profile: any, done: any) {
        const { id, login, displayname } = profile;
        const user = {
            id: id,
            login: login,
            username: displayname,
        };
        done(null, user);
        return profile;
    }
}
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { API } from '../Interface-42/constants';
import { ResponceUserInfo, ResponceAccessToken } from './Interface/Interface42';

@Injectable()
export class Client42ApiService {
    constructor(private httpService: HttpService) {}

    async redirectUrl(): Promise<string> {
        return "https://api.intra.42.fr/oauth/authorize?client_id=" + API.UID + "&redirect_uri=" + API.URL + "&response_type=code";
    }

    async getAccessToken(code: string): Promise<string> {
        return await this.httpService.post<ResponceAccessToken>('https://api.intra.42.fr/oauth/token', {
            grant_type: 'authorization_code',
            client_id: API.UID,
            client_secret: API.KEY,
            code: code,
            redirect_uri: API.URL,
        }).toPromise().then(response => {
            console.log(response.data);
            return response.data.access_token;
        }
        );

    }
    async getUserInfo(accessToken: string): Promise<ResponceUserInfo> {
        return await this.httpService.get<ResponceUserInfo>('https://api.intra.42.fr/v2/me', {
            headers: {
                "Authorization": "Bearer " + accessToken,
            },
        }).toPromise().then(response => {
            console.log(response.data);
            return response.data;
        }
        );
    }
}
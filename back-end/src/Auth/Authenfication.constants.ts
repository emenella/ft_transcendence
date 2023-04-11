import * as dotenv from 'dotenv';

dotenv.config();

export const jwtConstants = {
    secret: process.env.JWT,
};

export const API = {
    UID: process.env.API_UID,
    KEY: process.env.API_SECRET,
    URL: process.env.API_URL,
};

export const passPhrase = {
    secret: process.env.PASSPHRASE,
};

export const serverOption = {
    protocole: process.env.PROTOCOL,
    hostname: process.env.HOSTNAME,
    port: process.env.PORT_SSL,
}
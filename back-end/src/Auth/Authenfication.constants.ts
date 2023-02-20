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

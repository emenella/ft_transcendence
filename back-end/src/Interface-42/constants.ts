import * as dotenv from 'dotenv';

dotenv.config();

export const API = {
    UID: process.env.API_UID,
    KEY: process.env.API_KEY,
    URL: process.env.API_URL,
};
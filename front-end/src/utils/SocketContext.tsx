import { createContext } from "react";
import { getToken } from "../api/Api";
import io, { Socket } from 'socket.io-client'
import { url } from '../api/Api';

export const SocketContext = createContext<Socket  | undefined>(undefined);
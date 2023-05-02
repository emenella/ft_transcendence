import { createContext } from "react";
import { Socket } from "socket.io-client"
import { socket } from "../api/JwtCookie";

export const SocketContext = createContext<Socket  | undefined>(socket);

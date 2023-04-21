import { createContext } from "react";
import { getJwtCookie } from "../api/JwtCookie";
import io, { Socket } from "socket.io-client"
import { url } from "../api/JwtCookie";

export const SocketContext = createContext<Socket  | undefined>(undefined);
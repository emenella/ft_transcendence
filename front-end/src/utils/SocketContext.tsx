import { createContext } from "react";
import { Socket } from "socket.io-client"
import { socket } from "../api/Auth";

export const SocketContext = createContext<Socket>(socket);

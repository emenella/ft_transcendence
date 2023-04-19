import React from "react";
import { createContext } from "react";
import { User } from "./backend_interface";

export const UserContext = createContext<User | undefined>(undefined);

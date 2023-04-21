import { createContext } from "react";
import { User } from "./backendInterface";
import { Dispatch, SetStateAction } from "react";

export interface UserContextType {
	user: User | undefined;
	setUser: Dispatch<SetStateAction<User | undefined>>;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

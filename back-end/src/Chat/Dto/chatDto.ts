import { Socket } from 'socket.io'
import { ELevelInChan } from './chanDto';

export interface UserDataDto
{
	username:		string,
    id:				number,
	is_connected?:	boolean,
	date?:			Date,
	infos?:			any
}

export interface ChatUser 
{
 	socket:		Socket,

    username:	string,
    id:			number
}

export interface CreateChanDto
{
	title:			string,
	isPrivate:		boolean,
	isProtected:	boolean,
	password?:		string,
	isDm:			boolean,
	with?:			number
}

export interface ChanJoinedDTO
{
	id: 				number,
	title:				string,
	private:			boolean,
	protected:			boolean,
	level:				ELevelInChan,
	isDm:				boolean,
	owner:				number
}
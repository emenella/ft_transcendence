export enum ELevelInChan
{
	casual = 0,
	admin = 1,
	owner = 2,
}

export interface UserListDto
{
	username:		string,
    id:				number,
	is_connected:	boolean,
	isMuted:		boolean,
	isBan:			boolean,
	level:			ELevelInChan,
}

export interface ChanListDTO
{
	id:				number;
	title:			string;
	owner:			number;
	has_password:	boolean;
	isDm:			boolean;
}
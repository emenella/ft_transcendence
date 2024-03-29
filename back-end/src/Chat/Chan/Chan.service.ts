import { HttpException, HttpStatus, Injectable, Inject, forwardRef } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Chan, RelationTable } from "./Chan.entity";
import { ChanPasswordService } from "./Chan.password.service";
import { User } from "../../User/entity/User.entity";
import { ChanListDTO, UserListDto, ELevelInChan } from '../Dto/chanDto';
import { UserService } from "../../User/service/User.service";
import { Message } from "../Message/Message.entity";
import { MessageService } from "../Message/Message.service";

@Injectable()
export class ChanService {
    constructor(
        @InjectRepository(Chan)
	    private chanRepo: Repository<Chan>,
        
	    @InjectRepository(RelationTable)
	    private chanRelRepo: Repository<RelationTable>,
	    @Inject(forwardRef(() => UserService)) private readonly userService: UserService,
	    private readonly passwordService: ChanPasswordService,
	    private readonly messageService: MessageService
    ) {}

    async getChanByTitle(title: string) : Promise<Chan | undefined> {
		const ret = await this.chanRepo.findOne({ where: { title: title } })

		if (ret === undefined || ret === null)
			return undefined;

		return ret;
	}

	async getChanById(chanId: number) : Promise<Chan | undefined> {
		const ret = await this.chanRepo.findOne({ where: { id : chanId } })

		if (ret === undefined || ret === null)
			return undefined;

		return ret;
	}

	async getRelOf(chanId: number, userId: number) : Promise<RelationTable | undefined> {
		const ret = await this.chanRelRepo.findOne({ relations : ["user", "chan"],
                    where : { chan: { id : chanId }, user : { id : userId} } })

		if (ret === undefined || ret === null)
			return undefined;

		return ret;
	}

	async getUserLevel(chanId : number, ownerId: number, userId: number) : Promise<ELevelInChan> {
		let level : ELevelInChan;

		if (ownerId === userId)
			level = ELevelInChan.owner;
		else if (await this.isAdmin(chanId, userId))
			level = ELevelInChan.admin;
		else
			level = ELevelInChan.casual;

		return level;
	}

	async isInChan(chan : Chan, userId: number) : Promise<boolean> {
		const ret = await this.getRelOf(chan.id, userId);

		if (ret === undefined || ret === null)
			return false;
		if (ret.ban_expire !== null || ret.isInvite === true)
			return false;

		return true;
	}

	async isAdmin(chanId : number, userId: number) : Promise<boolean> {
		const ret = await this.chanRelRepo.findOne({ relations : ["user", "chan"],
			        where : { chan: { id : chanId }, user : { id : userId}, isAdmin: true } })

		if (ret)
			return true;

		return false;
	}

    async findDm(user1 : User, user2: User): Promise<boolean> {
		const chansDm = await this.chanRepo.find({ where : { isDm: true } });

		for (let c of chansDm)
		{
			const resp = await this.chanRelRepo.find({ relations : ["user", "chan"],
				        where: [ {chan: { id: c.id }, user: {id: user1.id}}, {chan: { id: c.id }, user: {id: user2.id} } ] })
			if (resp.length === 2)
				return true;
		}

		return false;
	}

	async getDm(user1 : User, user2: User): Promise<Chan | undefined> {
		if (!user1 || !user2)
			return;
		const chansDm : Chan[] = await this.chanRepo.find({ where : { isDm: true } });

		for (let c of chansDm) {
			const resp = await this.chanRelRepo.find({	relations : ["user", "chan"],
				        								where: [
															{chan: { id: c.id }, user: {id: user1.id}},
															{chan: { id: c.id }, user: {id: user2.id}}
														] })

			if (resp.length === 2) {
				return c;
			}
		}
		return undefined;
	}

	async createChan(title: string, owner: User, isPrivate: boolean, isProtected: boolean, password_key: string | undefined, isDm: boolean, user2: User) : Promise<string | Chan> {
		let ret = title.split(" ");
		if (ret.length > 1)
			return "chan title must not contain white space"
		title = ret[0];
		if (isDm !== true && title[0] !== '#')
			return "Chan title must begin by '#' !";
		if (isDm !== true && await this.getChanByTitle(title))
			return "Chan already exists";
		if (isDm && user2 === undefined)
			return "User doesn't exist";
		if (isDm && await this.findDm(owner, user2))
			return "DM chan already exists";
		if (isDm !== true && (title.length < 3 || title.length > 16))
			return "Title length must be between 3 and 16";
		if (password_key && (password_key.length < 3 || password_key.length > 16))
			return "Password length must be between 3 and 16";
		
		let chan: Chan = new Chan();

		chan.title			= title;
		chan.owner			= owner
		chan.createdAt  	= new Date();
		chan.isPrivate		= isPrivate;
		chan.isProtected	= isProtected;
		chan.password_key	= (password_key !== undefined) ? await this.passwordService.genHash(password_key) : undefined;
		chan.isDm			= isDm;
		
		chan = await this.chanRepo.save(chan);

		let chanRel: RelationTable = new RelationTable();

		chanRel.chan	= chan;
		chanRel.user	= owner;
		chanRel.isAdmin = true;
		await this.chanRelRepo.save(chanRel);

		if (isDm && owner.id !== user2.id)
		{
			let chanRel2: RelationTable = new RelationTable();

			chanRel2.chan	= chan;
			chanRel2.user	= user2;
			chanRel2.isAdmin = false;
			await this.chanRelRepo.save(chanRel2);
		}

		return chan;
	}
    
	async joinChan(chan: Chan, user: User, password_key: string | null) : Promise<Chan | string> {
        if (chan === undefined || chan === null)
            return ("No such chan !");
		if(chan.isDm === true)
            return ("You can't join dm chan");
		if (await this.checkBan(chan.id, user.id) === true)
            return ("banned !");
		if (await this.isInChan(chan, user.id) === true)
			return ("already in chan !");
        if (chan.password_key && await this.passwordService.isMatch(password_key, chan.password_key) !== true)
			return ("Wrong password !");
        if (chan.isPrivate === true) {
            if (await this.checkInvite(chan.id, user.id) === false)
                return ("Private chan ! You must be invited to join !");
            else
                await this.uninviteUser(chan.id, user.id);
        }
		let rel = await this.getRelOf(chan.id, user.id);

		if (rel !== undefined)
		{
			if (rel.isInvite === true){
				await this.uninviteUser(chan.id, user.id);
			}
		}
            
            
        let chanRel	: RelationTable	=  new RelationTable();
        
        chanRel.chan = chan;
        chanRel.user = user;
        
        await this.chanRelRepo.save(chanRel);
        
        return (chan);
    }

    async joinChanById(chanId: number, user: User, password_key: string | null) : Promise<string | Chan>  {
        const chan = await this.getChanById(chanId);
		if (chan)
			return (await this.joinChan(chan, user, password_key));
		throw new HttpException("Chan doesn't exist", HttpStatus.NOT_FOUND);
	}

	async joinChanByTitle(title: string, user: User, password_key: string | null) : Promise<string | Chan> {
		const chan = await this.getChanByTitle(title);
		if (chan)
		{
			if (chan.isDm === true)
				return ("You can't join dm chan");
			return (await this.joinChan(chan, user, password_key));
		}
		return ("Chan doesn't exist");
	}

	async leaveChanByTitle(title: string, userId: number) : Promise<boolean> {
		const chan = await this.getChanByTitle(title);

		if (chan === undefined || chan === null)
			return false;

		const ret = this.leaveChanById(chan.id, userId);
        if (typeof ret === "string")
            return false;
		return (true);
	}

	async leaveChanById(chanId: number, userId: number) : Promise<undefined | string | number> {
		const chan = await this.getChanById(chanId);
		
		if (chan === undefined || chan === null)
			return "No such chan !";
		if (chan.isDm === true)
			return ("You can't leave dm chan !");
			
		const ret = await this.chanRelRepo.findOne({ relations : ["user", "chan"],
					where : { chan: { id : chan.id }, user : { id : userId} } })
		if (ret === undefined || ret === null)
			return ("your are not in chan");
		await this.chanRelRepo.remove(ret);

		const query = this.chanRelRepo
  			.createQueryBuilder('relation')
  			.where('relation.chanId = :chanId', { chanId })
  			.andWhere('relation.ban_expire IS NULL')
  			.getMany();
		const rels = await query;
		if (rels.length === 0) {
			const messages : Message[] = await this.messageService.getMessagesFromChanId(chan.id);
			const messagesIds : number[] = [];
			messages.forEach((message) => {
				messagesIds.push(message.id);
			})
			await messagesIds.forEach(async (id) => {
				await this.messageService.deleteMessage(id);
			})
			await this.chanRepo.remove(chan);
			return (undefined);
		}
		else if (userId === chan.ownerId) {
			let newOwner : User;
			const rel = await this.chanRelRepo.findOne({ relations : ["chan", "user"],
				        where : { chan : { id : chan.id }, isAdmin: true } })
			if (rel) {
				newOwner = rel.user;
				chan.owner = newOwner;
				this.chanRepo.save(chan);
				return (chan.ownerId);
			}
			else {
				const rel = await this.chanRelRepo.findOne({ relations : ["chan", "user"],
					        where : { chan : { id : chan.id }, ban_expire: undefined } })
				if (rel) {
					rel.mute_expire = undefined;
					rel.isAdmin = true;
					newOwner = rel.user;
					await this.chanRelRepo.save(rel);
					chan.owner = newOwner;
					this.chanRepo.save(chan);
					return (chan.ownerId);
				}
			}
		}
		return (chan.ownerId);
	}

	async leaveDM(chanId: number) : Promise<undefined | string | number> {
		const chan = await this.getChanById(chanId);

		const messages : Message[] = await this.messageService.getMessagesFromChanId(chan.id);
		const messagesIds : number[] = [];
		messages.forEach((message) => {
			messagesIds.push(message.id);
		})
		await messagesIds.forEach(async (id) => {
			await this.messageService.deleteMessage(id);
		})
		await this.chanRepo.remove(chan);
		return (chan.ownerId);
	}

    async checkBan(chanId: number, userId: number) : Promise<boolean> {
		let rel = await this.getRelOf(chanId, userId);

		if (rel === undefined || rel === null)
			return false;
		if (rel.ban_expire === null || rel.ban_expire === undefined)
			return (false);

		if (rel.ban_expire <= new Date())
		{
			await this.chanRelRepo.remove(rel);
			return (false);
		}
		else
			return (true);
	}

	async banUser(chanId: number, senderId: number, banId: number, expires_in: Date) : Promise<string | Chan> {
		const chan = await this.getChanById(chanId);

		if (chan === undefined || chan === null)
			return ("Chan doesn't exist !")
		if (chan.isDm === true)
			return ("You can't do that in dm chan !");
		if (chan.ownerId !== senderId && await this.isAdmin(chan.id, senderId) === false)
			return "No Right !";
		if (await this.isAdmin(chan.id, banId) === true && chan.ownerId !== senderId)
			return "You can't ban chan operator !";
		if (banId === senderId)
			return "you can't ban yourself !"
		if (banId === chan.ownerId)
			return "You can't ban the owner !";

		const rel = await this.getRelOf(chanId, banId);
		if (rel === undefined || rel === null)
			return "User not in chan !";

		rel.ban_expire = expires_in;

		await this.chanRelRepo.save(rel);

		return chan;
	}

	async unbanUser(chanId: number, senderId: number, unbanId: number) : Promise<string | Chan> {
		const chan = await this.getChanById(chanId);

		if (chan === undefined || chan === null)
			return ("Chan doesn't exist !")
		if (chan.isDm === true)
			return ("You can't do that in dm chan !");
		if (chan.ownerId !== senderId && await this.isAdmin(chan.id, senderId) === false)
			return "No Right !";
		if (await this.isAdmin(chan.id, unbanId) === true && chan.ownerId !== senderId)
			return "You can't unban chan operator !";
		if (senderId === unbanId)
			return "You can't unban yourself !";

		const rel = await this.getRelOf(chanId, unbanId);
		if (rel === undefined || rel === null)
			return "User not in chan !";
		if (rel.ban_expire === null || rel.ban_expire === undefined)
			return "User is not Banned !";

		await this.chanRelRepo.remove(rel);
		return chan;
	}

    async checkInvite(chanId: number, userId: number) : Promise<boolean> {
        await this.checkBan(chanId, userId);
		let rel = await this.getRelOf(chanId, userId);

		if (rel === undefined || rel === null)
			return false;

        if (rel.ban_expire !== null && rel.ban_expire !== undefined)
            return false;

        if (rel.isInvite === true)
            return true;
        return false;
	}

	async inviteUser(chanId: number, senderId: number, inviteId: number) : Promise<string | Chan> {
		const chan = await this.getChanById(chanId);
        const user = await this.userService.getUserById(inviteId)

		if (chan === undefined || chan === null)
			return ("Chan doesn't exist !")
        if (user === undefined || user === null)
                return ("User doesn't exist !")
		if (chan.isDm === true)
			return ("You can't do that in dm chan !");
		if (chan.ownerId !== senderId && await this.isAdmin(chan.id, senderId) === false)
			return "No Right !";
		if (await this.isAdmin(chan.id, inviteId) === true && chan.ownerId !== senderId)
			return "You can't invite chan operator !";

		const rel = await this.getRelOf(chanId, inviteId);
		if (rel !== undefined && rel !== null)
			return "User already in chan (or invited/banned) !";

        let chanRel	: RelationTable	=  new RelationTable();
        
        chanRel.chan = chan;
        chanRel.user = user;
        chanRel.isInvite = true;
        
        await this.chanRelRepo.save(chanRel);

		return chan;
	}

	async uninviteUser(chanId: number, userId: number) : Promise<string | Chan> {
		const chan = await this.getChanById(chanId);

		if (chan === undefined || chan === null)
			return ("Chan doesn't exist !")
		if (chan.isDm === true)
			return ("You can't do that in dm chan !");

		const rel = await this.getRelOf(chanId, userId);
		if (rel === undefined || rel === null)
			return "User not in chan !";
		if (rel.isInvite === false)
			return "User is not invited !";

		await this.chanRelRepo.remove(rel);
		return chan;
	}

	async chanChangePass(id: number, userId: number, password: string | null) {
		const chan = await this.getChanById(id);

		if (chan === undefined || chan === null)
			return ("Chan doesn't exist !")
		if (chan.isDm === true)
			return ("You can't do that in dm chan !");
		if (password !== null && (password.length > 16))
			return ("Password must be less than 16 characters long");
		if (chan.ownerId !== userId)
			return "Only the chan owner can change the password !";
		if (password === null)
			chan.password_key = null;
		else
			chan.password_key = await this.passwordService.genHash(password);

		await this.chanRepo.save(chan);
	}

	async isMute(id: number, userId: number) : Promise<boolean> {
		let rel = await this.getRelOf(id, userId);

		if (rel === undefined || rel.mute_expire === undefined)
			return false;

		if (rel.mute_expire <= new Date())
		{
			rel.mute_expire = undefined;
			await this.chanRelRepo.save(rel);
			return (false)
		}
		else
			return (true);
	}

	async chanMute(chanId: number, senderId : number, muteId: number, mute_expire: Date): Promise<string | boolean> {
		const chan = await this.getChanById(chanId);

		if (chan === undefined || chan === null)
			return ("Chan doesn't exist !")
		if (chan.isDm === true)
			return ("You can't do that in dm chan !");
		if (chan.ownerId !== senderId && await this.isAdmin(chan.id, senderId) === false)
			return "No Right !";
		if (senderId === muteId)
			return "You can't mute yourself !"
		if (await this.isAdmin(chan.id, muteId) === true && chan.ownerId !== senderId)
			return "You can't mute chan operator !";
		if (muteId === chan.ownerId)
			return "You can't mute the owner !";

		const rel = await this.getRelOf(chanId, muteId);
		if (rel === undefined || rel === null)
			return "User not in chan !";
		rel.mute_expire = mute_expire;

		await this.chanRelRepo.save(rel);
		return (true);
	}

	async chanUnmute(id: number, senderId : number, unmuteId: number): Promise<string | boolean> {
		const chan = await this.getChanById(id);

		if (chan === undefined || chan === null)
			return ("Chan doesn't exist !")
		if (chan.isDm === true)
			return ("You can't do that in dm chan !");
		if (chan.ownerId !== senderId && await this.isAdmin(chan.id, senderId) === false)
			return "No Right !";
		if (senderId === unmuteId)
			return "You can't unmute yourself !"
		if (await this.isAdmin(chan.id, unmuteId) === true && chan.ownerId !== senderId)
			return "You can't unmute chan operator !";

		const rel = await this.getRelOf(id, unmuteId);
		if (rel === undefined || rel === null)
			return "User not in chan !";
		if (await this.isMute(id, unmuteId) === false)
			return "User not muted !"
		rel.mute_expire = new Date();

		await this.chanRelRepo.save(rel);
		return (true);
	}

	async setIsAdmin(id: number, senderId: number, userToSetId: number, isAdmin: boolean) : Promise<string | undefined> {
		const chan = await this.getChanById(id);

		if (chan === undefined || chan === null)
			return "Unknown chan";
		if (chan.isDm === true)
			return ("You can't do that in dm chan !");
		if (chan.ownerId !== senderId)
			return "Only the chan owner can promote/demote !";

		if (chan.ownerId === userToSetId)
			return "Owner can't be demote !"
		const ret = await this.getRelOf(id, userToSetId);

		if (ret === undefined || ret === null)
			return "User need to be in chan !";

		ret.isAdmin = isAdmin;
		await this.chanRelRepo.save(ret);
		return undefined;
	}
    
    async userListOfChan(chanId: number, userId: number) : Promise<UserListDto[] | string> {
		const chan = await this.getChanById(chanId);

		if (chan === undefined || chan === null)
			return ("no chan exist");

		if (await this.isInChan(chan, userId) === false)
			return ("not in chan");

		const rel = await this.chanRelRepo.find({ relations: ["user", "chan"],
			        where: { chan: { id : chan.id } } })

		let ret : UserListDto[];
		ret = [];

		for(const r of rel) {
			await this.checkBan(chan.id, r.user.id);
            if (r !== undefined && r !== null && r.isInvite === false) {
			    ret.push({
			    	id :	        r.user.id,
			    	username:		r.user.username,
			    	level:			await this.getUserLevel(chan.id, chan.ownerId, r.user.id),
			    	isMuted:		await this.isMute(chan.id, r.user.id),
			    	isBan:			r.ban_expire !== null,
			    	is_connected:	false
			    })
            }
		}

		return (ret);
	}

    async chanListOfUser(userId : number) : Promise<ChanListDTO[]> {
		const chan_list = await this.chanRelRepo.find({ relations : ["user", "chan"],
			            where : { user : { id : userId} } })

		let ret : ChanListDTO[];

		ret = [];

		if (chan_list === null || chan_list === undefined)
			return [];

		for (let rel of chan_list) {
			let chan = rel.chan;

			if (chan.isDm) {
				const rel2 = await this.chanRelRepo.find({ relations : ["user", "chan"],
					        where : { chan: { id: chan.id } } })

				rel2.forEach(r => {
					if (r.user.id !== userId)
					{
						chan.title = r.user.username;
						chan.owner = r.user;
					}
				});
			}

			if (rel.ban_expire === null && rel.isInvite === false) {
				ret.push({
					id:				chan.id,
					title:			chan.title,
					owner:			chan.ownerId,
					has_password:	chan.password_key !== null,
					isDm:			chan.isDm,
				});
			}
		}

		return ret;
	}

	async publicChanList() : Promise<ChanListDTO[]> {
		const chan_list = await this.chanRepo.find({ where : { isPrivate : false } })

		let ret : ChanListDTO[];

		ret = [];

		if (!chan_list)
			return [];

		chan_list.forEach((chan) => {
			ret.push({
				id: chan.id,
				title: chan.title,
				owner: chan.ownerId,
				has_password: chan.password_key !== null,
				isDm: false,
			})
		});

		return ret;
	}
}
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Chan, RelationTable } from "./Chan.entity";
import { ChanPasswordService } from "./Chan.password.service";
import { User } from "src/Users/entity/User.entity";

@Injectable()
export class ChanService {
    constructor(
        @InjectRepository(Chan)
	    private chanRepo: Repository<Chan>,
        
	    @InjectRepository(RelationTable)
	    private chanRelRepo: Repository<RelationTable>,
        
	    private readonly passwordService: ChanPasswordService
    ) {}

    async getChanByTitle(title: string) : Promise<Chan | undefined> {
		const ret = await this.chanRepo.findOne({ where: { title: title, isDm: false } })

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
		const ret = await this.chanRelRepo.findOne({ relations : ["user", "room"],
                    where : { chan: { id : chanId }, user : { id : userId} } })

		if (ret === undefined || ret === null)
			return undefined;

		return ret;
	}

    /*
    level 0 : owner;
    level 1 : admin;
    level 2 : casu;
    */
	async getUserLevel(chanId : number, ownerId: number, userId: number) : Promise<number> {
		let level : number;

		if (ownerId === userId)
			level = 0;
		else if (await this.isAdmin(chanId, userId))
			level = 1;
		else
			level = 2;

		return level;
	}

	async isInChan(chan : Chan, userId: number) : Promise<boolean> {
		const ret = await this.getRelOf(chan.id, userId);

		if (ret === undefined || ret === null)
			return false;
		if (ret.ban_expire !== null)
			false

		return true;
	}

	async isAdmin(chanId : number, userId: number) : Promise<boolean> {
		const ret = await this.chanRelRepo.findOne({ relations : ["user", "room"],
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
				        where: [ {chan: c, user: user1}, {chan: c, user: user2} ] })
			if (resp.length === 2)
				return true;
		}

		return false;
	}

	async createChan(title: string, owner: User, isPrivate: boolean, password_key: string, isDm: boolean, user2: User) : Promise<string | Chan> {
		let chan	: Chan 			= new Chan();
		let chanRel	: RelationTable	= new RelationTable();

		if (isDm !== true && await this.getChanByTitle(title))
			return "Room already exists";
		if (isDm && user2 === undefined)
			return "User doesn't exist";
		if (isDm && await this.findDm(owner, user2))
			return "DM room already exists";
		if (title.length < 3 || title.length > 16)
			return "Title length must be between 3 and 16";
		if (password_key && password_key.length > 16)
			return "Password length must be less than 16";

		chan.title			= title;
		chan.owner.id		= owner.id;
		chan.createdAt  	= new Date();
		chan.isPrivate		= isPrivate;
		chan.password_key	= (password_key !== undefined) ? await this.passwordService.genHash(password_key) : null;
		chan.isDm			= isDm;

		chan = await this.chanRepo.save(chan);

		chanRel.chan	= chan;
		chanRel.user	= owner;
		chanRel.isAdmin = true;

		if (isDm && owner.id !== user2.id)
		{
			let chanRel2	: RelationTable	= new RelationTable();

			chanRel2.chan	= chan;
			chanRel2.user	= user2;
			chanRel.isAdmin = false;
			chanRel2.isAdmin = false;
			await this.chanRelRepo.save(chanRel2);
		}

		await this.chanRelRepo.save(chanRel);

		return chan;
	}
    
	async joinChan(chan: Chan, user: User, password_key: string | null) : Promise<Chan | string> {
        if (chan === undefined || chan === null)
            return ("no chan exist !");
		if(chan.isDm === true)
            return ("You can't join dm chan");
		if (await this.checkBan(chan.id, user.id) === true)
            return ("banned !");
		if (await this.isInChan(chan, user.id) === true)
			return ("already in room !");
        if (await this.passwordService.isMatch(password_key, chan.password_key) !== true)
			return ("Wrong password !");
            
            
        let chanRel	: RelationTable	=  new RelationTable();
        
        chanRel.chan = chan;
        chanRel.user = user;
        
        await this.chanRelRepo.save(chanRel);
        
        return (chan);
    }  

    async joinChanById(chanId: number, user: User, password_key: string) : Promise<string | Chan>  {
        const chan = await this.getChanById(chanId);

		return (await this.joinChan(chan, user, password_key));
	}

	async joinChanByTitle(title: string, user: User, password_key: string) : Promise<string | Chan> {
		const room = await this.getChanByTitle(title);

		return (await this.joinChan(room, user, password_key));
	}

	async leaveChanByTitle(title: string, userId: number) : Promise<boolean> {
		const room = await this.getChanByTitle(title);

		if (room === undefined || room === null)
			return false;

		const ret = await this.chanRelRepo.findOne({ relations : ["user", "room"],
			        where : { room: { id : room.id }, user : { id : userId} } })
		if (ret)
			this.chanRelRepo.remove(ret);

		return (true);
	}

	async leaveChanById(chanId: number, userId: number) : Promise<undefined | string | number> {
		const chan = await this.getChanById(chanId);

		if (chan === undefined || chan === null)
			 return "no chan !";
		if (chan.isDm === true)
			return ("You can't leave dm chan !");

		const ret = await this.chanRelRepo.findOne({ relations : ["user", "chan"],
			        where : { chan: { id : chan.id }, user : { id : userId} } })
		if (ret === undefined || ret === null)
		    return ("your are not in chan");

		await this.chanRelRepo.remove(ret);
		const rels = await this.chanRelRepo.find({ relations : ["chan"],
			        where : { chan : { id : chan.id }, ban_expire: null } })

		if (rels.length === 0)
		{
			await this.chanRelRepo.createQueryBuilder()
				.relation("chan")
				.of({id: chanId})
				.delete()
				.execute();

			await this.chanRepo.remove(chan);
		}
		else if (userId === chan.owner.id)
		{
			let newOwner : User;
			const rel = await this.chanRelRepo.findOne({ relations : ["chan", "user"],
				        where : { chan : { id : chan.id }, isAdmin: true } })
			if (rel)
			{
				newOwner = rel.user;
			}
			else
			{
				const rel = await this.chanRelRepo.findOne({ relations : ["chan", "user"],
					        where : { chan : { id : chan.id }, ban_expire: null } })
				rel.mute_expire = null;
				rel.isAdmin = true;
				newOwner = rel.user;

				await this.chanRelRepo.save(rel);
			}
			chan.owner = newOwner;
            chan.owner.id = newOwner.id;
			this.chanRepo.save(chan);
			return (chan.owner.id);
		}
		return (undefined);
	}
}
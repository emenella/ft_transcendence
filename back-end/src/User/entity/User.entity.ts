import { Chan } from '../../Chat/Chan/Chan.entity';
import { RelationTable } from '../../Chat/Chan/Chan.entity';
import { Message } from '../../Chat/Message/Message.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Match } from './Match.entity';
import { Connection } from './Connection.entity';
import { Avatar } from './Avatar.entity';
import { UserStatus } from '../service/User.service';

@Entity()
export class User {
	//~~ INFO
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true, nullable: true})
    username: string;

    @OneToOne(() => Avatar, avatar => avatar.user, {cascade: true})
    avatar: Avatar;

    @OneToOne(() => Connection, connection => connection.user, {cascade: true})
    connection: Connection;

    @Column({type: 'boolean', default: false})
    isProfileComplete: boolean;

	@Column({type: 'boolean', default: false})
    is2FAActivated: boolean;

	@Column({default: UserStatus.Disconnected})
    status: number;

    //~~ GAME AND STATS
    @OneToMany(() => Match, matchHistory => matchHistory.winner, {cascade: true})
    winMatch: Match[];
	
    @OneToMany(() => Match, matchHistory => matchHistory.looser, {cascade: true})
    looseMatch: Match[];

	// float in 
	@Column({default: 1000})
	elo: number;
	
    //~~ CHAT
    @OneToMany(() => Chan, (target: Chan) => target.owner)
    ownedChans: Chan[];

    @OneToMany(() => RelationTable, (rel: RelationTable) => rel.user)
    relations: RelationTable[];

    @OneToMany(() => Message, (target: Message) => target.author)
    messages: Message[];
	
    //~~ FRIENDS AND BLACKLIST
	@ManyToMany(() => User)
    @JoinTable()
    friends: User[];

	@ManyToMany(() => User)
    @JoinTable()
    friend_invites: User[];

    @ManyToMany(() => User)
    @JoinTable()
    blacklist: User[];
}
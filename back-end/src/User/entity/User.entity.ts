import { Chan } from '../../Chat/Chan/Chan.entity';
import { RelationTable } from '../../Chat/Chan/Chan.entity';
import { Message } from '../../Chat/Message/Message.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Match } from './Match.entity';
import { Connection } from './Connection.entity';
import { UserStatus } from '../service/User.service';
import { Socket } from 'socket.io';

@Entity()
export class User {
    socket: Socket | undefined = undefined;

	//~~ INFO
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true, nullable: true})
    username: string;

	@Column({ default: "avatars/stormtrooper.jpg" })
	avatarPath: string;

    @OneToOne(() => Connection, connection => connection.user, {cascade: true})
    connection: Connection;

    @Column({type: 'boolean', default: false})
    isProfileComplete: boolean;

	@Column({type: 'boolean', default: false})
    is2FAActivated: boolean;

	@Column({default: UserStatus.Disconnected})
    status: number;

    @Column({default: "white"})
    color: string;

    //~~ GAME AND STATS
    @OneToMany(() => Match, match => match.winner, {cascade: true})
    winMatch: Match[];
	
    @OneToMany(() => Match, match => match.loser, {cascade: true})
    loseMatch: Match[];

	// float in 
	@Column({default: 1000})
	elo: number;
	
    //~~ CHAT
    @OneToMany(() => Chan, channel => channel.owner)
    ownedChans: Chan[];

    @OneToMany(() => RelationTable, relationTable => relationTable.user)
    relations: RelationTable[];

    @OneToMany(() => Message, message => message.author)
    messages: Message[];
	
    //~~ FRIENDS AND BLACKLIST
	@ManyToMany(() => User)
    @JoinTable()
    friends: User[];

	@ManyToMany(() => User)
    @JoinTable()
    friend_requests: User[];

    @ManyToMany(() => User)
    @JoinTable()
    blacklist: User[];
}

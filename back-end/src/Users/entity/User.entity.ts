import { Chan } from '../../Chat/Chan/Chan.entity';
import { RelationTable } from '../../Chat/Chan/Chan.entity';
import { Message } from '../../Chat/Message/Message.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { MatchHistory } from './History.entity';
import { Connection } from './Connection.entity';
import { Avatar } from './Avatar.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true, nullable: true})
    username: string;

    @OneToOne(() => Connection, connection => connection.user, {cascade: true})
    connection: Connection;

    // TODO chatroom
    @OneToMany(() => Chan, (target: Chan) => target.owner)
    ownedChans: Chan[];

    @OneToMany(() => RelationTable, (rel: RelationTable) => rel.user)
    relations: RelationTable[];

    @OneToMany(() => Message, (target: Message) => target.author)
    messages: Message[];
    
    // TODO friends
    // TODO match history
    @OneToOne(() => Avatar, avatar => avatar.user, {cascade: true})
    avatar: Avatar;

    @Column('boolean', {default: false})
    isProfileComplete: boolean;

    // float in 
    @Column({default: 1000})
    elo: number;

    @OneToMany(() => MatchHistory, matchHistory => matchHistory.winner, {cascade: true})
    winMatch: MatchHistory[];

    @OneToMany(() => MatchHistory, matchHistory => matchHistory.looser, {cascade: true})
    looseMatch: MatchHistory[];

    // default []
	@ManyToMany(() => User)
    @JoinTable()
    friends: User[];

    // default []
	@ManyToMany(() => User)
    @JoinTable()
    friend_invites: User[];

    @ManyToMany(() => User)
    @JoinTable()
    blacklist: User[];
}
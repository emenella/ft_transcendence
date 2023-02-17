import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToMany,
    JoinTable,
    OneToMany,
    OneToOne
} from 'typeorm';
import { Connection } from './Connection.entity';
import { Chan, RelationTable } from '../../Chat/Chan/Chan.entity';
import { Message } from '../../Chat/Message/Message.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    login: string;

    @Column({nullable: true})
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
}
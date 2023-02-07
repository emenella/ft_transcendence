import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToMany,
    JoinTable,
    OneToMany
} from 'typeorm';
import { Chan } from '../Chat/Chan.entity';
import { Message } from '../Chat/Message/Message.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    login: string;

    @Column()
    username: string;

    // TODO chatroom
    @OneToMany(() => Chan, (target) => target.owner)
    ownedChans: Chan[];

    @ManyToMany(() => Chan)
    @JoinTable()
    chans: Chan[];

    @ManyToMany(() => Chan)
    @JoinTable()
    admChans: Chan[];

    @ManyToMany(() => Chan)
    @JoinTable()
    invitedChans: Chan[];

    @OneToMany(() => Message, (target) => target.author)
    messages: Message[];

    // TODO friends
    // TODO match history
}
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
    RelationId,
} from 'typeorm';
import { User } from '../../User/entity/User.entity';
import { Chan } from '../Chan/Chan.entity';

@Entity()
export class Message {
    @PrimaryGeneratedColumn('uuid')
    id: number;

    @CreateDateColumn()
    date: Date;

    @Column()
    authorName: string;

    @Column()
    content: string;

    @ManyToOne(() => User, (user: User) => user.messages)
    @JoinColumn()
    author: User;

    @RelationId((self: Message) => self.author)
    readonly authorId: User['id'];

    @ManyToOne(() => Chan, (chan: Chan) => chan.messages)
    @JoinColumn()
    channel: Chan;

    @RelationId((self: Message) => self.channel)
    readonly channelId: Chan['id'];
}
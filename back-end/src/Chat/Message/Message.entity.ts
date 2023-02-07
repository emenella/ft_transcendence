import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
    RelationId,
} from 'typeorm';
import { User } from 'src/Users/User.entity';
import { Chan } from '../Chan.entity';

@Entity()
export class Message {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    date: number;

    @Column()
    content: string;

    @ManyToOne(() => User, (user) => user.messages)
    @JoinColumn()
    author: User;

    @RelationId((self: Message) => self.author)
    readonly authorId: User['id'];

    @ManyToOne(() => Chan, (chan) => chan.messages)
    @JoinColumn()
    channel: Chan;

    @RelationId((self: Message) => self.channel)
    readonly channelId: Chan['id'];
}
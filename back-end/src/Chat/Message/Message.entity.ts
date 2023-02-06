import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { User } from 'src/Users/User.entity';
import { Chan } from '../Chan.entity';

@Entity()
export class Message {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    date: number;

    @Column()
    content: string;

    @ManyToOne(() => User, (user) => user.messages)
    @JoinColumn()
    author: User;

    @RelationId((self: User) => self.author)
    readonly authorId: User['id'];

    @ManyToOne(() => Chan, (chan) => chan.messages)
    @JoinColumn()
    channel: Chan;

    @RelationId((self: Chan) => self.channel)
    readonly channelId: Chan['id'];
}
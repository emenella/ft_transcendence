import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
    RelationId,
    ManyToMany,
    JoinTable,
    OneToMany
} from 'typeorm';
import { User } from 'src/Users/User.entity';
import { Message } from './Message/Message.entity';


@Entity()
export class Chan {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column()
    mode: string;

    @Column()
    password: string;

    @CreateDateColumn()
    createdAt: number;

    @ManyToOne(() => User, (user) => user.ownedChans)
    @JoinColumn()
    owner: User;

    @RelationId((self: Chan) => self.owner)
    readonly ownerId: User['id'];

    @ManyToMany(() => User)
    @JoinTable()
    users: User[];

    @ManyToMany(() => User)
    @JoinTable()
    admUsers: User[];

    @ManyToMany(() => User)
    @JoinTable()
    invitedUsers: User[];

    @OneToMany(() => Message, (message) => message.channel)
    @JoinColumn()
    messages: Message[];
}
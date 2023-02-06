import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { User } from 'src/Users/User.entity';
import { Message } from './Message/Message.entity';


@Entity()
export class Chan {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    lastName: string;

    @Column()
    age: number;

    @ManyToOne(() => User, (user) => user.ownedChans)
    @JoinColumn()
    owner: User;

    @RelationId((self: User) => self.owner)
    readonly ownerId: User['id'];

    @ManyToMany(() => User)
    @JoinTable()
    users: User[];

    @ManyToMany(() => User)
    @JoinTable()
    admUsers: User[];

    @OneToMany(() => Message, (target) => target.channel)
    messages: Message[];
}
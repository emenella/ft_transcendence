import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
    RelationId,
    OneToMany
} from 'typeorm';
import { User } from '../../Users/entity/User.entity';
import { Message } from '../Message/Message.entity';


@Entity()
export class Chan {
    @PrimaryGeneratedColumn('uuid')
    id: number;

    @CreateDateColumn()
    createdAt: Date;

    @Column()
    title: string;

    @Column({default: false})
	isPrivate : boolean;

    @Column({default: false})
	isProtected : boolean;

	@Column({ nullable: true, type: 'varchar' })
	password_key : string | undefined | null;

	@Column({default: false})
	isDm : boolean;

    @ManyToOne(() => User, (user: User) => user.ownedChans)
    @JoinColumn()
    owner: User;

    @RelationId((self: Chan) => self.owner)
    readonly ownerId: User['id'];

    @OneToMany(() => RelationTable, (rel: RelationTable) => rel.chan)
    @JoinColumn()
    relations: RelationTable[];

    @OneToMany(() => Message, (message: Message) => message.channel)
    @JoinColumn()
    messages: Message[];
}

@Entity()
export class RelationTable
{
    @PrimaryGeneratedColumn('uuid')
    id: number;

    @ManyToOne(() => Chan)
	@JoinColumn()
	chan: Chan;

	@ManyToOne(() => User)
	@JoinColumn()
	user: User;

	@Column({default: false})
	isAdmin: boolean;

    @Column({default: false})
	isInvite: boolean;

	@Column({ nullable: true })
	mute_expire: Date | null;

	@Column({ nullable: true })
	ban_expire: Date | null;
}
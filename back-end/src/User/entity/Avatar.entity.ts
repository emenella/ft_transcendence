import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User.entity";

@Entity()
export class Avatar {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ default: "avatars/stormtrooper.jpg" })
	path: string;

	@ManyToOne(() => User, user => user.avatar)
	@JoinColumn({ name: 'user_id' })
	user: User;
}

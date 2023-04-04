import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User.entity";

@Entity()
export class Avatar {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({default: "../../../../front-end/src/assets/stormtrooper.jpg"})
    path: string;

    @ManyToOne(() => User, user => user.avatar)
    @JoinColumn({ name: 'user_id' })
    user: User;
}
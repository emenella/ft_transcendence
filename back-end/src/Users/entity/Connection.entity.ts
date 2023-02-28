import { Entity, Column, PrimaryGeneratedColumn, OneToMany, OneToOne, JoinColumn } from "typeorm";
import { User } from "./User.entity";

@Entity()
export class Connection {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => User, user => user.connection, {onDelete: 'CASCADE'})
    @JoinColumn()
    user: User;

    @Column({nullable: true})
    otp: string;

    @Column({nullable: true})
    id42: number;
}
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm";
import { User } from "./User.entity";

@Entity()
export class Connection {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => User, user => user.connection, {onDelete: 'CASCADE'})
    @JoinColumn()
    user: User;

    @Column({nullable: true, type: 'varchar'})
    otp: string | undefined;

    @Column({nullable: true, type: 'varchar'})
    iv: string | undefined;

    @Column({nullable: true, type: 'int'})
    id42: number | undefined;
}
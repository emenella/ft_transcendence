import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { Connection } from './Connection.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true, nullable: true})
    login: string;

    @OneToOne(() => Connection, connection => connection.user, {cascade: true})
    connection: Connection;

    // TODO chatroom
    // TODO friends
    // TODO match history
}
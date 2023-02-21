import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User.entity";

@Entity()
export class MatchHistory {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('int', { array: true, default: [] })
    scores: number[];

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    date: Date;

    @ManyToOne(() => User, user => user.winMatch)
    @JoinColumn({ name: 'user_id' })
    winner: User;

    @ManyToOne(() => User, user => user.looseMatch)
    @JoinColumn({ name: 'user_id' })
    loser: User;
}

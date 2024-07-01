import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('accounts')
export class Account {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    password!: string;

    @Column()
    activeAt!: Date;
}
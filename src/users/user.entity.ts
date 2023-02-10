import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Exclude} from 'class-transformer';
import {Todo} from "../todo/todo.entity";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    @Exclude()
    password: string;

    @OneToMany(() => Todo, (todo) => todo.user)
    todos: Todo[];
}

import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Todo} from "./todo.entity";
import {Repository} from "typeorm";
import {EntityDoesNotExistError} from "../_classes/errors/entity-does-not-exist.error";

@Injectable()
export class TodoService {

    constructor(
        @InjectRepository(Todo) private repo: Repository<Todo>
    ) {
    }

    public async create(todo: Todo): Promise<Todo> {
        const _todo = this.repo.create({...todo});
        return this.repo.save(_todo);
    }

    public async update(id: number, toUpdate: Partial<Todo>): Promise<Todo> {
        const todo = await this.repo.findOneBy({ id });

        if (!todo) {
            throw new EntityDoesNotExistError();
        }

        await this.repo.update(id, toUpdate);

        return this.repo.findOneBy({ id });
    }

    public async delete(id: number): Promise<Todo> {
        const todo = await this.repo.findOneBy({ id });

        if (!todo) {
            throw new EntityDoesNotExistError();
        }

        await this.repo.delete({ id });

        return todo;
    }

    public async findAllByUserId(userId: number): Promise<Todo[]> {
        return this.repo.findBy({ user: { id: userId }});
    }

}

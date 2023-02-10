import {Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Request, UseGuards} from "@nestjs/common";
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";
import {CreateTodoDTO} from "./dtos/createTodo.dto";
import {UpdateTodoDTO} from "./dtos/updateTodo.dto";
import {Todo} from "./todo.entity";
import {TodoService} from "./todo.service";
import {EntityDoesNotExistError} from "../_classes/errors/entity-does-not-exist.error";

@UseGuards(JwtAuthGuard)
@Controller('todo')
export class TodoController {

    constructor(
        private todoService: TodoService,
    ) {
    }

    @Post()
    public async create(
        @Request() req,
        @Body() dto: CreateTodoDTO
    ): Promise<Todo> {
        const toCreate = {
            text: dto.text,
            isCompleted: false,
            user: req.user
        } as Todo;

        return this.todoService.create(toCreate);
    }

    @Patch(':id')
    public async update(
        @Param('id') id,
        @Request() req,
        @Body() dto: UpdateTodoDTO
    ): Promise<Todo> {
        const toUpdate = {
            text: dto.text,
            isCompleted: dto.isCompleted
        } as Todo;

        try {
            return this.todoService.update(id, toUpdate);
        } catch (err) {
            if (err instanceof EntityDoesNotExistError) {
                throw new NotFoundException('Entity does not exist');
            }
        }
    }

    @Get()
    public async findAllByUser(
        @Request() req
    ): Promise<Todo[]> {
        return this.todoService.findAllByUserId(req.user.id);
    }

    @Delete(':id')
    public async delete(
        @Param('id') id,
        @Request() req
    ): Promise<Todo> {
        try {
            return this.todoService.delete(id);
        } catch (err) {
            if (err instanceof EntityDoesNotExistError) {
                throw new NotFoundException('Entity does not exist');
            }
        }
    }

}

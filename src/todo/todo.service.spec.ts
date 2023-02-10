import {Test, TestingModule} from '@nestjs/testing';
import {getRepositoryToken} from "@nestjs/typeorm";
import { TodoService } from './todo.service';
import { Todo } from './todo.entity';
import { EntityDoesNotExistError } from '../_classes/errors/entity-does-not-exist.error';

export const repositoryMockFactory = jest.fn(() => ({
    findOneBy: jest.fn(entity => entity),
    update: jest.fn(entity => entity),
    delete: jest.fn(entity => entity),
}));

describe('TodoService', () => {
    let service: TodoService;
    let repository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TodoService,
                {
                    provide: getRepositoryToken(Todo),
                    useFactory: repositoryMockFactory
                }
            ],
        }).compile();

        service = module.get<TodoService>(TodoService);
        repository = module.get(getRepositoryToken(Todo));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });


    describe('update', () => {
        it('should throw entity does not exist exception when todo does not exist', async () => {
            repository.findOneBy.mockReturnValue(Promise.resolve(null));
            expect(repository.update).toHaveBeenCalledTimes(0);
            await expect(service.update(1, { text: 'Foo' })).rejects.toThrow(EntityDoesNotExistError);
        });

        it('should call update and return updated entity', async () => {
            repository.findOneBy.mockReturnValue(Promise.resolve({ id: 1, text: 'Foo' }));

            const updated = await service.update(1, {});

            expect(repository.update).toHaveBeenCalledTimes(1);
            expect(updated).toMatchObject({ id: 1, text: 'Foo' });
        });
    });

    describe('delete', () => {
       it ('should throw entity does not exist exception when todo does not exist', async () => {
           repository.findOneBy.mockReturnValue(Promise.resolve(null));
           expect(repository.update).toHaveBeenCalledTimes(0);
           await expect(service.delete(1)).rejects.toThrow(EntityDoesNotExistError);
       });

       it('should call delete and return deleted entity', async () => {
           repository.findOneBy.mockReturnValue(Promise.resolve({ id: 1, text: 'Foo' }));

           const deleted = await service.delete(1);

           expect(repository.delete).toHaveBeenCalledTimes(1);
           expect(deleted).toMatchObject({ id: 1, text: 'Foo' });
       });
    });
});

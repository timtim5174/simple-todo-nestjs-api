import {Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {AuthModule} from './auth/auth.module';
import {User} from "./users/user.entity";
import {UsersModule} from "./users/users.module";
import {Todo} from "./todo/todo.entity";
import {TodoModule} from "./todo/todo.module";

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: 'localhost',
            port: 5432,
            username: 'postgres',
            password: 'secret',
            database: 'todo',
            entities: [User, Todo],
            synchronize: true, // Will create a fresh instance of a database every new start up
        }),
        AuthModule,
        TodoModule,
        UsersModule,
    ]
})
export class AppModule {
}

import {Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "./user.entity";
import {Repository} from "typeorm";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private repo: Repository<User>
    ) {
    }

    public async create(email: string, password: string) {
        const user = this.repo.create({email, password});
        return this.repo.save(user);
    }

    public async findByEmail(email: string) {
        return this.repo.findOneBy({ email });
    }
}

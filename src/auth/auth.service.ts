import {Injectable} from "@nestjs/common";
import {UsersService} from "../users/users.service";
import * as bcrypt from 'bcrypt';
import {JwtService} from "@nestjs/jwt";
import {User} from "../users/user.entity";
import {EmailAlreadyInUseError} from "../_classes/errors/email-already-in-use.error";

@Injectable()
export class AuthService {

    constructor(
        private userService: UsersService,
        private jwtService: JwtService,
    ) {
    }

    public async signup(email: string, password: string) {
        const user = await this.userService.findByEmail(email);

        if (user) {
            throw new EmailAlreadyInUseError();
        }

        const hashed = await bcrypt.hash(password, 10);

        const created = await this.userService.create(email, hashed);

        return this.login(created);
    }

    public async validateUser(email: string, password: string) {
        const user = await this.userService.findByEmail(email);

        if (!user) {
            return null;
        }

        const compare = await bcrypt.compare(password, user.password);

        if (compare) {
            return user;
        }

        return null;
    }

    public async login(user: User) {
        const payload = { sub: user.id, email: user.email };
        return {
            access_token: this.jwtService.sign(payload)
        };
    }
}

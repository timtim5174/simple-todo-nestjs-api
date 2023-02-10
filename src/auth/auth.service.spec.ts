import {AuthService} from "./auth.service";
import {UsersService} from "../users/users.service";
import {Test} from "@nestjs/testing";
import {getRepositoryToken} from "@nestjs/typeorm";
import {User} from "../users/user.entity";
import {PassportModule} from "@nestjs/passport";
import {JwtModule} from "@nestjs/jwt";
import {jwtConstants} from "./constants";
import {EmailAlreadyInUseError} from "../_classes/errors/email-already-in-use.error";

describe('AuthService', () => {
    let authService: AuthService;
    let usersService: UsersService;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [
                PassportModule,
                JwtModule.register({
                    secret: jwtConstants.secret,
                    signOptions: {expiresIn: '3600s'}
                })
            ],
            providers: [
                AuthService,
                UsersService,
                {
                    provide: getRepositoryToken(User),
                    useValue: {}
                },
            ]
        }).compile();

        usersService = moduleRef.get<UsersService>(UsersService);
        authService = moduleRef.get<AuthService>(AuthService);
    });

    it('should be defined', () => {
        expect(authService).toBeDefined();
    });

    describe('signup', () => {
        it('should create a new user when email does not exist', async () => {
            jest.spyOn(usersService, 'create').mockImplementation(() => Promise.resolve({
                id: 1,
                email: 'test@test.de',
                'password': 'hashed',
                todos: []
            }));
            jest.spyOn(usersService, 'findByEmail').mockImplementation(() => Promise.resolve(null));

            const result = await authService.signup('test@test.de', 'secret');

            expect(usersService.findByEmail).toHaveBeenCalledTimes(1);
            expect(usersService.create).toHaveBeenCalledTimes(1);
            expect(result).toBeDefined();
            expect(result).toHaveProperty('access_token');
            expect(result.access_token).toBeDefined();
        });

        it('should throw bad request exception when email is already in use', async () => {
            jest.spyOn(usersService, 'findByEmail').mockImplementation(() => Promise.resolve({
                id: 1,
                email: 'test@test.de',
                'password': 'hashed',
                todos: []
            }));
            await expect(authService.signup('test@test.de', 'secret')).rejects.toThrow(EmailAlreadyInUseError);
        });
    });

    describe('validateUser', () => {
        it('should return user when email & password combination is correct', async () => {
            jest.spyOn(usersService, 'findByEmail').mockImplementation(() => Promise.resolve({
                id: 1,
                email: 'test@test.de',
                password: '$2b$10$k0qX7qLQ2V3/25Q/DPlXseNfsHeXvonQXn8ZY4M6l5Lfhe7nu2X6S',
                todos: []
            }));

            const result = await authService.validateUser('test@test.de', 'asfoherhasf');

            expect(result).toBeDefined();
            expect(result).toMatchObject({
                id: 1,
                email: 'test@test.de',
                password: '$2b$10$k0qX7qLQ2V3/25Q/DPlXseNfsHeXvonQXn8ZY4M6l5Lfhe7nu2X6S'
            });
        });

        it('should return null when password do not compare', async () => {
            jest.spyOn(usersService, 'findByEmail').mockImplementation(() => Promise.resolve({
                id: 1,
                email: 'test@test.de',
                password: '$2b$10$k0qX7qLQ2V3/25Q/DPlXseNfsHeXvonQXn8ZY4M6l5Lfhe7nu2X6S',
                todos: []
            }));

            const result = await authService.validateUser('test@test.de', 'foo');

            expect(result).toBeNull();
        });

        it('should return null when user has not been found', async () => {
            jest.spyOn(usersService, 'findByEmail').mockImplementation(() => Promise.resolve(null));

            const result = await authService.validateUser('test@test.de', 'foo');

            expect(result).toBeNull();
        });
    });
    describe('login', () => {
        it('should return object with access token', async () => {
            const result = await authService.login({id: 1, email: 'test@test.de', password: 'hashed', todos: []});
            expect(result).toHaveProperty('access_token');
            expect(result.access_token).toBeDefined();
        });
    });
});

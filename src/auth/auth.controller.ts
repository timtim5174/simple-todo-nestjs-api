import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Post,
    Request,
    Res,
    UseGuards,
    UseInterceptors,
} from "@nestjs/common";
import {AuthService} from "./auth.service";
import {SignupDTO} from "./dtos/signup.dto";
import {LocalAuthGuard} from "./guards/local-auth.guard";

@Controller('auth')
export class AuthController {

    constructor(
        private authService: AuthService,
    ) {
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Post("/signup")
    public async signup(@Body() signupDTO: SignupDTO, @Res() response: Response) {
        const {email, password} = signupDTO;
        try {
            return await this.authService.signup(email, password);
        } catch (err) {
            return await response.json(); // Will use 201 as default for safety reasons
        }
    }

    @UseGuards(LocalAuthGuard)
    @Post("/login")
    public async login(@Request() req) {
        return this.authService.login(req.user);
    }
}

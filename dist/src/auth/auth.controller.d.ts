import { SignInUserDto } from './dto/signin-user.dto';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { JWTPayloadType } from 'src/utils/types';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signUp(signUpUserDto: any): Promise<import("../users/entities/user.entity").User>;
    signIn(SignInUserDto: SignInUserDto, req: Request, res: Response): Promise<void>;
    myAccount(payload: JWTPayloadType): Promise<import("../users/entities/user.entity").User>;
    signout(req: Request, res: Response): Response<any, Record<string, any>>;
}

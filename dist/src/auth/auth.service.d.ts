import { Repository } from 'typeorm';
import { Request, Response } from 'express';
import { User } from 'src/users/entities/user.entity';
import { SignInUserDto } from './dto/signin-user.dto';
import { UsersService } from 'src/users/users.service';
import { EmailService } from 'src/@core/shared/email.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { DeviceHistoryService } from 'src/deviceHistory/device-history.service';
import { RabbitMQService } from 'src/@core/shared/rabbitmq.service';
import { Redis } from 'ioredis';
import { JWTPayloadType } from 'src/@core/utils/types';
import { GetByIdDto } from 'src/products/dto/get-by-id.dto';
export declare class AuthService {
    private readonly userRepository;
    private readonly emailService;
    private readonly config;
    private readonly deviceHistory;
    private readonly jwtService;
    private readonly redisClient;
    private readonly rabbitMQService;
    private readonly authRepository;
    constructor(userRepository: UsersService, emailService: EmailService, config: ConfigService, deviceHistory: DeviceHistoryService, jwtService: JwtService, redisClient: Redis, rabbitMQService: RabbitMQService, authRepository: Repository<User>);
    signUp(signUpUserDto: any): Promise<User>;
    signIn(signInUserDto: SignInUserDto, req: Request, res: Response): Promise<void>;
    verifyToken(token: string): Promise<{
        user: User;
        decoded: JWTPayloadType;
    } | null>;
    checkIfAlreadyLoggedIn(req: Request, res: Response): Promise<void>;
    isPasswordValid(inputPassword: string, storedPassword: string): Promise<boolean>;
    collectDeviceInfo(req: Request, user: User): Promise<import("../deviceHistory/entities/device-history.entity").DeviceHistory>;
    createTokens(user: User, ipAddress: number | null, deviceId: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    refreshToken(refreshToken: string, res: Response): Promise<{
        success: boolean;
        accessToken?: string;
        user?: User;
    }>;
    myAccount({ id }: GetByIdDto): Promise<User>;
    signout(req: Request, res: Response): Response<any, Record<string, any>>;
    sendDeviceData(message: any): Promise<void>;
    getGeolocation(ipAddress: string): Promise<string>;
}

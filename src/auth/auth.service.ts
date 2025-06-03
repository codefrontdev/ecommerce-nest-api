import {
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Request, Response } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';
import { SignInUserDto } from './dto/signin-user.dto';
import { UsersService } from 'src/users/users.service';
import { EmailService } from 'src/shared/email.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { DeviceHistoryService } from 'src/deviceHistory/device-history.service';
import { DeviceUtils } from 'src/utils/device-utils';
import axios from 'axios';
import { RabbitMQService } from 'src/shared/rabbitmq.service';
import { Redis } from 'ioredis';
import { JWTPayloadType } from 'src/utils/types';
import { GetByIdDto } from 'src/products/dto/get-by-id.dto';
import { UserRole } from 'src/utils/enums';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UsersService,
    private readonly emailService: EmailService,
    private readonly config: ConfigService,
    private readonly deviceHistory: DeviceHistoryService,
    private readonly jwtService: JwtService,

    @Inject('REDIS') private readonly redisClient: Redis,
    private readonly rabbitMQService: RabbitMQService,
    @InjectRepository(User) private readonly authRepository: Repository<User>,
  ) {}

  async signUp(signUpUserDto: any) {
    // signUpUserDto.password = await bcrypt.hash(signUpUserDto.password, 10);
    // await this.emailService.sendWelcomeEmail(signUpUserDto.email);

    return this.userRepository.create(signUpUserDto);
  }

  async signIn(signInUserDto: SignInUserDto, req: Request, res: Response) {
    const user = await this.userRepository.findOneByEmail(signInUserDto.email);

    if (user.role === UserRole.CUSTOMER) {
      throw new ForbiddenException(
        'You are not allowed to access this resource',
      );
    }

    // if (
    //   user?.lastFailedAttempt &&
    //   new Date(user?.lastFailedAttempt) > new Date()
    // ) {
    //   throw new UnauthorizedException(
    //     `Your account is temporarily locked. Please try again after ${user.lastFailedAttempt}`,
    //   );
    // }
    await this.checkIfAlreadyLoggedIn(req, res);

    if (
      !(
        user?.password &&
        (await this.isPasswordValid(signInUserDto.password, user.password))
      )
    ) {
      await this.userRepository.updateUser(user.id, {
        failedAttempts: user.failedAttempts + 1,
        lastFailedAttempt: new Date(),
      });
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.status === 'inactive') {
      throw new ForbiddenException('Your account is not active');
    }

    const deviceInfo = await this.collectDeviceInfo(req, user);

    const { accessToken, refreshToken } = await this.createTokens(
      user,
      parseInt(req.ip || '0', 10) || null,
      deviceInfo.id,
    );

    const isProduction = this.config.get<string>('NODE_ENV') === 'production';
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: isProduction, // ضروري للإنتاج لأن الكوكيز لا تُرسل إلا عبر HTTPS
      sameSite: isProduction ? 'none' : 'lax', // None لو كانت الواجهة على دومين مختلف
      maxAge: 1000 * 60 * 15, // مثلًا: 15 دقيقة
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7, // مثلًا: أسبوع
    });
    if (user.failedAttempts > 3) {
      const lockDuration = 15 * 60 * 1000;
      const lockUntil = new Date(Date.now() + lockDuration);

      await this.userRepository.updateUser(user.id, {
        failedAttempts: 0,
        lastFailedAttempt: lockUntil,
      });

      throw new UnauthorizedException(
        'Your account is temporarily locked due to multiple failed login attempts. Please try again later.',
      );
    }

    res.status(200).json({ message: 'Login successful', success: true });
  }

  async verifyToken(
    token: string,
  ): Promise<{ user: User; decoded: JWTPayloadType } | null> {
    const decoded: JWTPayloadType = this.jwtService.verify(token, {
      secret: this.config.get<string>('JWT_SECRET'),
    });

    if (!decoded) {
      throw new UnauthorizedException('Invalid token');
    }

    const user = await this.userRepository.findOne(decoded.id);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    if (user.status === 'inactive') {
      throw new ForbiddenException('Your account is not active');
    }
    // if (user.lastFailedAttempt && user.lastFailedAttempt > new Date()) {
    //   throw new ForbiddenException(
    //     'Your account is temporarily locked. Please try again later.',
    //   );
    // }
    return { user, decoded };
  }

  async checkIfAlreadyLoggedIn(req: Request, res: Response) {
    const existingAccessToken = req.cookies['accessToken'];
    const existingRefreshToken = req.cookies['refreshToken'];

    if (existingAccessToken || existingRefreshToken) {
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');
    }
  }

  async isPasswordValid(inputPassword: string, storedPassword: string) {
    return await bcrypt.compare(inputPassword, storedPassword);
  }

  async collectDeviceInfo(req: Request, user: User) {
    const userAgent = req.headers['user-agent'] || '';
    const ipAddress = req.ip;
    const deviceType = DeviceUtils.detectDeviceType(req);
    const os = DeviceUtils.detectOperatingSystem(req);
    const browser = DeviceUtils.detectBrowser(req);

    const location = await this.getGeolocation(ipAddress || '');

    const deviceHistory = await this.deviceHistory.createDeviceHistory(
      user,
      ipAddress || 'Unknown IP',
      userAgent,
      deviceType,
      os,
      browser,
      location,
    );

    return deviceHistory;
  }

  async createTokens(user: User, ipAddress: number | null, deviceId: string) {
    const payload: JWTPayloadType = {
      id: user.id,
      deviceId: deviceId.toString(),
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.config.get<string>('ACCESS_TOKEN_EXPIRES_IN'),
      secret: this.config.get<string>('JWT_SECRET'),
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.config.get<string>('REFRESH_TOKEN_EXPIRES_IN'),
      secret: this.config.get<string>('JWT_SECRET'),
    });

    return { accessToken, refreshToken };
  }
  async refreshToken(
    refreshToken: string,
    res: Response,
  ): Promise<{ success: boolean; accessToken?: string; user?: User }> {
    if (!refreshToken) {
      return { success: false };
    }

    try {
      const decoded = this.jwtService.verify(refreshToken, {
        secret: this.config.get<string>('JWT_SECRET'),
      });

      const user = await this.userRepository.findOne(decoded.id);
      if (!user) {
        return { success: false };
      }

      const payload: JWTPayloadType = {
        id: user.id,
        role: user.role,
      };
      const accessToken = this.jwtService.sign(payload, {
        expiresIn: this.config.get<string>('ACCESS_TOKEN_EXPIRES_IN'),

        secret: this.config.get<string>('JWT_SECRET'),
      });

      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: this.config.get<string>('NODE_ENV') === 'production',
        sameSite: 'none',
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });

      return { success: true, accessToken, user };
    } catch (error) {
      return { success: false };
    }
  }

  async myAccount({ id }: GetByIdDto) {
    return this.userRepository.findOne(id);
  }

  signout(req: Request, res: Response) {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    return res.status(200).json({ message: 'Logout successful' });
  }

  async sendDeviceData(message: any): Promise<void> {
    try {
      await this.rabbitMQService.sendMessage('deviceQueue', message);
    } catch (error) {
      console.error('Error sending device data to RabbitMQ:', error);
    }
  }

  public async getGeolocation(ipAddress: string): Promise<string> {
    const cachedLocation = await this.redisClient.get(ipAddress);
    if (cachedLocation) return cachedLocation;

    try {
      const response = await axios.get(
        `${this.config.get<string>('GEOLOCATION_API')}/?ip=${ipAddress}`,
      );
      const { city, region, country } = response.data;
      const location = `${city}, ${region}, ${country}`;

      await this.redisClient.set(ipAddress, location, 'EX', 3600);
      return location;
    } catch (error) {
      console.error('Error fetching geolocation:', error);
      return 'Unknown location';
    }
  }
}

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserRole, UserStatus } from 'src/utils/enums';
import { CreateOrderDto } from 'src/orders/dto/create-order.dto';
import { JWTPayloadType } from 'src/utils/types';
import { CreateUserGestDto } from './dto/create-gest-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const hashPassword = await bcrypt.hash(createUserDto.password, 10);

    createUserDto.password = hashPassword;
    const userExists = await this.userRepository.findOneBy({
      email: createUserDto.email,
    });
    if (userExists) {
      throw new UnauthorizedException('User already exists');
    }

    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async findAll(query: {
    status?: string;
    search?: string;
    page?: number;
    pageSize?: number;
  }): Promise<{
    message: string;
    success: boolean;
    users: User[];
    page: number;
    lastPage: number;
    totalPages: number;
    nextPage: number | null;
    pageSize: number;
    total: number;
  }> {
    const { status, search, page = 1, pageSize = 10 } = query;

    const whereConditions: any = {};

    if (status && status !== 'All') {
      whereConditions.status = status;
    }

    if (search) {
      whereConditions.name = Like(`%${search}%`);
    }

    const [users, total] = await this.userRepository.findAndCount({
      where: whereConditions,
      skip: (page - 1) * pageSize,
      take: pageSize,
      relations: ['orders'],
    });

    return {
      message: 'users found successfully',
      success: true,
      page,
      lastPage: Math.ceil(total / pageSize),
      totalPages: Math.ceil(total / pageSize),
      nextPage: page < Math.ceil(total / pageSize) ? page + 1 : null,
      pageSize,
      users,
      total,
    };
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['orders', 'reviews', 'deviceHistory', 'comments'],
      select: [
        'id',
        'firstName',
        'lastName',
        'email',
        'role',
        'status',
        'phone',
        'country',
        'city',
        'postalCode',
        'website',
        'address',
        'profilePicture',
        'failedAttempts',
        'lastFailedAttempt',
        'createdAt',
        'updatedAt',
      ], // حدد الأعمدة التي تريد إرجاعها
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }

  async findOneByEmail(email: string) {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {

    const newData = {
      ...updateUserDto,
    };

    if (newData.password) {
      newData.password = await bcrypt.hash(newData.password, 10);
    }

    await this.updateUser(id, newData); // لا حاجة للإمساك بالنتيجة هنا لأنها فقط تنفيذ

    const updatedUser = await this.findOne(id); // إعادة جلب المستخدم بعد التحديث

    return {
      message: 'User updated successfully',
      success: true,
      data: updatedUser, // إرجاع الكائن الجديد
    };
  }

  async updateUser(id: string, updateUserDto: any) {
    await this.findOne(id);
    const result = await this.userRepository.update(id, {
      ...updateUserDto,
    });

    return result;
  }
  public async prepareUser(dto: CreateUserGestDto, payload?: JWTPayloadType) {
    const userId = payload?.id;
    let user = userId
      ? await this.userRepository.findOne({ where: { id: userId } })
      : dto.email
        ? await this.userRepository.findOneBy({ email: dto.email })
        : null;

    if (!user && !dto.email)
      throw new Error('User ID or email must be provided');

    if (!user) {
      user = this.userRepository.create({
        firstName: dto.firstName || 'Guest User',
        lastName: dto.lastName || '',
        email: dto.email,
        country: dto.country,
        city: dto.city,
        postalCode: dto.zip,
        address: dto.address,
        phone: dto.phone,
        role: UserRole.GEST,
        status: UserStatus.INACTIVE,
      });
    } else {
      user = Object.assign(user, {
        phone: user.phone || dto.phone,
        country: user.country || dto.country,
        city: user.city || dto.city,
        postalCode: user.postalCode || dto.zip,
        address: user.address || dto.address,
      });
    }

    return this.userRepository.save(user);
  }

  async remove(id: string) {
    await this.findOne(id);
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new UnauthorizedException('User not found');
    }
    return result;
  }
}

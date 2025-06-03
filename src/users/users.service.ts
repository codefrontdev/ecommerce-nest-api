import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

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
    console.log('updateUserDto', updateUserDto);

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
    console.log(result);

    return result;
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

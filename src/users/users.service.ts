import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from './entites/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const hashPassword = await bcrypt.hash(createUserDto.password, 10);

    createUserDto.password = hashPassword;

    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async findAll() {
    return this.userRepository.find();
  }

  async findOne(id: string) {

    const user = await this.userRepository.findOne({
      where: { id },
      select: [
        'id',
        'name',
        'email',
        'role',
        'status',
        'phone',
        'address',
        'profilePicture',
        'created_at',
        'updated_at',
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

  async update(id: string, updateUserDto: any) {
    return this.userRepository.update(id, updateUserDto);
  }

  async remove(id: string) {
    return this.userRepository.delete(id);
  }
}

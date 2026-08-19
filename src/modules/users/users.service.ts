import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  createUser(data: {
    email: string;
    password: string;
    name: string;
  }): Promise<User> {
    const user = this.usersRepository.create(data);
    return this.usersRepository.save(user);
  }

  async createTestUser(): Promise<void> {
    const exists = await this.findByEmail('test@mail.ru');
    if (!exists) {
      await this.createUser({
        email: 'test@mail.ru',
        password: '12345678',
        name: 'Тестовый',
      });
    }
  }
}

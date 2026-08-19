import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /** Регистрация */
  async register(data: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(data.email);
    if (existingUser) {
      throw new UnauthorizedException('Пользователь уже существует');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    return this.usersService.createUser({
      email: data.email,
      password: hashedPassword,
      name: data.name,
    });
  }

  /** Логин — возвращает JWT-токен */
  async login(data: LoginDto) {
    const user = await this.usersService.findByEmail(data.email);
    if (!user) {
      throw new UnauthorizedException('Пользователь не найден');
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Неверный пароль');
    }

    // Создаём токен
    const token = await this.jwtService.signAsync({
      userId: user.id,
      email: user.email,
    });

    return { token };
  }
}

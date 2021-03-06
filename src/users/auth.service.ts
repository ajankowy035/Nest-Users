import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(email: string, password: string) {
    try {
      // check if email is in use
      const users = await this.usersService.find(email);

      if (users.length) {
        throw new BadRequestException('Email in use');
      }

      //hash password
      const salt = randomBytes(8).toString('hex');
      const hash = (await scrypt(password, salt, 32)) as Buffer;
      const result = salt + '.' + hash.toString('hex');

      //create a new user and save it
      const user = await this.usersService.create(email, result);

      return user;
    } catch (error) {
      throw error;
    }
  }

  async signin(email: string, password: string) {
    try {
      const [user] = await this.usersService.find(email);

      if (!user) {
        throw new NotFoundException('Email not registered');
      }

      const [salt, storedHash] = user.password.split('.');
      const hash = (await scrypt(password, salt, 32)) as Buffer;

      if (storedHash !== hash.toString('hex')) {
        throw new BadRequestException('Incorrect password');
      }

      return user;
    } catch (error) {
      throw error;
    }
  }
}

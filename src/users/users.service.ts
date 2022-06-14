import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
@Injectable()
export class UsersService {
  // repo: Repository<User>;

  // constructor(repo: Repository<User>) {
  //   this.repo = repo;
  // }

  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async create(email: string, password: string) {
    const user = this.repo.create({ email, password });

    return await this.repo.save(user);
  }

  async findOne(id: number) {
    return await this.repo.findOneBy({ id });
  }

  async find(email: string) {
    return await this.repo.findBy({ email });
  }

  async update(id: number, attrs: Partial<User>) {
    try {
      const curr = await this.findOne(id);
      if (!curr) {
        throw new NotFoundException('User not found');
      }
      const updatedUser = { ...curr, ...attrs };

      this.repo.save(updatedUser);
    } catch (error) {
      throw new Error(error);
    }
  }

  async remove(id: number) {
    try {
      const user = await this.findOne(id);

      this.repo.remove(user);
    } catch (error) {
      throw new Error(error);
    }
  }
}

import { Post, Get, Patch, Param, Query, Body } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { updateUserDto } from './dtos/update-user.dto';
import { Serialize } from '../interceptors/serialize.intraceptor';
import { UserDto } from './dtos/user.dto';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('/signup')
  createUser(@Body() body: CreateUserDto) {
    this.usersService.create(body.email, body.password);
  }

  @Get('/:id')
  findUser(@Param('id') id: string) {
    return this.usersService.findOne(parseInt(id));
  }

  @Get('/')
  findAllUsers(@Query('email') email: string) {
    return this.usersService.find(email);
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: updateUserDto) {
    return this.usersService.update(parseInt(id), body);
  }
}

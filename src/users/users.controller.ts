import { Post, Get, Patch, Param, Query, Body, Session } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { updateUserDto } from './dtos/update-user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { Serialize } from '../interceptors/serialize.intraceptor';
import { UserDto } from './dtos/user.dto';
import { User } from './user.entity';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Get('/whoami')
  whoAmI(@CurrentUser() user: User) {
    return user;
  }

  @Post('/signup')
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    try {
      const user = await this.authService.signup(body.email, body.password);
      session.userId = user.id;

      return user;
    } catch (error) {
      throw error;
    }
  }

  @Post('/signin')
  async signin(@Body() body: CreateUserDto, @Session() session: any) {
    try {
      const user = await this.authService.signin(body.email, body.password);
      session.userId = user.id;

      return user;
    } catch (error) {
      throw error;
    }
  }

  @Post('/signout')
  signOut(@Session() session: any) {
    session.userId = null;
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

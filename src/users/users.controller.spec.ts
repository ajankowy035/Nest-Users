import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      findOne: (id: number) =>
        Promise.resolve({ id, email: 'abd@fe.com', password: 'asl' }),
      find: (email: string) =>
        Promise.resolve([{ id: 1, email, password: 'asl' }]),
    };
    fakeAuthService = {
      signup: (email: string, password: string) =>
        Promise.resolve({ id: 5, email, password }),
      signin: (email: string, password: string) =>
        Promise.resolve({ id: 1, email, password }),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: AuthService, useValue: fakeAuthService },
        { provide: UsersService, useValue: fakeUsersService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAllUsers returns a list of users with a given email', async () => {
    const users = await controller.findAllUsers('abd@fe.com');

    expect(users).toHaveLength(1);
    expect(users[0].email).toEqual('abd@fe.com');
  });

  it('findUser returns a single user with a given id', async () => {
    const user = await controller.findUser('22');

    expect(user).toBeDefined();
  });

  it('findUser throws an error when user with given id is not found', async () => {
    fakeUsersService.findOne = () => null;
    try {
      const user = await controller.findUser('22');
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it('signin updates session and returns user', async () => {
    const session = { userId: 0 };
    const user = await controller.signin(
      { email: 'abc@abc.com', password: 'password' },
      session,
    );

    expect(user.id).toBe(1);
    expect(session.userId).toBe(1);
  });

  it('createUser updates session and returns user', async () => {
    const session = { userId: 0 };
    const user = await controller.createUser(
      { email: 'abc@abc.com', password: 'password' },
      session,
    );

    expect(user.id).toBe(5);
    expect(session.userId).toBe(5);
  });
});

import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    //fake copy of UsersService
    fakeUsersService = {
      find: () => Promise.resolve([]),
      create: (email: string, password: string) =>
        Promise.resolve({ id: 1, email, password, reports: [] }),
    };

    //temprorary DI test container
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: fakeUsersService },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of AuthService', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with salted and hashed password', async () => {
    const password = '12345';
    const user = await service.signup('abc@def.com', password);
    const [salt, hash] = user.password.split('.');

    expect(user.password).not.toEqual(password);
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async () => {
    fakeUsersService.find = () =>
      Promise.resolve([
        { id: 1, email: 'abc@def.com', password: '12345', reports: [] },
      ]);
    try {
      await service.signup('abc@def.com', '12345');
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it('throws an error if user signs in with incorrect password', async () => {
    fakeUsersService.find = () =>
      Promise.resolve([
        { id: 1, email: 'abc@def.com', password: '12345', reports: [] },
      ]);
    try {
      await service.signin('abc@def.com', 'password');
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it('throws an error if user signups with not registered email', async () => {
    try {
      await service.signin('abc@def.com', '12345');
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it('signs in an existing user when provides correct data', async () => {
    const newUser = await service.signup('abc@def.com', '12345');

    fakeUsersService.find = () =>
      Promise.resolve([
        {
          id: 1,
          email: 'abc@def.com',
          password: newUser.password,
          reports: [],
        },
      ]);

    const user = await service.signin('abc@def.com', '12345');

    expect(user).toBeDefined();
  });
});

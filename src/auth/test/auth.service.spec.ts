import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Users } from '../../users/users.entity';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from '../dto/login-user.dto';
import { CreateUserDto } from '../dto/create-user.dto';

describe('AuthService', () => {
  let authService: AuthService;
  let usersRepository: Repository<Users>;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(Users),
          useClass: Repository,
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersRepository = module.get<Repository<Users>>(getRepositoryToken(Users));
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('login', () => {
    it('should return an access token for valid credentials', async () => {
      const loginUserDto: LoginUserDto = { email: 'test@example.com', password: 'testpassword' };
      const user = { id: 1, email: 'test@example.com', password: 'hashedPassword' };
      const result = { access_token: 'mocked_token' };

      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(user as any);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
      jest.spyOn(jwtService, 'sign').mockReturnValue('mocked_token');

      expect(await authService.login(loginUserDto)).toEqual(result);
    });

    it('should throw an error for invalid credentials', async () => {
      const loginUserDto: LoginUserDto = { email: 'invalid@example.com', password: 'wrongpassword' };

      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(null);

      await expect(authService.login(loginUserDto)).rejects.toThrow('Las credenciales no coinciden');
    });
  });

  describe('register', () => {
    it('should return an access token after registration', async () => {
      const createUserDto: CreateUserDto = { name: 'Test User', email: 'test@example.com', password: 'testpassword' };
      const user = { id: 1, userName: 'Test User', email: 'test@example.com', password: 'hashedPassword' };
      const result = { access_token: 'mocked_token' };

      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword');
      jest.spyOn(usersRepository, 'create').mockReturnValue(user as any);
      jest.spyOn(usersRepository, 'save').mockResolvedValue(user as any);
      jest.spyOn(jwtService, 'sign').mockReturnValue('mocked_token');

      expect(await authService.register(createUserDto)).toEqual(result);
    });
  });
});

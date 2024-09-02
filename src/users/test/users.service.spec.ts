import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.service';
import { Repository } from 'typeorm';
import { Users } from '../users.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthService } from '../../auth/auth.service';
import { usersNew, updateUser } from '../users.dto';
import * as bcrypt from 'bcrypt';
import { NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let usersService: UsersService;
  let userRepository: Repository<Users>;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(Users),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: AuthService,
          useValue: {
            generateToken: jest.fn(),
          },
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<Users>>(getRepositoryToken(Users));
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('register', () => {
    it('should register a user, hash the password, save the user and return the access token', async () => {
      const newUser: usersNew = { userName: 'John', email: 'john@example.com', password: 'password123' };
      const savedUser = { ...newUser, id: 1, password: 'hashedPassword' };
      const accessToken = 'some-token';

      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword');
      jest.spyOn(userRepository, 'create').mockReturnValue(savedUser as Users);
      jest.spyOn(userRepository, 'save').mockResolvedValue(savedUser as Users);
      jest.spyOn(authService, 'generateToken').mockReturnValue(accessToken);

      const result = await usersService.register(newUser);

      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(userRepository.create).toHaveBeenCalledWith({
        ...newUser,
        password: 'hashedPassword',
      });
      expect(userRepository.save).toHaveBeenCalledWith(savedUser);
      expect(authService.generateToken).toHaveBeenCalledWith({ email: savedUser.email, sub: savedUser.id });
      expect(result).toEqual({ access_token: accessToken, user: savedUser });
    });
  });

  describe('login', () => {
    it('should validate the user credentials and return the access token', async () => {
      const loginUserDto = { email: 'john@example.com', password: 'password123' };
      const user = { id: 1, email: 'john@example.com', password: 'hashedPassword' };
      const accessToken = 'some-token';

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user as Users);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
      jest.spyOn(authService, 'generateToken').mockReturnValue(accessToken);

      const result = await usersService.login(loginUserDto);

      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { email: 'john@example.com' } });
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword');
      expect(authService.generateToken).toHaveBeenCalledWith({ email: user.email, sub: user.id });
      expect(result).toEqual({ access_token: accessToken });
    });

    it('should throw an error if credentials are incorrect', async () => {
      const loginUserDto = { email: 'john@example.com', password: 'wrongPassword' };
      const user = { id: 1, email: 'john@example.com', password: 'hashedPassword' };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user as Users);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      await expect(usersService.login(loginUserDto)).rejects.toThrow('Las credenciales no coinciden');
    });
  });

  describe('agregarUser', () => {
    it('should save a new user', async () => {
      const newUser: usersNew = { userName: 'John', email: 'john@example.com', password: 'password123' };
      jest.spyOn(userRepository, 'save').mockResolvedValue(newUser as Users);

      const result = await usersService.agregarUser(newUser);

      expect(userRepository.save).toHaveBeenCalledWith(newUser);
      expect(result).toBe(newUser);
    });
  });

  describe('getUsers', () => {
    it('should return an array of users', async () => {
      const users = [{ id: 1, userName: 'John', email: 'john@example.com', password: 'password123' }];
      jest.spyOn(userRepository, 'find').mockResolvedValue(users as Users[]);

      const result = await usersService.getUsers();

      expect(userRepository.find).toHaveBeenCalledWith({
        relations: {
          shedules: true,
          medicina: true,
        },
      });
      expect(result).toBe(users);
    });
  });

  describe('findUser', () => {
    it('should return the user if found', async () => {
      const user = { id: 1, userName: 'John', email: 'john@example.com', password: 'password123' };
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user as Users);

      const result = await usersService.findUser(1);

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: {
          medicina: true,
          shedules: true,
        },
      });
      expect(result).toBe(user);
    });

    it('should throw a NotFoundException if the user is not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(usersService.findUser(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateUser', () => {
    it('should update the user if found', async () => {
      const updateData: updateUser = { userName: 'John Updated' };
      jest.spyOn(userRepository, 'update').mockResolvedValue({ affected: 1 } as any);

      await usersService.updateUser(1, updateData);

      expect(userRepository.update).toHaveBeenCalledWith(1, updateData);
    });

    it('should throw a NotFoundException if the user is not found', async () => {
      const updateData: updateUser = { userName: 'John Updated' };
      jest.spyOn(userRepository, 'update').mockResolvedValue({ affected: 0 } as any);

      await expect(usersService.updateUser(1, updateData)).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteUser', () => {
    it('should delete the user if found', async () => {
      const user = { id: 1, userName: 'John', email: 'john@example.com', password: 'password123' };
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user as Users);
      jest.spyOn(userRepository, 'delete').mockResolvedValue(undefined);

      const result = await usersService.deleteUser(1);

      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(userRepository.delete).toHaveBeenCalledWith(1);
      expect(result).toBe('User deleted');
    });

    it('should throw a NotFoundException if the user is not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(usersService.deleteUser(1)).rejects.toThrow(NotFoundException);
    });
  });
});

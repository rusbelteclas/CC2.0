import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { LoginUserDto } from '../dto/login-user.dto';
import { CreateUserDto } from '../dto/create-user.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
            register: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('login', () => {
    it('Debería regresar un JWT cuando los datos de acceso son validos', async () => {
      const result = { access_token: 'mocked_token' };
      const loginUserDto: LoginUserDto = { email: 'admin@admin.com', password: 'admin' };

      jest.spyOn(authService, 'login').mockResolvedValue(result);

      expect(await authController.login(loginUserDto)).toEqual(result);
    });

    it('Debería mostrar un error cuando los datos de acceso no son validos', async () => {
      const loginUserDto: LoginUserDto = { email: 'correo.com', password: '1234' };

      jest.spyOn(authService, 'login').mockRejectedValue(new Error('Las credenciales no coinciden'));

      await expect(authController.login(loginUserDto)).rejects.toThrow('Las credenciales no coinciden');
    });
  });
});

import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Users } from './users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { updateUser, usersNew } from './users.dto';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../auth/auth.service';
import { LoginUserDto } from '../auth/dto/login-user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(Users) private readonly userRepository: Repository<Users>,
        private authService: AuthService,
    ) {}

    async register(user: usersNew): Promise<any> {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        const newUser = this.userRepository.create({
            ...user,
            password: hashedPassword,
        });
        await this.userRepository.save(newUser);
        
        // Generate access token
        const payload = { email: newUser.email, sub: newUser.id };
        const accessToken = this.authService.generateToken(payload);

        // Return both access token and user data
        return {
            access_token: accessToken,
            user: newUser,
        };
    }

    async login(loginUserDto: LoginUserDto): Promise<any> {
        const { email, password } = loginUserDto;
        const user = await this.userRepository.findOne({ where: { email } });
        if (user && await bcrypt.compare(password, user.password)) {
            const payload = { email: user.email, sub: user.id };
            const accessToken = this.authService.generateToken(payload);
            return {
                access_token: accessToken,
            };
        }
        throw new Error('Las credenciales no coinciden');
    }

    async agregarUser(user: usersNew): Promise<Users> {
        return await this.userRepository.save(user);
    }

    async getUsers(): Promise<Users[]> {
        return await this.userRepository.find({
            relations: {
                shedules: true,
                medicina: true
            },
        });
    }

    async findUser(id: number): Promise<Users> {
        const user = await this.userRepository.findOne({
            where: { id },
            relations: {
                medicina: true,
                shedules: true
            }
        });
        if (!user) {
            throw new NotFoundException(`User with id ${id} not found`);
        }
        return user;
    }

    async updateUser(id: number, user: updateUser): Promise<void> {
        const updateResult = await this.userRepository.update(id, user);
        if (updateResult.affected === 0) {
            throw new NotFoundException(`User with id ${id} not found`);
        }
    }

    async deleteUser(id: number): Promise<string> {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException(`User with id ${id} not found`);
        }
        await this.userRepository.delete(id);
        return 'User deleted';
    }
}

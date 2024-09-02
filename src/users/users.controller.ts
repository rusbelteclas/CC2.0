import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { updateUser, usersNew } from './users.dto';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { LoginUserDto } from '../auth/dto/login-user.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly UsersServ: UsersService) {}

    @Post('register')
    async register(@Body() user: usersNew) {
        const registrationResult = await this.UsersServ.register(user);
        return registrationResult;
    }

    @Post('login')
    login(@Body() loginUserDto: LoginUserDto) {
        return this.UsersServ.login(loginUserDto);
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    insert(@Body() User: usersNew){
        return this.UsersServ.agregarUser(User);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    find(){
        return this.UsersServ.getUsers();
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number){
        return this.UsersServ.findUser(id);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    updateUser(@Param('id', ParseIntPipe) id: number,  @Body() updatU: updateUser){
        return this.UsersServ.updateUser(id, updatU);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    deleteUser(@Param('id', ParseIntPipe) id: number){
        return this.UsersServ.deleteUser(id);
    }
}

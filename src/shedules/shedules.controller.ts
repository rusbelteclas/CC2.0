import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { ShedulesService } from './shedules.service';
import { newShed, updateS } from './shedelus.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Shedules } from './shedules.entity';

@UseGuards(JwtAuthGuard)
@Controller('shedules')
export class ShedulesController {
    constructor(private readonly shedulesService: ShedulesService) { }

    @Post()
    async createS(@Body() newShed: newShed): Promise<Shedules> {
        return this.shedulesService.createS(newShed);
    }

    @Get()
    findAll() {
        return this.shedulesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.shedulesService.findShedules(id);
    }

    @Put(':id')
    updateS(@Param('id', ParseIntPipe) id: number,
        @Body() updateData: updateS) {
        return this.shedulesService.updateS(id, updateData);
    }

    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id: number) {
        return this.shedulesService.deleteS(id);
    }
}

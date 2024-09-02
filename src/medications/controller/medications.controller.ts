import { Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { MedicationsService } from '../service/medications.service';
import { Newmedicina, Updatmedicina } from '../medications.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('medications')
export class MedicationsController {
    constructor(private readonly MServ: MedicationsService) {}

    @Post()
    agregarM(@Body() medicina: Newmedicina) {
        return this.MServ.createM(medicina);
    }

    @Get()
    getAll() {
        return this.MServ.findAll();
    }

    @Get(':id')
    findMedic(@Param('id', ParseIntPipe) id: number) {
        return this.MServ.findMedicina(id);
    }

    @Patch(':id')
    actualizM(@Param('id', ParseIntPipe) id: number, @Body() updatU: Updatmedicina) {
        return this.MServ.updateM(id, updatU);
    }

    @Delete(':id') // Implementación del método DELETE
    async deleteM(@Param('id', ParseIntPipe) id: number) {
        try {
            return await this.MServ.deleteM(id);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException(`Medicina con id ${id} no encontrada`);
            }
            throw error;
        }
    }
}
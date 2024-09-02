import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shedules } from './shedules.entity';
import { newShed, updateS } from './shedelus.dto';
import { Medicina } from '../medications/medications.entity';
import { Users } from '../users/users.entity';

@Injectable()
export class ShedulesService {
    constructor(
        @InjectRepository(Shedules) private readonly sRepository: Repository<Shedules>
    ) {}

    async createS(shed: newShed): Promise<Shedules> {
        const medicina = new Medicina();
        medicina.id = shed.medicina;

        const user = new Users();
        user.id = shed.user;

        const shedul = this.sRepository.create({
            medicina,
            users: user,
            interval_hours: shed.intervalo,
            finish_dose_time: shed.finish_time,
        });

        return await this.sRepository.save(shedul);
    }

    async findAll(): Promise<Shedules[]> {
        return await this.sRepository.find({
            relations: ['medicina', 'users', 'notifications'],
        });
    }

    async findShedules(id: number): Promise<Shedules> {
        const shedules = await this.sRepository.findOne({
            where: { id },
            relations: ['medicina', 'users', 'notifications'],
        });
        if (!shedules) {
            throw new NotFoundException(`Shedules con id ${id} no encontrada`);
        }
        return shedules;
    }

    async updateS(id: number, shed: updateS): Promise<Shedules> {
        const existingShedules = await this.sRepository.findOne({ where: { id } });
        if (!existingShedules) {
            throw new NotFoundException(`Shedules con id ${id} no encontrada`);
        }

        const updatedShedules = Object.assign(existingShedules, shed);
        return await this.sRepository.save(updatedShedules);
    }

    async deleteS(id: number): Promise<string> {
        const shedules = await this.sRepository.findOne({ where: { id } });
        if (!shedules) {
            throw new NotFoundException(`Shedules con id ${id} no encontrada`);
        }

        await this.sRepository.delete(id);
        return 'Shedules deleted';
    }
}

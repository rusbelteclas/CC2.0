import { Test, TestingModule } from "@nestjs/testing";
import { ShedulesService } from "../shedules.service";
import { DeleteResult, Repository } from "typeorm";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Shedules } from "../shedules.entity";
import { newShed, updateS } from "../shedelus.dto";
import { NotFoundException } from "@nestjs/common";

describe('ShedulesService', () => {
    let service: ShedulesService;
    let repository: Repository<Shedules>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ShedulesService,
                {
                    provide: getRepositoryToken(Shedules),
                    useValue: {
                        create: jest.fn(),
                        save: jest.fn(),
                        find: jest.fn(),
                        findOne: jest.fn(),
                        delete: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<ShedulesService>(ShedulesService);
        repository = module.get<Repository<Shedules>>(getRepositoryToken(Shedules));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should create a schedule', async () => {
        const newShed: newShed = {
            medicina: 1,
            user: 1,
            intervalo: 1,
            finish_time: new Date(),
        };

        const result = new Shedules();
        jest.spyOn(repository, 'save').mockResolvedValue(result);

        expect(await service.createS(newShed)).toBe(result);
    });

    it('should find all schedules', async () => {
        const result = [new Shedules()];
        jest.spyOn(repository, 'find').mockResolvedValue(result);

        expect(await service.findAll()).toBe(result);
    });

    it('should find a schedule by id', async () => {
        const result = new Shedules();
        jest.spyOn(repository, 'findOne').mockResolvedValue(result);

        expect(await service.findShedules(1)).toBe(result);
    });

    it('should throw NotFoundException if schedule not found', async () => {
        jest.spyOn(repository, 'findOne').mockResolvedValue(null);

        await expect(service.findShedules(1)).rejects.toThrow(NotFoundException);
    });

    it('should update a schedule', async () => {
        const existingShedule = new Shedules();
        existingShedule.interval_hours = 3;
        const updateShedules = { intervalo: 5 };

        jest.spyOn(repository, 'findOne').mockResolvedValue(existingShedule);
        jest.spyOn(repository, 'save').mockResolvedValue({ ...existingShedule, ...updateShedules });

        const result = await service.updateS(1, updateShedules);

        expect(result).toEqual(expect.objectContaining(updateShedules));
    });

    it('should delete a schedule', async () => {
        const deleteResult: DeleteResult = {
            affected: 1,
            raw: {},
        };

        // Simula la existencia de la programación a eliminar
        jest.spyOn(repository, 'findOne').mockResolvedValue(new Shedules());

        // Simula la respuesta del método delete
        jest.spyOn(repository, 'delete').mockResolvedValue(deleteResult);

        await expect(service.deleteS(1)).resolves.toEqual('Shedules deleted');
    });

    it('should throw NotFoundException if schedule not found for deletion', async () => {
        jest.spyOn(repository, 'findOne').mockResolvedValue(null);

        await expect(service.deleteS(1)).rejects.toThrow(NotFoundException);
    });
});

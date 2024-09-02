import { Test, TestingModule } from '@nestjs/testing';
import { ShedulesController } from '../shedules.controller';
import { ShedulesService } from '../shedules.service';
import { newShed, updateS } from '../shedelus.dto';

describe('ShedulesController', () => {
    let controller: ShedulesController;
    let service: ShedulesService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ShedulesController],
            providers: [
                {
                    provide: ShedulesService,
                    useValue: {
                        createS: jest.fn(),
                        findAll: jest.fn(),
                        findShedules: jest.fn(),
                        updateS: jest.fn(),
                        deleteS: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<ShedulesController>(ShedulesController);
        service = module.get<ShedulesService>(ShedulesService);
    });

    it('should create a shedules', async () => {
        const newShed: newShed = {
            medicina: 1,
            user: 1,
            intervalo: 4,
            finish_time: new Date(),
        };

        await controller.createS(newShed);

        expect(service.createS).toHaveBeenCalledWith(newShed);
    });

    it('should get all shedules', async () => {
        await controller.findAll();
        expect(service.findAll).toHaveBeenCalled();
    });

    it('should get a schedule by ID', async () => {
        const id = 1;
        await controller.findOne(id);

        expect(service.findShedules).toHaveBeenCalledWith(id);
    });

    it('should update a schedule by ID', async () => {
        const id = 1;
        const updateShed: updateS = {
            intervalo: 4,
            finish_time: new Date(),
        };

        await controller.updateS(id, updateShed);

        expect(service.updateS).toHaveBeenCalledWith(id, updateShed);
    });

    it('should delete a schedule by ID', async () => {
        const id = 1;
        await controller.delete(id);
        expect(service.deleteS).toHaveBeenCalledWith(id);
    });
});

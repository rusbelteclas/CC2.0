import { Test, TestingModule } from '@nestjs/testing';
import { MedicationsController } from '../medications.controller';
import { MedicationsService } from '../../service/medications.service';
import { NotFoundException } from '@nestjs/common';

describe('MedicationsController - Read', () => {
  let medicationsController: MedicationsController;
  let medicationsService: MedicationsService;

  const mockMedicationsService = {
    findAll: jest.fn(() => {
      return [
        { id: 1, name: 'Medicine One', quantity: 10, user: 1 },
        { id: 2, name: 'Medicine Two', quantity: 20, user: 2 },
      ];
    }),
    findMedicina: jest.fn((id: number) => {
      if (id === 1) {
        return { id, name: 'Medicine', quantity: 10, user: 1 };
      } else {
        throw new NotFoundException(`Medicina con id 999 no encontrada`);
      }
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MedicationsController],
      providers: [MedicationsService],
    })
      .overrideProvider(MedicationsService)
      .useValue(mockMedicationsService)
      .compile();

    medicationsController = module.get<MedicationsController>(MedicationsController);
    medicationsService = module.get<MedicationsService>(MedicationsService);
  });

  it('should be defined', () => {
    expect(medicationsController).toBeDefined();
  });

  describe('getAll', () => {
    it('should return all medications', async () => {
      const result = await medicationsController.getAll();
      expect(result).toEqual([
        { id: 1, name: 'Medicine One', quantity: 10, user: 1 },
        { id: 2, name: 'Medicine Two', quantity: 20, user: 2 },
      ]);
      expect(mockMedicationsService.findAll).toHaveBeenCalled();
    });
  });

  describe('findMedic', () => {
    it('should return a medication by ID', async () => {
      const result = await medicationsController.findMedic(1);
      expect(result).toEqual({ id: 1, name: 'Medicine', quantity: 10, user: 1 });
      expect(mockMedicationsService.findMedicina).toHaveBeenCalledWith(1);
    });

    it('should throw an error if medication not found', async () => {
      try {
        await medicationsController.findMedic(999);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('Medicina con id 999 no encontrada');
      }
    });
  });
});

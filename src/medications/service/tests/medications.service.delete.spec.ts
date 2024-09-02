import { Test, TestingModule } from '@nestjs/testing';
import { MedicationsService } from '../medications.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Medicina } from '../../medications.entity';
import { NotFoundException } from '@nestjs/common';

describe('MedicationsService - Delete', () => {
  let medicationsService: MedicationsService;
  let medicationsRepository: Repository<Medicina>;

  const mockMedicationsRepository = {
    findOne: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MedicationsService,
        {
          provide: getRepositoryToken(Medicina),
          useValue: mockMedicationsRepository,
        },
      ],
    }).compile();

    medicationsService = module.get<MedicationsService>(MedicationsService);
    medicationsRepository = module.get<Repository<Medicina>>(getRepositoryToken(Medicina));
  });

  it('should be defined', () => {
    expect(medicationsService).toBeDefined();
  });

  describe('deleteM', () => {
    it('should delete a medication', async () => {
      const med: Medicina = {
          id: 1, name: 'Medicine', quantity: 10, user: { id: 1 } as any,
          schedules: []
      };

      mockMedicationsRepository.findOne.mockResolvedValue(med);
      mockMedicationsRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await medicationsService.deleteM(1);
      expect(result).toBe('Medicina borrada');
      expect(mockMedicationsRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockMedicationsRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw an error if medication not found', async () => {
      mockMedicationsRepository.findOne.mockResolvedValue(null);

      await expect(medicationsService.deleteM(999)).rejects.toThrow(
        new NotFoundException(`Medicina con id 999 no encontrada`),
      );
    });
  });
});

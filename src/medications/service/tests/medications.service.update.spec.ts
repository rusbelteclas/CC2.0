import { Test, TestingModule } from '@nestjs/testing';
import { MedicationsService } from '../medications.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Medicina } from '../../medications.entity';
import { Updatmedicina } from '../../medications.dto';
import { NotFoundException } from '@nestjs/common';

describe('MedicationsService - Update', () => {
  let medicationsService: MedicationsService;
  let repository: Repository<Medicina>;

  const mockRepository = {
    update: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MedicationsService,
        {
          provide: getRepositoryToken(Medicina),
          useValue: mockRepository,
        },
      ],
    }).compile();

    medicationsService = module.get<MedicationsService>(MedicationsService);
    repository = module.get<Repository<Medicina>>(getRepositoryToken(Medicina));
  });

  it('should be defined', () => {
    expect(medicationsService).toBeDefined();
  });

  describe('updateM', () => {
    it('should update a medication', async () => {
      const id = 1;
      const dto: Updatmedicina = { name: 'Updated Medicine', quantity: 15 };

      mockRepository.update.mockResolvedValue({ affected: 1 });
      mockRepository.findOne.mockResolvedValue({ id, ...dto });

      const result = await medicationsService.updateM(id, dto);

      expect(mockRepository.update).toHaveBeenCalledWith(id, dto);
      expect(result).toBeUndefined();
    });

    it('should throw an error if medication not found', async () => {
      const id = 999;
      const dto: Updatmedicina = { name: 'Test', quantity: 5 };

      mockRepository.update.mockResolvedValue({ affected: 0 });

      await expect(medicationsService.updateM(id, dto)).rejects.toThrow(
        new NotFoundException(`Medicina con id ${id} no encontrada`)
      );
    });
  });
});
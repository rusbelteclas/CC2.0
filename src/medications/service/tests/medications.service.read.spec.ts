import { Test, TestingModule } from '@nestjs/testing';
import { MedicationsService } from '../medications.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Medicina } from '../../medications.entity';
import { NotFoundException } from '@nestjs/common';

describe('MedicationsService - Read', () => {
  let medicationsService: MedicationsService;
  let medicationsRepository: Repository<Medicina>;

  const mockMedicationsRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
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

  describe('findAll', () => {
    it('should return all medications', async () => {
      const meds: Medicina[] = [
        {
            id: 1, name: 'Medicine One', quantity: 10, user: { id: 1 } as any,
            schedules: []
        },
        {
            id: 2, name: 'Medicine Two', quantity: 20, user: { id: 2 } as any,
            schedules: []
        },
      ];

      mockMedicationsRepository.find.mockResolvedValue(meds);

      const result = await medicationsService.findAll();
      expect(result).toEqual(meds);
      expect(mockMedicationsRepository.find).toHaveBeenCalled();
    });
  });

  describe('findMedicina', () => {
    it('should return a medication by ID', async () => {
      const med: Medicina = {
          id: 1, name: 'Medicine', quantity: 10, user: { id: 1 } as any,
          schedules: []
      };

      mockMedicationsRepository.findOne.mockResolvedValue(med);

      const result = await medicationsService.findMedicina(1);
      expect(result).toEqual(med);
      expect(mockMedicationsRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['user', 'schedules'],
      });
          });

    it('should throw an error if medication not found', async () => {
      mockMedicationsRepository.findOne.mockResolvedValue(null);

      await expect(medicationsService.findMedicina(999)).rejects.toThrow(
        new NotFoundException(`Medicina con id 999 no encontrada`),
      );
    });
  });
});

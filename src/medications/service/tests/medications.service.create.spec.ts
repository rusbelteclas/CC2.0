import { Test, TestingModule } from '@nestjs/testing';
import { MedicationsService } from '../medications.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Medicina } from '../../medications.entity';
import { Newmedicina } from '../../medications.dto';

describe('MedicationsService - Create', () => {
  let medicationsService: MedicationsService;
  let medicationsRepository: Repository<Medicina>;

  const mockMedicationsRepository = {
    save: jest.fn(),
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

  describe('createM', () => {
    it('should create a medication', async () => {
      const dto: Newmedicina = { name: 'Medicine', quantity: 10, user: 1 };
      const med: Medicina = {
          id: 1, ...dto, user: { id: 1 } as any,
          schedules: []
      };

      mockMedicationsRepository.save.mockResolvedValue(med);

      const result = await medicationsService.createM(dto);
      expect(result).toEqual(med);
      expect(mockMedicationsRepository.save).toHaveBeenCalledWith(expect.any(Medicina));
    });
  });
});

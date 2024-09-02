import { Test, TestingModule } from '@nestjs/testing';
import { MedicationsController } from '../medications.controller';
import { MedicationsService } from '../../service/medications.service';
import { Newmedicina } from '../../medications.dto';

describe('MedicationsController - Create', () => {
  let medicationsController: MedicationsController;

  const mockMedicationsService = {
    createM: jest.fn((dto: Newmedicina) => {
      return {
        id: Date.now(),
        ...dto,
      };
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
  });

  it('should be defined', () => {
    expect(medicationsController).toBeDefined();
  });

  describe('agregarM', () => {
    it('should create a medication', async () => {
      const dto: Newmedicina = { name: 'Medicine', quantity: 10, user: 1 };
      const result = await medicationsController.agregarM(dto);
      expect(result).toEqual({
        id: expect.any(Number),
        ...dto,
      });
      expect(mockMedicationsService.createM).toHaveBeenCalledWith(dto);
    });
  });
});

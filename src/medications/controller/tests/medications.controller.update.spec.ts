import { Test, TestingModule } from '@nestjs/testing';
import { MedicationsController } from '../medications.controller';
import { MedicationsService } from '../../service/medications.service';
import { Updatmedicina } from '../../medications.dto';

describe('MedicationsController - Update', () => {
  let medicationsController: MedicationsController;
  let medicationsService: MedicationsService;

  const mockMedicationsService = {
    updateM: jest.fn((id: number, dto: Updatmedicina) => {
      return { id, ...dto };
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

  describe('actualizM', () => {
    it('should update a medication', async () => {
      const dto: Updatmedicina = { name: 'Updated Medicine', quantity: 15 };
      const result = await medicationsController.actualizM(1, dto);
      expect(result).toEqual({ id: 1, ...dto });
      expect(mockMedicationsService.updateM).toHaveBeenCalledWith(1, dto);
    });
  });
});

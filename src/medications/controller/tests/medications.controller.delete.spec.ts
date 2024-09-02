import { Test, TestingModule } from '@nestjs/testing';
import { MedicationsController } from '../medications.controller';
import { MedicationsService } from '../../service/medications.service';
import { NotFoundException } from '@nestjs/common';

describe('MedicationsController - Delete', () => {
  let medicationsController: MedicationsController;
  let medicationsService: MedicationsService;

  
  const mockMedicationsService = {
    deleteM: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MedicationsController],
      providers: [
        {
          provide: MedicationsService,
          useValue: mockMedicationsService,
        },
      ],
    }).compile();

    medicationsController = module.get<MedicationsController>(MedicationsController);
    medicationsService = module.get<MedicationsService>(MedicationsService);
  });

  it('should delete a medication', async () => {
    mockMedicationsService.deleteM.mockResolvedValue('Medicina borrada');

    const result = await medicationsController.deleteM(1);

    expect(medicationsService.deleteM).toHaveBeenCalledWith(1);
    expect(result).toBe('Medicina borrada');
  });

  it('should throw an error if medication not found', async () => {
    mockMedicationsService.deleteM.mockRejectedValue(new NotFoundException('Medicina con id 999 no encontrada'));

    try {
      await medicationsController.deleteM(999);
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toBe('Medicina con id 999 no encontrada');
    }
  });
});
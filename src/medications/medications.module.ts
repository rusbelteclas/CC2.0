import { Module } from '@nestjs/common';
import { MedicationsController } from '../medications/controller/medications.controller';
import { Medicina } from './medications.entity';
import { MedicationsService } from '../medications/service/medications.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Medicina])],
  providers: [MedicationsService],
  controllers: [MedicationsController]
})
export class MedicationsModule {}

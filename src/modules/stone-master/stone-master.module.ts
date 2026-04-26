import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoneFamily } from './entity/stone-family.entity';
import { StoneClarity } from './entity/stone-clarity.entity';
import { StoneShape } from './entity/stone-shape.entity';
import { StoneMasterService } from './stone-master.service';
import {
  StoneFamilyController,
  StoneClarityController,
  StoneShapeController,
} from './stone-master.controller';

@Module({
  imports: [TypeOrmModule.forFeature([StoneFamily, StoneClarity, StoneShape])],
  controllers: [StoneFamilyController, StoneClarityController, StoneShapeController],
  providers: [StoneMasterService],
  exports: [StoneMasterService],
})
export class StoneMasterModule {}

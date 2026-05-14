import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoneType } from './entity/stone-type.entity';
import { StoneClarity } from './entity/stone-clarity.entity';
import { StoneShape } from './entity/stone-shape.entity';
import { StoneMasterService } from './stone-master.service';
import {
  StoneTypeController,
  StoneClarityController,
  StoneShapeController,
} from './stone-master.controller';

@Module({
  imports: [TypeOrmModule.forFeature([StoneType, StoneClarity, StoneShape])],
  controllers: [StoneTypeController, StoneClarityController, StoneShapeController],
  providers: [StoneMasterService],
  exports: [StoneMasterService],
})
export class StoneMasterModule {}

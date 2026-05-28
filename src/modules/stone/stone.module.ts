import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoneController } from './stone.controller';
import { StoneService } from './stone.service';
import { StoneImportService } from './stone-import.service';
import { Stone } from './entity/stone.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Stone])],
  controllers: [StoneController],
  providers: [StoneService, StoneImportService],
  exports: [StoneService],
})
export class StoneModule {}

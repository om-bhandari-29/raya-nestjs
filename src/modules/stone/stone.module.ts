import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoneController } from './stone.controller';
import { StoneService } from './stone.service';
import { Stone } from './entity/stone.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Stone])],
  controllers: [StoneController],
  providers: [StoneService],
  exports: [StoneService],
})
export class StoneModule {}

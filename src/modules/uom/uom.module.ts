import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UomController } from './uom.controller';
import { UomService } from './uom.service';
import { Uom } from './entity/uom.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Uom])],
  controllers: [UomController],
  providers: [UomService],
  exports: [UomService],
})
export class UomModule {}

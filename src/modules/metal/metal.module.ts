import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MetalPurity } from './entity/metal-purity.entity';
import { MetalColor } from './entity/metal-color.entity';
import { MetalPurityController } from './metal-purity.controller';
import { MetalMasterController } from './metal-master.controller';
import { MetalPurityService } from './metal-purity.service';
import { MetalColorService } from './metal-color.service';

@Module({
  imports: [TypeOrmModule.forFeature([MetalPurity, MetalColor])],
  controllers: [MetalPurityController, MetalMasterController],
  providers: [MetalPurityService, MetalColorService],
  exports: [MetalPurityService, MetalColorService],
})
export class MetalModule {}

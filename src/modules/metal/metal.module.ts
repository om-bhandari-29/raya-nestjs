import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MetalPurity } from './entity/metal-purity.entity';
import { MetalPurityController } from './metal-purity.controller';
import { MetalPurityService } from './metal-purity.service';

@Module({
  imports: [TypeOrmModule.forFeature([MetalPurity])],
  controllers: [MetalPurityController],
  providers: [MetalPurityService],
  exports: [MetalPurityService],
})
export class MetalModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductMasterController } from './product-master.controller';
import { ProductMasterService } from './product-master.service';
import { ProductMaster } from './entity/product-master.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductMaster])],
  controllers: [ProductMasterController],
  providers: [ProductMasterService],
  exports: [ProductMasterService],
})
export class ProductMasterModule {}

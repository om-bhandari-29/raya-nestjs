import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemAttributeMasterController } from './item-attribute-master.controller';
import { ItemAttributeMasterService } from './item-attribute-master.service';
import { ItemAttributeMaster } from './entity/item-attribute-master.entity';
import { ItemAttributeValue } from './entity/item-attribute-value.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ItemAttributeMaster, ItemAttributeValue])],
  controllers: [ItemAttributeMasterController],
  providers: [ItemAttributeMasterService],
  exports: [ItemAttributeMasterService],
})
export class ItemAttributeMasterModule {}

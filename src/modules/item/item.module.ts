import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemController } from './item.controller';
import { ItemService } from './item.service';
import { Item } from './entity/item.entity';
import { ItemBarcode } from './entity/item-barcode.entity';
import { ItemVariant } from './entity/item-variant.entity';
import { ItemAttributeValue } from '../item-attribute-master/entity/item-attribute-value.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Item, ItemBarcode, ItemVariant, ItemAttributeValue])],
  controllers: [ItemController],
  providers: [ItemService],
  exports: [ItemService],
})
export class ItemModule {}

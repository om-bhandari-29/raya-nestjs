import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemController } from './item.controller';
import { ItemService } from './item.service';
import { Item } from './entity/item.entity';
import { ItemBarcode } from './entity/item-barcode.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Item, ItemBarcode])],
  controllers: [ItemController],
  providers: [ItemService],
  exports: [ItemService],
})
export class ItemModule {}

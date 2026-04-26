import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemGroupController } from './item-group.controller';
import { ItemGroupService } from './item-group.service';
import { ItemGroup } from './entity/item-group.entity';
import { SubCategory } from '../sub-category/entity/sub-category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ItemGroup, SubCategory])],
  controllers: [ItemGroupController],
  providers: [ItemGroupService],
  exports: [ItemGroupService],
})
export class ItemGroupModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemGroupController } from './item-group.controller';
import { ItemGroupService } from './item-group.service';
import { ItemGroup } from './entity/item-group.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ItemGroup])],
  controllers: [ItemGroupController],
  providers: [ItemGroupService],
  exports: [ItemGroupService],
})
export class ItemGroupModule {}

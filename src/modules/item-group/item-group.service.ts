import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ItemGroup } from './entity/item-group.entity';
import { SubCategory } from '../sub-category/entity/sub-category.entity';
import { CreateItemGroupDto } from './dto/create-item-group.dto';
import { UpdateItemGroupDto } from './dto/update-item-group.dto';
import { ToggleLikedItemGroupDto } from './dto/toggle-liked-item-group.dto';

@Injectable()
export class ItemGroupService {
  constructor(
    @InjectRepository(ItemGroup)
    private readonly itemGroupRepository: Repository<ItemGroup>,
    @InjectRepository(SubCategory)
    private readonly subCategoryRepository: Repository<SubCategory>,
  ) {}

  async create(createItemGroupDto: CreateItemGroupDto) {
    const itemGroup = this.itemGroupRepository.create(createItemGroupDto);
    await this.itemGroupRepository.save(itemGroup);
    return {
      status: true,
      message: 'Item group created successfully',
      statusCode: 201,
      data: itemGroup,
    };
  }

  async combo() {
    const itemGroups = await this.itemGroupRepository.find({
      where: { is_active: true },
      select: ['id', 'name'],
      order: { name: 'ASC' },
    });
    return {
      status: true,
      message: 'Item group combo retrieved successfully',
      statusCode: 200,
      data: itemGroups,
    };
  }

  async findAll() {
    const itemGroups = await this.itemGroupRepository.find({
      relations: ['parent_item_group_rel'],
    });
    const data = itemGroups.map(({ parent_item_group_rel, ...rest }) => ({
      ...rest,
      parent_item_group_name: parent_item_group_rel?.name ?? null,
    }));
    return {
      status: true,
      message: 'Item groups retrieved successfully',
      statusCode: 200,
      data,
    };
  }

  async findOne(id: number) {
    const itemGroup = await this.itemGroupRepository.findOne({ where: { id } });
    if (!itemGroup) {
      throw new NotFoundException(`Item group with id ${id} not found`);
    }
    return {
      status: true,
      message: 'Item group retrieved successfully',
      statusCode: 200,
      data: itemGroup,
    };
  }

  async update(id: number, updateItemGroupDto: UpdateItemGroupDto) {
    const itemGroup = await this.itemGroupRepository.findOne({ where: { id } });
    if (!itemGroup) {
      throw new NotFoundException(`Item group with id ${id} not found`);
    }
    Object.assign(itemGroup, updateItemGroupDto);
    await this.itemGroupRepository.save(itemGroup);
    return {
      status: true,
      message: 'Item group updated successfully',
      statusCode: 200,
      data: itemGroup,
    };
  }

  async toggleLiked(dto: ToggleLikedItemGroupDto) {
    const itemGroup = await this.itemGroupRepository.findOne({
      where: { name: dto.name },
    });
    if (!itemGroup) {
      throw new NotFoundException(
        `Item group "${dto.name}" not found`,
      );
    }
    itemGroup.liked = dto.liked;
    await this.itemGroupRepository.save(itemGroup);
    return {
      status: true,
      message: `Item group "${dto.name}" ${dto.liked ? 'liked' : 'unliked'} successfully`,
      statusCode: 200,
      data: itemGroup,
    };
  }

  async remove(id: number) {
    const itemGroup = await this.itemGroupRepository.findOne({ where: { id } });
    if (!itemGroup) {
      throw new NotFoundException(`Item group with id ${id} not found`);
    }

    const subCategoryCount = await this.subCategoryRepository
      .createQueryBuilder('sc')
      .where('sc.item_group_id = :id', { id })
      .getCount();

    if (subCategoryCount > 0) {
      throw new BadRequestException(
        `Cannot delete this item group. ${subCategoryCount} sub-categor${subCategoryCount > 1 ? 'ies exist' : 'y exists'} under it. Please delete them first.`,
      );
    }

    await this.itemGroupRepository.remove(itemGroup);
    return {
      status: true,
      message: 'Item group deleted successfully',
      statusCode: 200,
      data: null,
    };
  }
}

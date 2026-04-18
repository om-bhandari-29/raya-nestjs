import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ItemGroup } from './entity/item-group.entity';
import { CreateItemGroupDto } from './dto/create-item-group.dto';
import { UpdateItemGroupDto } from './dto/update-item-group.dto';

@Injectable()
export class ItemGroupService {
  constructor(
    @InjectRepository(ItemGroup)
    private readonly itemGroupRepository: Repository<ItemGroup>,
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

  async findAll() {
    const itemGroups = await this.itemGroupRepository.find();
    return {
      status: true,
      message: 'Item groups retrieved successfully',
      statusCode: 200,
      data: itemGroups,
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

  async remove(id: number) {
    const itemGroup = await this.itemGroupRepository.findOne({ where: { id } });
    if (!itemGroup) {
      throw new NotFoundException(`Item group with id ${id} not found`);
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

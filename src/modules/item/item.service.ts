import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from './entity/item.entity';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
  ) {}

  async create(createItemDto: CreateItemDto) {
    const item = this.itemRepository.create(createItemDto);
    await this.itemRepository.save(item);
    return {
      status: true,
      message: 'Item created successfully',
      statusCode: 201,
      data: item,
    };
  }

  async findAll() {
    const items = await this.itemRepository.find({
      relations: ['product_master', 'item_group', 'hsn_sac', 'default_uom'],
    });
    return {
      status: true,
      message: 'Items retrieved successfully',
      statusCode: 200,
      data: items,
    };
  }

  async findOne(id: number) {
    const item = await this.itemRepository.findOne({
      where: { id },
      relations: ['product_master', 'item_group', 'hsn_sac', 'default_uom'],
    });
    if (!item) {
      throw new NotFoundException(`Item with id ${id} not found`);
    }
    return {
      status: true,
      message: 'Item retrieved successfully',
      statusCode: 200,
      data: item,
    };
  }

  async update(id: number, updateItemDto: UpdateItemDto) {
    const item = await this.itemRepository.findOne({ where: { id } });
    if (!item) {
      throw new NotFoundException(`Item with id ${id} not found`);
    }
    if (updateItemDto.has_variants === false && item.has_variants === true) {
      throw new BadRequestException(
        'Cannot disable variants once enabled. Remove variants first.',
      );
    }
    Object.assign(item, updateItemDto);
    await this.itemRepository.save(item);
    return {
      status: true,
      message: 'Item updated successfully',
      statusCode: 200,
      data: item,
    };
  }

  async remove(id: number) {
    const item = await this.itemRepository.findOne({ where: { id } });
    if (!item) {
      throw new NotFoundException(`Item with id ${id} not found`);
    }
    await this.itemRepository.remove(item);
    return {
      status: true,
      message: 'Item deleted successfully',
      statusCode: 200,
      data: null,
    };
  }
}

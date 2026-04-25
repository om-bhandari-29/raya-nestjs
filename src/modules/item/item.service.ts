import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from './entity/item.entity';
import { ItemBarcode } from './entity/item-barcode.entity';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

const ITEM_RELATIONS = [
  'product_master',
  'item_group',
  'hsn_sac',
  'default_uom',
  'weight_uom',
  'barcodes',
  'barcodes.uom',
];

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
    @InjectRepository(ItemBarcode)
    private readonly barcodeRepository: Repository<ItemBarcode>,
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
    const items = await this.itemRepository.find({ relations: ITEM_RELATIONS });
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
      relations: ITEM_RELATIONS,
    });
    if (!item) throw new NotFoundException(`Item with id ${id} not found`);
    return {
      status: true,
      message: 'Item retrieved successfully',
      statusCode: 200,
      data: item,
    };
  }

  async update(id: number, updateItemDto: UpdateItemDto) {
    const item = await this.itemRepository.findOne({
      where: { id },
      relations: ['barcodes'],
    });
    if (!item) throw new NotFoundException(`Item with id ${id} not found`);

    if (updateItemDto.has_variants === false && item.has_variants === true) {
      throw new BadRequestException(
        'Cannot disable variants once enabled. Remove variants first.',
      );
    }

    const { barcodes, ...rest } = updateItemDto;
    Object.assign(item, rest);

    if (barcodes !== undefined) {
      await this.barcodeRepository.delete({ item_id: id });
      item.barcodes = barcodes.map((b) =>
        this.barcodeRepository.create({ ...b, item_id: id }),
      );
    }

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
    if (!item) throw new NotFoundException(`Item with id ${id} not found`);
    await this.itemRepository.remove(item);
    return {
      status: true,
      message: 'Item deleted successfully',
      statusCode: 200,
      data: null,
    };
  }
}

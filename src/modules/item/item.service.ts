import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from './entity/item.entity';
import { ItemBarcode } from './entity/item-barcode.entity';
import { ItemVariant } from './entity/item-variant.entity';
import { ItemStoneDetail } from './entity/item-stone-detail.entity';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { SaveWeightDto } from './dto/save-weight.dto';

const ITEM_RELATIONS = [
  'product_master',
  'item_group',
  'hsn_sac',
  'default_uom',
  'weight_uom',
  'barcodes',
  'barcodes.uom',
  'variants',
  'variants.attribute',
  'stone_details',
  'stone_details.stone_type',
  'stone_details.stone_clarity',
  'stone_details.stone_shape',
];

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
    @InjectRepository(ItemBarcode)
    private readonly barcodeRepository: Repository<ItemBarcode>,
    @InjectRepository(ItemVariant)
    private readonly variantRepository: Repository<ItemVariant>,
    @InjectRepository(ItemStoneDetail)
    private readonly stoneDetailRepository: Repository<ItemStoneDetail>,
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

  async options(page: number, limit: number, search?: string) {
    const qb = this.itemRepository
      .createQueryBuilder('item')
      .select(['item.id', 'item.name']);

    if (search) {
      qb.where('item.name LIKE :search', { search: `%${search}%` });
    }

    const [items, total] = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('item.name', 'ASC')
      .getManyAndCount();

    return {
      status: true,
      message: 'Item options retrieved successfully',
      statusCode: 200,
      data: {
        items: items.map((i) => ({ id: i.id, name: i.name })),
        pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
      },
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

  async findByName(name: string) {
    const item = await this.itemRepository.findOne({
      where: { name },
      relations: ITEM_RELATIONS,
    });
    if (!item) throw new NotFoundException(`Item with name "${name}" not found`);
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
      relations: ['barcodes', 'variants', 'stone_details'],
    });
    if (!item) throw new NotFoundException(`Item with id ${id} not found`);

    if (updateItemDto.has_variants === false && item.has_variants === true) {
      throw new BadRequestException(
        'Cannot disable variants once enabled. Remove variants first.',
      );
    }

    const { barcodes, variants, stone_details, ...rest } = updateItemDto;
    Object.assign(item, rest);

    if (barcodes !== undefined) {
      await this.barcodeRepository.delete({ item_id: id });
      item.barcodes = barcodes.map((b) =>
        this.barcodeRepository.create({ ...b, item_id: id }),
      );
    }

    if (variants !== undefined) {
      await this.variantRepository.delete({ item_master_id: id });
      item.variants = variants.map((v) =>
        this.variantRepository.create({ ...v, item_master_id: id }),
      );
    }

    if (stone_details !== undefined) {
      await this.stoneDetailRepository.delete({ item_id: id });
      item.stone_details = stone_details.map((s) =>
        this.stoneDetailRepository.create({ ...s, item_id: id }),
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

  async saveWeight(id: number, dto: SaveWeightDto) {
    const item = await this.itemRepository.findOne({ where: { id } });
    if (!item) throw new NotFoundException(`Item with id ${id} not found`);

    const { variants, ...weightData } = dto;
    Object.assign(item, weightData);
    await this.itemRepository.save(item);

    for (const v of variants) {
      if (v.id === 0) {
        const { id: _id, ...rest } = v;
        await this.variantRepository.save(
          this.variantRepository.create({ ...rest, item_master_id: id }),
        );
      } else {
        const { id: variantId, ...rest } = v;
        await this.variantRepository.update(variantId, { ...rest, item_master_id: id });
      }
    }

    return {
      status: true,
      message: 'Weight and variants saved successfully',
      statusCode: 200,
      data: await this.itemRepository.findOne({ where: { id }, relations: ['variants'] }),
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

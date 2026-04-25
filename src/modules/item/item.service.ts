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
import { ItemAttributeValue } from '../item-attribute-master/entity/item-attribute-value.entity';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { CreateItemVariantDto } from './dto/create-item-variant.dto';

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
  'variants.value',
  'variants.variant_of',
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
    @InjectRepository(ItemAttributeValue)
    private readonly attributeValueRepository: Repository<ItemAttributeValue>,
  ) {}

  private async validateVariants(variants: CreateItemVariantDto[]) {
    for (const v of variants) {
      const attrValue = await this.attributeValueRepository.findOne({
        where: { id: v.value_id, attribute_id: v.attribute_id },
      });
      if (!attrValue) {
        throw new BadRequestException(
          `value_id ${v.value_id} does not belong to attribute_id ${v.attribute_id}`,
        );
      }
    }
  }

  async create(createItemDto: CreateItemDto) {
    if (createItemDto.variants?.length) {
      await this.validateVariants(createItemDto.variants);
    }
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

    const { barcodes, variants, ...rest } = updateItemDto;
    Object.assign(item, rest);

    if (barcodes !== undefined) {
      await this.barcodeRepository.delete({ item_id: id });
      item.barcodes = barcodes.map((b) =>
        this.barcodeRepository.create({ ...b, item_id: id }),
      );
    }

    if (variants !== undefined) {
      await this.validateVariants(variants);
      await this.variantRepository.delete({ item_id: id });
      item.variants = variants.map((v) =>
        this.variantRepository.create({ ...v, item_id: id }),
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

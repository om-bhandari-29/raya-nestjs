import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ItemAttributeMaster } from './entity/item-attribute-master.entity';
import { ItemAttributeValue } from './entity/item-attribute-value.entity';
import { CreateItemAttributeMasterDto } from './dto/create-item-attribute-master.dto';
import { UpdateItemAttributeMasterDto } from './dto/update-item-attribute-master.dto';
import { CreateItemAttributeValueDto } from './dto/create-item-attribute-value.dto';
import { UpdateItemAttributeValueDto } from './dto/update-item-attribute-value.dto';

@Injectable()
export class ItemAttributeMasterService {
  constructor(
    @InjectRepository(ItemAttributeMaster)
    private readonly attributeRepository: Repository<ItemAttributeMaster>,
    @InjectRepository(ItemAttributeValue)
    private readonly valueRepository: Repository<ItemAttributeValue>,
  ) {}

  async combo(page: number, limit: number, search?: string) {
    const qb = this.attributeRepository
      .createQueryBuilder('attr')
      .select(['attr.id', 'attr.name'])
      .where('attr.status = :status', { status: true });

    if (search) {
      qb.andWhere('attr.name ILIKE :search', { search: `%${search}%` });
    }

    const [items, total] = await qb
      .orderBy('attr.name', 'ASC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      status: true,
      message: 'Item attribute combo retrieved successfully',
      statusCode: 200,
      data: {
        items,
        pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
      },
    };
  }

  async create(createDto: CreateItemAttributeMasterDto) {
    const existing = await this.attributeRepository.findOne({
      where: { name: createDto.name },
    });
    if (existing) {
      throw new ConflictException(
        `Item attribute '${createDto.name}' already exists`,
      );
    }

    const { values, ...rest } = createDto;
    const attribute = this.attributeRepository.create(rest);

    if (values?.length) {
      attribute.values = values.map((v) =>
        this.valueRepository.create(v as Partial<ItemAttributeValue>),
      );
    }

    await this.attributeRepository.save(attribute);
    return {
      status: true,
      message: 'Item attribute created successfully',
      statusCode: 201,
      data: attribute,
    };
  }

  async findAll() {
    const attributes = await this.attributeRepository.find({
      relations: ['values'],
    });
    return {
      status: true,
      message: 'Item attributes retrieved successfully',
      statusCode: 200,
      data: attributes,
    };
  }

  async findOne(id: number) {
    const attribute = await this.attributeRepository.findOne({
      where: { id },
      relations: ['values'],
    });
    if (!attribute)
      throw new NotFoundException(`Item attribute with id ${id} not found`);
    return {
      status: true,
      message: 'Item attribute retrieved successfully',
      statusCode: 200,
      data: attribute,
    };
  }

  async update(id: number, updateDto: UpdateItemAttributeMasterDto) {
    const attribute = await this.attributeRepository.findOne({
      where: { id },
      relations: ['values'],
    });
    if (!attribute)
      throw new NotFoundException(`Item attribute with id ${id} not found`);

    if (updateDto.name && updateDto.name !== attribute.name) {
      const existing = await this.attributeRepository.findOne({
        where: { name: updateDto.name },
      });
      if (existing) {
        throw new ConflictException(
          `Item attribute '${updateDto.name}' already exists`,
        );
      }
    }

    const { values, ...rest } = updateDto;
    Object.assign(attribute, rest);

    if (updateDto.numeric_values === true) {
      await this.valueRepository.delete({ attribute_master_id: id });
      attribute.values = [];
    } else if (updateDto.numeric_values === false) {
      attribute.from_range = 0;
      attribute.to_range = 0;
      attribute.increment = 0;
    }

    if (values !== undefined && updateDto.numeric_values !== true) {
      const existingIds = attribute.values.map((v) => v.id);
      const incomingIds = values.filter((v) => v.id).map((v) => v.id);

      // Delete values not present in incoming payload
      const toDelete = existingIds.filter((eId) => !incomingIds.includes(eId));
      if (toDelete.length) {
        await this.valueRepository.delete({ id: In(toDelete) });
      }

      // Update existing and insert new
      attribute.values = values.map((v) =>
        this.valueRepository.create({
          ...v,
          attribute_master_id: id,
        } as Partial<ItemAttributeValue>),
      );
    }

    await this.attributeRepository.save(attribute);
    return {
      status: true,
      message: 'Item attribute updated successfully',
      statusCode: 200,
      data: attribute,
    };
  }

  async remove(id: number) {
    const attribute = await this.attributeRepository.findOne({
      where: { id },
    });
    if (!attribute)
      throw new NotFoundException(`Item attribute with id ${id} not found`);
    await this.attributeRepository.remove(attribute);
    return {
      status: true,
      message: 'Item attribute deleted successfully',
      statusCode: 200,
      data: null,
    };
  }

  // Value CRUD
  async createValue(
    attributeId: number,
    createDto: CreateItemAttributeValueDto,
  ) {
    const attribute = await this.attributeRepository.findOne({
      where: { id: attributeId },
    });
    if (!attribute)
      throw new NotFoundException(
        `Item attribute with id ${attributeId} not found`,
      );

    const value = this.valueRepository.create({
      ...createDto,
      attribute_master_id: attributeId,
    });
    await this.valueRepository.save(value);
    return {
      status: true,
      message: 'Attribute value created successfully',
      statusCode: 201,
      data: value,
    };
  }

  async findAllValues(attributeId: number) {
    const attribute = await this.attributeRepository.findOne({
      where: { id: attributeId },
    });
    if (!attribute)
      throw new NotFoundException(
        `Item attribute with id ${attributeId} not found`,
      );

    const values = await this.valueRepository.find({
      where: { attribute_master_id: attributeId },
    });
    return {
      status: true,
      message: 'Attribute values retrieved successfully',
      statusCode: 200,
      data: values,
    };
  }

  async findOneValue(attributeId: number, valueId: number) {
    const attribute = await this.attributeRepository.findOne({
      where: { id: attributeId },
    });
    if (!attribute)
      throw new NotFoundException(
        `Item attribute with id ${attributeId} not found`,
      );

    const value = await this.valueRepository.findOne({
      where: { id: valueId, attribute_master_id: attributeId },
    });
    if (!value)
      throw new NotFoundException(
        `Attribute value with id ${valueId} not found for attribute id ${attributeId}`,
      );
    return {
      status: true,
      message: 'Attribute value retrieved successfully',
      statusCode: 200,
      data: value,
    };
  }

  async updateValue(
    attributeId: number,
    valueId: number,
    updateDto: UpdateItemAttributeValueDto,
  ) {
    const attribute = await this.attributeRepository.findOne({
      where: { id: attributeId },
    });
    if (!attribute)
      throw new NotFoundException(
        `Item attribute with id ${attributeId} not found`,
      );

    const value = await this.valueRepository.findOne({
      where: { id: valueId, attribute_master_id: attributeId },
    });
    if (!value)
      throw new NotFoundException(
        `Attribute value with id ${valueId} not found for attribute id ${attributeId}`,
      );

    Object.assign(value, updateDto);
    await this.valueRepository.save(value);
    return {
      status: true,
      message: 'Attribute value updated successfully',
      statusCode: 200,
      data: value,
    };
  }

  async removeValue(attributeId: number, valueId: number) {
    const attribute = await this.attributeRepository.findOne({
      where: { id: attributeId },
    });
    if (!attribute)
      throw new NotFoundException(
        `Item attribute with id ${attributeId} not found`,
      );

    const value = await this.valueRepository.findOne({
      where: { id: valueId, attribute_master_id: attributeId },
    });
    if (!value)
      throw new NotFoundException(
        `Attribute value with id ${valueId} not found for attribute id ${attributeId}`,
      );

    await this.valueRepository.remove(value);
    return {
      status: true,
      message: 'Attribute value deleted successfully',
      statusCode: 200,
      data: null,
    };
  }
}

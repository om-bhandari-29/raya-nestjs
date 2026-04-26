import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  async combo() {
    const data = await this.attributeRepository.find({
      where: { status: true },
      select: ['id', 'attribute_name'],
      order: { attribute_name: 'ASC' },
    });
    return {
      status: true,
      message: 'Item attribute combo retrieved successfully',
      statusCode: 200,
      data,
    };
  }

  async create(createDto: CreateItemAttributeMasterDto) {
    const attribute = this.attributeRepository.create(createDto);
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

    const { values, ...rest } = updateDto;
    Object.assign(attribute, rest);

    if (values !== undefined) {
      await this.valueRepository.delete({ attribute_id: id });
      attribute.values = values.map((v) =>
        this.valueRepository.create({ ...v, attribute_id: id }),
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
    const attribute = await this.attributeRepository.findOne({ where: { id } });
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
  async createValue(attributeId: number, createDto: CreateItemAttributeValueDto) {
    const attribute = await this.attributeRepository.findOne({
      where: { id: attributeId },
    });
    if (!attribute)
      throw new NotFoundException(`Item attribute with id ${attributeId} not found`);

    const value = this.valueRepository.create({
      ...createDto,
      attribute_id: attributeId,
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
      throw new NotFoundException(`Item attribute with id ${attributeId} not found`);

    const values = await this.valueRepository.find({
      where: { attribute_id: attributeId },
    });
    return {
      status: true,
      message: 'Attribute values retrieved successfully',
      statusCode: 200,
      data: values,
    };
  }

  async findOneValue(attributeId: number, valueId: number) {
    const value = await this.valueRepository.findOne({
      where: { id: valueId, attribute_id: attributeId },
    });
    if (!value)
      throw new NotFoundException(
        `Attribute value with id ${valueId} not found for attribute ${attributeId}`,
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
    const value = await this.valueRepository.findOne({
      where: { id: valueId, attribute_id: attributeId },
    });
    if (!value)
      throw new NotFoundException(
        `Attribute value with id ${valueId} not found for attribute ${attributeId}`,
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
    const value = await this.valueRepository.findOne({
      where: { id: valueId, attribute_id: attributeId },
    });
    if (!value)
      throw new NotFoundException(
        `Attribute value with id ${valueId} not found for attribute ${attributeId}`,
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

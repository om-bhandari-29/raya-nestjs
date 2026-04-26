import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Uom } from './entity/uom.entity';
import { CreateUomDto } from './dto/create-uom.dto';
import { UpdateUomDto } from './dto/update-uom.dto';

@Injectable()
export class UomService {
  constructor(
    @InjectRepository(Uom)
    private readonly uomRepository: Repository<Uom>,
  ) {}

  async combo() {
    const data = await this.uomRepository.find({
      where: { is_active: true },
      select: ['id', 'name'],
      order: { name: 'ASC' },
    });
    return {
      status: true,
      message: 'UOM combo retrieved successfully',
      statusCode: 200,
      data,
    };
  }

  async create(createUomDto: CreateUomDto) {
    const existing = await this.uomRepository.findOne({
      where: { name: createUomDto.name },
    });
    if (existing) {
      throw new ConflictException(`UOM '${createUomDto.name}' already exists`);
    }

    const uom = this.uomRepository.create(createUomDto);
    await this.uomRepository.save(uom);
    return {
      status: true,
      message: 'UOM created successfully',
      statusCode: 201,
      data: uom,
    };
  }

  async findAll() {
    const uoms = await this.uomRepository.find();
    return {
      status: true,
      message: 'UOMs retrieved successfully',
      statusCode: 200,
      data: uoms,
    };
  }

  async findOne(id: number) {
    const uom = await this.uomRepository.findOne({ where: { id } });
    if (!uom) {
      throw new NotFoundException(`UOM with id ${id} not found`);
    }
    return {
      status: true,
      message: 'UOM retrieved successfully',
      statusCode: 200,
      data: uom,
    };
  }

  async update(id: number, updateUomDto: UpdateUomDto) {
    const uom = await this.uomRepository.findOne({ where: { id } });
    if (!uom) {
      throw new NotFoundException(`UOM with id ${id} not found`);
    }

    if (updateUomDto.name && updateUomDto.name !== uom.name) {
      const existing = await this.uomRepository.findOne({
        where: { name: updateUomDto.name },
      });
      if (existing) {
        throw new ConflictException(`UOM '${updateUomDto.name}' already exists`);
      }
    }

    Object.assign(uom, updateUomDto);
    await this.uomRepository.save(uom);
    return {
      status: true,
      message: 'UOM updated successfully',
      statusCode: 200,
      data: uom,
    };
  }

  async remove(id: number) {
    const uom = await this.uomRepository.findOne({ where: { id } });
    if (!uom) {
      throw new NotFoundException(`UOM with id ${id} not found`);
    }
    await this.uomRepository.remove(uom);
    return {
      status: true,
      message: 'UOM deleted successfully',
      statusCode: 200,
      data: null,
    };
  }
}

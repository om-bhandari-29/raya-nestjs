import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MetalPurity } from './entity/metal-purity.entity';
import { CreateMetalPurityDto } from './dto/create-metal-purity.dto';
import { UpdateMetalPurityDto } from './dto/update-metal-purity.dto';

@Injectable()
export class MetalPurityService {
  constructor(
    @InjectRepository(MetalPurity)
    private readonly metalPurityRepository: Repository<MetalPurity>,
  ) {}

  async combo() {
    const data = await this.metalPurityRepository.find({
      select: ['id', 'name', 'code'],
      order: { name: 'ASC' },
    });
    return {
      status: true,
      message: 'Metal purity combo retrieved successfully',
      statusCode: 200,
      data,
    };
  }

  async create(createMetalPurityDto: CreateMetalPurityDto) {
    const existing = await this.metalPurityRepository.findOne({
      where: { code: createMetalPurityDto.code },
    });
    if (existing) {
      throw new ConflictException(
        `Metal purity with code '${createMetalPurityDto.code}' already exists`,
      );
    }

    const metalPurity = this.metalPurityRepository.create(createMetalPurityDto);
    await this.metalPurityRepository.save(metalPurity);
    return {
      status: true,
      message: 'Metal purity created successfully',
      statusCode: 201,
      data: metalPurity,
    };
  }

  async findAll() {
    const metalPurities = await this.metalPurityRepository.find();
    return {
      status: true,
      message: 'Metal purities retrieved successfully',
      statusCode: 200,
      data: metalPurities,
    };
  }

  async findOne(id: number) {
    const metalPurity = await this.metalPurityRepository.findOne({
      where: { id },
    });
    if (!metalPurity) {
      throw new NotFoundException(`Metal purity with ID '${id}' not found`);
    }
    return {
      status: true,
      message: 'Metal purity retrieved successfully',
      statusCode: 200,
      data: metalPurity,
    };
  }

  async update(id: number, updateMetalPurityDto: UpdateMetalPurityDto) {
    const metalPurity = await this.metalPurityRepository.findOne({
      where: { id },
    });
    if (!metalPurity) {
      throw new NotFoundException(`Metal purity with ID '${id}' not found`);
    }

    if (
      updateMetalPurityDto.code &&
      updateMetalPurityDto.code !== metalPurity.code
    ) {
      const existing = await this.metalPurityRepository.findOne({
        where: { code: updateMetalPurityDto.code },
      });
      if (existing) {
        throw new ConflictException(
          `Metal purity with code '${updateMetalPurityDto.code}' already exists`,
        );
      }
    }

    Object.assign(metalPurity, updateMetalPurityDto);
    await this.metalPurityRepository.save(metalPurity);
    return {
      status: true,
      message: 'Metal purity updated successfully',
      statusCode: 200,
      data: metalPurity,
    };
  }

  async remove(id: number) {
    const metalPurity = await this.metalPurityRepository.findOne({
      where: { id },
    });
    if (!metalPurity) {
      throw new NotFoundException(`Metal purity with ID '${id}' not found`);
    }
    await this.metalPurityRepository.remove(metalPurity);
    return {
      status: true,
      message: 'Metal purity deleted successfully',
      statusCode: 200,
      data: null,
    };
  }
}

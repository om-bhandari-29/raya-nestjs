import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MetalColor } from './entity/metal-color.entity';
import { CreateMetalColorDto } from './dto/create-metal-color.dto';
import { UpdateMetalColorDto } from './dto/update-metal-color.dto';

@Injectable()
export class MetalColorService {
  constructor(
    @InjectRepository(MetalColor)
    private readonly metalColorRepository: Repository<MetalColor>,
  ) {}

  async combo() {
    const data = await this.metalColorRepository.find({
      select: ['id', 'name', 'code'],
      order: { name: 'ASC' },
    });
    return {
      status: true,
      message: 'Metal color combo retrieved successfully',
      statusCode: 200,
      data,
    };
  }

  async create(createMetalColorDto: CreateMetalColorDto) {
    const existing = await this.metalColorRepository.findOne({
      where: { code: createMetalColorDto.code },
    });
    if (existing) {
      throw new ConflictException(
        `Metal color with code '${createMetalColorDto.code}' already exists`,
      );
    }

    const metalColor = this.metalColorRepository.create(createMetalColorDto);
    await this.metalColorRepository.save(metalColor);
    return {
      status: true,
      message: 'Metal color created successfully',
      statusCode: 201,
      data: metalColor,
    };
  }

  async findAll() {
    const metalColors = await this.metalColorRepository.find();
    return {
      status: true,
      message: 'Metal colors retrieved successfully',
      statusCode: 200,
      data: metalColors,
    };
  }

  async findOne(id: number) {
    const metalColor = await this.metalColorRepository.findOne({
      where: { id },
    });
    if (!metalColor) {
      throw new NotFoundException(`Metal color with ID '${id}' not found`);
    }
    return {
      status: true,
      message: 'Metal color retrieved successfully',
      statusCode: 200,
      data: metalColor,
    };
  }

  async update(id: number, updateMetalColorDto: UpdateMetalColorDto) {
    const metalColor = await this.metalColorRepository.findOne({
      where: { id },
    });
    if (!metalColor) {
      throw new NotFoundException(`Metal color with ID '${id}' not found`);
    }

    if (
      updateMetalColorDto.code &&
      updateMetalColorDto.code !== metalColor.code
    ) {
      const existing = await this.metalColorRepository.findOne({
        where: { code: updateMetalColorDto.code },
      });
      if (existing) {
        throw new ConflictException(
          `Metal color with code '${updateMetalColorDto.code}' already exists`,
        );
      }
    }

    Object.assign(metalColor, updateMetalColorDto);
    await this.metalColorRepository.save(metalColor);
    return {
      status: true,
      message: 'Metal color updated successfully',
      statusCode: 200,
      data: metalColor,
    };
  }

  async remove(id: number) {
    const metalColor = await this.metalColorRepository.findOne({
      where: { id },
    });
    if (!metalColor) {
      throw new NotFoundException(`Metal color with ID '${id}' not found`);
    }
    await this.metalColorRepository.remove(metalColor);
    return {
      status: true,
      message: 'Metal color deleted successfully',
      statusCode: 200,
      data: null,
    };
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stone } from './entity/stone.entity';
import { CreateStoneDto } from './dto/create-stone.dto';
import { UpdateStoneDto } from './dto/update-stone.dto';

@Injectable()
export class StoneService {
  constructor(
    @InjectRepository(Stone)
    private readonly stoneRepository: Repository<Stone>,
  ) {}

  async create(createStoneDto: CreateStoneDto) {
    const stone = this.stoneRepository.create(createStoneDto);
    await this.stoneRepository.save(stone);
    return {
      status: true,
      message: 'Stone created successfully',
      statusCode: 201,
      data: stone,
    };
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    
    const [stones, total] = await this.stoneRepository.findAndCount({
      skip,
      take: limit,
      order: { created_at: 'DESC' },
    });

    return {
      status: true,
      message: 'Stones retrieved successfully',
      statusCode: 200,
      data: {
        stones,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  }

  async findOne(id: number) {
    const stone = await this.stoneRepository.findOne({ where: { id } });
    if (!stone) {
      throw new NotFoundException(`Stone with id ${id} not found`);
    }
    return {
      status: true,
      message: 'Stone retrieved successfully',
      statusCode: 200,
      data: stone,
    };
  }

  async update(id: number, updateStoneDto: UpdateStoneDto) {
    const stone = await this.stoneRepository.findOne({ where: { id } });
    if (!stone) {
      throw new NotFoundException(`Stone with id ${id} not found`);
    }
    Object.assign(stone, updateStoneDto);
    await this.stoneRepository.save(stone);
    return {
      status: true,
      message: 'Stone updated successfully',
      statusCode: 200,
      data: stone,
    };
  }

  async remove(id: number) {
    const stone = await this.stoneRepository.findOne({ where: { id } });
    if (!stone) {
      throw new NotFoundException(`Stone with id ${id} not found`);
    }
    await this.stoneRepository.remove(stone);
    return {
      status: true,
      message: 'Stone deleted successfully',
      statusCode: 200,
      data: null,
    };
  }

  async combo() {
    const stones = await this.stoneRepository.find({
      where: { is_active: true },
      select: ['id', 'stoneName', 'generatedKey'],
      order: { stoneName: 'ASC' },
    });
    return {
      status: true,
      message: 'Stone combo retrieved successfully',
      statusCode: 200,
      data: stones,
    };
  }
}

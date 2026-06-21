import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
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

  async findAll(page: number = 1, limit: number = 10, generatedKey?: string) {
    const skip = (page - 1) * limit;

    const queryBuilder = this.stoneRepository
      .createQueryBuilder('stone')
      .orderBy('stone.created_at', 'DESC')
      .skip(skip)
      .take(limit);

    if (generatedKey) {
      queryBuilder.andWhere('stone.generatedKey ILIKE :generatedKey', {
        generatedKey: `%${generatedKey}%`,
      });
    }

    const [stones, total] = await queryBuilder.getManyAndCount();

    return {
      status: true,
      message: 'Stones retrieved successfully',
      statusCode: 200,
      data: {
        stones,
      },
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const stone = await this.stoneRepository.findOne({
      where: { id },
    });
    if (!stone) {
      throw new NotFoundException(`Stone with key "${id}" not found`);
    }
    return {
      status: true,
      message: 'Stone retrieved successfully',
      statusCode: 200,
      data: stone,
    };
  }

  async update(id: number, updateStoneDto: UpdateStoneDto) {
    const stone = await this.stoneRepository.findOne({
      where: { id },
    });
    if (!stone) {
      throw new NotFoundException(`Stone with key "${id}" not found`);
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

  async getStoneOptions(
    stoneOriginType: string,
    shapeNormalised: string,
    dimLMm: number,
    dimWMm: number,
  ) {
    if (!stoneOriginType) {
      throw new BadRequestException('stoneOriginType is required');
    }
    if (!shapeNormalised) {
      throw new BadRequestException('shapeNormalised is required');
    }
    if (dimLMm === undefined || dimLMm === null || isNaN(dimLMm)) {
      throw new BadRequestException('dim_l_mm must be a valid number');
    }
    if (dimWMm === undefined || dimWMm === null || isNaN(dimWMm)) {
      throw new BadRequestException('dim_w_mm must be a valid number');
    }

    const queryBuilder = this.stoneRepository
      .createQueryBuilder('stone')
      .where('stone.stoneType ILIKE :stoneOriginType', { stoneOriginType })
      .andWhere('stone.shape ILIKE :shapeNormalised', { shapeNormalised })
      .andWhere('stone.length = :dimLMm', { dimLMm })
      .andWhere('stone.width = :dimWMm', { dimWMm })
      .andWhere('stone.is_active = true');

    const matchingStones = await queryBuilder.getMany();

    // Group by stoneName and select the one with the largest estimatedWeightInCt
    const stoneMap = new Map<string, Stone>();
    for (const stone of matchingStones) {
      const existing = stoneMap.get(stone.stoneName);
      const weight = stone.estimatedWeightInCt ? Number(stone.estimatedWeightInCt) : 0;
      if (!existing) {
        stoneMap.set(stone.stoneName, stone);
      } else {
        const existingWeight = existing.estimatedWeightInCt ? Number(existing.estimatedWeightInCt) : 0;
        if (weight > existingWeight) {
          stoneMap.set(stone.stoneName, stone);
        }
      }
    }

    const data = Array.from(stoneMap.values()).map((stone) => ({
      id: stone.id,
      Stone_name: stone.stoneName,
      Estimated_Weight_Final_ct: stone.estimatedWeightInCt ? Number(stone.estimatedWeightInCt) : null,
      Price_per_ct_INR: stone.pricePerCt ? Number(stone.pricePerCt) : null,
      Price_per_ct_USD: stone.pricePerCtUsd ? Number(stone.pricePerCtUsd) : null,
    }));

    return {
      status: true,
      message: 'Stone options retrieved successfully',
      statusCode: 200,
      data,
    };
  }
}

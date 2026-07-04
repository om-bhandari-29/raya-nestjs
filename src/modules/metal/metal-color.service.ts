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

  // async comboplane() {
  //   const data = await this.metalColorRepository.find({
  //     select: ['id', 'name', 'code'],
  //     order: { name: 'ASC' },
  //   });
  //   return {
  //     status: true,
  //     message: 'Metal color combo retrieved successfully',
  //     statusCode: 200,
  //     data,
  //   };
  // }
  async combo(variantId: number = null, metalPurityId: number = null) {
    // 1. Build the dynamic query using parameterized inputs to prevent SQL injection
    const query = `
    SELECT DISTINCT
      mc.id,
      mc.name,
      mc.code
    FROM metal_colors mc
    -- We join the mapping table if we want to filter by variant or purity
    LEFT JOIN design_variant_allowed_metals dvam ON dvam.metal_color_id = mc.id
    WHERE 
      -- If variantId is null, skip this condition. Otherwise, match it.
      ($1::integer IS NULL OR dvam.variant_id = $1)
      AND
      -- If metalPurityId is null, skip this condition. Otherwise, match it.
      ($2::integer IS NULL OR dvam.metal_purity_id = $2)
    ORDER BY mc.name ASC
  `;

    // 2. Execute the query passing the parameters
    const data = await this.metalColorRepository.query(query, [
      variantId,
      metalPurityId,
    ]);

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

  async findAll(page: number = 1, limit: number = 10, search?: string) {
    const query = this.metalColorRepository.createQueryBuilder('mc');

    if (search) {
      query.where('(mc.name ILIKE :search OR mc.code ILIKE :search)', {
        search: `%${search}%`,
      });
    }

    const [items, total] = await query
      .orderBy('mc.id', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      status: true,
      message: 'Metal colors retrieved successfully',
      statusCode: 200,
      data: {
        items,
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

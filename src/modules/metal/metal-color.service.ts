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
      mc.name
    FROM metal_master mc
    -- We join the mapping table if we want to filter by variant or purity
    LEFT JOIN design_variant_allowed_metals dvam ON dvam.metal_master_id = mc.id
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
      where: { name: createMetalColorDto.name },
    });
    if (existing) {
      throw new ConflictException(
        `Metal color with name '${createMetalColorDto.name}' already exists`,
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
      query.where('mc.name ILIKE :search', {
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

  async findMetalsWithPurities(
    page: number = 1,
    limit: number = 10,
    search?: string,
    metal_id?: number,
    isPagination: boolean = false,
  ) {
    const query = this.metalColorRepository
      .createQueryBuilder('mc')
      .leftJoinAndSelect('mc.purities', 'mp');

    if (search) {
      query.andWhere('mc.name ILIKE :search', {
        search: `%${search}%`,
      });
    }

    if (metal_id) {
      query.andWhere('mc.id = :metal_id', { metal_id });
    }

    query.orderBy('mc.id', 'DESC').addOrderBy('mp.id', 'ASC');

    if (isPagination) {
      const [items, total] = await query
        .skip((page - 1) * limit)
        .take(limit)
        .getManyAndCount();

      return {
        status: true,
        message: 'Metals with purities retrieved successfully',
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
    } else {
      const items = await query.getMany();
      return {
        status: true,
        message: 'Metals with purities retrieved successfully',
        statusCode: 200,
        data: {
          items,
        },
      };
    }
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
      updateMetalColorDto.name &&
      updateMetalColorDto.name !== metalColor.name
    ) {
      const existing = await this.metalColorRepository.findOne({
        where: { name: updateMetalColorDto.name },
      });
      if (existing) {
        throw new ConflictException(
          `Metal color with name '${updateMetalColorDto.name}' already exists`,
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

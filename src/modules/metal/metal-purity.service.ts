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

  async findAll(page: number = 1, limit: number = 10, search?: string) {
    const query = this.metalPurityRepository.createQueryBuilder('mp');

    if (search) {
      query.where('(mp.name ILIKE :search OR mp.code ILIKE :search)', {
        search: `%${search}%`,
      });
    }

    const [items, total] = await query
      .orderBy('mp.id', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      status: true,
      message: 'Metal purities retrieved successfully',
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

  async findByVariantId(variantId: number) {
    // Check if the product blueprint variant exists
    const blueprints = await this.metalPurityRepository.query(
      `SELECT id FROM product_blueprints WHERE id = $1`,
      [variantId],
    );

    if (!blueprints || blueprints.length === 0) {
      throw new NotFoundException(
        `Product variant/blueprint with ID '${variantId}' not found`,
      );
    }

    // Added DISTINCT and removed id / metal_color_id to get unique purities
    const rows = await this.metalPurityRepository.query(
      `SELECT DISTINCT
        dvam.metal_purity_id as id, 
        mp.name
     FROM design_variant_allowed_metals dvam
     JOIN metal_purities mp ON dvam.metal_purity_id = mp.id
     WHERE dvam.variant_id = $1`,
      [variantId],
    );

    return {
      status: true,
      message: 'Allowed metals for variant retrieved successfully',
      statusCode: 200,
      data: rows,
    }; // <-- Fixed: Changed ) to }
  }
}

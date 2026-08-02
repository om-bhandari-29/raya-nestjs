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
import { MetalType } from '../../core/enum/metal-type.enum';

@Injectable()
export class MetalPurityService {
  constructor(
    @InjectRepository(MetalPurity)
    private readonly metalPurityRepository: Repository<MetalPurity>,
  ) {}

  async combo() {
    const data = await this.metalPurityRepository.find({
      select: [
        'id',
        'purity',
        'purity_code',
        'name',
        'metal_type',
        'percentage',
        'rate_per_gram_inr',
        'rate_per_gram_usd',
        'density_multiplier',
      ],
      order: { purity: 'ASC' },
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
      where: {
        purity: createMetalPurityDto.purity,
        metal_type: createMetalPurityDto.metal_type,
      },
    });
    if (existing) {
      throw new ConflictException(
        `Metal purity with purity '${createMetalPurityDto.purity}' and metal_type '${createMetalPurityDto.metal_type}' already exists`,
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

  async findAll(
    page: number = 1,
    limit: number = 10,
    search?: string,
    metal_type: number = -1,
  ) {
    const query = this.metalPurityRepository.createQueryBuilder('mp');

    // 1. Handle search filter
    if (search) {
      query.where('(mp.purity ILIKE :search OR mp.name ILIKE :search)', {
        search: `%${search}%`,
      });
    }

    // 2. Handle metal_type filter (assuming -1 means "no filter")
    if (metal_type !== undefined && metal_type > -1) {
      query.andWhere('mp.metal_type = :metal_type', { metal_type });
    }

    // Fetch paginated items and total count
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
      (updateMetalPurityDto.purity || updateMetalPurityDto.metal_type !== undefined) &&
      (updateMetalPurityDto.purity !== metalPurity.purity ||
        updateMetalPurityDto.metal_type !== metalPurity.metal_type)
    ) {
      const existing = await this.metalPurityRepository.findOne({
        where: {
          purity: updateMetalPurityDto.purity ?? metalPurity.purity,
          metal_type: updateMetalPurityDto.metal_type ?? metalPurity.metal_type,
        },
      });
      if (existing && existing.id !== id) {
        throw new ConflictException(
          `Metal purity with purity '${updateMetalPurityDto.purity ?? metalPurity.purity}' and metal_type '${updateMetalPurityDto.metal_type ?? metalPurity.metal_type}' already exists`,
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

    // Added DISTINCT and removed id / metal_master_id to get unique purities
    const rows = await this.metalPurityRepository.query(
      `SELECT DISTINCT
        dvam.metal_purity_id as id, 
        mp.purity
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
    };
  }

  async groupedByMetal() {
    const purities = await this.metalPurityRepository.find({
      select: ['id', 'purity', 'purity_code', 'name', 'density_multiplier', 'metal_type'],
      order: { purity: 'ASC' },
    });

    const data = Object.keys(MetalType)
      .filter((key) => isNaN(Number(key))) // Filter out numeric reverse mappings
      .map((key) => {
        const metalTypeId = MetalType[key as keyof typeof MetalType];
        return {
          metal_type_id: metalTypeId,
          metal_name: key,
          purities: purities
            .filter((p) => p.metal_type === metalTypeId)
            .map((p) => ({
              id: p.id,
              purity: p.purity,
              purity_code: p.purity_code,
              name: p.name,
              density_multiplier: p.density_multiplier,
            })),
        };
      });

    return {
      status: true,
      message: 'Metal purities grouped by metal type retrieved successfully',
      statusCode: 200,
      data,
    };
  }

  async calculateWeight(variantId: number, targetPurity: string) {
    // 1. Fetch Size Matrix (ring_size, base_metal_weight_gm)
    const sizeMatrix = await this.metalPurityRepository.query(
      `SELECT ring_size, base_metal_weight_gm FROM metal_weight_matrix WHERE variant_id = $1 ORDER BY ring_size ASC`,
      [variantId],
    );

    if (!sizeMatrix || sizeMatrix.length === 0) {
      throw new NotFoundException(
        `No size matrix found for variant ID '${variantId}'`,
      );
    }

    // 2. Fetch Base Purity
    const basePurityRow = await this.metalPurityRepository.query(
      `SELECT purity FROM variant_base_metal_purity WHERE variant_id = $1`,
      [variantId],
    );

    if (!basePurityRow || basePurityRow.length === 0) {
      throw new NotFoundException(
        `No base purity found for variant ID '${variantId}'`,
      );
    }
    const basePurityCode = basePurityRow[0].purity;

    // 3. Fetch density multipliers for base and target purities
    const multipliers = await this.metalPurityRepository.query(
      `SELECT purity_code, density_multiplier FROM metal_purities WHERE purity_code IN ($1, $2)`,
      [basePurityCode, targetPurity],
    );

    const baseMultiplierRow = multipliers.find(
      (m) => m.purity_code === basePurityCode,
    );
    const targetMultiplierRow = multipliers.find(
      (m) => m.purity_code === targetPurity,
    );

    if (!baseMultiplierRow || !baseMultiplierRow.density_multiplier) {
      throw new NotFoundException(
        `Density multiplier not found for base purity '${basePurityCode}'`,
      );
    }
    if (!targetMultiplierRow || !targetMultiplierRow.density_multiplier) {
      throw new NotFoundException(
        `Density multiplier not found for target purity '${targetPurity}'`,
      );
    }

    const baseMultiplier = Number(baseMultiplierRow.density_multiplier);
    const targetMultiplier = Number(targetMultiplierRow.density_multiplier);

    // 4. Calculate
    const weights = sizeMatrix.map((row) => {
      const baseWeight = Number(row.base_metal_weight_gm);
      const targetWeight = baseWeight * (targetMultiplier / baseMultiplier);
      
      // format ring_size nicely, removing trailing zero if integer
      const formattedRingSize = Number(row.ring_size).toString();
      
      return {
        ringSize: formattedRingSize,
        targetWeight: Number(targetWeight.toFixed(3)),
      };
    });

    return {
      status: true,
      message: 'Target weights calculated successfully',
      statusCode: 200,
      data: {
        variantId,
        targetPurity,
        weights,
      },
    };
  }
}

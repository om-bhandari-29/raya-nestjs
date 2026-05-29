import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { StoneType } from './entity/stone-type.entity';
import { StoneClarity } from './entity/stone-clarity.entity';
import { StoneShape } from './entity/stone-shape.entity';
import { CreateStoneMasterDto } from './dto/create-stone-master.dto';
import { UpdateStoneMasterDto } from './dto/update-stone-master.dto';

type StoneRepo =
  | Repository<StoneType>
  | Repository<StoneClarity>
  | Repository<StoneShape>;

@Injectable()
export class StoneMasterService {
  constructor(
    @InjectRepository(StoneType)
    private readonly typeRepo: Repository<StoneType>,
    @InjectRepository(StoneClarity)
    private readonly clarityRepo: Repository<StoneClarity>,
    @InjectRepository(StoneShape)
    private readonly shapeRepo: Repository<StoneShape>,
  ) {}

  private getRepo(type: 'type' | 'clarity' | 'shape'): StoneRepo {
    if (type === 'type') return this.typeRepo;
    if (type === 'clarity') return this.clarityRepo;
    return this.shapeRepo;
  }

  async combo(type: 'type' | 'clarity' | 'shape') {
    const repo = this.getRepo(type);
    const data = await (repo as Repository<StoneType>).find({
      where: { is_published: true } as any,
      select: ['id', 'name'] as any,
      order: { name: 'ASC' } as any,
    });
    return {
      status: true,
      message: `Stone ${type} combo retrieved successfully`,
      statusCode: 200,
      data,
    };
  }

  async create(type: 'type' | 'clarity' | 'shape', dto: CreateStoneMasterDto) {
    const repo = this.getRepo(type);
    const entity = repo.create(dto as any);
    try {
      await repo.save(entity as any);
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        (error as any).code === '23505'
      ) {
        throw new ConflictException(
          `Stone ${type} with name "${dto.name}" already exists`,
        );
      }
      throw error;
    }
    return {
      status: true,
      message: `Stone ${type} created successfully`,
      statusCode: 201,
      data: entity,
    };
  }

  async findAll(
    type: 'type' | 'clarity' | 'shape',
    page: number,
    limit: number,
    search?: string,
  ) {
    const repo = this.getRepo(type);
    const query = repo
      .createQueryBuilder('s')
      .orderBy('s.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (search) {
      query.where('s.name ILIKE :search', {
        search: `%${search}%`,
      });
    }

    const [data, total] = await query.getManyAndCount();

    return {
      status: true,
      message: `Stone ${type} list retrieved successfully`,
      statusCode: 200,
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(type: 'type' | 'clarity' | 'shape', name: string) {
    const repo = this.getRepo(type);
    const entity = await repo.findOne({ where: { name } as any });
    if (!entity)
      throw new NotFoundException(
        `Stone ${type} with name "${name}" not found`,
      );
    return {
      status: true,
      message: `Stone ${type} retrieved successfully`,
      statusCode: 200,
      data: entity,
    };
  }

  async update(
    type: 'type' | 'clarity' | 'shape',
    name: string,
    dto: UpdateStoneMasterDto,
  ) {
    const repo = this.getRepo(type);
    const entity = await repo.findOne({ where: { name } as any });
    if (!entity)
      throw new NotFoundException(
        `Stone ${type} with name "${name}" not found`,
      );
    Object.assign(entity, dto);
    try {
      await repo.save(entity as any);
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        (error as any).code === '23505'
      ) {
        throw new ConflictException(
          `Stone ${type} with name "${dto.name}" already exists`,
        );
      }
      throw error;
    }
    return {
      status: true,
      message: `Stone ${type} updated successfully`,
      statusCode: 200,
      data: entity,
    };
  }

  async remove(type: 'type' | 'clarity' | 'shape', name: string) {
    const repo = this.getRepo(type);
    const entity = await repo.findOne({ where: { name } as any });
    if (!entity)
      throw new NotFoundException(
        `Stone ${type} with name "${name}" not found`,
      );
    await repo.remove(entity as any);
    return {
      status: true,
      message: `Stone ${type} deleted successfully`,
      statusCode: 200,
      data: null,
    };
  }
}

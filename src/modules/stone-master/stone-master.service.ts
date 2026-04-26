import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StoneFamily } from './entity/stone-family.entity';
import { StoneClarity } from './entity/stone-clarity.entity';
import { StoneShape } from './entity/stone-shape.entity';
import { CreateStoneMasterDto } from './dto/create-stone-master.dto';
import { UpdateStoneMasterDto } from './dto/update-stone-master.dto';

type StoneRepo =
  | Repository<StoneFamily>
  | Repository<StoneClarity>
  | Repository<StoneShape>;

type StoneEntity = StoneFamily | StoneClarity | StoneShape;

@Injectable()
export class StoneMasterService {
  constructor(
    @InjectRepository(StoneFamily)
    private readonly familyRepo: Repository<StoneFamily>,
    @InjectRepository(StoneClarity)
    private readonly clarityRepo: Repository<StoneClarity>,
    @InjectRepository(StoneShape)
    private readonly shapeRepo: Repository<StoneShape>,
  ) {}

  private getRepo(type: 'family' | 'clarity' | 'shape'): StoneRepo {
    if (type === 'family') return this.familyRepo;
    if (type === 'clarity') return this.clarityRepo;
    return this.shapeRepo;
  }

  async create(type: 'family' | 'clarity' | 'shape', dto: CreateStoneMasterDto) {
    const repo = this.getRepo(type);
    const entity = repo.create(dto as any);
    await repo.save(entity as any);
    return { status: true, message: `Stone ${type} created successfully`, statusCode: 201, data: entity };
  }

  async findAll(type: 'family' | 'clarity' | 'shape') {
    const repo = this.getRepo(type);
    const data = await repo.find();
    return { status: true, message: `Stone ${type} list retrieved successfully`, statusCode: 200, data };
  }

  async findOne(type: 'family' | 'clarity' | 'shape', id: number) {
    const repo = this.getRepo(type);
    const entity = await repo.findOne({ where: { id } as any });
    if (!entity) throw new NotFoundException(`Stone ${type} with id ${id} not found`);
    return { status: true, message: `Stone ${type} retrieved successfully`, statusCode: 200, data: entity };
  }

  async update(type: 'family' | 'clarity' | 'shape', id: number, dto: UpdateStoneMasterDto) {
    const repo = this.getRepo(type);
    const entity = await repo.findOne({ where: { id } as any });
    if (!entity) throw new NotFoundException(`Stone ${type} with id ${id} not found`);
    Object.assign(entity, dto);
    await repo.save(entity as any);
    return { status: true, message: `Stone ${type} updated successfully`, statusCode: 200, data: entity };
  }

  async remove(type: 'family' | 'clarity' | 'shape', id: number) {
    const repo = this.getRepo(type);
    const entity = await repo.findOne({ where: { id } as any });
    if (!entity) throw new NotFoundException(`Stone ${type} with id ${id} not found`);
    await repo.remove(entity as any);
    return { status: true, message: `Stone ${type} deleted successfully`, statusCode: 200, data: null };
  }
}

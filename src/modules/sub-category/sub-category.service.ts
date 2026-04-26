import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubCategory } from './entity/sub-category.entity';
import { CreateSubCategoryDto } from './dto/create-sub-category.dto';
import { UpdateSubCategoryDto } from './dto/update-sub-category.dto';

@Injectable()
export class SubCategoryService {
  constructor(
    @InjectRepository(SubCategory)
    private readonly subCategoryRepository: Repository<SubCategory>,
  ) {}

  async create(createSubCategoryDto: CreateSubCategoryDto) {
    const subCategory = this.subCategoryRepository.create(createSubCategoryDto);
    await this.subCategoryRepository.save(subCategory);
    return {
      status: true,
      message: 'Sub-category created successfully',
      statusCode: 201,
      data: subCategory,
    };
  }

  async combo(itemGroupId?: number) {
    const query = this.subCategoryRepository
      .createQueryBuilder('sc')
      .select(['sc.id', 'sc.name'])
      .where('sc.is_active = :isActive', { isActive: true })
      .orderBy('sc.name', 'ASC');

    if (itemGroupId) {
      query.andWhere('sc.item_group_id = :itemGroupId', { itemGroupId });
    }

    const data = await query.getMany();
    return {
      status: true,
      message: 'Sub-category combo retrieved successfully',
      statusCode: 200,
      data,
    };
  }

  async findAll() {
    const subCategories = await this.subCategoryRepository.find({ relations: ['item_group'] });
    return {
      status: true,
      message: 'Sub-categories retrieved successfully',
      statusCode: 200,
      data: subCategories,
    };
  }

  async findOne(id: number) {
    const subCategory = await this.subCategoryRepository.findOne({ where: { id }, relations: ['item_group'] });
    if (!subCategory) {
      throw new NotFoundException(`Sub-category with id ${id} not found`);
    }
    return {
      status: true,
      message: 'Sub-category retrieved successfully',
      statusCode: 200,
      data: subCategory,
    };
  }

  async update(id: number, updateSubCategoryDto: UpdateSubCategoryDto) {
    const subCategory = await this.subCategoryRepository.findOne({ where: { id } });
    if (!subCategory) {
      throw new NotFoundException(`Sub-category with id ${id} not found`);
    }
    Object.assign(subCategory, updateSubCategoryDto);
    await this.subCategoryRepository.save(subCategory);
    return {
      status: true,
      message: 'Sub-category updated successfully',
      statusCode: 200,
      data: subCategory,
    };
  }

  async remove(id: number) {
    const subCategory = await this.subCategoryRepository.findOne({ where: { id } });
    if (!subCategory) {
      throw new NotFoundException(`Sub-category with id ${id} not found`);
    }
    await this.subCategoryRepository.remove(subCategory);
    return {
      status: true,
      message: 'Sub-category deleted successfully',
      statusCode: 200,
      data: null,
    };
  }
}

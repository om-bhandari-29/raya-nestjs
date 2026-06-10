import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductMaster } from './entity/product-master.entity';
import { CreateProductMasterDto } from './dto/create-product-master.dto';
import { UpdateProductMasterDto } from './dto/update-product-master.dto';

@Injectable()
export class ProductMasterService {
  constructor(
    @InjectRepository(ProductMaster)
    private readonly productMasterRepository: Repository<ProductMaster>,
  ) {}

  async create(createProductMasterDto: CreateProductMasterDto) {
    const product = this.productMasterRepository.create(createProductMasterDto);
    await this.productMasterRepository.save(product);
    return {
      status: true,
      message: 'Product master created successfully',
      statusCode: 201,
      data: product,
    };
  }

  async combo(
    subCategoryId: number | null,
    page: number,
    limit: number,
    search?: string,
  ) {
    const query = this.productMasterRepository
      .createQueryBuilder('pm')
      .select(['pm.id', 'pm.name'])
      .where('pm.is_active = :isActive', { isActive: true });

    if (subCategoryId) {
      query.andWhere('pm.sub_category_id = :subCategoryId', { subCategoryId });
    }

    if (search) {
      query.andWhere('pm.name ILIKE :search', { search: `%${search}%` });
    }

    const [items, total] = await query
      .orderBy('pm.name', 'ASC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      status: true,
      message: 'Product master combo retrieved successfully',
      statusCode: 200,
      data: {
        items,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  }

  async findAll() {
    const products = await this.productMasterRepository.find({
      relations: ['sub_category'],
    });
    return {
      status: true,
      message: 'Product masters retrieved successfully',
      statusCode: 200,
      data: products,
    };
  }

  async findOne(name: string) {
    const product = await this.productMasterRepository.findOne({
      where: { name },
      relations: ['sub_category'],
    });
    if (!product) {
      throw new NotFoundException(`Product master with name ${name} not found`);
    }
    return {
      status: true,
      message: 'Product master retrieved successfully',
      statusCode: 200,
      data: product,
    };
  }

  async update(name: string, updateProductMasterDto: UpdateProductMasterDto) {
    const product = await this.productMasterRepository.findOne({
      where: { name },
    });
    if (!product) {
      throw new NotFoundException(`Product master with name ${name} not found`);
    }
    Object.assign(product, updateProductMasterDto);
    await this.productMasterRepository.save(product);
    return {
      status: true,
      message: 'Product master updated successfully',
      statusCode: 200,
      data: product,
    };
  }

  async remove(name: string) {
    const product = await this.productMasterRepository.findOne({
      where: { name },
    });
    if (!product) {
      throw new NotFoundException(`Product master with name ${name} not found`);
    }
    await this.productMasterRepository.remove(product);
    return {
      status: true,
      message: 'Product master deleted successfully',
      statusCode: 200,
      data: null,
    };
  }
}

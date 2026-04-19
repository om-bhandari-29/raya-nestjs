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

  async findOne(id: number) {
    const product = await this.productMasterRepository.findOne({
      where: { id },
      relations: ['sub_category'],
    });
    if (!product) {
      throw new NotFoundException(`Product master with id ${id} not found`);
    }
    return {
      status: true,
      message: 'Product master retrieved successfully',
      statusCode: 200,
      data: product,
    };
  }

  async update(id: number, updateProductMasterDto: UpdateProductMasterDto) {
    const product = await this.productMasterRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product master with id ${id} not found`);
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

  async remove(id: number) {
    const product = await this.productMasterRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product master with id ${id} not found`);
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

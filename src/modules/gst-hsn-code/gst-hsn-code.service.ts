import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GstHsnCode } from './entity/gst-hsn-code.entity';
import { CreateGstHsnCodeDto } from './dto/create-gst-hsn-code.dto';
import { UpdateGstHsnCodeDto } from './dto/update-gst-hsn-code.dto';

@Injectable()
export class GstHsnCodeService {
  constructor(
    @InjectRepository(GstHsnCode)
    private readonly gstHsnCodeRepository: Repository<GstHsnCode>,
  ) {}

  async create(createGstHsnCodeDto: CreateGstHsnCodeDto) {
    const existing = await this.gstHsnCodeRepository.findOne({
      where: { hsn_code: createGstHsnCodeDto.hsn_code },
    });
    if (existing) {
      throw new ConflictException(
        `GST HSN code '${createGstHsnCodeDto.hsn_code}' already exists`,
      );
    }

    const gstHsnCode = this.gstHsnCodeRepository.create(createGstHsnCodeDto);
    await this.gstHsnCodeRepository.save(gstHsnCode);
    return {
      status: true,
      message: 'GST HSN code created successfully',
      statusCode: 201,
      data: gstHsnCode,
    };
  }

  async findAll() {
    const gstHsnCodes = await this.gstHsnCodeRepository.find();
    return {
      status: true,
      message: 'GST HSN codes retrieved successfully',
      statusCode: 200,
      data: gstHsnCodes,
    };
  }

  async findOne(id: number) {
    const gstHsnCode = await this.gstHsnCodeRepository.findOne({
      where: { id },
    });
    if (!gstHsnCode) {
      throw new NotFoundException(`GST HSN code with id ${id} not found`);
    }
    return {
      status: true,
      message: 'GST HSN code retrieved successfully',
      statusCode: 200,
      data: gstHsnCode,
    };
  }

  async update(id: number, updateGstHsnCodeDto: UpdateGstHsnCodeDto) {
    const gstHsnCode = await this.gstHsnCodeRepository.findOne({
      where: { id },
    });
    if (!gstHsnCode) {
      throw new NotFoundException(`GST HSN code with id ${id} not found`);
    }

    if (
      updateGstHsnCodeDto.hsn_code &&
      updateGstHsnCodeDto.hsn_code !== gstHsnCode.hsn_code
    ) {
      const existing = await this.gstHsnCodeRepository.findOne({
        where: { hsn_code: updateGstHsnCodeDto.hsn_code },
      });
      if (existing) {
        throw new ConflictException(
          `GST HSN code '${updateGstHsnCodeDto.hsn_code}' already exists`,
        );
      }
    }

    Object.assign(gstHsnCode, updateGstHsnCodeDto);
    await this.gstHsnCodeRepository.save(gstHsnCode);
    return {
      status: true,
      message: 'GST HSN code updated successfully',
      statusCode: 200,
      data: gstHsnCode,
    };
  }

  async remove(id: number) {
    const gstHsnCode = await this.gstHsnCodeRepository.findOne({
      where: { id },
    });
    if (!gstHsnCode) {
      throw new NotFoundException(`GST HSN code with id ${id} not found`);
    }
    await this.gstHsnCodeRepository.remove(gstHsnCode);
    return {
      status: true,
      message: 'GST HSN code deleted successfully',
      statusCode: 200,
      data: null,
    };
  }
}

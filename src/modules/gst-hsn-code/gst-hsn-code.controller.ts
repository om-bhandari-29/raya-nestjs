import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GstHsnCodeService } from './gst-hsn-code.service';
import { CreateGstHsnCodeDto } from './dto/create-gst-hsn-code.dto';
import { UpdateGstHsnCodeDto } from './dto/update-gst-hsn-code.dto';
import {
  CreateGstHsnCodeSwagger,
  FindAllGstHsnCodesSwagger,
  FindOneGstHsnCodeSwagger,
  UpdateGstHsnCodeSwagger,
  RemoveGstHsnCodeSwagger,
} from './gst-hsn-code.swagger';

@ApiTags('gst-hsn-code')
@Controller('gst-hsn-code')
export class GstHsnCodeController {
  constructor(private readonly gstHsnCodeService: GstHsnCodeService) {}

  @Post()
  @CreateGstHsnCodeSwagger()
  create(@Body() createGstHsnCodeDto: CreateGstHsnCodeDto) {
    return this.gstHsnCodeService.create(createGstHsnCodeDto);
  }

  @Get()
  @FindAllGstHsnCodesSwagger()
  findAll() {
    return this.gstHsnCodeService.findAll();
  }

  @Get(':id')
  @FindOneGstHsnCodeSwagger()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.gstHsnCodeService.findOne(id);
  }

  @Patch(':id')
  @UpdateGstHsnCodeSwagger()
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateGstHsnCodeDto: UpdateGstHsnCodeDto,
  ) {
    return this.gstHsnCodeService.update(id, updateGstHsnCodeDto);
  }

  @Delete(':id')
  @RemoveGstHsnCodeSwagger()
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.gstHsnCodeService.remove(id);
  }
}

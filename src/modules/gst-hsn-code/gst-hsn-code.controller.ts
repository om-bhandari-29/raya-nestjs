import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GstHsnCodeService } from './gst-hsn-code.service';
import { CreateGstHsnCodeDto } from './dto/create-gst-hsn-code.dto';
import { UpdateGstHsnCodeDto } from './dto/update-gst-hsn-code.dto';
import {
  ComboGstHsnCodeSwagger,
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

  @Get('combo')
  @ComboGstHsnCodeSwagger()
  combo() {
    return this.gstHsnCodeService.combo();
  }

  @Get()
  @FindAllGstHsnCodesSwagger()
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('search') search?: string,
  ) {
    return this.gstHsnCodeService.findAll(+page, +limit, search);
  }

  @Get(':name')
  @FindOneGstHsnCodeSwagger()
  findOne(@Param('name') name: string) {
    return this.gstHsnCodeService.findOne(name);
  }

  @Patch(':name')
  @UpdateGstHsnCodeSwagger()
  update(
    @Param('name') name: string,
    @Body() updateGstHsnCodeDto: UpdateGstHsnCodeDto,
  ) {
    return this.gstHsnCodeService.update(name, updateGstHsnCodeDto);
  }

  @Delete(':name')
  @RemoveGstHsnCodeSwagger()
  remove(@Param('name') name: string) {
    return this.gstHsnCodeService.remove(name);
  }
}

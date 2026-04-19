import { PartialType } from '@nestjs/swagger';
import { CreateProductMasterDto } from './create-product-master.dto';

export class UpdateProductMasterDto extends PartialType(CreateProductMasterDto) {}

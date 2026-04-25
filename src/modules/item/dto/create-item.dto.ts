import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { MaterialRequestTypeEnum } from '../../../core/enum/material-request-type.enum';
import { ValuationMethodEnum } from '../../../core/enum/valuation-method.enum';
import { CreateItemBarcodeDto } from './create-item-barcode.dto';

export class CreateItemDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @Type(() => Number)
  product_master_id: number;

  @ApiProperty({ example: 'White Gold Oval Hoop Earrings in Sterling Silver' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Type(() => Number)
  item_group_id: number;

  @ApiPropertyOptional({ example: 1 })
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  hsn_sac_id?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  default_uom_id?: number;

  @ApiPropertyOptional({ example: 0 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  fixed_qty?: number;

  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @IsOptional()
  is_disabled?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @IsOptional()
  allow_alternative_item?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  maintain_stock?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @IsOptional()
  is_in_stock?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @IsOptional()
  has_variants?: boolean;

  @ApiPropertyOptional({ example: 0 })
  @IsInt()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  estimated_delivery_days?: number;

  @ApiPropertyOptional({ example: 0 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  valuation_rate?: number;

  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @IsOptional()
  is_fixed_asset?: boolean;

  @ApiPropertyOptional({ example: 0 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  over_delivery_receipt_allowance?: number;

  @ApiPropertyOptional({ example: 0 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  over_billing_allowance?: number;

  @ApiPropertyOptional({ example: 'A beautiful pair of earrings' })
  @IsString()
  @IsOptional()
  description?: string;

  // Inventory Settings
  @ApiPropertyOptional({ example: 0 })
  @IsInt()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  shelf_life_in_days?: number;

  @ApiPropertyOptional({ example: 365 })
  @IsInt()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  warranty_period_in_days?: number;

  @ApiPropertyOptional({ example: '2099-12-31' })
  @IsDateString()
  @IsOptional()
  end_of_life?: string;

  @ApiPropertyOptional({ example: 0.0 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  weight_per_unit?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  weight_uom_id?: number;

  @ApiPropertyOptional({ enum: MaterialRequestTypeEnum, example: MaterialRequestTypeEnum.purchase })
  @IsEnum(MaterialRequestTypeEnum)
  @IsOptional()
  default_material_request_type?: MaterialRequestTypeEnum;

  @ApiPropertyOptional({ enum: ValuationMethodEnum, example: ValuationMethodEnum.fifo })
  @IsEnum(ValuationMethodEnum)
  @IsOptional()
  valuation_method?: ValuationMethodEnum;

  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @IsOptional()
  allow_negative_stock?: boolean;

  @ApiPropertyOptional({ type: [CreateItemBarcodeDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateItemBarcodeDto)
  @IsOptional()
  barcodes?: CreateItemBarcodeDto[];
}

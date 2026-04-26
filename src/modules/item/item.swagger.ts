import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

const itemExample = {
  id: 1,
  product_master_id: 1,
  name: 'White Gold Oval Hoop Earrings in Sterling Silver',
  item_group_id: 1,
  hsn_sac_id: 1,
  default_uom_id: 1,
  fixed_qty: '0.00',
  is_disabled: false,
  allow_alternative_item: false,
  maintain_stock: true,
  is_in_stock: false,
  has_variants: false,
  estimated_delivery_days: 0,
  valuation_rate: '0.00',
  is_fixed_asset: false,
  over_delivery_receipt_allowance: '0.000',
  over_billing_allowance: '0.000',
  description: null,
  // Inventory
  shelf_life_in_days: 0,
  warranty_period_in_days: null,
  end_of_life: '2099-12-31',
  weight_per_unit: '0.000',
  weight_uom_id: null,
  default_material_request_type: 'Purchase',
  valuation_method: null,
  allow_negative_stock: false,
  // Variants
  stones: null,
  gross_weight: '0.000',
  net_weight: '0.000',
  stones_weight_in_gram: '0.000',
  stone_carat_wt: '0.000',
  pure_weight_metal: '0.000',
  labor_rate: '0.00',
  created_at: '2026-04-25T00:00:00.000Z',
  updated_at: '2026-04-25T00:00:00.000Z',
  product_master: { id: 1, name: 'Earrings' },
  item_group: { id: 1, name: 'Jewellery' },
  hsn_sac: { id: 1, hsn_sac_code: '7113' },
  default_uom: { id: 1, uom_name: 'Nos' },
  weight_uom: null,
  barcodes: [
    {
      id: 1,
      item_id: 1,
      barcode: 'ABC123456789',
      barcode_type: 'EAN',
      uom_id: 1,
      uom: { id: 1, uom_name: 'Nos' },
    },
  ],
  variants: [
    {
      id: 1,
      item_id: 1,
      variant_of_id: null,
      attribute_id: 1,
      value_id: 2,
      is_disabled: false,
      stone_family: null,
      stone_id: null,
      attribute: { id: 1, attribute_name: 'Metal Type' },
      value: { id: 2, attribute_value: 'Silver', abbreviation: 'SL' },
      variant_of: null,
    },
  ],
  stone_details: [
    {
      id: 1,
      item_id: 1,
      stone_family_id: 1,
      stone_clarity_id: 1,
      stone_shape_id: 1,
      weight_carat: '0.500',
      stone_family: { id: 1, name: 'Natural Diamond' },
      stone_clarity: { id: 1, name: 'VVS' },
      stone_shape: { id: 1, name: 'Round' },
    },
  ],
};

const notFoundExample = {
  status: false,
  message: 'Item with id 1 not found',
  statusCode: 404,
  data: null,
};

export const CreateItemSwagger = () =>
  applyDecorators(
    ApiOperation({ summary: 'Create a new item' }),
    ApiResponse({
      status: 201,
      description: 'Item created successfully',
      schema: {
        example: {
          status: true,
          message: 'Item created successfully',
          statusCode: 201,
          data: itemExample,
        },
      },
    }),
  );

export const FindAllItemsSwagger = () =>
  applyDecorators(
    ApiOperation({ summary: 'Get all items' }),
    ApiResponse({
      status: 200,
      description: 'Items retrieved successfully',
      schema: {
        example: {
          status: true,
          message: 'Items retrieved successfully',
          statusCode: 200,
          data: [itemExample],
        },
      },
    }),
  );

export const FindOneItemSwagger = () =>
  applyDecorators(
    ApiOperation({ summary: 'Get an item by id' }),
    ApiResponse({
      status: 200,
      description: 'Item retrieved successfully',
      schema: {
        example: {
          status: true,
          message: 'Item retrieved successfully',
          statusCode: 200,
          data: itemExample,
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Item not found',
      schema: { example: notFoundExample },
    }),
  );

export const UpdateItemSwagger = () =>
  applyDecorators(
    ApiOperation({ summary: 'Update an item by id' }),
    ApiResponse({
      status: 200,
      description: 'Item updated successfully',
      schema: {
        example: {
          status: true,
          message: 'Item updated successfully',
          statusCode: 200,
          data: itemExample,
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Item not found',
      schema: { example: notFoundExample },
    }),
  );

export const RemoveItemSwagger = () =>
  applyDecorators(
    ApiOperation({ summary: 'Delete an item by id' }),
    ApiResponse({
      status: 200,
      description: 'Item deleted successfully',
      schema: {
        example: {
          status: true,
          message: 'Item deleted successfully',
          statusCode: 200,
          data: null,
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Item not found',
      schema: { example: notFoundExample },
    }),
  );

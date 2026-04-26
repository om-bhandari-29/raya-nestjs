import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

const productMasterExample = {
  id: 1,
  name: 'Steel Rod',
  sub_category_id: 1,
  labour_rate: '150.50',
  labour_rate_on: 'Net',
  product_description: 'High quality steel rod',
  is_active: true,
  created_at: '2026-04-19T00:00:00.000Z',
  updated_at: '2026-04-19T00:00:00.000Z',
  sub_category: {
    id: 1,
    name: 'Mobile Phones',
    item_group_id: 1,
    is_active: true,
  },
};

const notFoundExample = {
  status: false,
  message: 'Product master with id 1 not found',
  statusCode: 404,
  data: null,
};

export const ComboProductMasterSwagger = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get product masters for dropdown (id and name only)',
      description: 'Pass optional `sub_category_id` query param to filter by sub-category',
    }),
    ApiQuery({
      name: 'sub_category_id',
      required: false,
      type: Number,
      description: 'Filter product masters by sub-category id',
    }),
    ApiResponse({
      status: 200,
      description: 'Product master combo retrieved successfully',
      schema: {
        example: {
          status: true,
          message: 'Product master combo retrieved successfully',
          statusCode: 200,
          data: [
            { id: 1, name: 'Gold Ring' },
            { id: 2, name: 'Silver Necklace' },
          ],
        },
      },
    }),
  );

export const CreateProductMasterSwagger = () =>
  applyDecorators(
    ApiOperation({ summary: 'Create a new product master' }),
    ApiResponse({
      status: 201,
      description: 'Product master created successfully',
      schema: {
        example: {
          status: true,
          message: 'Product master created successfully',
          statusCode: 201,
          data: productMasterExample,
        },
      },
    }),
  );

export const FindAllProductMastersSwagger = () =>
  applyDecorators(
    ApiOperation({ summary: 'Get all product masters' }),
    ApiResponse({
      status: 200,
      description: 'Product masters retrieved successfully',
      schema: {
        example: {
          status: true,
          message: 'Product masters retrieved successfully',
          statusCode: 200,
          data: [productMasterExample],
        },
      },
    }),
  );

export const FindOneProductMasterSwagger = () =>
  applyDecorators(
    ApiOperation({ summary: 'Get a product master by id' }),
    ApiResponse({
      status: 200,
      description: 'Product master retrieved successfully',
      schema: {
        example: {
          status: true,
          message: 'Product master retrieved successfully',
          statusCode: 200,
          data: productMasterExample,
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Product master not found',
      schema: { example: notFoundExample },
    }),
  );

export const UpdateProductMasterSwagger = () =>
  applyDecorators(
    ApiOperation({ summary: 'Update a product master by id' }),
    ApiResponse({
      status: 200,
      description: 'Product master updated successfully',
      schema: {
        example: {
          status: true,
          message: 'Product master updated successfully',
          statusCode: 200,
          data: productMasterExample,
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Product master not found',
      schema: { example: notFoundExample },
    }),
  );

export const RemoveProductMasterSwagger = () =>
  applyDecorators(
    ApiOperation({ summary: 'Delete a product master by id' }),
    ApiResponse({
      status: 200,
      description: 'Product master deleted successfully',
      schema: {
        example: {
          status: true,
          message: 'Product master deleted successfully',
          statusCode: 200,
          data: null,
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Product master not found',
      schema: { example: notFoundExample },
    }),
  );

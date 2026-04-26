import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

const subCategoryExample = {
  id: 1,
  name: 'Mobile Phones',
  item_group_id: 1,
  is_active: true,
  created_at: '2026-04-18T00:00:00.000Z',
  updated_at: '2026-04-18T00:00:00.000Z',
  item_group: {
    id: 1,
    name: 'Electronics',
    is_active: true,
    created_at: '2026-04-18T00:00:00.000Z',
    updated_at: '2026-04-18T00:00:00.000Z',
  },
};

const notFoundExample = {
  status: false,
  message: 'Sub-category with id 1 not found',
  statusCode: 404,
  data: null,
};

export const ComboSubCategorySwagger = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get sub-categories for dropdown (id and name only)',
      description: 'Pass optional `item_group_id` query param to filter by item group',
    }),
    ApiQuery({
      name: 'item_group_id',
      required: false,
      type: Number,
      description: 'Filter sub-categories by item group id',
    }),
    ApiResponse({
      status: 200,
      description: 'Sub-category combo retrieved successfully',
      schema: {
        example: {
          status: true,
          message: 'Sub-category combo retrieved successfully',
          statusCode: 200,
          data: [
            { id: 1, name: 'Mobile Phones' },
            { id: 2, name: 'Laptops' },
          ],
        },
      },
    }),
  );

export const CreateSubCategorySwagger = () =>
  applyDecorators(
    ApiOperation({ summary: 'Create a new sub-category' }),
    ApiResponse({
      status: 201,
      description: 'Sub-category created successfully',
      schema: {
        example: {
          status: true,
          message: 'Sub-category created successfully',
          statusCode: 201,
          data: subCategoryExample,
        },
      },
    }),
  );

export const FindAllSubCategoriesSwagger = () =>
  applyDecorators(
    ApiOperation({ summary: 'Get all sub-categories' }),
    ApiResponse({
      status: 200,
      description: 'Sub-categories retrieved successfully',
      schema: {
        example: {
          status: true,
          message: 'Sub-categories retrieved successfully',
          statusCode: 200,
          data: [subCategoryExample],
        },
      },
    }),
  );

export const FindOneSubCategorySwagger = () =>
  applyDecorators(
    ApiOperation({ summary: 'Get a sub-category by id' }),
    ApiResponse({
      status: 200,
      description: 'Sub-category retrieved successfully',
      schema: {
        example: {
          status: true,
          message: 'Sub-category retrieved successfully',
          statusCode: 200,
          data: subCategoryExample,
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Sub-category not found',
      schema: { example: notFoundExample },
    }),
  );

export const UpdateSubCategorySwagger = () =>
  applyDecorators(
    ApiOperation({ summary: 'Update a sub-category by id' }),
    ApiResponse({
      status: 200,
      description: 'Sub-category updated successfully',
      schema: {
        example: {
          status: true,
          message: 'Sub-category updated successfully',
          statusCode: 200,
          data: subCategoryExample,
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Sub-category not found',
      schema: { example: notFoundExample },
    }),
  );

export const RemoveSubCategorySwagger = () =>
  applyDecorators(
    ApiOperation({ summary: 'Delete a sub-category by id' }),
    ApiResponse({
      status: 200,
      description: 'Sub-category deleted successfully',
      schema: {
        example: {
          status: true,
          message: 'Sub-category deleted successfully',
          statusCode: 200,
          data: null,
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Sub-category not found',
      schema: { example: notFoundExample },
    }),
  );

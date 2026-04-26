import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

const itemGroupExample = {
  id: 1,
  name: 'Electronics',
  is_active: true,
  created_at: '2026-04-18T00:00:00.000Z',
  updated_at: '2026-04-18T00:00:00.000Z',
};

const notFoundExample = {
  status: false,
  message: 'Item group with id 1 not found',
  statusCode: 404,
  data: null,
};

export const ComboItemGroupSwagger = () =>
  applyDecorators(
    ApiOperation({ summary: 'Get item groups for dropdown (id and name only)' }),
    ApiResponse({
      status: 200,
      description: 'Item group combo retrieved successfully',
      schema: {
        example: {
          status: true,
          message: 'Item group combo retrieved successfully',
          statusCode: 200,
          data: [
            { id: 1, name: 'Electronics' },
            { id: 2, name: 'Jewellery' },
          ],
        },
      },
    }),
  );

export const CreateItemGroupSwagger = () =>
  applyDecorators(
    ApiOperation({ summary: 'Create a new item group' }),
    ApiResponse({
      status: 201,
      description: 'Item group created successfully',
      schema: {
        example: {
          status: true,
          message: 'Item group created successfully',
          statusCode: 201,
          data: itemGroupExample,
        },
      },
    }),
  );

export const FindAllItemGroupsSwagger = () =>
  applyDecorators(
    ApiOperation({ summary: 'Get all item groups' }),
    ApiResponse({
      status: 200,
      description: 'Item groups retrieved successfully',
      schema: {
        example: {
          status: true,
          message: 'Item groups retrieved successfully',
          statusCode: 200,
          data: [itemGroupExample],
        },
      },
    }),
  );

export const FindOneItemGroupSwagger = () =>
  applyDecorators(
    ApiOperation({ summary: 'Get an item group by id' }),
    ApiResponse({
      status: 200,
      description: 'Item group retrieved successfully',
      schema: {
        example: {
          status: true,
          message: 'Item group retrieved successfully',
          statusCode: 200,
          data: itemGroupExample,
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Item group not found',
      schema: { example: notFoundExample },
    }),
  );

export const UpdateItemGroupSwagger = () =>
  applyDecorators(
    ApiOperation({ summary: 'Update an item group by id' }),
    ApiResponse({
      status: 200,
      description: 'Item group updated successfully',
      schema: {
        example: {
          status: true,
          message: 'Item group updated successfully',
          statusCode: 200,
          data: itemGroupExample,
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Item group not found',
      schema: { example: notFoundExample },
    }),
  );

export const RemoveItemGroupSwagger = () =>
  applyDecorators(
    ApiOperation({ summary: 'Delete an item group by id' }),
    ApiResponse({
      status: 200,
      description: 'Item group deleted successfully',
      schema: {
        example: {
          status: true,
          message: 'Item group deleted successfully',
          statusCode: 200,
          data: null,
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Item group not found',
      schema: { example: notFoundExample },
    }),
  );

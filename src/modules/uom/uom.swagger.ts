import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

const uomExample = {
  id: 1,
  name: 'Kilogram',
  description: 'Unit of weight measurement',
  is_active: true,
  created_at: '2026-04-25T00:00:00.000Z',
  updated_at: '2026-04-25T00:00:00.000Z',
};

const notFoundExample = {
  status: false,
  message: 'UOM with id 1 not found',
  statusCode: 404,
  data: null,
};

const conflictExample = {
  status: false,
  message: "UOM 'Kilogram' already exists",
  statusCode: 409,
  data: null,
};

export const ComboUomSwagger = () =>
  applyDecorators(
    ApiOperation({ summary: 'Get UOMs for dropdown (id and name only)' }),
    ApiResponse({
      status: 200,
      description: 'UOM combo retrieved successfully',
      schema: {
        example: {
          status: true,
          message: 'UOM combo retrieved successfully',
          statusCode: 200,
          data: [
            { id: 1, name: 'Gram' },
            { id: 2, name: 'Kilogram' },
          ],
        },
      },
    }),
  );

export const CreateUomSwagger = () =>
  applyDecorators(
    ApiOperation({ summary: 'Create a new UOM' }),
    ApiResponse({
      status: 201,
      description: 'UOM created successfully',
      schema: {
        example: {
          status: true,
          message: 'UOM created successfully',
          statusCode: 201,
          data: uomExample,
        },
      },
    }),
    ApiResponse({
      status: 409,
      description: 'UOM already exists',
      schema: { example: conflictExample },
    }),
  );

export const FindAllUomsSwagger = () =>
  applyDecorators(
    ApiOperation({ summary: 'Get all UOMs' }),
    ApiResponse({
      status: 200,
      description: 'UOMs retrieved successfully',
      schema: {
        example: {
          status: true,
          message: 'UOMs retrieved successfully',
          statusCode: 200,
          data: [uomExample],
        },
      },
    }),
  );

export const FindOneUomSwagger = () =>
  applyDecorators(
    ApiOperation({ summary: 'Get a UOM by id' }),
    ApiResponse({
      status: 200,
      description: 'UOM retrieved successfully',
      schema: {
        example: {
          status: true,
          message: 'UOM retrieved successfully',
          statusCode: 200,
          data: uomExample,
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'UOM not found',
      schema: { example: notFoundExample },
    }),
  );

export const UpdateUomSwagger = () =>
  applyDecorators(
    ApiOperation({ summary: 'Update a UOM by id' }),
    ApiResponse({
      status: 200,
      description: 'UOM updated successfully',
      schema: {
        example: {
          status: true,
          message: 'UOM updated successfully',
          statusCode: 200,
          data: uomExample,
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'UOM not found',
      schema: { example: notFoundExample },
    }),
    ApiResponse({
      status: 409,
      description: 'UOM already exists',
      schema: { example: conflictExample },
    }),
  );

export const RemoveUomSwagger = () =>
  applyDecorators(
    ApiOperation({ summary: 'Delete a UOM by id' }),
    ApiResponse({
      status: 200,
      description: 'UOM deleted successfully',
      schema: {
        example: {
          status: true,
          message: 'UOM deleted successfully',
          statusCode: 200,
          data: null,
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'UOM not found',
      schema: { example: notFoundExample },
    }),
  );

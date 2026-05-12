import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

const gstHsnCodeExample = {
  name: '8471',
  hsn_code: '8471',
  description: 'Automatic data processing machines and units',
  is_active: true,
  created_at: '2026-04-25T00:00:00.000Z',
  updated_at: '2026-04-25T00:00:00.000Z',
};

const notFoundExample = {
  status: false,
  message: "GST HSN code '8471' not found",
  statusCode: 404,
  data: null,
};

const conflictExample = {
  status: false,
  message: "GST HSN code '8471' already exists",
  statusCode: 409,
  data: null,
};

export const ComboGstHsnCodeSwagger = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get GST HSN codes for dropdown (name and hsn_code)',
    }),
    ApiResponse({
      status: 200,
      description: 'GST HSN code combo retrieved successfully',
      schema: {
        example: {
          status: true,
          message: 'GST HSN code combo retrieved successfully',
          statusCode: 200,
          data: [
            { name: '7113', hsn_code: '7113' },
            { name: '7114', hsn_code: '7114' },
          ],
        },
      },
    }),
  );

export const CreateGstHsnCodeSwagger = () =>
  applyDecorators(
    ApiOperation({ summary: 'Create a new GST HSN code' }),
    ApiResponse({
      status: 201,
      description: 'GST HSN code created successfully',
      schema: {
        example: {
          status: true,
          message: 'GST HSN code created successfully',
          statusCode: 201,
          data: gstHsnCodeExample,
        },
      },
    }),
    ApiResponse({
      status: 409,
      description: 'GST HSN code already exists',
      schema: { example: conflictExample },
    }),
  );

export const FindAllGstHsnCodesSwagger = () =>
  applyDecorators(
    ApiOperation({ summary: 'Get all GST HSN codes with pagination' }),
    ApiQuery({
      name: 'page',
      required: false,
      example: 1,
      description: 'Page number (default: 1)',
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      example: 20,
      description: 'Items per page (default: 20)',
    }),
    ApiQuery({
      name: 'search',
      required: false,
      description: 'Search by hsn_code or description',
    }),
    ApiResponse({
      status: 200,
      description: 'GST HSN codes retrieved successfully',
      schema: {
        example: {
          status: true,
          message: 'GST HSN codes retrieved successfully',
          statusCode: 200,
          data: [gstHsnCodeExample],
          meta: {
            total: 5000,
            page: 1,
            limit: 20,
            totalPages: 250,
          },
        },
      },
    }),
  );

export const FindOneGstHsnCodeSwagger = () =>
  applyDecorators(
    ApiOperation({ summary: 'Get a GST HSN code by name' }),
    ApiResponse({
      status: 200,
      description: 'GST HSN code retrieved successfully',
      schema: {
        example: {
          status: true,
          message: 'GST HSN code retrieved successfully',
          statusCode: 200,
          data: gstHsnCodeExample,
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'GST HSN code not found',
      schema: { example: notFoundExample },
    }),
  );

export const UpdateGstHsnCodeSwagger = () =>
  applyDecorators(
    ApiOperation({ summary: 'Update a GST HSN code by name' }),
    ApiResponse({
      status: 200,
      description: 'GST HSN code updated successfully',
      schema: {
        example: {
          status: true,
          message: 'GST HSN code updated successfully',
          statusCode: 200,
          data: gstHsnCodeExample,
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'GST HSN code not found',
      schema: { example: notFoundExample },
    }),
    ApiResponse({
      status: 409,
      description: 'GST HSN code already exists',
      schema: { example: conflictExample },
    }),
  );

export const RemoveGstHsnCodeSwagger = () =>
  applyDecorators(
    ApiOperation({ summary: 'Delete a GST HSN code by name' }),
    ApiResponse({
      status: 200,
      description: 'GST HSN code deleted successfully',
      schema: {
        example: {
          status: true,
          message: 'GST HSN code deleted successfully',
          statusCode: 200,
          data: null,
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'GST HSN code not found',
      schema: { example: notFoundExample },
    }),
  );

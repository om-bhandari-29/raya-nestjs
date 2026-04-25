import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

const gstHsnCodeExample = {
  id: 1,
  hsn_code: '8471',
  description: 'Automatic data processing machines and units',
  gst_rate: '18.00',
  is_active: true,
  created_at: '2026-04-25T00:00:00.000Z',
  updated_at: '2026-04-25T00:00:00.000Z',
};

const notFoundExample = {
  status: false,
  message: 'GST HSN code with id 1 not found',
  statusCode: 404,
  data: null,
};

const conflictExample = {
  status: false,
  message: "GST HSN code '8471' already exists",
  statusCode: 409,
  data: null,
};

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
    ApiOperation({ summary: 'Get all GST HSN codes' }),
    ApiResponse({
      status: 200,
      description: 'GST HSN codes retrieved successfully',
      schema: {
        example: {
          status: true,
          message: 'GST HSN codes retrieved successfully',
          statusCode: 200,
          data: [gstHsnCodeExample],
        },
      },
    }),
  );

export const FindOneGstHsnCodeSwagger = () =>
  applyDecorators(
    ApiOperation({ summary: 'Get a GST HSN code by id' }),
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
    ApiOperation({ summary: 'Update a GST HSN code by id' }),
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
    ApiOperation({ summary: 'Delete a GST HSN code by id' }),
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

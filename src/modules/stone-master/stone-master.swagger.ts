import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

const example = () => ({
  id: 1,
  name: 'Diamond',
  is_published: true,
  created_at: '2026-04-25T00:00:00.000Z',
  updated_at: '2026-04-25T00:00:00.000Z',
});

const notFound = (type: string) => ({
  status: false,
  message: `Stone ${type} with name "Diamond" not found`,
  statusCode: 404,
  data: null,
});

export const ComboStoneMasterSwagger = (type: string) =>
  applyDecorators(
    ApiOperation({
      summary: `Get stone ${type}s for dropdown (id and name only)`,
    }),
    ApiResponse({
      status: 200,
      description: `Stone ${type} combo retrieved successfully`,
      schema: {
        example: {
          status: true,
          message: `Stone ${type} combo retrieved successfully`,
          statusCode: 200,
          data: [
            { id: 1, name: 'Diamond' },
            { id: 2, name: 'Ruby' },
          ],
        },
      },
    }),
  );

export const CreateStoneMasterSwagger = (type: string) =>
  applyDecorators(
    ApiOperation({ summary: `Create a new stone ${type}` }),
    ApiResponse({
      status: 201,
      description: `Stone ${type} created successfully`,
      schema: {
        example: {
          status: true,
          message: `Stone ${type} created successfully`,
          statusCode: 201,
          data: example(),
        },
      },
    }),
  );

export const FindAllStoneMasterSwagger = (type: string) =>
  applyDecorators(
    ApiOperation({ summary: `Get all stone ${type}s (paginated)` }),
    ApiQuery({ name: 'page', required: false, type: Number, example: 1 }),
    ApiQuery({ name: 'limit', required: false, type: Number, example: 20 }),
    ApiQuery({
      name: 'search',
      required: false,
      type: String,
      description: 'Search by name',
    }),
    ApiResponse({
      status: 200,
      description: `Stone ${type} list retrieved successfully`,
      schema: {
        example: {
          status: true,
          message: `Stone ${type} list retrieved successfully`,
          statusCode: 200,
          data: [example()],
          meta: {
            total: 50,
            page: 1,
            limit: 20,
            totalPages: 3,
          },
        },
      },
    }),
  );

export const FindOneStoneMasterSwagger = (type: string) =>
  applyDecorators(
    ApiOperation({ summary: `Get a stone ${type} by name` }),
    ApiResponse({
      status: 200,
      description: `Stone ${type} retrieved successfully`,
      schema: {
        example: {
          status: true,
          message: `Stone ${type} retrieved successfully`,
          statusCode: 200,
          data: example(),
        },
      },
    }),
    ApiResponse({ status: 404, schema: { example: notFound(type) } }),
  );

export const UpdateStoneMasterSwagger = (type: string) =>
  applyDecorators(
    ApiOperation({ summary: `Update a stone ${type} by name` }),
    ApiResponse({
      status: 200,
      description: `Stone ${type} updated successfully`,
      schema: {
        example: {
          status: true,
          message: `Stone ${type} updated successfully`,
          statusCode: 200,
          data: example(),
        },
      },
    }),
    ApiResponse({ status: 404, schema: { example: notFound(type) } }),
  );

export const RemoveStoneMasterSwagger = (type: string) =>
  applyDecorators(
    ApiOperation({ summary: `Delete a stone ${type} by name` }),
    ApiResponse({
      status: 200,
      description: `Stone ${type} deleted successfully`,
      schema: {
        example: {
          status: true,
          message: `Stone ${type} deleted successfully`,
          statusCode: 200,
          data: null,
        },
      },
    }),
    ApiResponse({ status: 404, schema: { example: notFound(type) } }),
  );

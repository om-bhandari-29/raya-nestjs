import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';

// ===== Metal Purity Examples =====

const metalPurityExample = {
  id: 1,
  purity: '14K Gold',
  name: '14K Gold Name',
  metal_id: 1,
  percentage: 58.33,
  rate_per_gram_inr: 4500.0,
  rate_per_gram_usd: 54.5,
  created_at: '2026-07-03T00:00:00.000Z',
  updated_at: '2026-07-03T00:00:00.000Z',
};

const metalPurityNotFoundExample = {
  status: false,
  message: "Metal purity with ID '1' not found",
  statusCode: 404,
  data: null,
};

const metalPurityConflictExample = {
  status: false,
  message:
    "Metal purity with purity '14K Gold' and metal_id '1' already exists",
  statusCode: 409,
  data: null,
};

// ===== Metal Color Examples =====

const metalColorExample = {
  id: 1,
  name: 'Yellow',
  created_at: '2026-07-03T00:00:00.000Z',
  updated_at: '2026-07-03T00:00:00.000Z',
};

const metalColorNotFoundExample = {
  status: false,
  message: "Metal color with ID '1' not found",
  statusCode: 404,
  data: null,
};

const metalColorConflictExample = {
  status: false,
  message: "Metal color with name 'Yellow' already exists",
  statusCode: 409,
  data: null,
};

// ===== Metal Purity Swagger Decorators =====

export const ComboMetalPuritySwagger = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get metal purities for dropdown (id, name, and code only)',
    }),
    ApiResponse({
      status: 200,
      description: 'Metal purity combo retrieved successfully',
      schema: {
        example: {
          status: true,
          message: 'Metal purity combo retrieved successfully',
          statusCode: 200,
          data: [
            { id: 1, name: '14K Gold', code: 'GOLD_14K' },
            { id: 2, name: '18K Gold', code: 'GOLD_18K' },
          ],
        },
      },
    }),
  );

export const CreateMetalPuritySwagger = () =>
  applyDecorators(
    ApiOperation({ summary: 'Create a new metal purity' }),
    ApiResponse({
      status: 201,
      description: 'Metal purity created successfully',
      schema: {
        example: {
          status: true,
          message: 'Metal purity created successfully',
          statusCode: 201,
          data: metalPurityExample,
        },
      },
    }),
    ApiResponse({
      status: 409,
      description: 'Metal purity already exists',
      schema: { example: metalPurityConflictExample },
    }),
  );

export const FindAllMetalPuritiesSwagger = () =>
  applyDecorators(
    ApiOperation({ summary: 'Get paginated list of metal purities' }),
    ApiQuery({
      name: 'page',
      required: false,
      example: 1,
      description: 'Page number',
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      example: 10,
      description: 'Items per page',
    }),
    ApiQuery({
      name: 'search',
      required: false,
      example: '14K',
      description: 'Search by name or code',
    }),
    ApiResponse({
      status: 200,
      description: 'Metal purities retrieved successfully',
      schema: {
        example: {
          status: true,
          message: 'Metal purities retrieved successfully',
          statusCode: 200,
          data: {
            items: [metalPurityExample],
          },
          meta: {
            total: 1,
            page: 1,
            limit: 10,
            totalPages: 1,
          },
        },
      },
    }),
  );

export const FindOneMetalPuritySwagger = () =>
  applyDecorators(
    ApiOperation({ summary: 'Get a metal purity by id' }),
    ApiParam({ name: 'id', type: 'number', example: 1 }),
    ApiResponse({
      status: 200,
      description: 'Metal purity retrieved successfully',
      schema: {
        example: {
          status: true,
          message: 'Metal purity retrieved successfully',
          statusCode: 200,
          data: metalPurityExample,
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Metal purity not found',
      schema: { example: metalPurityNotFoundExample },
    }),
  );

export const UpdateMetalPuritySwagger = () =>
  applyDecorators(
    ApiOperation({ summary: 'Update a metal purity by id' }),
    ApiParam({ name: 'id', type: 'number', example: 1 }),
    ApiResponse({
      status: 200,
      description: 'Metal purity updated successfully',
      schema: {
        example: {
          status: true,
          message: 'Metal purity updated successfully',
          statusCode: 200,
          data: metalPurityExample,
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Metal purity not found',
      schema: { example: metalPurityNotFoundExample },
    }),
    ApiResponse({
      status: 409,
      description: 'Metal purity already exists',
      schema: { example: metalPurityConflictExample },
    }),
  );

export const RemoveMetalPuritySwagger = () =>
  applyDecorators(
    ApiOperation({ summary: 'Delete a metal purity by id' }),
    ApiParam({ name: 'id', type: 'number', example: 1 }),
    ApiResponse({
      status: 200,
      description: 'Metal purity deleted successfully',
      schema: {
        example: {
          status: true,
          message: 'Metal purity deleted successfully',
          statusCode: 200,
          data: null,
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Metal purity not found',
      schema: { example: metalPurityNotFoundExample },
    }),
  );

export const GetAllowedMetalsByVariantSwagger = () =>
  applyDecorators(
    ApiOperation({
      summary:
        'Get metal purities and colors for a given variant ID with purity name',
      description: 'Returns list containing id (metal_purity_id) and purity.',
    }),
    ApiParam({
      name: 'variantId',
      type: 'number',
      example: 1,
      description: 'The variant (blueprint) ID',
    }),
    ApiResponse({
      status: 200,
      description: 'Allowed metals retrieved successfully',
      schema: {
        example: {
          status: true,
          message: 'Allowed metals for variant retrieved successfully',
          statusCode: 200,
          data: [
            {
              id: 2,
              purity: '18K Gold',
            },
          ],
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Product variant/blueprint not found',
      schema: {
        example: {
          status: false,
          message: "Product variant/blueprint with ID '1' not found",
          statusCode: 404,
          data: null,
        },
      },
    }),
  );

// ===== Metal Color Swagger Decorators =====

export const ComboMetalColorSwagger = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get metal colors for dropdown (id and name only)',
    }),
    ApiResponse({
      status: 200,
      description: 'Metal color combo retrieved successfully',
      schema: {
        example: {
          status: true,
          message: 'Metal color combo retrieved successfully',
          statusCode: 200,
          data: [
            { id: 1, name: 'Yellow' },
            { id: 2, name: 'Rose' },
          ],
        },
      },
    }),
  );

export const CreateMetalColorSwagger = () =>
  applyDecorators(
    ApiOperation({ summary: 'Create a new metal color' }),
    ApiResponse({
      status: 201,
      description: 'Metal color created successfully',
      schema: {
        example: {
          status: true,
          message: 'Metal color created successfully',
          statusCode: 201,
          data: metalColorExample,
        },
      },
    }),
    ApiResponse({
      status: 409,
      description: 'Metal color already exists',
      schema: { example: metalColorConflictExample },
    }),
  );

export const FindAllMetalColorsSwagger = () =>
  applyDecorators(
    ApiOperation({ summary: 'Get paginated list of metal colors' }),
    ApiQuery({
      name: 'page',
      required: false,
      example: 1,
      description: 'Page number',
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      example: 10,
      description: 'Items per page',
    }),
    ApiQuery({
      name: 'search',
      required: false,
      example: 'Yellow',
      description: 'Search by name',
    }),
    ApiResponse({
      status: 200,
      description: 'Metal colors retrieved successfully',
      schema: {
        example: {
          status: true,
          message: 'Metal colors retrieved successfully',
          statusCode: 200,
          data: {
            items: [metalColorExample],
          },
          meta: {
            total: 1,
            page: 1,
            limit: 10,
            totalPages: 1,
          },
        },
      },
    }),
  );

export const FindOneMetalColorSwagger = () =>
  applyDecorators(
    ApiOperation({ summary: 'Get a metal color by id' }),
    ApiParam({ name: 'id', type: 'number', example: 1 }),
    ApiResponse({
      status: 200,
      description: 'Metal color retrieved successfully',
      schema: {
        example: {
          status: true,
          message: 'Metal color retrieved successfully',
          statusCode: 200,
          data: metalColorExample,
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Metal color not found',
      schema: { example: metalColorNotFoundExample },
    }),
  );

export const UpdateMetalColorSwagger = () =>
  applyDecorators(
    ApiOperation({ summary: 'Update a metal color by id' }),
    ApiParam({ name: 'id', type: 'number', example: 1 }),
    ApiResponse({
      status: 200,
      description: 'Metal color updated successfully',
      schema: {
        example: {
          status: true,
          message: 'Metal color updated successfully',
          statusCode: 200,
          data: metalColorExample,
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Metal color not found',
      schema: { example: metalColorNotFoundExample },
    }),
    ApiResponse({
      status: 409,
      description: 'Metal color already exists',
      schema: { example: metalColorConflictExample },
    }),
  );

export const RemoveMetalColorSwagger = () =>
  applyDecorators(
    ApiOperation({ summary: 'Delete a metal color by id' }),
    ApiParam({ name: 'id', type: 'number', example: 1 }),
    ApiResponse({
      status: 200,
      description: 'Metal color deleted successfully',
      schema: {
        example: {
          status: true,
          message: 'Metal color deleted successfully',
          statusCode: 200,
          data: null,
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Metal color not found',
      schema: { example: metalColorNotFoundExample },
    }),
  );

export const FindMetalsWithPuritiesSwagger = () =>
  applyDecorators(
    ApiOperation({ summary: 'Get list of metals and their purities' }),
    ApiQuery({
      name: 'page',
      required: false,
      example: 1,
      description: 'Page number',
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      example: 10,
      description: 'Items per page',
    }),
    ApiQuery({
      name: 'search',
      required: false,
      example: 'Gold',
      description: 'Search by metal name',
    }),
    ApiQuery({
      name: 'metal_id',
      required: false,
      example: 1,
      description: 'Filter by metal ID',
    }),
    ApiQuery({
      name: 'isPagination',
      required: false,
      example: 'true',
      description: 'Enable pagination if true',
    }),
    ApiResponse({
      status: 200,
      description: 'Metals with purities retrieved successfully',
      schema: {
        example: {
          status: true,
          message: 'Metals with purities retrieved successfully',
          statusCode: 200,
          data: {
            items: [
              {
                id: 1,
                name: 'Gold',
                created_at: '2026-07-03T00:00:00.000Z',
                updated_at: '2026-07-03T00:00:00.000Z',
                purities: [
                  {
                    id: 1,
                    purity: '14K Gold',
                    name: '14K Gold Name',
                    metal_id: 1,
                    percentage: 58.33,
                    rate_per_gram_inr: 4500.0,
                    rate_per_gram_usd: 54.5,
                    created_at: '2026-07-03T00:00:00.000Z',
                    updated_at: '2026-07-03T00:00:00.000Z',
                  },
                ],
              },
            ],
          },
        },
      },
    }),
  );

export const GroupedByMetalSwagger = () =>
  applyDecorators(
    ApiOperation({ summary: 'Get all metal purities grouped by metal type' }),
    ApiQuery({
      name: 'isPagination',
      required: false,
      example: 'false',
      description: 'Ignored, always returns flat list for dynamic forms',
    }),
    ApiResponse({
      status: 200,
      description: 'Metal purities grouped by metal type retrieved successfully',
      schema: {
        example: {
          status: true,
          message: 'Metal purities grouped by metal type retrieved successfully',
          statusCode: 200,
          data: [
            {
              metal_type_id: 0,
              metal_name: 'GOLD',
              purities: [
                {
                  id: 1,
                  purity: '14K Gold',
                  purity_code: '14K',
                  density_multiplier: 1.2
                }
              ]
            }
          ]
        }
      }
    })
  );


export const CalculateWeightSwagger = () =>
  applyDecorators(
    ApiOperation({ summary: 'Calculate target weight for a variant across sizes based on density multiplier' }),
    ApiResponse({
      status: 200,
      description: 'Calculated weights retrieved successfully',
      schema: {
        example: {
          status: true,
          message: 'Target weights calculated successfully',
          statusCode: 200,
          data: {
            variantId: 102,
            targetPurity: '18K',
            weights: [
              { ringSize: '5', targetWeight: 3.078 },
              { ringSize: '6', targetWeight: 3.433 },
              { ringSize: '7', targetWeight: 3.784 },
              { ringSize: '8', targetWeight: 4.139 }
            ]
          }
        }
      }
    }),
    ApiResponse({
      status: 404,
      description: 'Variant, size matrix, or multiplier not found'
    })
  );


import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

const stoneExample = {
  id: 1,
  shape: 'Round',
  stoneName: 'Diamond',
  cutStyle: 'Brilliant',
  origin: 'South Africa',
  clarity: 'VS1',
  colour: 'D',
  stoneType: 'Natural',
  cutGrade: 'Excellent',
  countryOrigin: 'South Africa',
  enhancementTreatment: 'None',
  sourceFile: 'import_batch_001.csv',
  sizeRange: '1.00-2.00 ct',
  length: 5.25,
  width: 5.25,
  height: 3.15,
  estimatedWeightInCt: 1.25,
  pricePerCt: 5000.00,
  pricePerCtUsd: 6000.00,
  generatedKey: 'Diamond-Round-Natural-Brilliant-Excellent-D-None-5.25x5.25x3.15',
  is_active: true,
  created_at: '2026-05-03T00:00:00.000Z',
  updated_at: '2026-05-03T00:00:00.000Z',
};

const notFoundExample = {
  status: false,
  message: 'Stone with id 1 not found',
  statusCode: 404,
  data: null,
};

export const ComboStoneSwagger = () =>
  applyDecorators(
    ApiOperation({ summary: 'Get stones for dropdown (id, stoneName, and generatedKey only)' }),
    ApiResponse({
      status: 200,
      description: 'Stone combo retrieved successfully',
      schema: {
        example: {
          status: true,
          message: 'Stone combo retrieved successfully',
          statusCode: 200,
          data: [
            { 
              id: 1, 
              stoneName: 'Diamond',
              generatedKey: 'Diamond-Round-Natural-Brilliant-Excellent-D-None-5.25x5.25x3.15'
            },
            { 
              id: 2, 
              stoneName: 'Ruby',
              generatedKey: 'Ruby-Oval-Natural-Mixed-Good-Red-Heat-6.00x4.00x2.50'
            },
          ],
        },
      },
    }),
  );

export const CreateStoneSwagger = () =>
  applyDecorators(
    ApiOperation({ summary: 'Create a new stone' }),
    ApiResponse({
      status: 201,
      description: 'Stone created successfully',
      schema: {
        example: {
          status: true,
          message: 'Stone created successfully',
          statusCode: 201,
          data: stoneExample,
        },
      },
    }),
  );

export const FindAllStonesSwagger = () =>
  applyDecorators(
    ApiOperation({ summary: 'Get all stones with pagination' }),
    ApiResponse({
      status: 200,
      description: 'Stones retrieved successfully',
      schema: {
        example: {
          status: true,
          message: 'Stones retrieved successfully',
          statusCode: 200,
          data: {
            stones: [stoneExample],
            pagination: {
              total: 100,
              page: 1,
              limit: 10,
              totalPages: 10,
            },
          },
        },
      },
    }),
  );

export const FindOneStoneSwagger = () =>
  applyDecorators(
    ApiOperation({ summary: 'Get a stone by id' }),
    ApiResponse({
      status: 200,
      description: 'Stone retrieved successfully',
      schema: {
        example: {
          status: true,
          message: 'Stone retrieved successfully',
          statusCode: 200,
          data: stoneExample,
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Stone not found',
      schema: { example: notFoundExample },
    }),
  );

export const UpdateStoneSwagger = () =>
  applyDecorators(
    ApiOperation({ summary: 'Update a stone by id' }),
    ApiResponse({
      status: 200,
      description: 'Stone updated successfully',
      schema: {
        example: {
          status: true,
          message: 'Stone updated successfully',
          statusCode: 200,
          data: stoneExample,
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Stone not found',
      schema: { example: notFoundExample },
    }),
  );

export const RemoveStoneSwagger = () =>
  applyDecorators(
    ApiOperation({ summary: 'Delete a stone by id' }),
    ApiResponse({
      status: 200,
      description: 'Stone deleted successfully',
      schema: {
        example: {
          status: true,
          message: 'Stone deleted successfully',
          statusCode: 200,
          data: null,
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Stone not found',
      schema: { example: notFoundExample },
    }),
  );

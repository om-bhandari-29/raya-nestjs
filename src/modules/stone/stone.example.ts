/**
 * Stone Module Usage Examples
 * 
 * This file contains example code snippets showing how to use the Stone module.
 * These are not executable tests, but rather documentation examples.
 */

// Example 1: Creating a stone
const createStoneExample = {
  shape: 'Round',
  stoneName: 'Diamond',
  cutStyle: 'Brilliant',
  stoneType: 'Natural',
  cutGrade: 'Excellent',
  colour: 'D',
  clarity: 'VS1',
  enhancementTreatment: 'None',
  origin: 'South Africa',
  countryOrigin: 'South Africa',
  length: 5.25,
  width: 5.25,
  height: 3.15,
  estimatedWeightInCt: 1.25,
  pricePerCt: 5000.00,
  pricePerCtUsd: 6000.00,
  sizeRange: '1.00-2.00 ct',
  sourceFile: 'import_batch_001.csv',
  is_active: true,
};

// Expected generatedKey: "Diamond-Round-Natural-Brilliant-Excellent-D-None-5.25x5.25x3.15"

// Example 2: Creating a ruby
const createRubyExample = {
  shape: 'Oval',
  stoneName: 'Ruby',
  cutStyle: 'Mixed',
  stoneType: 'Natural',
  cutGrade: 'Good',
  colour: 'Red',
  clarity: 'SI1',
  enhancementTreatment: 'Heat',
  length: 6.00,
  width: 4.00,
  height: 2.50,
  estimatedWeightInCt: 0.85,
  pricePerCt: 3000.00,
  pricePerCtUsd: 3500.00,
};

// Expected generatedKey: "Ruby-Oval-Natural-Mixed-Good-Red-Heat-6.00x4.00x2.50"

// Example 3: Creating a sapphire with minimal fields
const createSapphireExample = {
  shape: 'Cushion',
  stoneName: 'Sapphire',
  cutStyle: 'Step',
  stoneType: 'Lab-grown',
  length: 7.50,
  width: 7.50,
  height: 4.20,
};

// Expected generatedKey: "Sapphire-Cushion-Lab-grown-Step---7.50x7.50x4.20"

// Example 4: Updating a stone (only price fields)
const updateStoneExample = {
  pricePerCt: 5500.00,
  pricePerCtUsd: 6500.00,
};
// Note: generatedKey will NOT change since key components weren't modified

// Example 5: Updating stone dimensions (will regenerate key)
const updateDimensionsExample = {
  length: 5.30,
  width: 5.30,
  height: 3.20,
};
// Note: generatedKey WILL change to reflect new dimensions

// Example 6: Pagination parameters
const paginationExample = {
  page: 1,
  limit: 20,
};

/**
 * API Endpoint Examples (using curl)
 */

// Create a stone
const curlCreateExample = `
curl -X POST http://localhost:3000/stone \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify(createStoneExample, null, 2)}'
`;

// Get all stones with pagination
const curlGetAllExample = `
curl -X GET "http://localhost:3000/stone?page=1&limit=10"
`;

// Get combo data for dropdown
const curlComboExample = `
curl -X GET http://localhost:3000/stone/combo
`;

// Get single stone
const curlGetOneExample = `
curl -X GET http://localhost:3000/stone/1
`;

// Update a stone
const curlUpdateExample = `
curl -X PATCH http://localhost:3000/stone/1 \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify(updateStoneExample, null, 2)}'
`;

// Delete a stone
const curlDeleteExample = `
curl -X DELETE http://localhost:3000/stone/1
`;

/**
 * Using StoneService in another module
 */

/*
import { Injectable } from '@nestjs/common';
import { StoneService } from '../stone/stone.service';

@Injectable()
export class MyService {
  constructor(private readonly stoneService: StoneService) {}

  async createDiamond() {
    const result = await this.stoneService.create({
      shape: 'Round',
      stoneName: 'Diamond',
      cutStyle: 'Brilliant',
      stoneType: 'Natural',
      length: 5.25,
      width: 5.25,
      height: 3.15,
    });

    console.log('Created stone with key:', result.data.generatedKey);
    return result;
  }

  async getAllStones() {
    const result = await this.stoneService.findAll(1, 10);
    console.log('Total stones:', result.data.pagination.total);
    return result;
  }

  async getStoneCombo() {
    const result = await this.stoneService.combo();
    return result.data; // Array of { id, stoneName, generatedKey }
  }
}
*/

/**
 * Expected Response Formats
 */

const createResponseExample = {
  status: true,
  message: 'Stone created successfully',
  statusCode: 201,
  data: {
    id: 1,
    shape: 'Round',
    stoneName: 'Diamond',
    cutStyle: 'Brilliant',
    stoneType: 'Natural',
    cutGrade: 'Excellent',
    colour: 'D',
    clarity: 'VS1',
    enhancementTreatment: 'None',
    origin: 'South Africa',
    countryOrigin: 'South Africa',
    length: 5.25,
    width: 5.25,
    height: 3.15,
    estimatedWeightInCt: 1.25,
    pricePerCt: 5000.00,
    pricePerCtUsd: 6000.00,
    sizeRange: '1.00-2.00 ct',
    sourceFile: 'import_batch_001.csv',
    generatedKey: 'Diamond-Round-Natural-Brilliant-Excellent-D-None-5.25x5.25x3.15',
    is_active: true,
    created_at: '2026-05-03T00:00:00.000Z',
    updated_at: '2026-05-03T00:00:00.000Z',
  },
};

const findAllResponseExample = {
  status: true,
  message: 'Stones retrieved successfully',
  statusCode: 200,
  data: {
    stones: [
      // Array of stone objects
    ],
    pagination: {
      total: 100,
      page: 1,
      limit: 10,
      totalPages: 10,
    },
  },
};

const comboResponseExample = {
  status: true,
  message: 'Stone combo retrieved successfully',
  statusCode: 200,
  data: [
    {
      id: 1,
      stoneName: 'Diamond',
      generatedKey: 'Diamond-Round-Natural-Brilliant-Excellent-D-None-5.25x5.25x3.15',
    },
    {
      id: 2,
      stoneName: 'Ruby',
      generatedKey: 'Ruby-Oval-Natural-Mixed-Good-Red-Heat-6.00x4.00x2.50',
    },
  ],
};

const errorResponseExample = {
  status: false,
  message: 'Stone with id 999 not found',
  statusCode: 404,
  data: null,
};

export {
  createStoneExample,
  createRubyExample,
  createSapphireExample,
  updateStoneExample,
  updateDimensionsExample,
  paginationExample,
  curlCreateExample,
  curlGetAllExample,
  curlComboExample,
  curlGetOneExample,
  curlUpdateExample,
  curlDeleteExample,
  createResponseExample,
  findAllResponseExample,
  comboResponseExample,
  errorResponseExample,
};

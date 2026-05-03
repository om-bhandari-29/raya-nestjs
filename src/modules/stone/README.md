# Stone Module

A complete CRUD module for managing stone/gemstone data in the jewelry management system.

## Features

- Full CRUD operations (Create, Read, Update, Delete)
- Automatic key generation based on stone attributes
- Pagination support for listing stones
- Combo endpoint for dropdown selections
- Swagger API documentation
- Input validation using class-validator

## Entity Fields

### String Fields
- `shape` - Shape of the stone (e.g., Round, Oval, Emerald)
- `stoneName` - Name of the stone (e.g., Diamond, Ruby, Sapphire)
- `cutStyle` - Cut style (e.g., Brilliant, Mixed, Step)
- `origin` - Origin of the stone (optional)
- `clarity` - Clarity grade (e.g., VS1, VVS2) (optional)
- `colour` - Color grade (e.g., D, E, F for diamonds) (optional)
- `stoneType` - Type of stone (e.g., Natural, Synthetic, Lab-grown)
- `cutGrade` - Quality of the cut (e.g., Excellent, Very Good) (optional)
- `countryOrigin` - Country of origin (optional)
- `enhancementTreatment` - Any treatments applied (optional)
- `sourceFile` - Source file reference (optional)
- `sizeRange` - Size range description (optional)

### Number Fields
- `length` - Length in mm (decimal, 2 decimal places)
- `width` - Width in mm (decimal, 2 decimal places)
- `height` - Height in mm (decimal, 2 decimal places)
- `estimatedWeightInCt` - Estimated weight in carats (decimal, 2 decimal places)
- `pricePerCt` - Price per carat in local currency (decimal, 2 decimal places)
- `pricePerCtUsd` - Price per carat in USD (decimal, 2 decimal places)

### Generated Fields
- `generatedKey` - Automatically generated unique key based on stone attributes
  - Format: `{stoneName}-{shape}-{stoneType}-{cutStyle}-{cutGrade}-{colour}-{enhancementTreatment}-{length}x{width}x{height}`
  - Dimensions are formatted to 2 decimal places
  - Example: `Diamond-Round-Natural-Brilliant-Excellent-D-None-5.25x5.25x3.15`

### System Fields
- `id` - Primary key (auto-generated)
- `is_active` - Active status (boolean, default: true)
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

## API Endpoints

### POST /stone
Create a new stone record.

**Request Body:**
```json
{
  "shape": "Round",
  "stoneName": "Diamond",
  "cutStyle": "Brilliant",
  "stoneType": "Natural",
  "cutGrade": "Excellent",
  "colour": "D",
  "clarity": "VS1",
  "enhancementTreatment": "None",
  "length": 5.25,
  "width": 5.25,
  "height": 3.15,
  "estimatedWeightInCt": 1.25,
  "pricePerCt": 5000.00,
  "pricePerCtUsd": 6000.00
}
```

**Response:**
```json
{
  "status": true,
  "message": "Stone created successfully",
  "statusCode": 201,
  "data": {
    "id": 1,
    "shape": "Round",
    "stoneName": "Diamond",
    "generatedKey": "Diamond-Round-Natural-Brilliant-Excellent-D-None-5.25x5.25x3.15",
    ...
  }
}
```

### GET /stone
Get all stones with pagination.

**Query Parameters:**
- `page` (optional, default: 1) - Page number
- `limit` (optional, default: 10) - Items per page

**Response:**
```json
{
  "status": true,
  "message": "Stones retrieved successfully",
  "statusCode": 200,
  "data": {
    "stones": [...],
    "pagination": {
      "total": 100,
      "page": 1,
      "limit": 10,
      "totalPages": 10
    }
  }
}
```

### GET /stone/combo
Get stones for dropdown (returns only id, stoneName, and generatedKey).

**Response:**
```json
{
  "status": true,
  "message": "Stone combo retrieved successfully",
  "statusCode": 200,
  "data": [
    {
      "id": 1,
      "stoneName": "Diamond",
      "generatedKey": "Diamond-Round-Natural-Brilliant-Excellent-D-None-5.25x5.25x3.15"
    }
  ]
}
```

### GET /stone/:id
Get a single stone by ID.

**Response:**
```json
{
  "status": true,
  "message": "Stone retrieved successfully",
  "statusCode": 200,
  "data": { ... }
}
```

### PATCH /stone/:id
Update a stone by ID.

**Request Body:** (all fields optional)
```json
{
  "pricePerCt": 5500.00,
  "pricePerCtUsd": 6500.00
}
```

**Note:** The `generatedKey` will be automatically regenerated if any of the key components are updated.

### DELETE /stone/:id
Delete a stone by ID.

**Response:**
```json
{
  "status": true,
  "message": "Stone deleted successfully",
  "statusCode": 200,
  "data": null
}
```

## Key Generation Logic

The `generatedKey` is automatically generated using a `@BeforeInsert()` and `@BeforeUpdate()` hook in the entity. The key is created by concatenating:

1. Stone name
2. Shape
3. Stone type
4. Cut style
5. Cut grade
6. Colour
7. Enhancement treatment
8. Dimensions (formatted as `{length}x{width}x{height}` with 2 decimal places)

Empty or null values are replaced with empty strings, and dimensions default to "0.00" if not provided.

## Database Migration

Run the migration to create the stone table:

```bash
npm run migration:run
```

The migration file is located at: `db/migrations/1777000000000-CreateStoneTable.ts`

## Module Structure

```
src/modules/stone/
├── dto/
│   ├── create-stone.dto.ts    # DTO for creating stones
│   └── update-stone.dto.ts    # DTO for updating stones
├── entity/
│   └── stone.entity.ts        # Stone entity with key generation logic
├── stone.controller.ts        # REST API endpoints
├── stone.service.ts           # Business logic
├── stone.module.ts            # Module definition
├── stone.swagger.ts           # Swagger documentation decorators
└── README.md                  # This file
```

## Usage Example

```typescript
// In another service
import { StoneService } from './modules/stone/stone.service';

constructor(private readonly stoneService: StoneService) {}

async createStone() {
  const result = await this.stoneService.create({
    shape: 'Round',
    stoneName: 'Diamond',
    cutStyle: 'Brilliant',
    stoneType: 'Natural',
    length: 5.25,
    width: 5.25,
    height: 3.15,
  });
  
  console.log(result.data.generatedKey);
  // Output: Diamond-Round-Natural-Brilliant---5.25x5.25x3.15
}
```

## Validation

All DTOs use class-validator decorators for input validation:
- Required fields are validated with `@IsNotEmpty()`
- String fields have max length constraints
- Number fields are validated with `@IsNumber()` and transformed using `@Type(() => Number)`
- Optional fields use `@IsOptional()`

## Notes

- The `generatedKey` field is unique and indexed for fast lookups
- The `stoneName` field is also indexed for search performance
- All decimal fields use precision 10 and scale 2
- The module is exported and can be imported by other modules

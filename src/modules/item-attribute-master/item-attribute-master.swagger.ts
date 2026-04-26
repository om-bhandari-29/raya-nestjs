import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

const attributeExample = {
  id: 1,
  attribute_name: 'Metal Type',
  status: true,
  is_base_attribute: false,
  numeric_values: false,
  values: [
    {
      id: 1,
      attribute_id: 1,
      attribute_value: 'Gold',
      attribute_type: 'Metal',
      abbreviation: 'GL',
      purity_factor: 0,
    },
    {
      id: 2,
      attribute_id: 1,
      attribute_value: 'Silver',
      attribute_type: 'Metal',
      abbreviation: 'SL',
      purity_factor: 0,
    },
  ],
  created_at: '2026-04-25T00:00:00.000Z',
  updated_at: '2026-04-25T00:00:00.000Z',
};

const valueExample = {
  id: 1,
  attribute_id: 1,
  attribute_value: 'Gold',
  attribute_type: 'Metal',
  abbreviation: 'GL',
  purity_factor: 0,
};

const notFoundExample = {
  status: false,
  message: 'Item attribute with id 1 not found',
  statusCode: 404,
  data: null,
};

export const ComboAttributeSwagger = () =>
  applyDecorators(
    ApiOperation({ summary: 'Get item attributes for dropdown (id and attribute_name only)' }),
    ApiResponse({
      status: 200,
      description: 'Item attribute combo retrieved successfully',
      schema: {
        example: {
          status: true,
          message: 'Item attribute combo retrieved successfully',
          statusCode: 200,
          data: [
            { id: 1, attribute_name: 'Metal Type' },
            { id: 2, attribute_name: 'Stone Type' },
          ],
        },
      },
    }),
  );

export const CreateAttributeSwagger = () =>
  applyDecorators(
    ApiOperation({ summary: 'Create a new item attribute' }),
    ApiResponse({
      status: 201,
      description: 'Item attribute created successfully',
      schema: {
        example: {
          status: true,
          message: 'Item attribute created successfully',
          statusCode: 201,
          data: attributeExample,
        },
      },
    }),
  );

export const FindAllAttributesSwagger = () =>
  applyDecorators(
    ApiOperation({ summary: 'Get all item attributes' }),
    ApiResponse({
      status: 200,
      description: 'Item attributes retrieved successfully',
      schema: {
        example: {
          status: true,
          message: 'Item attributes retrieved successfully',
          statusCode: 200,
          data: [attributeExample],
        },
      },
    }),
  );

export const FindOneAttributeSwagger = () =>
  applyDecorators(
    ApiOperation({ summary: 'Get an item attribute by id' }),
    ApiResponse({
      status: 200,
      description: 'Item attribute retrieved successfully',
      schema: {
        example: {
          status: true,
          message: 'Item attribute retrieved successfully',
          statusCode: 200,
          data: attributeExample,
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Item attribute not found',
      schema: { example: notFoundExample },
    }),
  );

export const UpdateAttributeSwagger = () =>
  applyDecorators(
    ApiOperation({ summary: 'Update an item attribute by id' }),
    ApiResponse({
      status: 200,
      description: 'Item attribute updated successfully',
      schema: {
        example: {
          status: true,
          message: 'Item attribute updated successfully',
          statusCode: 200,
          data: attributeExample,
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Item attribute not found',
      schema: { example: notFoundExample },
    }),
  );

export const RemoveAttributeSwagger = () =>
  applyDecorators(
    ApiOperation({ summary: 'Delete an item attribute by id' }),
    ApiResponse({
      status: 200,
      description: 'Item attribute deleted successfully',
      schema: {
        example: {
          status: true,
          message: 'Item attribute deleted successfully',
          statusCode: 200,
          data: null,
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Item attribute not found',
      schema: { example: notFoundExample },
    }),
  );

export const CreateValueSwagger = () =>
  applyDecorators(
    ApiOperation({ summary: 'Create a new attribute value' }),
    ApiResponse({
      status: 201,
      description: 'Attribute value created successfully',
      schema: {
        example: {
          status: true,
          message: 'Attribute value created successfully',
          statusCode: 201,
          data: valueExample,
        },
      },
    }),
  );

export const FindAllValuesSwagger = () =>
  applyDecorators(
    ApiOperation({ summary: 'Get all values for an attribute' }),
    ApiResponse({
      status: 200,
      description: 'Attribute values retrieved successfully',
      schema: {
        example: {
          status: true,
          message: 'Attribute values retrieved successfully',
          statusCode: 200,
          data: [valueExample],
        },
      },
    }),
  );

export const FindOneValueSwagger = () =>
  applyDecorators(
    ApiOperation({ summary: 'Get an attribute value by id' }),
    ApiResponse({
      status: 200,
      description: 'Attribute value retrieved successfully',
      schema: {
        example: {
          status: true,
          message: 'Attribute value retrieved successfully',
          statusCode: 200,
          data: valueExample,
        },
      },
    }),
  );

export const UpdateValueSwagger = () =>
  applyDecorators(
    ApiOperation({ summary: 'Update an attribute value by id' }),
    ApiResponse({
      status: 200,
      description: 'Attribute value updated successfully',
      schema: {
        example: {
          status: true,
          message: 'Attribute value updated successfully',
          statusCode: 200,
          data: valueExample,
        },
      },
    }),
  );

export const RemoveValueSwagger = () =>
  applyDecorators(
    ApiOperation({ summary: 'Delete an attribute value by id' }),
    ApiResponse({
      status: 200,
      description: 'Attribute value deleted successfully',
      schema: {
        example: {
          status: true,
          message: 'Attribute value deleted successfully',
          statusCode: 200,
          data: null,
        },
      },
    }),
  );

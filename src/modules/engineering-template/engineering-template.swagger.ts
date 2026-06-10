import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

export const FindAllEngineeringTemplatesSwagger = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get all engineering templates with pagination',
      description:
        'Returns a paginated list of engineering templates. Use `search` to filter by Template ID, Zone, Shape, or Placement.',
    }),
    ApiResponse({
      status: 200,
      description: 'Engineering templates retrieved successfully',
      schema: {
        example: {
          status: true,
          message: 'Engineering templates retrieved successfully',
          statusCode: 200,
          data: {
            items: [
              {
                template_id: 'TPL-001',
                zone_name: 'Top',
                stone_shape: 'Round',
                dim_l: 2.5,
                dim_w: 2.5,
                dim_h: 1.5,
                dim_string: '2.5x2.5x1.5',
                base_qty: 4,
                weight_each_ct: 0.12,
                placement: 'Center',
                is_active: true,
                created_at: '2024-01-01T00:00:00.000Z',
                updated_at: '2024-01-01T00:00:00.000Z',
              },
            ],
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

export const UploadEngineeringTemplateSwagger = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Bulk upload engineering templates from an Excel file',
      description: `Upload a \`.xlsx\` file to insert or update engineering template records.

**First row must contain the following headers (order doesn't matter):**

| Excel Column   | Entity Field     | Type    |
|----------------|------------------|---------|
| Template_ID    | template_id      | string  |
| Zone           | zone_name        | string  |
| Shape          | stone_shape      | string  |
| Dim_L          | dim_l            | number  |
| Dim_W          | dim_w            | number  |
| Dim_H          | dim_h            | number  |
| Dim_String     | dim_string       | string  |
| Base_Qty       | base_qty         | integer |
| Weight_Each    | weight_each_ct   | number  |
| Placement      | placement        | string  |

- If a **Template_ID already exists**, the row is **updated**.
- If it does **not exist**, a new record is **inserted**.
- Rows with validation errors are skipped and reported in the response.
`,
    }),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        required: ['file'],
        properties: {
          file: {
            type: 'string',
            format: 'binary',
            description: 'Excel (.xlsx) file with engineering template data',
          },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Upload processed successfully',
      schema: {
        example: {
          message: 'Upload complete',
          inserted: 8,
          updated: 2,
          errorCount: 1,
          errors: [
            {
              row: 5,
              message: '"Dim_L" must be a valid number (got "N/A")',
            },
          ],
        },
      },
    }),
    ApiResponse({
      status: 400,
      description:
        'No file uploaded, invalid file type, or missing required header columns',
      schema: {
        examples: {
          noFile: {
            summary: 'No file uploaded',
            value: {
              statusCode: 400,
              message:
                'No file uploaded. Send the file under the "file" field.',
              error: 'Bad Request',
            },
          },
          invalidType: {
            summary: 'Wrong file type',
            value: {
              statusCode: 400,
              message:
                'Invalid file type "text/csv". Only .xlsx / .xls files are accepted.',
              error: 'Bad Request',
            },
          },
          missingHeader: {
            summary: 'Missing required header',
            value: {
              statusCode: 400,
              message: 'Missing required header column: "Weight_Each"',
              error: 'Bad Request',
            },
          },
        },
      },
    }),
  );

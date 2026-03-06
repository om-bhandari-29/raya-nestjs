import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export const GenerateOtpSwagger = () =>
  applyDecorators(
    ApiOperation({ summary: 'Generate OTP for contact number' }),
    ApiResponse({
      status: 200,
      description: 'OTP generated successfully',
      schema: {
        example: {
          status: true,
          message: 'OTP generated successfully',
          statusCode: 200,
          data: null,
        },
      },
    }),
  );

export const VerifyOtpSwagger = () =>
  applyDecorators(
    ApiOperation({ summary: 'Verify OTP for contact number' }),
    ApiResponse({
      status: 200,
      description: 'OTP verified successfully',
      schema: {
        example: {
          status: true,
          message: 'OTP verified successfully',
          statusCode: 200,
          data: {
            userId: 1,
            contactNumber: 9876543210,
          },
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Invalid OTP',
      schema: {
        example: {
          status: false,
          message: 'Invalid OTP',
          statusCode: 400,
          data: null,
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'User not found',
      schema: {
        example: {
          status: false,
          message: 'User not found',
          statusCode: 404,
          data: null,
        },
      },
    }),
  );

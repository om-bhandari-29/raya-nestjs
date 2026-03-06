import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { GenerateOtpDto } from './dto/generate-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('generate-otp')
  @ApiOperation({ summary: 'Generate OTP for contact number' })
  @ApiResponse({
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
  })
  async generateOtp(@Body() generateOtpDto: GenerateOtpDto) {
    return await this.authService.generateOtp(generateOtpDto);
  }

  @Post('verify-otp')
  @ApiOperation({ summary: 'Verify OTP for contact number' })
  @ApiResponse({
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
  })
  @ApiResponse({
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
  })
  @ApiResponse({
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
  })
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return await this.authService.verifyOtp(verifyOtpDto);
  }
}

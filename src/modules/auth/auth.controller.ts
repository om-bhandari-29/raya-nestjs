import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { GenerateOtpDto } from './dto/generate-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { GenerateOtpSwagger, VerifyOtpSwagger } from './auth.swagger';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('generate-otp')
  @GenerateOtpSwagger()
  async generateOtp(@Body() generateOtpDto: GenerateOtpDto) {
    return await this.authService.generateOtp(generateOtpDto);
  }

  @Post('verify-otp')
  @VerifyOtpSwagger()
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return await this.authService.verifyOtp(verifyOtpDto);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // Initiates Google OAuth flow
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(@Req() req, @Res() res: Response) {
    const result = await this.authService.googleLogin(req.user);

    // Redirect to frontend with tokens as query parameters
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
    const redirectUrl = `${frontendUrl}/auth/callback?accessToken=${result.data.accessToken}&refreshToken=${result.data.refreshToken}&userId=${result.data.userId}&email=${result.data.email}&name=${result.data.name || ''}`;

    return res.redirect(redirectUrl);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getProfile(@Req() req) {
    return {
      status: true,
      message: 'Profile retrieved successfully',
      statusCode: 200,
      data: {
        userId: req.user.id,
        email: req.user.email,
        name: req.user.name,
        mobile: req.user.mobile_number,
        gender: req.user.gender,
        provider: req.user.provider,
      },
    };
  }

  @Post('refresh')
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshAccessToken(refreshTokenDto.refreshToken);
  }
}

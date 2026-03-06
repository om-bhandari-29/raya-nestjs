import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from './entity/auth.entity';
import { GenerateOtpDto } from './dto/generate-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Generic function to generate JWT token for authenticated users
   * Used across all login methods: mobile OTP, Google OAuth, Facebook OAuth
   * @param user - User entity
   * @returns JWT access token
   */
  private generateJwtToken(user: User): string {
    const payload = {
      sub: user.id,
      email: user.email,
      mobile: user.mobile_number,
      provider: user.provider,
    };
    return this.jwtService.sign(payload);
  }

  /**
   * Generate refresh token with longer expiration
   * @param user - User entity
   * @returns JWT refresh token
   */
  private generateRefreshToken(user: User): string {
    const payload = {
      sub: user.id,
      type: 'refresh',
    };
    return this.jwtService.sign(payload, { expiresIn: '7d' });
  }

  /**
   * Generate both access and refresh tokens
   * @param user - User entity
   * @returns Object with accessToken and refreshToken
   */
  async generateTokens(user: User): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const accessToken = this.generateJwtToken(user);
    const refreshToken = this.generateRefreshToken(user);

    // Store refresh token in database
    user.refresh_token = refreshToken;
    await this.userRepository.save(user);

    return { accessToken, refreshToken };
  }

  /**
   * Find or create user based on email or mobile
   * This handles the scenario where user might login via different methods
   * @param email - User email (optional)
   * @param mobile - User mobile number (optional)
   * @param provider - Login provider (mobile, google, facebook)
   * @returns User entity
   */
  async findOrCreateUser(
    email?: string,
    mobile?: number,
    provider?: string,
    googleId?: string,
    facebookId?: string,
  ): Promise<User> {
    let user: User;

    // Try to find existing user by email or mobile
    if (email) {
      user = await this.userRepository.findOne({ where: { email } });
    }
    if (!user && mobile) {
      user = await this.userRepository.findOne({
        where: { mobile_number: mobile },
      });
    }

    // If user exists, update provider info if needed
    if (user) {
      let needsUpdate = false;

      if (googleId && !user.google_id) {
        user.google_id = googleId;
        needsUpdate = true;
      }
      if (facebookId && !user.facebook_id) {
        user.facebook_id = facebookId;
        needsUpdate = true;
      }
      if (email && !user.email) {
        user.email = email;
        needsUpdate = true;
      }
      if (mobile && !user.mobile_number) {
        user.mobile_number = mobile;
        needsUpdate = true;
      }

      if (needsUpdate) {
        await this.userRepository.save(user);
      }
    } else {
      // Create new user
      user = this.userRepository.create({
        email,
        mobile_number: mobile,
        provider,
        google_id: googleId,
        facebook_id: facebookId,
      });
      await this.userRepository.save(user);
    }

    return user;
  }
  /**
   * Save user entity
   * Helper method for updating user records
   * @param user - User entity to save
   * @returns Saved user entity
   */
  async saveUser(user: User): Promise<User> {
    return await this.userRepository.save(user);
  }

  /**
   * Find user by ID
   * Used by JWT strategy for authentication
   * @param id - User ID
   * @returns User entity or null
   */
  async findUserById(id: number): Promise<User | null> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async generateOtp(generateOtpDto: GenerateOtpDto) {
    const { contactNumber } = generateOtpDto;

    // Generate 6-digit random OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Set OTP expiration to 10 minutes from now
    const otpExpiresAt = new Date();
    otpExpiresAt.setMinutes(otpExpiresAt.getMinutes() + 10);

    // Check if user exists with this contact number
    let user = await this.userRepository.findOne({
      where: { mobile_number: parseInt(contactNumber) },
    });

    if (user) {
      // Update existing user's OTP and expiration
      user.otp = otp;
      user.otp_expires_at = otpExpiresAt;
      if (!user.provider) {
        user.provider = 'mobile';
      }
      await this.userRepository.save(user);
    } else {
      // Create new user record with OTP and expiration
      user = this.userRepository.create({
        mobile_number: parseInt(contactNumber),
        otp: otp,
        otp_expires_at: otpExpiresAt,
        provider: 'mobile',
      });
      await this.userRepository.save(user);
    }

    return {
      status: true,
      message: 'OTP generated successfully',
      statusCode: 200,
      data: {
        expiresIn: '10 minutes',
      },
    };
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    const { contactNumber, otp } = verifyOtpDto;

    // Find user by contact number
    const user = await this.userRepository.findOne({
      where: { mobile_number: parseInt(contactNumber) },
    });

    if (!user) {
      return {
        status: false,
        message: 'User not found',
        statusCode: 404,
        data: null,
      };
    }

    // Check if OTP has expired
    if (user.otp_expires_at && new Date() > user.otp_expires_at) {
      return {
        status: false,
        message: 'OTP has expired. Please request a new one.',
        statusCode: 400,
        data: null,
      };
    }

    // Verify OTP
    if (user.otp !== otp) {
      return {
        status: false,
        message: 'Invalid OTP',
        statusCode: 400,
        data: null,
      };
    }

    // Clear OTP after successful verification
    user.otp = null;
    user.otp_expires_at = null;
    await this.userRepository.save(user);

    // OTP verified successfully - Generate JWT tokens
    const { accessToken, refreshToken } = await this.generateTokens(user);

    return {
      status: true,
      message: 'OTP verified successfully',
      statusCode: 200,
      data: {
        userId: user.id,
        contactNumber: user.mobile_number,
        email: user.email,
        name: user.name,
        accessToken,
        refreshToken,
      },
    };
  }

  /**
   * Handle Google OAuth login
   * This method will be called from Google strategy after successful authentication
   * @param user - User entity returned from Google strategy
   * @returns Response with JWT token
   */
  async googleLogin(user: User) {
    const { accessToken, refreshToken } = await this.generateTokens(user);

    return {
      status: true,
      message: 'Google login successful',
      statusCode: 200,
      data: {
        userId: user.id,
        email: user.email,
        name: user.name,
        accessToken,
        refreshToken,
      },
    };
  }

  /**
   * Handle Facebook OAuth login
   * This method will be called from Facebook strategy after successful authentication
   * @param user - User entity returned from Facebook strategy
   * @returns Response with JWT token
   */
  async facebookLogin(user: User) {
    const { accessToken, refreshToken } = await this.generateTokens(user);

    return {
      status: true,
      message: 'Facebook login successful',
      statusCode: 200,
      data: {
        userId: user.id,
        email: user.email,
        name: user.name,
        accessToken,
        refreshToken,
      },
    };
  }

  /**
   * Refresh access token using refresh token
   * @param refreshToken - Refresh token
   * @returns New access token
   */
  async refreshAccessToken(refreshToken: string) {
    try {
      // Verify refresh token
      const payload = this.jwtService.verify(refreshToken);

      if (payload.type !== 'refresh') {
        return {
          status: false,
          message: 'Invalid token type',
          statusCode: 400,
          data: null,
        };
      }

      // Find user and verify refresh token matches
      const user = await this.userRepository.findOne({
        where: { id: payload.sub },
      });

      if (!user || user.refresh_token !== refreshToken) {
        return {
          status: false,
          message: 'Invalid refresh token',
          statusCode: 401,
          data: null,
        };
      }

      // Generate new access token
      const accessToken = this.generateJwtToken(user);

      return {
        status: true,
        message: 'Token refreshed successfully',
        statusCode: 200,
        data: {
          accessToken,
        },
      };
    } catch {
      return {
        status: false,
        message: 'Invalid or expired refresh token',
        statusCode: 401,
        data: null,
      };
    }
  }
}

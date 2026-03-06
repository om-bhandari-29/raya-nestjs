import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/auth.entity';
import { GenerateOtpDto } from './dto/generate-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async generateOtp(generateOtpDto: GenerateOtpDto) {
    const { contactNumber } = generateOtpDto;

    // Generate 6-digit OTP
    // const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otp = '123456'; //for development

    // Check if user exists with this contact number
    let user = await this.userRepository.findOne({
      where: { mobile_number: parseInt(contactNumber) },
    });

    if (user) {
      // Update existing user's OTP
      user.otp = otp;
      await this.userRepository.save(user);
    } else {
      // Create new user record with OTP
      user = this.userRepository.create({
        mobile_number: parseInt(contactNumber),
        otp: otp,
      });
      await this.userRepository.save(user);
    }

    return {
      status: true,
      message: 'OTP generated successfully',
      statusCode: 200,
      data: null,
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

    // Verify OTP
    if (user.otp !== otp) {
      return {
        status: false,
        message: 'Invalid OTP',
        statusCode: 400,
        data: null,
      };
    }

    // OTP verified successfully
    return {
      status: true,
      message: 'OTP verified successfully',
      statusCode: 200,
      data: {
        userId: user.id,
        contactNumber: user.mobile_number,
      },
    };
  }
}

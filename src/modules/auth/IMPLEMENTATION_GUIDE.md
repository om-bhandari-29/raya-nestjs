# Authentication Implementation Guide

## Understanding User Identity Management

### The Problem
When a user logs in with mobile number `xyz` and completes their profile with email `abc@gmail.com`, what happens when they later try to login with Google OAuth using that same email?

### The Solution: Single User Account
We implement a **unified user identity** approach where:
- Email and mobile number are unique identifiers
- A user can have multiple login methods (mobile OTP, Google, Facebook)
- The system automatically links authentication methods to the same user account

### How It Works
1. User logs in with mobile `123456789` → User record created with `mobile_number`
2. User completes profile with email `user@gmail.com` → Email added to same user record
3. User logs in with Google OAuth using `user@gmail.com` → System finds existing user by email and links Google ID
4. Result: One user account with multiple login options

## JWT Token Generation

### Generic JWT Function
The `generateJwtToken()` method creates tokens for all authentication methods:

```typescript
private generateJwtToken(user: User): string {
  const payload = {
    sub: user.id,
    email: user.email,
    mobile: user.mobile_number,
    provider: user.provider,
  };
  return this.jwtService.sign(payload);
}
```

### Usage Across Login Methods
- Mobile OTP Login → Returns JWT after OTP verification
- Google OAuth → Returns JWT after Google authentication
- Facebook OAuth → Returns JWT after Facebook authentication

## Implementation Examples

### 1. Mobile OTP Login (Already Implemented)
```typescript
// Generate OTP
await authService.generateOtp({ contactNumber: '1234567890' });

// Verify OTP and get JWT
const result = await authService.verifyOtp({ 
  contactNumber: '1234567890', 
  otp: '123456' 
});
// Returns: { accessToken, userId, contactNumber, email, name }
```

### 2. Google OAuth Login (Example Implementation)

#### Step 1: Install Google OAuth Package
```bash
npm install @nestjs/passport passport-google-oauth20
npm install -D @types/passport-google-oauth20
```

#### Step 2: Add to .env
```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
```

#### Step 3: Create Google Strategy
```typescript
// src/auth/strategies/google.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private authService: AuthService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { id, emails, displayName } = profile;
    const email = emails[0].value;

    // Use the generic findOrCreateUser function
    const user = await this.authService.findOrCreateUser(
      email,
      null,
      'google',
      id,
      null,
    );

    // Update name if not set
    if (!user.name && displayName) {
      user.name = displayName;
      await this.authService.userRepository.save(user);
    }

    done(null, user);
  }
}
```

#### Step 4: Add Google Login Methods to AuthService
```typescript
// Add this method to auth.service.ts
async googleLogin(user: User) {
  const accessToken = this.generateJwtToken(user);
  
  return {
    status: true,
    message: 'Google login successful',
    statusCode: 200,
    data: {
      userId: user.id,
      email: user.email,
      name: user.name,
      accessToken,
    },
  };
}
```

#### Step 5: Add Google Routes to AuthController
```typescript
// Add to auth.controller.ts
import { Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Get('google')
@UseGuards(AuthGuard('google'))
async googleAuth() {
  // Initiates Google OAuth flow
}

@Get('google/callback')
@UseGuards(AuthGuard('google'))
async googleAuthCallback(@Req() req) {
  return this.authService.googleLogin(req.user);
}
```

#### Step 6: Update AuthModule
```typescript
// Add to auth.module.ts imports
import { GoogleStrategy } from './strategies/google.strategy';

@Module({
  // ... existing imports
  providers: [AuthService, GoogleStrategy],
  exports: [AuthService], // Export for use in other modules
})
```

### 3. Facebook OAuth Login (Similar Pattern)

Follow the same pattern as Google OAuth:
1. Install `passport-facebook`
2. Create `FacebookStrategy`
3. Use `findOrCreateUser(email, null, 'facebook', null, facebookId)`
4. Generate JWT token using `generateJwtToken()`

## User Linking Scenarios

### Scenario 1: Mobile First, Then Google
```
1. User signs up with mobile: 1234567890
   → User created: { id: 1, mobile: 1234567890, provider: 'mobile' }

2. User completes profile with email: user@gmail.com
   → User updated: { id: 1, mobile: 1234567890, email: 'user@gmail.com' }

3. User logs in with Google (user@gmail.com)
   → System finds user by email
   → Links Google ID: { id: 1, mobile: 1234567890, email: 'user@gmail.com', google_id: 'google123' }
   → Returns JWT for user ID 1
```

### Scenario 2: Google First, Then Mobile
```
1. User signs up with Google: user@gmail.com
   → User created: { id: 1, email: 'user@gmail.com', google_id: 'google123', provider: 'google' }

2. User adds mobile: 1234567890
   → User updated: { id: 1, email: 'user@gmail.com', mobile: 1234567890, google_id: 'google123' }

3. User logs in with mobile OTP
   → System finds user by mobile
   → Returns JWT for user ID 1 (same user!)
```

## Database Migration

Run the migration to add new fields:
```bash
npm run migration:run
```

This adds:
- `google_id` - Stores Google user ID
- `facebook_id` - Stores Facebook user ID
- `provider` - Tracks primary login method

## Security Best Practices

1. **JWT Expiration**: Currently set to 2 days in `auth.module.ts`
2. **OTP Security**: Change from hardcoded '123456' to random generation in production
3. **Token Refresh**: Consider implementing refresh tokens for better security
4. **Rate Limiting**: Add rate limiting to OTP generation endpoints
5. **Email Verification**: Verify email ownership when linking accounts

## Testing the Implementation

### Test Mobile OTP Flow
```bash
# Generate OTP
POST /auth/generate-otp
{ "contactNumber": "1234567890" }

# Verify OTP
POST /auth/verify-otp
{ "contactNumber": "1234567890", "otp": "123456" }
# Response includes accessToken
```

### Test Google OAuth Flow
```bash
# Initiate Google login
GET /auth/google
# User redirected to Google consent screen

# After consent, callback returns JWT
GET /auth/google/callback
# Response includes accessToken
```

## Next Steps

1. Run migration: `npm run migration:run`
2. Implement Google OAuth following the example above
3. Add Facebook OAuth using similar pattern
4. Implement JWT authentication guard for protected routes
5. Add refresh token mechanism
6. Implement profile update endpoints that maintain user linking

# Quick Reference - Authentication System

## Your Question Answered

**Q: If user logs in with mobile xyz, completes profile with email abc@gmail.com, then logs in with Google using abc@gmail.com - new user or existing?**

**A: EXISTING USER** ✓ The system finds the user by email and links the Google account to the same user.

---

## What You Need to Do Now

### 1. Run the Migration
```bash
npm run migration:run
```

### 2. Test Mobile OTP (Already Working)
```bash
# Generate OTP
POST /auth/generate-otp
{ "contactNumber": "1234567890" }

# Verify OTP - Now returns JWT!
POST /auth/verify-otp
{ "contactNumber": "1234567890", "otp": "123456" }

# Response:
{
  "status": true,
  "message": "OTP verified successfully",
  "statusCode": 200,
  "data": {
    "userId": 1,
    "contactNumber": 1234567890,
    "email": "user@gmail.com",
    "name": "John Doe",
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 3. Implement Google OAuth (See IMPLEMENTATION_GUIDE.md)
```bash
npm install passport-google-oauth20 @types/passport-google-oauth20
```

---

## Key Functions You Can Use

### 1. Generate JWT Token (Private - Used Internally)
```typescript
private generateJwtToken(user: User): string
```
- Used by ALL login methods
- Returns JWT access token
- Token expires in 2 days

### 2. Find or Create User (Public - Use for OAuth)
```typescript
async findOrCreateUser(
  email?: string,
  mobile?: number,
  provider?: string,
  googleId?: string,
  facebookId?: string
): Promise<User>
```
- Finds existing user by email OR mobile
- Links new auth methods automatically
- Creates new user only if no match found

### 3. Mobile OTP Login (Already Implemented)
```typescript
async generateOtp(generateOtpDto: GenerateOtpDto)
async verifyOtp(verifyOtpDto: VerifyOtpDto)
```

### 4. Google OAuth Login (Ready to Use)
```typescript
async googleLogin(user: User)
```

### 5. Facebook OAuth Login (Ready to Use)
```typescript
async facebookLogin(user: User)
```

---

## Database Schema

```typescript
User Entity:
- id: number (Primary Key)
- name: string
- email: string (unique)
- mobile_number: number (unique)
- gender: GenderEnum
- password: string
- otp: string
- google_id: string       ← NEW
- facebook_id: string     ← NEW
- provider: string        ← NEW ('mobile', 'google', 'facebook')
```

---

## How User Linking Works

```
Mobile Login (1234567890) → User ID 1 created
                              ↓
User adds email (user@gmail.com) → Email added to User ID 1
                              ↓
Google Login (user@gmail.com) → System finds User ID 1 by email
                              ↓
                         Google ID linked to User ID 1
                              ↓
                    ONE USER, MULTIPLE LOGIN METHODS
```

---

## JWT Token Payload

```json
{
  "sub": 1,                    // User ID
  "email": "user@gmail.com",
  "mobile": 1234567890,
  "provider": "mobile",
  "iat": 1234567890,           // Issued at
  "exp": 1234740690            // Expires in 2 days
}
```

---

## Files Modified/Created

### Modified:
- ✓ `src/auth/entity/auth.entity.ts` - Added provider fields
- ✓ `src/auth/auth.service.ts` - Added JWT and user linking
- ✓ `db/migrations/1772816449820-AddProviderFieldsToUser.ts` - Migration

### Created:
- ✓ `AUTHENTICATION_SUMMARY.md` - Overview
- ✓ `src/auth/IMPLEMENTATION_GUIDE.md` - Detailed guide with Google OAuth example
- ✓ `USER_LINKING_FLOW.md` - Visual flow diagrams
- ✓ `QUICK_REFERENCE.md` - This file

---

## Next Steps Checklist

- [ ] Run migration: `npm run migration:run`
- [ ] Test mobile OTP with new JWT response
- [ ] Install Google OAuth packages
- [ ] Add Google OAuth strategy (see IMPLEMENTATION_GUIDE.md)
- [ ] Add Google routes to controller
- [ ] Test Google login flow
- [ ] Implement Facebook OAuth (similar to Google)
- [ ] Add JWT authentication guard for protected routes
- [ ] Replace hardcoded OTP with random generation
- [ ] Add OTP expiration logic
- [ ] Implement refresh tokens

---

## Need Help?

1. **Understanding user linking** → Read `USER_LINKING_FLOW.md`
2. **Implementing Google OAuth** → Read `src/auth/IMPLEMENTATION_GUIDE.md`
3. **Quick overview** → Read `AUTHENTICATION_SUMMARY.md`
4. **This reference** → You're here!

---

## Important Notes

⚠️ Change OTP from '123456' to random in production
⚠️ Add OTP expiration (5-10 minutes recommended)
⚠️ Implement rate limiting on OTP generation
⚠️ Add refresh token mechanism for better security
⚠️ Verify email ownership when linking accounts

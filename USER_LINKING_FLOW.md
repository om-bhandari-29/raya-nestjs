# User Account Linking Flow - Visual Guide

## Scenario: Understanding How One User Can Have Multiple Login Methods

### Timeline of Events

```
┌─────────────────────────────────────────────────────────────────────┐
│ DAY 1: User Signs Up with Mobile Number                            │
└─────────────────────────────────────────────────────────────────────┘

User Action: Signs up with mobile 1234567890
             ↓
System: Generates OTP and creates user
             ↓
Database:
┌──────────────────────────────────────────────────────────┐
│ User Table                                               │
├──────────────────────────────────────────────────────────┤
│ id: 1                                                    │
│ mobile_number: 1234567890                                │
│ email: null                                              │
│ provider: 'mobile'                                       │
│ google_id: null                                          │
│ facebook_id: null                                        │
│ otp: '123456'                                            │
└──────────────────────────────────────────────────────────┘
             ↓
User verifies OTP
             ↓
System: Returns JWT token for user ID 1
```

```
┌─────────────────────────────────────────────────────────────────────┐
│ DAY 2: User Completes Profile with Email                           │
└─────────────────────────────────────────────────────────────────────┘

User Action: Updates profile with email user@gmail.com
             ↓
System: Updates existing user record (ID 1)
             ↓
Database:
┌──────────────────────────────────────────────────────────┐
│ User Table                                               │
├──────────────────────────────────────────────────────────┤
│ id: 1                                                    │
│ mobile_number: 1234567890                                │
│ email: user@gmail.com          ← ADDED                   │
│ provider: 'mobile'                                       │
│ google_id: null                                          │
│ facebook_id: null                                        │
└──────────────────────────────────────────────────────────┘
```

```
┌─────────────────────────────────────────────────────────────────────┐
│ DAY 3: User Tries to Login with Google (user@gmail.com)            │
└─────────────────────────────────────────────────────────────────────┘

User Action: Clicks "Login with Google"
             ↓
Google: Authenticates user, returns email: user@gmail.com
             ↓
System: Calls findOrCreateUser(email='user@gmail.com', provider='google', googleId='google123')
             ↓
System Logic:
  1. Search for user with email 'user@gmail.com'
  2. FOUND! User ID 1 exists with this email
  3. Link Google ID to existing user
  4. Return existing user (ID 1)
             ↓
Database:
┌──────────────────────────────────────────────────────────┐
│ User Table                                               │
├──────────────────────────────────────────────────────────┤
│ id: 1                                                    │
│ mobile_number: 1234567890                                │
│ email: user@gmail.com                                    │
│ provider: 'mobile'                                       │
│ google_id: 'google123'         ← LINKED                  │
│ facebook_id: null                                        │
└──────────────────────────────────────────────────────────┘
             ↓
System: Returns JWT token for user ID 1 (SAME USER!)
```

```
┌─────────────────────────────────────────────────────────────────────┐
│ RESULT: One User, Multiple Login Options                           │
└─────────────────────────────────────────────────────────────────────┘

User can now login using:
  ✓ Mobile OTP (1234567890)
  ✓ Google OAuth (user@gmail.com)
  
All logins return JWT for the SAME user (ID 1)
```

## Alternative Scenario: Google First, Then Mobile

```
┌─────────────────────────────────────────────────────────────────────┐
│ DAY 1: User Signs Up with Google                                   │
└─────────────────────────────────────────────────────────────────────┘

User Action: Clicks "Login with Google"
             ↓
Database:
┌──────────────────────────────────────────────────────────┐
│ User Table                                               │
├──────────────────────────────────────────────────────────┤
│ id: 1                                                    │
│ mobile_number: null                                      │
│ email: user@gmail.com                                    │
│ provider: 'google'                                       │
│ google_id: 'google123'                                   │
│ facebook_id: null                                        │
└──────────────────────────────────────────────────────────┘
```

```
┌─────────────────────────────────────────────────────────────────────┐
│ DAY 2: User Adds Mobile Number                                     │
└─────────────────────────────────────────────────────────────────────┘

User Action: Adds mobile 1234567890 to profile
             ↓
Database:
┌──────────────────────────────────────────────────────────┐
│ User Table                                               │
├──────────────────────────────────────────────────────────┤
│ id: 1                                                    │
│ mobile_number: 1234567890      ← ADDED                   │
│ email: user@gmail.com                                    │
│ provider: 'google'                                       │
│ google_id: 'google123'                                   │
│ facebook_id: null                                        │
└──────────────────────────────────────────────────────────┘
```

```
┌─────────────────────────────────────────────────────────────────────┐
│ DAY 3: User Tries Mobile OTP Login                                 │
└─────────────────────────────────────────────────────────────────────┘

User Action: Requests OTP for 1234567890
             ↓
System Logic:
  1. Search for user with mobile 1234567890
  2. FOUND! User ID 1 exists with this mobile
  3. Generate OTP for existing user
  4. User verifies OTP
  5. Return JWT for user ID 1 (SAME USER!)
```

## Key Takeaway

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│  EMAIL and MOBILE are UNIQUE IDENTIFIERS                           │
│                                                                     │
│  When user logs in with ANY method:                                │
│    1. System searches for existing user by email OR mobile         │
│    2. If found → Link new auth method to existing user             │
│    3. If not found → Create new user                               │
│                                                                     │
│  Result: ONE USER ACCOUNT with MULTIPLE LOGIN OPTIONS              │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## Code That Makes This Work

### The Magic Function: `findOrCreateUser()`

```typescript
async findOrCreateUser(
  email?: string,
  mobile?: number,
  provider?: string,
  googleId?: string,
  facebookId?: string,
): Promise<User> {
  let user: User;

  // 🔍 STEP 1: Try to find existing user
  if (email) {
    user = await this.userRepository.findOne({ where: { email } });
  }
  if (!user && mobile) {
    user = await this.userRepository.findOne({ where: { mobile_number: mobile } });
  }

  // 🔗 STEP 2: If found, link new auth method
  if (user) {
    if (googleId && !user.google_id) {
      user.google_id = googleId;  // Link Google
    }
    if (email && !user.email) {
      user.email = email;  // Add email
    }
    // ... save updates
  } 
  // ✨ STEP 3: If not found, create new user
  else {
    user = this.userRepository.create({
      email,
      mobile_number: mobile,
      provider,
      google_id: googleId,
      facebook_id: facebookId,
    });
  }

  return user;  // Same user, whether found or created!
}
```

## Benefits of This Approach

✅ User has ONE account, not multiple fragmented accounts
✅ User can login with their preferred method
✅ No confusion about "which account did I use?"
✅ All user data (profile, preferences, history) stays together
✅ Easy to add more login methods (Apple, Twitter, etc.)

## What Happens Without This Approach?

❌ User logs in with mobile → Account A created
❌ User logs in with Google → Account B created (different account!)
❌ User has TWO separate accounts with same email
❌ Data fragmentation and confusion
❌ Poor user experience

# Google OAuth Frontend Integration Guide

## Backend Implementation (Current)

### What Changed
The `googleAuthCallback` now redirects to your frontend with tokens as query parameters instead of returning JSON.

```typescript
@Get('google/callback')
@UseGuards(AuthGuard('google'))
async googleAuthCallback(@Req() req, @Res() res: Response) {
  const result = await this.authService.googleLogin(req.user);

  // Redirect to frontend with tokens
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
  const redirectUrl = `${frontendUrl}/auth/callback?accessToken=${result.data.accessToken}&refreshToken=${result.data.refreshToken}&userId=${result.data.userId}&email=${result.data.email}&name=${result.data.name || ''}`;

  return res.redirect(redirectUrl);
}
```

---

## Frontend Implementation

### Option 1: React Example

#### 1. Create Auth Callback Page
```jsx
// pages/auth/callback.jsx or app/auth/callback/page.jsx
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Get tokens from URL query parameters
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');
    const userId = searchParams.get('userId');
    const email = searchParams.get('email');
    const name = searchParams.get('name');

    if (accessToken && refreshToken) {
      // Save tokens to localStorage
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      
      // Save user info
      localStorage.setItem('user', JSON.stringify({
        userId,
        email,
        name
      }));

      // Redirect to dashboard or home
      router.push('/dashboard');
    } else {
      // Handle error - no tokens received
      router.push('/login?error=auth_failed');
    }
  }, [searchParams, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Completing login...</h2>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div
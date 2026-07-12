# BloodOS Authentication

This directory contains the authentication configuration for BloodOS using better-auth.

## Architecture

```
Frontend (Next.js)                Backend (Express)
┌─────────────────┐              ┌──────────────────┐
│  better-auth    │              │   jose JWKS      │
│  Client SDK     │─────JWT─────>│   Verification   │
│                 │              │                  │
│  - Login        │              │  - Verify token  │
│  - Register     │              │  - Extract user  │
│  - Session mgmt │              │  - Authorization │
└─────────────────┘              └──────────────────┘
        │                                  │
        └──────────MongoDB Atlas──────────┘
              (Direct connection)
```

## Key Features

- **Direct MongoDB Connection**: better-auth connects directly to MongoDB Atlas (not through backend API)
- **JWT Storage**: Tokens stored in httpOnly cookies automatically by better-auth
- **Extended User Schema**: Custom fields for role, phone, district, bloodGroup, isDonor, lastDonationDate, dateOfBirth, weight
- **JWKS Endpoint**: Backend verifies JWTs using JWKS endpoint from better-auth
- **Demo Account**: Pre-configured credentials at `demo@bloodos.app`

## Files

### Server Configuration (`/lib/auth.ts`)
- better-auth server instance
- MongoDB adapter configuration
- Extended user schema with BloodOS fields
- JWT plugin configuration
- Email/password + Google OAuth enabled

### Client Configuration (`/lib/auth-client.ts`)
- better-auth React client
- JWT client plugin
- Exports: signIn, signUp, signOut, useSession, getSession

### Helper Functions (`/lib/auth-helpers.ts`)
- `login(credentials)`: Email/password authentication
- `register(data)`: New user registration
- `logout()`: Sign out current user
- `getSession()`: Get current session
- `loginWithDemo()`: Demo account quick login
- `DEMO_CREDENTIALS`: Demo account credentials

### Provider (`/components/providers/auth-provider.tsx`)
- Wraps app with auth context
- Placeholder for future providers (theme, toast, etc.)

### Types (`/types/auth.ts`)
- `User`: Extended user model
- `SessionUser`: Session user from JWT
- `LoginCredentials`: Login payload
- `RegisterData`: Registration payload

## Usage Examples

### In Client Components

```tsx
'use client';
import { useSession } from '@/lib/auth';

export function ProfileButton() {
  const { data: session, isPending } = useSession();
  
  if (isPending) return <div>Loading...</div>;
  if (!session) return <a href="/login">Login</a>;
  
  return <div>Welcome, {session.user.name}</div>;
}
```

### Login Form

```tsx
'use client';
import { login } from '@/lib/auth';
import { useState } from 'react';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
      // Redirect to dashboard
    } catch (error) {
      console.error('Login failed:', error);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <button type="submit">Login</button>
    </form>
  );
}
```

### Server-Side Session Check

```tsx
import { getSession } from '@/lib/auth';

export default async function ProtectedPage() {
  const session = await getSession();
  
  if (!session) {
    redirect('/login');
  }
  
  return <div>Protected content for {session.user.name}</div>;
}
```

### Demo Account

```tsx
'use client';
import { loginWithDemo, DEMO_CREDENTIALS } from '@/lib/auth';

export function DemoLoginButton() {
  return (
    <button onClick={() => loginWithDemo()}>
      Login with Demo ({DEMO_CREDENTIALS.email})
    </button>
  );
}
```

## Environment Variables

Required in `.env`:

```bash
# better-auth Configuration
BETTER_AUTH_SECRET=<random-secret>
BETTER_AUTH_URL=http://localhost:3000

# MongoDB
MONGODB_URI=mongodb+srv://...

# OAuth (optional)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# Public
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## API Routes

better-auth automatically handles these routes:

- `POST /api/auth/sign-in/email` - Email/password login
- `POST /api/auth/sign-up/email` - Email/password registration
- `POST /api/auth/sign-out` - Logout
- `GET /api/auth/session` - Get current session
- `GET /api/auth/.well-known/jwks.json` - JWKS for JWT verification

## Backend Integration

The Express backend verifies JWTs using jose library:

```typescript
import { createRemoteJWKSet, jwtVerify } from 'jose';

const JWKS_URL = process.env.BETTER_AUTH_URL + '/.well-known/jwks.json';
const JWKS = createRemoteJWKSet(new URL(JWKS_URL));

async function verifyToken(token: string) {
  const { payload } = await jwtVerify(token, JWKS, {
    issuer: process.env.BETTER_AUTH_URL,
  });
  return payload;
}
```

## Demo Account Setup

Create demo account via MongoDB or registration endpoint:

```javascript
// In MongoDB bloodos.user collection:
{
  email: "demo@bloodos.app",
  name: "Demo User",
  // ... password hash generated during registration
  role: "user",
  phone: "+880171234567",
  district: "Dhaka",
  bloodGroup: "A+",
  isDonor: true,
  weight: 65,
  dateOfBirth: ISODate("1990-01-01T00:00:00.000Z")
}
```

## Security Notes

- JWT tokens stored in httpOnly cookies (not accessible to JavaScript)
- CSRF protection enabled by default
- Role="user" enforced on registration (admin promotion requires manual DB update)
- All auth endpoints include CORS protection
- Rate limiting applied on backend authentication endpoints (5 req / 15 min)

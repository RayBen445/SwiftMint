# Authentication Flow Documentation

## Overview

SwiftMint implements a modern authentication system with email/password login, signup, and OTP verification capabilities. The authentication system is designed to be secure, user-friendly, and extensible for future enhancements like 2FA and social login.

---

## Authentication Architecture

### Components

1. **AuthContext** (`frontend/src/context/AuthContext.tsx`)
   - Global authentication state management
   - Provides login, signup, logout, and verifyOTP functions
   - Persists user session in localStorage
   - Accessible throughout the app via `useAuth()` hook

2. **Authentication Pages**
   - **Login** (`/login`) - Email/password authentication
   - **Signup** (`/signup`) - New user registration
   - **Profile** (`/profile`) - User account management

3. **API Endpoints**
   - `POST /api/auth/login` - Authenticate existing users
   - `POST /api/auth/signup` - Create new user accounts
   - `POST /api/auth/verify-otp` - Verify OTP codes
   - `POST /api/auth/resend-otp` - Resend OTP for verification

---

## User Flows

### 1. Sign Up Flow

```
User visits /signup
    ↓
Enters: Name, Email, Password, Confirm Password
    ↓
Validates:
  - Email format
  - Password length (min 6 chars)
  - Passwords match
  - Terms acceptance
    ↓
POST /api/auth/signup
    ↓
API creates user account:
  - Generates unique user ID
  - Generates unique wallet ID
  - Creates mock JWT token
    ↓
Returns user data + token
    ↓
AuthContext stores:
  - User data in state
  - User data in localStorage
  - Token in localStorage
    ↓
Navigate to /
```

#### Sign Up API Request
```typescript
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepass123",
  "phone": "+1234567890" // optional
}
```

#### Sign Up API Response
```typescript
{
  "success": true,
  "user": {
    "id": "user_1699876543210_abc123",
    "email": "john@example.com",
    "name": "John Doe",
    "walletId": "wallet_1699876543210_xyz789",
    "phone": "+1234567890",
    "createdAt": "2024-01-01T12:00:00.000Z"
  },
  "token": "base64_encoded_token",
  "message": "Account created successfully"
}
```

---

### 2. Login Flow

```
User visits /login
    ↓
Enters: Email, Password
    ↓
POST /api/auth/login
    ↓
API validates credentials:
  - Finds user by email
  - Verifies password (mock comparison)
    ↓
If valid:
  - Generate mock JWT token
  - Return user data (excluding password)
    ↓
AuthContext stores session
    ↓
Navigate to /
```

#### Login API Request
```typescript
POST /api/auth/login
Content-Type: application/json

{
  "email": "demo@swiftmint.app",
  "password": "demo123"
}
```

#### Login API Response
```typescript
{
  "success": true,
  "user": {
    "id": "user_demo",
    "email": "demo@swiftmint.app",
    "name": "Demo User",
    "walletId": "wallet_demo123",
    "phone": "+1234567890"
  },
  "token": "base64_encoded_token",
  "message": "Login successful"
}
```

#### Demo Credentials
For testing purposes, use:
- **Email:** demo@swiftmint.app
- **Password:** demo123

---

### 3. Logout Flow

```
User clicks Logout (in Profile page)
    ↓
AuthContext.logout() called
    ↓
Clears:
  - User state
  - localStorage (user data)
  - localStorage (token)
    ↓
Navigate to /login
```

---

### 4. OTP Verification Flow (Future)

```
User signs up or requests OTP
    ↓
POST /api/auth/resend-otp
    ↓
API generates 6-digit OTP
    ↓
(In production: Send via email/SMS)
Demo: Returns OTP in response
    ↓
User enters OTP code
    ↓
POST /api/auth/verify-otp
    ↓
API validates OTP
    ↓
If valid: Account verified
If invalid: Error message
```

#### OTP Request
```typescript
POST /api/auth/resend-otp
Content-Type: application/json

{
  "email": "user@example.com"
  // or "phone": "+1234567890"
}
```

#### OTP Response (Demo)
```typescript
{
  "success": true,
  "message": "OTP sent successfully",
  "demo": {
    "otp": "123456",
    "note": "Use this OTP for demo purposes"
  }
}
```

#### Verify OTP Request
```typescript
POST /api/auth/verify-otp
Content-Type: application/json

{
  "code": "123456",
  "email": "user@example.com"
}
```

---

## Session Management

### Storage Strategy

**localStorage** is used for session persistence:

```typescript
// User data
localStorage.setItem('swiftmint_user', JSON.stringify(userData));

// Authentication token
localStorage.setItem('swiftmint_token', token);
```

### Session Lifecycle

1. **App Load**
   - AuthContext checks localStorage for existing session
   - If found: Restore user state
   - If not found: User is logged out

2. **Login/Signup**
   - Store user data and token in localStorage
   - Update AuthContext state

3. **Logout**
   - Remove all data from localStorage
   - Clear AuthContext state

4. **Auto-Login**
   - On app refresh, user stays logged in
   - Session persists until explicit logout

---

## Protected Routes (Future Implementation)

### Current State
- All routes are accessible without authentication
- Authentication is optional for MVP

### Future Implementation
```typescript
// ProtectedRoute component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

// Usage in App.tsx
<Route 
  path="/send" 
  element={
    <ProtectedRoute>
      <Send />
    </ProtectedRoute>
  } 
/>
```

---

## Security Considerations

### Current Implementation (Demo)

⚠️ **Mock Security** - Not production-ready:
- Passwords stored in plain text
- Simple base64 tokens (not JWT)
- No password hashing
- No HTTPS enforcement
- No rate limiting
- No session expiration

### Production Recommendations

1. **Password Security**
   ```typescript
   import bcrypt from 'bcrypt';
   
   // Hash password
   const hashedPassword = await bcrypt.hash(password, 10);
   
   // Verify password
   const isValid = await bcrypt.compare(password, hashedPassword);
   ```

2. **JWT Tokens**
   ```typescript
   import jwt from 'jsonwebtoken';
   
   // Generate token
   const token = jwt.sign(
     { userId: user.id },
     process.env.JWT_SECRET,
     { expiresIn: '7d' }
   );
   
   // Verify token
   const decoded = jwt.verify(token, process.env.JWT_SECRET);
   ```

3. **Secure Storage**
   - Use httpOnly cookies for tokens (not localStorage)
   - Implement CSRF protection
   - Add XSS prevention headers

4. **Rate Limiting**
   - Limit login attempts (e.g., 5 per 15 minutes)
   - Implement CAPTCHA after failed attempts
   - Add exponential backoff

5. **Session Management**
   - Set token expiration (e.g., 7 days)
   - Implement refresh tokens
   - Add device tracking
   - Support "logout all devices"

---

## API Authentication

### Current Implementation

No authentication required for API calls (mock data).

### Future Implementation

```typescript
// Attach token to requests
const token = localStorage.getItem('swiftmint_token');

fetch('/api/send', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify(data)
});
```

### API Middleware (Future)

```typescript
// Verify token on API routes
export const authMiddleware = (handler) => {
  return async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      return handler(req, res);
    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  };
};
```

---

## Error Handling

### Authentication Errors

| Error Code | Scenario | Message |
|-----------|----------|---------|
| 400 | Missing fields | "Email and password are required" |
| 401 | Invalid credentials | "Invalid email or password" |
| 401 | Invalid OTP | "Invalid OTP code" |
| 403 | Account locked | "Account temporarily locked" |
| 429 | Too many attempts | "Too many login attempts" |
| 500 | Server error | "Internal server error" |

### Error Display

Errors are displayed in the UI:
```tsx
{error && (
  <div className="rounded-md bg-red-50 p-4">
    <p className="text-sm text-red-800">{error}</p>
  </div>
)}
```

---

## Testing

### Manual Testing

1. **Sign Up Flow**
   - Visit `/signup`
   - Enter valid data
   - Submit form
   - Verify redirect to home
   - Check user data in localStorage

2. **Login Flow**
   - Visit `/login`
   - Use demo credentials
   - Submit form
   - Verify redirect to home
   - Check Navbar shows user name

3. **Logout Flow**
   - Visit `/profile`
   - Click Logout button
   - Verify redirect to login
   - Check localStorage is cleared

4. **Session Persistence**
   - Login successfully
   - Refresh page
   - Verify still logged in

### Automated Testing (Future)

```typescript
// Example test suite
describe('Authentication', () => {
  it('should login successfully with valid credentials', async () => {
    // Test implementation
  });
  
  it('should show error with invalid credentials', async () => {
    // Test implementation
  });
  
  it('should persist session across page refresh', async () => {
    // Test implementation
  });
});
```

---

## Future Enhancements

### Phase 2: Enhanced Authentication
- [ ] Two-factor authentication (2FA)
- [ ] Biometric login (Face ID, Touch ID)
- [ ] Social login (Google, Apple, Facebook)
- [ ] Password recovery flow
- [ ] Email verification
- [ ] Phone number verification

### Phase 3: Advanced Features
- [ ] Device management
- [ ] Login activity log
- [ ] Suspicious activity alerts
- [ ] Session timeout
- [ ] Remember me functionality
- [ ] Multi-device sync

---

## Troubleshooting

### Common Issues

**Issue:** "Cannot read property 'user' of undefined"
- **Solution:** Ensure component is wrapped in AuthProvider

**Issue:** User not staying logged in
- **Solution:** Check localStorage is not being cleared by browser

**Issue:** Login redirects to login page
- **Solution:** Verify token is being stored correctly

**Issue:** 401 Unauthorized errors
- **Solution:** Check token is being sent in Authorization header

---

## API Reference Summary

| Endpoint | Method | Purpose | Auth Required |
|----------|--------|---------|---------------|
| `/api/auth/signup` | POST | Create account | No |
| `/api/auth/login` | POST | Authenticate user | No |
| `/api/auth/verify-otp` | POST | Verify OTP code | No |
| `/api/auth/resend-otp` | POST | Resend OTP | No |

---

**Last Updated:** November 2024  
**Status:** Phase 1 Complete (Mock Implementation)  
**Next Phase:** JWT tokens, password hashing, and production security

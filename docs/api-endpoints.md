# SwiftMint API Endpoints

## Base URL
- **Production**: `https://your-domain.vercel.app/api`
- **Development**: `http://localhost:3000/api` (Express) or `http://localhost:5173/api` (Vite proxy)

## Authentication
All endpoints (except public ones) require authentication via JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

Alternative: User ID in custom header for MVP:
```
x-user-id: <user-id>
```

---

## Auth Endpoints

### Register User
```http
POST /api/auth/register
```

**Request Body**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "password": "secure_password"
}
```

**Response** (201 Created)
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "user_123",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Login
```http
POST /api/auth/login
```

**Request Body**
```json
{
  "email": "john@example.com",
  "password": "secure_password"
}
```

**Response** (200 OK)
```json
{
  "message": "Login successful",
  "user": {
    "id": "user_123",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Get Profile
```http
GET /api/auth/profile
```

**Headers**
```
x-user-id: user_123
```

**Response** (200 OK)
```json
{
  "user": {
    "id": "user_123",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890"
  }
}
```

---

## Wallet Endpoints

### Get Wallet
```http
GET /api/wallet
```

**Headers**
```
x-user-id: user_123
```

**Response** (200 OK)
```json
{
  "wallet": {
    "id": "wallet_456",
    "userId": "user_123",
    "pockets": [
      {
        "currency": "USD",
        "balance": 1250.50,
        "symbol": "$"
      },
      {
        "currency": "EUR",
        "balance": 850.75,
        "symbol": "€"
      }
    ],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-15T12:30:00.000Z"
  }
}
```

### Add Currency Pocket
```http
POST /api/wallet/pockets
```

**Request Body**
```json
{
  "currency": "GBP",
  "symbol": "£"
}
```

**Response** (200 OK)
```json
{
  "wallet": {
    "id": "wallet_456",
    "pockets": [
      {
        "currency": "USD",
        "balance": 1250.50,
        "symbol": "$"
      },
      {
        "currency": "GBP",
        "balance": 0,
        "symbol": "£"
      }
    ]
  }
}
```

### Get Balance
```http
GET /api/wallet/balance/:currency
```

**Example**: `GET /api/wallet/balance/USD`

**Response** (200 OK)
```json
{
  "currency": "USD",
  "balance": 1250.50
}
```

---

## Transaction Endpoints

### Send Money
```http
POST /api/transactions/send
```

**Request Body**
```json
{
  "recipientEmail": "jane@example.com",
  "amount": 50.00,
  "currency": "USD"
}
```

**Response** (201 Created)
```json
{
  "transaction": {
    "id": "txn_789",
    "userId": "user_123",
    "type": "send",
    "amount": 50.00,
    "currency": "USD",
    "recipientEmail": "jane@example.com",
    "status": "pending",
    "fee": 0.05,
    "createdAt": "2024-01-15T14:30:00.000Z"
  }
}
```

### Receive Money
```http
POST /api/transactions/receive
```

**Request Body**
```json
{
  "amount": 100.00,
  "currency": "EUR"
}
```

**Response** (201 Created)
```json
{
  "transaction": {
    "id": "txn_790",
    "userId": "user_123",
    "type": "receive",
    "amount": 100.00,
    "currency": "EUR",
    "status": "completed",
    "fee": 0,
    "createdAt": "2024-01-15T14:35:00.000Z",
    "completedAt": "2024-01-15T14:35:00.000Z"
  }
}
```

### Convert Currency
```http
POST /api/transactions/convert
```

**Request Body**
```json
{
  "amount": 200.00,
  "fromCurrency": "USD",
  "toCurrency": "GBP"
}
```

**Response** (201 Created)
```json
{
  "transaction": {
    "id": "txn_791",
    "userId": "user_123",
    "type": "convert",
    "amount": 200.00,
    "fromCurrency": "USD",
    "toCurrency": "GBP",
    "exchangeRate": 0.79,
    "status": "pending",
    "fee": 0.20,
    "createdAt": "2024-01-15T14:40:00.000Z"
  }
}
```

### Get Transactions
```http
GET /api/transactions
```

**Query Parameters**
- `limit` (optional): Number of transactions to return (default: 50)
- `offset` (optional): Pagination offset (default: 0)

**Response** (200 OK)
```json
{
  "transactions": [
    {
      "id": "txn_791",
      "type": "convert",
      "amount": 200.00,
      "fromCurrency": "USD",
      "toCurrency": "GBP",
      "status": "completed",
      "createdAt": "2024-01-15T14:40:00.000Z"
    },
    {
      "id": "txn_790",
      "type": "receive",
      "amount": 100.00,
      "currency": "EUR",
      "status": "completed",
      "createdAt": "2024-01-15T14:35:00.000Z"
    }
  ]
}
```

### Get Transaction by ID
```http
GET /api/transactions/:id
```

**Example**: `GET /api/transactions/txn_789`

**Response** (200 OK)
```json
{
  "transaction": {
    "id": "txn_789",
    "userId": "user_123",
    "type": "send",
    "amount": 50.00,
    "currency": "USD",
    "recipientEmail": "jane@example.com",
    "status": "completed",
    "fee": 0.05,
    "createdAt": "2024-01-15T14:30:00.000Z",
    "completedAt": "2024-01-15T14:31:00.000Z"
  }
}
```

---

## Currency Endpoints

### Get Exchange Rates
```http
GET /api/currency/rates
```

**Query Parameters**
- `base` (optional): Base currency (default: USD)

**Example**: `GET /api/currency/rates?base=USD`

**Response** (200 OK)
```json
{
  "base": "USD",
  "rates": {
    "USD": 1.0,
    "EUR": 0.92,
    "GBP": 0.79,
    "JPY": 149.5,
    "CAD": 1.36,
    "AUD": 1.53,
    "CHF": 0.88,
    "CNY": 7.24
  },
  "timestamp": "2024-01-15T14:45:00.000Z"
}
```

### Convert Currency (Preview)
```http
GET /api/currency/convert
```

**Query Parameters**
- `amount`: Amount to convert
- `from`: Source currency
- `to`: Target currency

**Example**: `GET /api/currency/convert?amount=100&from=USD&to=EUR`

**Response** (200 OK)
```json
{
  "from": "USD",
  "to": "EUR",
  "amount": 100.00,
  "convertedAmount": 92.00,
  "rate": 0.92,
  "timestamp": "2024-01-15T14:50:00.000Z"
}
```

### Get Optimal Rate
```http
GET /api/currency/optimal-rate
```

**Query Parameters**
- `from`: Source currency
- `to`: Target currency

**Example**: `GET /api/currency/optimal-rate?from=USD&to=EUR`

**Response** (200 OK)
```json
{
  "from": "USD",
  "to": "EUR",
  "optimalRate": 0.9246,
  "timestamp": "2024-01-15T14:55:00.000Z"
}
```

### Get Supported Currencies
```http
GET /api/currency/supported
```

**Response** (200 OK)
```json
{
  "currencies": [
    {
      "code": "USD",
      "symbol": "$",
      "name": "US Dollar"
    },
    {
      "code": "EUR",
      "symbol": "€",
      "name": "Euro"
    },
    {
      "code": "GBP",
      "symbol": "£",
      "name": "British Pound"
    }
  ]
}
```

### Get Historical Rates
```http
GET /api/currency/historical
```

**Query Parameters**
- `from`: Source currency
- `to`: Target currency
- `days` (optional): Number of days (default: 30)

**Example**: `GET /api/currency/historical?from=USD&to=EUR&days=7`

**Response** (200 OK)
```json
{
  "from": "USD",
  "to": "EUR",
  "history": [
    {
      "date": "2024-01-08",
      "rate": 0.9185
    },
    {
      "date": "2024-01-09",
      "rate": 0.9203
    },
    {
      "date": "2024-01-10",
      "rate": 0.9195
    }
  ]
}
```

---

## Error Responses

All endpoints return consistent error responses:

**400 Bad Request**
```json
{
  "error": "Amount and currency are required"
}
```

**401 Unauthorized**
```json
{
  "error": "Unauthorized"
}
```

**404 Not Found**
```json
{
  "error": "Transaction not found"
}
```

**500 Internal Server Error**
```json
{
  "error": "Something went wrong!"
}
```

## Rate Limiting

- **Rate**: 100 requests per 15 minutes per IP
- **Headers**: 
  - `X-RateLimit-Limit`: Maximum requests
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Time when limit resets

## Versioning

Current version: `v1` (implicit in `/api/`)

Future versions will use explicit versioning:
- `/api/v2/transactions`
- `/api/v3/currency/rates`

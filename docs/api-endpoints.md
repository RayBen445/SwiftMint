# API Endpoints Documentation

Base URL: `https://your-app.vercel.app/api`

## Authentication

Currently, the API uses mock authentication. Future versions will implement JWT-based authentication.

## Endpoints

### 1. Send Money

**Endpoint:** `POST /api/send`

**Description:** Send money from one wallet to another

**Request Body:**
```json
{
  "fromWallet": "wallet_user123",
  "toWallet": "wallet_user456",
  "amount": 100.00,
  "currency": "USD",
  "note": "Payment for services"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "transaction": {
    "id": "txn_1699876543210_abc123",
    "fromWallet": "wallet_user123",
    "toWallet": "wallet_user456",
    "amount": 100.00,
    "currency": "USD",
    "note": "Payment for services",
    "fee": 0.10,
    "total": 100.10,
    "status": "completed",
    "timestamp": "2024-01-01T12:00:00.000Z"
  },
  "message": "Transaction completed successfully"
}
```

**Error Responses:**
- `400 Bad Request`: Missing required fields or invalid amount
- `500 Internal Server Error`: Server error

---

### 2. Request Payment

**Endpoint:** `POST /api/receive`

**Description:** Create a payment request that others can fulfill

**Request Body:**
```json
{
  "walletId": "wallet_user123",
  "amount": 50.00,
  "currency": "USD",
  "requesterId": "user123",
  "note": "Freelance work payment"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "paymentRequest": {
    "id": "req_1699876543210_def456",
    "walletId": "wallet_user123",
    "amount": 50.00,
    "currency": "USD",
    "requesterId": "user123",
    "note": "Freelance work payment",
    "status": "pending",
    "qrCode": "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=...",
    "paymentLink": "https://swiftmint.app/pay/wallet_user123?amount=50.00&currency=USD",
    "expiresAt": "2024-01-02T12:00:00.000Z",
    "createdAt": "2024-01-01T12:00:00.000Z"
  },
  "message": "Payment request created successfully"
}
```

**Get Payment Request Status:**

**Endpoint:** `GET /api/receive?requestId=req_123`

**Response (200 OK):**
```json
{
  "success": true,
  "paymentRequest": {
    "id": "req_123",
    "status": "pending",
    "amount": 100,
    "currency": "USD",
    "createdAt": "2024-01-01T12:00:00.000Z"
  }
}
```

---

### 3. Convert Currency

**Endpoint:** `POST /api/convert`

**Description:** Convert amount from one currency to another

**Request Body:**
```json
{
  "fromCurrency": "USD",
  "toCurrency": "EUR",
  "amount": 100.00
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "conversion": {
    "fromCurrency": "USD",
    "toCurrency": "EUR",
    "fromAmount": 100.00,
    "toAmount": 91.80,
    "rate": 0.92,
    "fee": 0.20,
    "timestamp": "2024-01-01T12:00:00.000Z"
  },
  "message": "Conversion calculated successfully"
}
```

**Error Responses:**
- `400 Bad Request`: Invalid currency or amount
- `500 Internal Server Error`: Conversion failed

---

### 4. Get Exchange Rates

**Endpoint:** `GET /api/rates`

**Description:** Get current exchange rates for supported currencies

**Query Parameters:**
- `base` (optional): Base currency (default: USD)
- `currencies` (optional): Comma-separated list of currencies to fetch

**Examples:**
- `/api/rates` - Get all rates
- `/api/rates?base=EUR` - Get rates with EUR as base
- `/api/rates?currencies=EUR,GBP,JPY` - Get specific currencies

**Response (200 OK):**
```json
{
  "success": true,
  "base": "USD",
  "rates": {
    "EUR": 0.92,
    "GBP": 0.79,
    "JPY": 149.50,
    "CAD": 1.36,
    "AUD": 1.52,
    "INR": 83.12,
    "CHF": 0.88,
    "CNY": 7.24,
    "SGD": 1.34,
    "HKD": 7.83,
    "NZD": 1.67,
    "SEK": 10.45,
    "NOK": 10.87,
    "DKK": 6.85,
    "MXN": 17.12,
    "BRL": 4.95,
    "ZAR": 18.75
  },
  "lastUpdate": "2024-01-01T12:00:00.000Z",
  "disclaimer": "These are mock rates for demonstration purposes only"
}
```

---

### 5. Get Transactions

**Endpoint:** `GET /api/transactions`

**Description:** Get transaction history with filtering and pagination

**Query Parameters:**
- `walletId` (optional): Filter by wallet ID
- `type` (optional): Filter by type (send, receive, convert)
- `status` (optional): Filter by status (completed, pending, failed)
- `limit` (optional): Number of results (default: 10, max: 100)
- `offset` (optional): Pagination offset (default: 0)

**Examples:**
- `/api/transactions?walletId=wallet_user123`
- `/api/transactions?type=send&status=completed`
- `/api/transactions?limit=20&offset=0`

**Response (200 OK):**
```json
{
  "success": true,
  "transactions": [
    {
      "id": "txn_1699876543210_abc123",
      "type": "send",
      "amount": 150.00,
      "currency": "USD",
      "status": "completed",
      "timestamp": "2024-01-01T10:00:00.000Z",
      "fromWallet": "wallet_user123",
      "toWallet": "wallet_user456",
      "note": "Payment for services"
    },
    {
      "id": "txn_1699876543211_def456",
      "type": "receive",
      "amount": 75.50,
      "currency": "EUR",
      "status": "completed",
      "timestamp": "2024-01-01T07:00:00.000Z",
      "fromWallet": "wallet_user789",
      "toWallet": "wallet_user123",
      "note": "Freelance work payment"
    }
  ],
  "total": 50,
  "limit": 10,
  "offset": 0,
  "hasMore": true
}
```

---

## Error Handling

All endpoints follow a consistent error format:

```json
{
  "error": "Error type",
  "message": "Detailed error message"
}
```

### Common HTTP Status Codes
- `200 OK`: Successful GET request
- `201 Created`: Successful POST request (resource created)
- `400 Bad Request`: Invalid input
- `405 Method Not Allowed`: Wrong HTTP method
- `500 Internal Server Error`: Server error

---

## Rate Limiting

Rate limiting is planned for future implementation:
- 100 requests per minute per IP
- 1000 requests per hour per authenticated user

---

## Supported Currencies

Currently supported currencies:
- USD (US Dollar)
- EUR (Euro)
- GBP (British Pound)
- JPY (Japanese Yen)
- CAD (Canadian Dollar)
- AUD (Australian Dollar)
- INR (Indian Rupee)
- CHF (Swiss Franc)
- CNY (Chinese Yuan)
- SGD (Singapore Dollar)
- HKD (Hong Kong Dollar)
- NZD (New Zealand Dollar)
- SEK (Swedish Krona)
- NOK (Norwegian Krone)
- DKK (Danish Krone)
- MXN (Mexican Peso)
- BRL (Brazilian Real)
- ZAR (South African Rand)

---

## Fee Structure

### Transaction Fees
- **Send Money**: 0.1% of transaction amount
- **Currency Conversion**: 0.2% of converted amount
- **Payment Requests**: Free

### Examples
- Send $100: Fee = $0.10
- Convert $1000 USD to EUR: Fee ≈ €1.84
- Request payment: $0

---

## Testing

Use tools like Postman, Insomnia, or curl to test the API:

```bash
# Send money example
curl -X POST https://your-app.vercel.app/api/send \
  -H "Content-Type: application/json" \
  -d '{
    "fromWallet": "wallet_test123",
    "toWallet": "wallet_test456",
    "amount": 50,
    "currency": "USD",
    "note": "Test payment"
  }'

# Get exchange rates
curl https://your-app.vercel.app/api/rates

# Get transactions
curl "https://your-app.vercel.app/api/transactions?limit=5"
```

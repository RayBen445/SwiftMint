# User Flow Documentation

This document describes the key user journeys through the SwiftMint application.

## 1. Send Money Flow

### Entry Points
- Click "Send" from navigation
- Click "Send" quick action on home page

### User Journey

```
┌─────────────────┐
│  Home Page      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Send Page      │
│  - Enter wallet │
│  - Enter amount │
│  - Select curr. │
│  - Add note     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Validation     │
│  - Check fields │
│  - Validate amt │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  API Call       │
│  POST /api/send │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Success/Error  │
│  - Show result  │
│  - Display fee  │
│  - Show TX ID   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Return Home    │
│  or Send More   │
└─────────────────┘
```

### Steps
1. **Navigate to Send Page**
   - User clicks "Send" button
   - Form loads with empty fields

2. **Enter Transaction Details**
   - Recipient wallet ID (required)
   - Amount (required, > 0)
   - Currency (default: USD)
   - Note (optional)

3. **Submit Transaction**
   - Click "Send Money" button
   - Loading state shows
   - Validation occurs

4. **View Result**
   - Success: Green confirmation box
   - Shows transaction ID, fee, status
   - Option to send more money

5. **Error Handling**
   - Red error box displays
   - Clear error message
   - Form stays filled for retry

### Success Criteria
- Transaction ID generated
- Fee calculated correctly (0.1%)
- Status shows "completed"
- User can initiate new transaction

---

## 2. Request Money Flow

### Entry Points
- Click "Request" from navigation
- Click "Request" quick action on home page

### User Journey

```
┌─────────────────┐
│  Home Page      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Request Page   │
│  - Enter amount │
│  - Select curr. │
│  - Add note     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Create Request │
│  POST /api/recv │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Show QR Code   │
│  - Display QR   │
│  - Show link    │
│  - Share opts   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Share/Download │
│  or New Request │
└─────────────────┘
```

### Steps
1. **Navigate to Request Page**
   - User clicks "Request" button
   - Form loads

2. **Enter Request Details**
   - Amount (required, > 0)
   - Currency (default: USD)
   - Note describing request (optional)

3. **Create Payment Request**
   - Click "Create Payment Request"
   - API generates unique request ID
   - QR code generated
   - Payment link created

4. **View Payment Request**
   - Large QR code display
   - Request ID shown
   - Payment link copyable
   - Expiration time visible (24 hours)

5. **Share Options**
   - Share link button
   - Download QR button
   - Create another request option

### Success Criteria
- Unique request ID created
- QR code displays correctly
- Payment link is valid
- Expiration time set to 24 hours

---

## 3. Currency Conversion Flow

### Entry Points
- Click "Convert" from navigation
- Click "Convert" quick action on home page

### User Journey

```
┌─────────────────┐
│  Home Page      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Convert Page   │
│  - Enter amount │
│  - Select from  │
│  - Select to    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Show Rates     │
│  - Display curr │
│  - rates table  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Calculate      │
│  POST /convert  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Show Result    │
│  - Final amount │
│  - Exchange rate│
│  - Fee charged  │
└─────────────────┘
```

### Steps
1. **Navigate to Convert Page**
   - User clicks "Convert"
   - Form and rates table load

2. **View Current Rates**
   - Exchange rates table displays
   - Shows top 9 currency pairs
   - Last update timestamp

3. **Enter Conversion Details**
   - Amount to convert (required)
   - From currency (default: USD)
   - To currency (default: EUR)
   - Swap button to reverse currencies

4. **Calculate Conversion**
   - Click "Convert Currency"
   - API calculates using current rates
   - Fee applied (0.2%)

5. **View Conversion Result**
   - Large display of final amount
   - Exchange rate shown
   - Fee breakdown displayed
   - All in highlighted box

### Success Criteria
- Accurate rate calculation
- Fee correctly applied
- Result clearly displayed
- User can perform multiple conversions

---

## 4. Transaction History Flow

### Entry Points
- Click "History" from navigation
- Click "History" quick action on home page
- Click "Recent Transactions" on home page

### User Journey

```
┌─────────────────┐
│  Home/Any Page  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  History Page   │
│  - Stats cards  │
│  - Filter opts  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Load TXs       │
│  GET /api/txs   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Apply Filters  │
│  - By type      │
│  - By status    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Display List   │
│  - Paginated    │
│  - Load more    │
└─────────────────┘
```

### Steps
1. **Navigate to History**
   - User clicks "History"
   - Loading state shows

2. **View Summary Stats**
   - Three cards display:
     - Total sent
     - Total received
     - Total converted
   - Color-coded and prominent

3. **View Transaction List**
   - Default: All transactions
   - Sorted by date (newest first)
   - Shows 20 transactions initially

4. **Apply Filters**
   - Type filter: All, Send, Receive, Convert
   - Status filter: All, Completed, Pending, Failed
   - Filters apply immediately

5. **Transaction Details**
   - Each transaction shows:
     - Type icon and label
     - Amount and currency
     - Status badge
     - Timestamp
     - Note/description

6. **Load More**
   - "Load More" button at bottom
   - Loads next 20 transactions
   - Maintains current filters

### Success Criteria
- All transactions loaded
- Filters work correctly
- Stats accurately calculated
- Pagination works smoothly

---

## 5. Home Dashboard Flow

### Entry Point
- Application root URL
- Logo click from any page

### User Journey

```
┌─────────────────┐
│  App Launch     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Home Dashboard │
│  - Balance card │
│  - Quick actions│
│  - Recent TXs   │
└────────┬────────┘
         │
    ┌────┼────┐
    │    │    │
    ▼    ▼    ▼
  Send Request Convert
```

### Components

1. **Balance Card**
   - Shows main wallet balance
   - Currency: USD
   - Prominent display
   - Available balance shown

2. **Quick Actions Grid**
   - 4 large buttons:
     - Send (blue)
     - Request (green)
     - Convert (purple)
     - History (orange)
   - Icon + label
   - Hover animation

3. **Recent Transactions**
   - Last 5 transactions
   - Summary view
   - Click to view full history

### Navigation Options
- Click any quick action → Navigate to that page
- Click "Recent Transactions" header → Navigate to History
- Use top navigation → Go to specific page

---

## 6. First-Time User Flow

### User Journey

```
┌─────────────────┐
│  Land on Site   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  View Home      │
│  - See features │
│  - Understand   │
│    platform     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Explore        │
│  - Try send     │
│  - Try convert  │
│  - View history │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Sign Up        │
│  (Future)       │
└─────────────────┘
```

### Onboarding Steps (Current)
1. **Land on Home**
   - See tagline: "Instant global micro-payments"
   - View balance card (demo data)
   - See quick actions

2. **Explore Features**
   - Try sending money (demo mode)
   - Request payment
   - Convert currencies
   - View transaction history

3. **Learn Platform**
   - Read info boxes on each page
   - Understand fee structure
   - See example transactions

### Future Onboarding
- Account creation
- KYC verification
- Wallet setup
- First transaction guide

---

## Mobile User Experience

### Responsive Behavior

1. **Navigation**
   - Hamburger menu on mobile (planned)
   - Bottom tab bar (future consideration)

2. **Forms**
   - Full-width inputs
   - Large touch targets
   - Numeric keyboards for amounts

3. **Cards**
   - Stack vertically on mobile
   - Maintain readability
   - Swipe gestures (future)

---

## Error States

### Network Errors
- Clear error message
- Retry button
- Form data preserved

### Validation Errors
- Inline field errors
- Red highlighting
- Helpful error messages

### API Errors
- User-friendly messages
- Technical details hidden
- Support contact option (future)

---

## Loading States

### Page Load
- Skeleton screens (future)
- Loading spinners for data
- Smooth transitions

### Form Submission
- Button shows "Processing..."
- Disabled state
- Cannot submit twice

### Infinite Scroll
- Loading indicator at bottom
- Smooth pagination
- No jarring jumps

---

## Success States

### Transaction Success
- Green confirmation box
- Clear success message
- Transaction details
- Next action options

### Request Created
- Large success indicator
- QR code prominent
- Easy sharing options

### Conversion Complete
- Results highlighted
- Clear breakdown
- Conversion saved to history

---

## User Preferences (Future)

### Settings to Remember
- Preferred currency
- Default amounts
- Recent recipients
- Favorite currency pairs

### Notifications
- Transaction confirmations
- Request status updates
- Rate alerts
- Security notifications

---

## Accessibility Considerations

### Keyboard Navigation
- Tab order logical
- Enter to submit forms
- Escape to close modals

### Screen Readers
- Alt text on images
- ARIA labels on buttons
- Semantic HTML structure

### Visual
- High contrast mode support
- Font size adjustable
- Color-blind friendly palette

---

## Performance Considerations

### Fast Initial Load
- Critical CSS inline
- Lazy load components
- Optimized images

### Smooth Interactions
- Optimistic UI updates
- Local state management
- Minimal API calls

### Offline Support (Future)
- Service worker
- Cached data
- Queue failed requests

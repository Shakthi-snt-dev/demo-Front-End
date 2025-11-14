# API Documentation

This directory contains all API functions organized in a centralized way for easy access across the application.

## Structure

- `index.ts` - Main export file, imports and exports all APIs
- `services.ts` - All API services organized by feature/module

## Usage Examples

### Method 1: Import specific services

```typescript
import { authService, customersService } from '@/api'

// Use in your component
const handleLogin = async () => {
  try {
    const response = await authService.login(email, password)
    // Handle response
  } catch (error) {
    // Handle error
  }
}
```

### Method 2: Import the API namespace

```typescript
import API from '@/api'

// Use in your component
const handleLogin = async () => {
  try {
    const response = await API.auth.login(email, password)
    // Handle response
  } catch (error) {
    // Handle error
  }
}
```

### Method 3: Import individual services

```typescript
import { 
  authService, 
  customersService, 
  inventoryService 
} from '@/api'

// Use services
await authService.login(email, password)
await customersService.getAll()
await inventoryService.getById(id)
```

## Available Services

### Auth Service
- `login(email, password)` - User login
- `signup(data)` - User registration
- `forgotPassword(email)` - Request password reset
- `resetPassword(token, password)` - Reset password
- `verifyEmail(token)` - Verify email address
- `logout()` - User logout
- `refreshToken(token)` - Refresh access token

### User Service
- `getProfile()` - Get user profile
- `updateProfile(data)` - Update user profile
- `uploadAvatar(file)` - Upload profile picture
- `changePassword(currentPassword, newPassword)` - Change password

### Customers Service
- `getAll(params?)` - Get all customers
- `getById(id)` - Get customer by ID
- `create(data)` - Create new customer
- `update(id, data)` - Update customer
- `delete(id)` - Delete customer
- `search(query)` - Search customers

### Inventory Service
- `getAll(params?)` - Get all inventory items
- `getById(id)` - Get item by ID
- `create(data)` - Create new item
- `update(id, data)` - Update item
- `delete(id)` - Delete item
- `updateStock(id, quantity)` - Update stock quantity

### Repairs Service
- `getAll(params?)` - Get all repairs
- `getById(id)` - Get repair by ID
- `create(data)` - Create new repair
- `update(id, data)` - Update repair
- `updateStatus(id, status)` - Update repair status
- `delete(id)` - Delete repair

### POS Service
- `createSale(data)` - Create new sale
- `getSales(params?)` - Get all sales
- `getSaleById(id)` - Get sale by ID
- `processPayment(saleId, paymentData)` - Process payment
- `getReceipt(saleId)` - Get receipt

### Employees Service
- `getAll(params?)` - Get all employees
- `getById(id)` - Get employee by ID
- `create(data)` - Create new employee
- `update(id, data)` - Update employee
- `delete(id)` - Delete employee
- `updateRole(id, role)` - Update employee role

### Reports Service
- `getSalesReport(params)` - Get sales report
- `getInventoryReport()` - Get inventory report
- `getRepairsReport(params)` - Get repairs report
- `getCustomerReport()` - Get customer report
- `getDashboardStats()` - Get dashboard statistics

### Settings Service
- `getStoreSettings()` - Get store settings
- `updateStoreSettings(data)` - Update store settings
- `getPOSSettings()` - Get POS settings
- `updatePOSSettings(data)` - Update POS settings
- `getNotificationSettings()` - Get notification settings
- `updateNotificationSettings(data)` - Update notification settings

### Chat Service
- `getConversations()` - Get all conversations
- `getMessages(conversationId)` - Get messages for conversation
- `sendMessage(conversationId, message)` - Send message
- `createConversation(data)` - Create new conversation

## Base API Methods

You can also use the base HTTP methods directly:

```typescript
import { api } from '@/api'

// GET request
const data = await api.get('/custom-endpoint')

// POST request
const result = await api.post('/custom-endpoint', { data })

// PUT request
await api.put('/custom-endpoint/1', { data })

// PATCH request
await api.patch('/custom-endpoint/1', { data })

// DELETE request
await api.delete('/custom-endpoint/1')
```

## Error Handling

All API calls can throw `ApiError`. Handle errors appropriately:

```typescript
import { ApiError } from '@/api'

try {
  await authService.login(email, password)
} catch (error) {
  if (error instanceof ApiError) {
    console.error('API Error:', error.message)
    console.error('Status:', error.status)
    console.error('Data:', error.data)
  } else {
    console.error('Unknown error:', error)
  }
}
```

## Adding New API Endpoints

To add new API endpoints:

1. Open `src/api/services.ts`
2. Add your new service or add methods to existing service
3. Export it from `src/api/index.ts`
4. Use it in your components!

Example:

```typescript
// In services.ts
export const myNewService = {
  getData: () => api.get('/my-endpoint'),
  createData: (data: any) => api.post('/my-endpoint', data),
}

// In index.ts - add to exports
export { myNewService } from './services'
```


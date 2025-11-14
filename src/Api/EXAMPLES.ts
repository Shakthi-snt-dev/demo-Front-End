/**
 * API Usage Examples
 * Copy and adapt these examples for your components
 */

// ============================================
// Example 1: Using specific services
// ============================================
import { authService, customersService } from '@/api'

export const example1 = async () => {
  // Login
  const loginResponse = await authService.login('user@example.com', 'password123')
  console.log('Login successful:', loginResponse)

  // Get customers
  const customers = await customersService.getAll({ page: 1, limit: 10 })
  console.log('Customers:', customers)
}

// ============================================
// Example 2: Using API namespace
// ============================================
import API from '@/api'

export const example2 = async () => {
  // Login using namespace
  const loginResponse = await API.auth.login('user@example.com', 'password123')
  
  // Get inventory items
  const inventory = await API.inventory.getAll({ page: 1 })
  
  // Create a repair
  const repair = await API.repairs.create({
    customerId: '123',
    description: 'Screen repair',
    price: 150,
  })
}

// ============================================
// Example 3: In a React component
// ============================================
/*
import { useState } from 'react'
import { authService } from '@/api'
import { ApiError } from '@/api'

function LoginComponent() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await authService.login(email, password)
      // Handle successful login
      console.log('Logged in:', response)
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError('An unexpected error occurred')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleLogin}>
      <input 
        type="email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
      />
      <input 
        type="password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
      {error && <p>{error}</p>}
    </form>
  )
}
*/

// ============================================
// Example 4: Using with Redux Thunks
// ============================================
/*
import { createAsyncThunk } from '@reduxjs/toolkit'
import { customersService } from '@/api'

export const fetchCustomers = createAsyncThunk(
  'customers/fetchAll',
  async (params?: { page?: number; limit?: number }) => {
    const response = await customersService.getAll(params)
    return response
  }
)
*/

// ============================================
// Example 5: Error handling
// ============================================
import { ApiError } from '@/api'

export const example5 = async () => {
  try {
    await authService.login('invalid', 'password')
  } catch (error) {
    if (error instanceof ApiError) {
      // Handle API-specific errors
      switch (error.status) {
        case 401:
          console.error('Unauthorized - Invalid credentials')
          break
        case 404:
          console.error('Not found')
          break
        case 500:
          console.error('Server error')
          break
        default:
          console.error('API Error:', error.message)
      }
    } else {
      // Handle other errors (network, etc.)
      console.error('Network error:', error)
    }
  }
}

// ============================================
// Example 6: Using base API methods
// ============================================
import { api } from '@/api'

export const example6 = async () => {
  // Custom GET request
  const data = await api.get('/custom-endpoint')
  
  // Custom POST request
  const result = await api.post('/custom-endpoint', {
    name: 'John',
    age: 30,
  })
  
  // Custom PUT request
  await api.put('/custom-endpoint/1', { name: 'Jane' })
  
  // Custom PATCH request
  await api.patch('/custom-endpoint/1', { age: 31 })
  
  // Custom DELETE request
  await api.delete('/custom-endpoint/1')
}


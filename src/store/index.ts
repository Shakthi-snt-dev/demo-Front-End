import { configureStore } from '@reduxjs/toolkit'
import authReducer from '@/features/auth/authSlice'
import uiReducer from '@/features/ui/uiSlice'
import customersReducer from '@/features/customers/customersSlice'
import inventoryReducer from '@/features/inventory/inventorySlice'
import repairsReducer from '@/features/repairs/repairsSlice'
import posReducer from '@/features/pos/posSlice'
import employeesReducer from '@/features/employees/employeesSlice'
import reportsReducer from '@/features/reports/reportsSlice'
import settingsReducer from '@/features/settings/settingsSlice'
import chatReducer from '@/features/chat/chatSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    customers: customersReducer,
    inventory: inventoryReducer,
    repairs: repairsReducer,
    pos: posReducer,
    employees: employeesReducer,
    reports: reportsReducer,
    settings: settingsReducer,
    chat: chatReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

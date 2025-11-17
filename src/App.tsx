import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { ProtectedRoute } from '@/components/protected-route'
import { DashboardLayout } from '@/components/layout/dashboard-layout'

// Auth pages
import LoginPage from '@/Pages/auth/login'
import SignupPage from '@/Pages/auth/signup'
import ForgotPasswordPage from '@/Pages/auth/forgot-password'
import VerifyEmailPage from '@/Pages/auth/verify-email'
import StepVerificationPage from '@/Pages/auth/stepvery'
import StepsPage from '@/Pages/steps'

// Onboarding pages
import ProfileSetupPage from '@/Pages/onboarding/profile-setup'
import ContactInfoPage from '@/Pages/onboarding/contact-info'

// Dashboard
import DashboardPage from '@/Pages/dashboard/index'

// POS
import POSPage from '@/Pages/pos/index'

// Other modules
import InventoryPage from '@/Pages/inventory/index'
import RepairsPage from '@/Pages/repairs/index'
import CustomersPage from '@/Pages/customers/index'
import ReportsPage from '@/Pages/reports/index'
import SettingsPage from '@/Pages/settings/index'
import ManageStoresPage from '@/Pages/settings/stores'
import StoreTypesPage from '@/Pages/settings/store-types'
import RolesPage from '@/Pages/settings/roles'
import SecurityChecksPage from '@/Pages/settings/security-checks'
import EmployeesPage from '@/Pages/employees/index'
import AppUserAdminPage from '@/Pages/appuseradmin/index'
import ChatPage from '@/Pages/chat/index'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/steps" element={<StepsPage />} />
        <Route
          path="/auth/step-verification"
          element={
            <ProtectedRoute>
              <StepVerificationPage />
            </ProtectedRoute>
          }
        />

        {/* Onboarding routes */}
        <Route
          path="/onboarding/profile"
          element={
            <ProtectedRoute>
              <ProfileSetupPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/onboarding/contact"
          element={
            <ProtectedRoute>
              <ContactInfoPage />
            </ProtectedRoute>
          }
        />

        {/* Dashboard routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
        </Route>
        
        {/* POS route */}
        <Route
          path="/pos"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<POSPage />} />
        </Route>

        {/* Inventory route */}
        <Route
          path="/inventory"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<InventoryPage />} />
        </Route>

        {/* Repairs route */}
        <Route
          path="/repairs"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<RepairsPage />} />
        </Route>

        {/* Customers route */}
        <Route
          path="/customers"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<CustomersPage />} />
        </Route>

        {/* Reports route */}
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<ReportsPage />} />
        </Route>

        {/* Settings route */}
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<SettingsPage />} />
          <Route path="stores" element={<ManageStoresPage />} />
          <Route path="store-types" element={<StoreTypesPage />} />
          <Route path="roles" element={<RolesPage />} />
          <Route path="security-checks" element={<SecurityChecksPage />} />
        </Route>

        {/* Employees route */}
        <Route
          path="/employees"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<EmployeesPage />} />
        </Route>

        {/* AppUserAdmin (Business Owners) route */}
        <Route
          path="/appuseradmin"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AppUserAdminPage />} />
        </Route>

        {/* Chat route */}
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<ChatPage />} />
        </Route>

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  )
}

export default App

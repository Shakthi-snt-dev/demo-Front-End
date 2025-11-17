import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAppSelector } from '@/store/hooks'
import { User, Mail, Phone, MapPin, Building2, Upload, X, Key, Globe, Clock, DollarSign, Shield, Lock, Settings as SettingsIcon } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { settingsService } from '@/Api/services'
import { useToast } from '@/hooks/use-toast'

// User Profile Schema
const userProfileSchema = z.object({
  username: z.string().min(1, 'Username is required').optional(),
  email: z.string().email('Invalid email address').optional(),
  accessPin: z.string().min(4, 'PIN must be at least 4 digits').max(10, 'PIN must be at most 10 digits').optional(),
  language: z.string().optional(),
  userType: z.enum(['AppUser', 'Admin', 'Employee']).optional(),
  phone: z.string().optional(),
  mobile: z.string().optional(),
  streetNumber: z.string().optional(),
  streetName: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  postalCode: z.string().optional(),
  defaultStoreId: z.string().uuid().optional(),
  enableTwoFactor: z.boolean().optional(),
})

// Password Update Schema
const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Password must be at least 8 characters'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

// Store Settings Schema
const storeSettingsSchema = z.object({
  businessName: z.string().optional(),
  storeEmail: z.string().email('Invalid email address').optional(),
  alternateName: z.string().optional(),
  phone: z.string().optional(),
  mobile: z.string().optional(),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  timeZone: z.string().optional(),
  timeFormat: z.string().optional(),
  language: z.string().optional(),
  defaultCurrency: z.string().optional(),
  priceFormat: z.string().optional(),
  decimalFormat: z.string().optional(),
  chargeSalesTax: z.boolean().optional(),
  defaultTaxClass: z.string().optional(),
  taxPercentage: z.number().min(0).max(100).optional(),
  registrationNumber: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  accountingMethod: z.string().optional(),
  companyEmail: z.string().email('Invalid email address').optional(),
  emailNotifications: z.boolean().optional(),
  requireTwoFactorForAllUsers: z.boolean().optional(),
  chargeRestockingFee: z.boolean().optional(),
  diagnosticBenchFee: z.number().min(0).optional(),
  chargeDepositOnRepairs: z.boolean().optional(),
  lockScreenTimeoutMinutes: z.number().min(1).optional(),
})

type UserProfileFormData = z.infer<typeof userProfileSchema>
type PasswordFormData = z.infer<typeof passwordSchema>
type StoreSettingsFormData = z.infer<typeof storeSettingsSchema>

export default function SettingsPage() {
  const { user } = useAppSelector((state) => state.auth)
  const { toast } = useToast()
  const [avatar, setAvatar] = useState<string | null>(user?.avatar || null)
  const [loading, setLoading] = useState(false)
  const [storeId, setStoreId] = useState<string | null>(null)

  // User Profile Form
  const userProfileForm = useForm<UserProfileFormData>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      username: user?.username || '',
      email: user?.email || '',
      language: 'en',
      userType: 'AppUser',
      enableTwoFactor: false,
    },
  })

  // Password Form
  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  })

  // Store Settings Form
  const storeSettingsForm = useForm<StoreSettingsFormData>({
    resolver: zodResolver(storeSettingsSchema),
    defaultValues: {
      timeFormat: '12h',
      language: 'en',
      defaultCurrency: 'USD',
      priceFormat: '$0.00',
      decimalFormat: '2',
      chargeSalesTax: false,
      accountingMethod: 'Cash Basis',
      emailNotifications: true,
      requireTwoFactorForAllUsers: false,
      chargeRestockingFee: false,
      chargeDepositOnRepairs: false,
      lockScreenTimeoutMinutes: 15,
    },
  })

  // Load user profile
  useEffect(() => {
    if (user?.id) {
      loadUserProfile()
    }
  }, [user?.id])

  const loadUserProfile = async () => {
    try {
      setLoading(true)
      const response = await settingsService.getUserProfile(user.id)
      const profile = response.data.data
      userProfileForm.reset({
        username: profile.username || '',
        email: profile.email || '',
        phone: profile.phone || '',
        mobile: profile.mobile || '',
        language: profile.language || 'en',
        userType: profile.userType || 'AppUser',
        defaultStoreId: profile.defaultStoreId || '',
        enableTwoFactor: profile.enableTwoFactor || false,
        streetNumber: profile.address?.streetNumber || '',
        streetName: profile.address?.streetName || '',
        city: profile.address?.city || '',
        state: profile.address?.state || '',
        country: profile.address?.country || '',
        postalCode: profile.address?.postalCode || '',
      })
      if (profile.profilePictureUrl) {
        setAvatar(profile.profilePictureUrl)
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to load profile',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const onUserProfileSubmit = async (data: UserProfileFormData) => {
    try {
      setLoading(true)
      const address = data.streetNumber || data.streetName || data.city || data.state || data.postalCode
        ? {
            streetNumber: data.streetNumber || '',
            streetName: data.streetName || '',
            city: data.city || '',
            state: data.state || '',
            country: data.country || '',
            postalCode: data.postalCode || '',
          }
        : undefined

      await settingsService.updateUserProfile(user.id, {
        username: data.username,
        email: data.email,
        accessPin: data.accessPin,
        language: data.language,
        userType: data.userType,
        phone: data.phone,
        mobile: data.mobile,
        address: address,
        defaultStoreId: data.defaultStoreId ? data.defaultStoreId : undefined,
        enableTwoFactor: data.enableTwoFactor,
      })
      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update profile',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const onPasswordSubmit = async (data: PasswordFormData) => {
    try {
      setLoading(true)
      await settingsService.changePassword(user.id, data)
      toast({
        title: 'Success',
        description: 'Password updated successfully',
      })
      passwordForm.reset()
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update password',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const onStoreSettingsSubmit = async (data: StoreSettingsFormData) => {
    if (!storeId) {
      toast({
        title: 'Error',
        description: 'Please select a store first',
        variant: 'destructive',
      })
      return
    }

    try {
      setLoading(true)
      await settingsService.updateStoreSettings(storeId, data)
      toast({
        title: 'Success',
        description: 'Store settings updated successfully',
      })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update store settings',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setLoading(true)
      const response = await settingsService.uploadAvatar(user.id, file)
      setAvatar(response.data.data.avatar)
      toast({
        title: 'Success',
        description: 'Avatar uploaded successfully',
      })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to upload avatar',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Manage your account and store settings</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="w-full sm:w-auto grid grid-cols-2 sm:inline-flex">
          <TabsTrigger value="profile" className="text-xs sm:text-sm">User Profile</TabsTrigger>
          <TabsTrigger value="store" className="text-xs sm:text-sm">Store Settings</TabsTrigger>
        </TabsList>

        {/* User Profile Tab */}
        <TabsContent value="profile" className="space-y-4">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Update your profile details</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={userProfileForm.handleSubmit(onUserProfileSubmit)} className="space-y-4">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                <Avatar className="h-20 w-20 sm:h-24 sm:w-24">
                  <AvatarImage src={avatar || undefined} />
                  <AvatarFallback className="text-xl sm:text-2xl">
                    {user?.username?.[0]?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <label className="cursor-pointer">
                      <Button type="button" variant="outline" size="sm" className="w-full sm:w-auto" asChild>
                        <span>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload
                        </span>
                  </Button>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarUpload}
                      />
                    </label>
                  {avatar && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setAvatar(null)}
                        className="w-full sm:w-auto"
                      >
                      <X className="mr-2 h-4 w-4" />
                      Remove
                    </Button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="username"
                        {...userProfileForm.register('username')}
                        className="pl-10"
                        placeholder="Enter username"
                      />
                    </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        {...userProfileForm.register('email')}
                        className="pl-10"
                        placeholder="Enter email"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="accessPin">Access PIN</Label>
                    <Input
                      id="accessPin"
                      type="password"
                      {...userProfileForm.register('accessPin')}
                      placeholder="Enter PIN"
                      maxLength={10}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select
                      value={userProfileForm.watch('language')}
                      onValueChange={(value) => userProfileForm.setValue('language', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="userType">User Type</Label>
                  <Select
                    value={userProfileForm.watch('userType')}
                    onValueChange={(value) => userProfileForm.setValue('userType', value as 'AppUser' | 'Admin' | 'Employee')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select user type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AppUser">App User</SelectItem>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="Employee">Employee</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" disabled={loading}>
                  Save Changes
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>Update your contact details</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={userProfileForm.handleSubmit(onUserProfileSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        {...userProfileForm.register('phone')}
                        className="pl-10"
                        placeholder="Enter phone number"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mobile">Mobile Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="mobile"
                        {...userProfileForm.register('mobile')}
                        className="pl-10"
                        placeholder="Enter mobile number"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="defaultStoreId">Default Store</Label>
                  <Select
                    value={userProfileForm.watch('defaultStoreId') || ''}
                    onValueChange={(value) => userProfileForm.setValue('defaultStoreId', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select default store" />
                    </SelectTrigger>
                    <SelectContent>
                      {/* TODO: Load stores from API */}
                      <SelectItem value="store1">Store 1</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <Label>Address</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="streetNumber">Street Number</Label>
                      <Input
                        id="streetNumber"
                        {...userProfileForm.register('streetNumber')}
                        placeholder="Enter street number"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="streetName">Street Name</Label>
                      <Input
                        id="streetName"
                        {...userProfileForm.register('streetName')}
                        placeholder="Enter street name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        {...userProfileForm.register('city')}
                        placeholder="Enter city"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        {...userProfileForm.register('state')}
                        placeholder="Enter state"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        {...userProfileForm.register('country')}
                        placeholder="Enter country"
                      />
              </div>
              <div className="space-y-2">
                      <Label htmlFor="postalCode">Postal Code</Label>
                      <Input
                        id="postalCode"
                        {...userProfileForm.register('postalCode')}
                        placeholder="Enter postal code"
                      />
                    </div>
                  </div>
              </div>

                <Button type="submit" disabled={loading}>
                  Save Changes
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Security */}
          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>Manage your security settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex-1">
                  <Label htmlFor="2fa">Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                </div>
                <Switch
                  id="2fa"
                  checked={userProfileForm.watch('enableTwoFactor') || false}
                  onCheckedChange={(checked) => userProfileForm.setValue('enableTwoFactor', checked)}
                  className="sm:ml-4"
                />
              </div>

              <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                  <Input
                    id="current-password"
                    type="password"
                    {...passwordForm.register('currentPassword')}
                    placeholder="Enter current password"
                  />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    {...passwordForm.register('newPassword')}
                    placeholder="Enter new password"
                  />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    {...passwordForm.register('confirmPassword')}
                    placeholder="Confirm new password"
                  />
              </div>
                <Button type="submit" disabled={loading}>
                  Update Password
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Store Settings Tab */}
        <TabsContent value="store" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Store Settings</CardTitle>
              <CardDescription>Configure your store information and preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={storeSettingsForm.handleSubmit(onStoreSettingsSubmit)} className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="businessName">Business Name</Label>
                      <Input
                        id="businessName"
                        {...storeSettingsForm.register('businessName')}
                        placeholder="Enter business name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="storeEmail">Store Email</Label>
                      <Input
                        id="storeEmail"
                        type="email"
                        {...storeSettingsForm.register('storeEmail')}
                        placeholder="Enter store email"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="alternateName">Alternate Name</Label>
                      <Input
                        id="alternateName"
                        {...storeSettingsForm.register('alternateName')}
                        placeholder="Enter alternate name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        {...storeSettingsForm.register('phone')}
                        placeholder="Enter phone number"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mobile">Mobile</Label>
                      <Input
                        id="mobile"
                        {...storeSettingsForm.register('mobile')}
                        placeholder="Enter mobile number"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        type="url"
                        {...storeSettingsForm.register('website')}
                        placeholder="https://example.com"
                      />
                    </div>
                  </div>
                </div>

                {/* Other Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Other Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="timeZone">Time Zone</Label>
                      <Select
                        value={storeSettingsForm.watch('timeZone')}
                        onValueChange={(value) => storeSettingsForm.setValue('timeZone', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="America/New_York">America/New_York</SelectItem>
                          <SelectItem value="America/Chicago">America/Chicago</SelectItem>
                          <SelectItem value="America/Denver">America/Denver</SelectItem>
                          <SelectItem value="America/Los_Angeles">America/Los_Angeles</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timeFormat">Time Format</Label>
                      <Select
                        value={storeSettingsForm.watch('timeFormat')}
                        onValueChange={(value) => storeSettingsForm.setValue('timeFormat', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="12h">12 Hour</SelectItem>
                          <SelectItem value="24h">24 Hour</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <Select
                        value={storeSettingsForm.watch('language')}
                        onValueChange={(value) => storeSettingsForm.setValue('language', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                          <SelectItem value="fr">French</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="defaultCurrency">Default Currency</Label>
                      <Select
                        value={storeSettingsForm.watch('defaultCurrency')}
                        onValueChange={(value) => storeSettingsForm.setValue('defaultCurrency', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD ($)</SelectItem>
                          <SelectItem value="EUR">EUR (€)</SelectItem>
                          <SelectItem value="GBP">GBP (£)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="priceFormat">Price Format</Label>
                      <Input
                        id="priceFormat"
                        {...storeSettingsForm.register('priceFormat')}
                        placeholder="$0.00"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="decimalFormat">Decimal Format</Label>
                      <Input
                        id="decimalFormat"
                        type="number"
                        {...storeSettingsForm.register('decimalFormat', { valueAsNumber: true })}
                        placeholder="2"
                      />
                    </div>
              <div className="space-y-2">
                      <Label htmlFor="registrationNumber">Registration Number</Label>
                      <Input
                        id="registrationNumber"
                        {...storeSettingsForm.register('registrationNumber')}
                        placeholder="Enter registration number"
                      />
              </div>
              <div className="space-y-2">
                      <Label htmlFor="accountingMethod">Accounting Method</Label>
                      <Select
                        value={storeSettingsForm.watch('accountingMethod')}
                        onValueChange={(value) => storeSettingsForm.setValue('accountingMethod', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Cash Basis">Cash Basis</SelectItem>
                          <SelectItem value="Accrual Basis">Accrual Basis</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Sales Tax */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Sales Tax</h3>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="chargeSalesTax"
                      checked={storeSettingsForm.watch('chargeSalesTax') || false}
                      onCheckedChange={(checked) => storeSettingsForm.setValue('chargeSalesTax', checked)}
                    />
                    <Label htmlFor="chargeSalesTax">Charge Sales Tax</Label>
                  </div>
                  {storeSettingsForm.watch('chargeSalesTax') && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="defaultTaxClass">Default Tax Class</Label>
                        <Input
                          id="defaultTaxClass"
                          {...storeSettingsForm.register('defaultTaxClass')}
                          placeholder="Enter tax class"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="taxPercentage">Tax Percentage (%)</Label>
                        <Input
                          id="taxPercentage"
                          type="number"
                          step="0.01"
                          {...storeSettingsForm.register('taxPercentage', { valueAsNumber: true })}
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                  )}
              </div>

                {/* Business Hours */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Business Hours</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                      <Label htmlFor="startTime">Start Time</Label>
                      <Input
                        id="startTime"
                        type="time"
                        {...storeSettingsForm.register('startTime')}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endTime">End Time</Label>
                      <Input
                        id="endTime"
                        type="time"
                        {...storeSettingsForm.register('endTime')}
                      />
                    </div>
                  </div>
                </div>

                {/* Company Email */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Company Email</h3>
                <div className="space-y-2">
                    <Label htmlFor="companyEmail">Company Email</Label>
                    <Input
                      id="companyEmail"
                      type="email"
                      {...storeSettingsForm.register('companyEmail')}
                      placeholder="company@example.com"
                    />
                    <p className="text-sm text-muted-foreground">
                      Recommended to use a company domain for reliable delivery
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button type="button" variant="outline">
                      Change Email
                    </Button>
                    <Button type="button" variant="outline">
                      Verified
                    </Button>
                  </div>
                </div>

                {/* Email Notifications */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Email Notifications</h3>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="emailNotifications"
                      checked={storeSettingsForm.watch('emailNotifications') || false}
                      onCheckedChange={(checked) => storeSettingsForm.setValue('emailNotifications', checked)}
                    />
                    <Label htmlFor="emailNotifications">
                      Receive all internal system emails
                    </Label>
                  </div>
                </div>

                {/* Security */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Security</h3>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="requireTwoFactorForAllUsers"
                      checked={storeSettingsForm.watch('requireTwoFactorForAllUsers') || false}
                      onCheckedChange={(checked) => storeSettingsForm.setValue('requireTwoFactorForAllUsers', checked)}
                    />
                    <Label htmlFor="requireTwoFactorForAllUsers">
                      Require all users to set up two-factor authentication to log in
                    </Label>
                  </div>
                </div>

                {/* Restocking Fee */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Restocking Fee</h3>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="chargeRestockingFee"
                      checked={storeSettingsForm.watch('chargeRestockingFee') || false}
                      onCheckedChange={(checked) => storeSettingsForm.setValue('chargeRestockingFee', checked)}
                    />
                    <Label htmlFor="chargeRestockingFee">
                      Charge a restocking fee for returns
                    </Label>
                </div>
              </div>

                {/* Deposit */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Deposit</h3>
              <div className="space-y-2">
                    <Label htmlFor="diagnosticBenchFee">Diagnostic/Bench Fee</Label>
                    <Input
                      id="diagnosticBenchFee"
                      type="number"
                      step="0.01"
                      {...storeSettingsForm.register('diagnosticBenchFee', { valueAsNumber: true })}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="chargeDepositOnRepairs"
                      checked={storeSettingsForm.watch('chargeDepositOnRepairs') || false}
                      onCheckedChange={(checked) => storeSettingsForm.setValue('chargeDepositOnRepairs', checked)}
                    />
                    <Label htmlFor="chargeDepositOnRepairs">
                      Charge a deposit on repairs
                    </Label>
              </div>
                </div>

                {/* Lock Screen */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Lock Screen (Screen Timeout Settings)</h3>
                  <div className="space-y-2">
                    <Label htmlFor="lockScreenTimeoutMinutes">Auto-screen-off timeout (minutes)</Label>
                    <Input
                      id="lockScreenTimeoutMinutes"
                      type="number"
                      {...storeSettingsForm.register('lockScreenTimeoutMinutes', { valueAsNumber: true })}
                      placeholder="15"
                    />
              </div>
                </div>

                {/* API Key */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">API Key</h3>
                  <div className="space-y-2">
                    <Label htmlFor="apiKey">Current API Key</Label>
                    <div className="flex gap-2">
                      <Input
                        id="apiKey"
                        readOnly
                        value="••••••••••••••••"
                        className="font-mono"
                      />
                      <Button type="button" variant="outline" onClick={async () => {
                        if (!storeId) {
                          toast({
                            title: 'Error',
                            description: 'Please select a store first',
                            variant: 'destructive',
                          })
                          return
                        }
                        try {
                          const response = await settingsService.resetApiKey(storeId)
                          toast({
                            title: 'Success',
                            description: 'API key reset successfully',
                          })
                        } catch (error: any) {
                          toast({
                            title: 'Error',
                            description: error.response?.data?.message || 'Failed to reset API key',
                            variant: 'destructive',
                          })
                        }
                      }}>
                        <Key className="mr-2 h-4 w-4" />
                        Reset
                      </Button>
                    </div>
                  </div>
              </div>

                <Button type="submit" disabled={loading} className="w-full">
                  Save Settings
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

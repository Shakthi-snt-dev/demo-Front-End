import { useState, useEffect } from 'react'
import { DynamicForm, type FormConfiguration } from '@/components/forms/DynamicForm'
import { formConfigurationService, settingsService } from '@/Api/services'
import { useAppSelector } from '@/store/hooks'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2 } from 'lucide-react'

export default function DynamicSettingsPage() {
  const { user } = useAppSelector((state) => state.auth)
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [userProfileConfig, setUserProfileConfig] = useState<FormConfiguration | null>(null)
  const [storeSettingsConfig, setStoreSettingsConfig] = useState<FormConfiguration | null>(null)
  const [userProfileData, setUserProfileData] = useState<any>(null)
  const [storeSettingsData, setStoreSettingsData] = useState<any>(null)

  // Load form configurations
  useEffect(() => {
    if (user?.id) {
      loadConfigurations()
    }
  }, [user?.id])

  const loadConfigurations = async () => {
    try {
      setLoading(true)
      
      // Load user profile form configuration
      const profileConfigResponse = await formConfigurationService.getUserProfileForm(user.id)
      setUserProfileConfig(profileConfigResponse.data.data)

      // Load user profile data
      const profileResponse = await settingsService.getUserProfile(user.id)
      const profile = profileResponse.data.data
      setUserProfileData({
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

      // Load store settings form configuration (if storeId available)
      // You can get storeId from user's stores
      // For now, we'll skip this or use a placeholder
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to load form configurations',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUserProfileSubmit = async (data: any) => {
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
      throw error
    } finally {
      setLoading(false)
    }
  }

  const handleStoreSettingsSubmit = async (data: any) => {
    // TODO: Implement store settings update
    toast({
      title: 'Info',
      description: 'Store settings update will be implemented',
    })
  }

  if (loading && !userProfileConfig) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Settings (Dynamic Forms)</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Forms are configured dynamically from the backend
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">User Profile</TabsTrigger>
          <TabsTrigger value="store">Store Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          {userProfileConfig ? (
            <Card>
              <CardHeader>
                <CardTitle>{userProfileConfig.title}</CardTitle>
                {userProfileConfig.description && (
                  <CardDescription>{userProfileConfig.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <DynamicForm
                  configuration={userProfileConfig}
                  onSubmit={handleUserProfileSubmit}
                  defaultValues={userProfileData}
                  loading={loading}
                  submitLabel="Save Changes"
                />
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-8">
                <p className="text-center text-muted-foreground">Loading form configuration...</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="store" className="space-y-4">
          {storeSettingsConfig ? (
            <Card>
              <CardHeader>
                <CardTitle>{storeSettingsConfig.title}</CardTitle>
                {storeSettingsConfig.description && (
                  <CardDescription>{storeSettingsConfig.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <DynamicForm
                  configuration={storeSettingsConfig}
                  onSubmit={handleStoreSettingsSubmit}
                  defaultValues={storeSettingsData}
                  loading={loading}
                  submitLabel="Save Settings"
                />
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-8">
                <p className="text-center text-muted-foreground">
                  Store settings form will be loaded when a store is selected
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}


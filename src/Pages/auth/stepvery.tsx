import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '@/store/hooks'
import {
  User,
  Upload,
  CheckCircle2,
  ArrowRight,
  PlayCircle,
  Briefcase,
  Store,
  Settings,
  Users,
  Star,
  Image as ImageIcon,
  Power,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useToast } from '@/hooks/use-toast'
import { motion, AnimatePresence } from 'framer-motion'

// Step 1 Schema
const profileSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  profilePicture: z.any().optional(),
  defaultStore: z.string().min(1, 'Default store is required'),
  mobileNumber: z.string().min(10, 'Mobile number must be at least 10 digits'),
  street: z.string().min(1, 'Street address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  country: z.string().min(1, 'Country is required'),
  zipCode: z.string().min(1, 'Zip code is required'),
})

// Step 2 Schema
const storeSchema = z.object({
  businessName: z.string().min(1, 'Business name is required'),
  storeEmail: z.string().email('Invalid email address'),
  storeLogo: z.any().optional(),
  defaultStore: z.string().min(1, 'Default store is required'),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits'),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
  street: z.string().min(1, 'Street address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  postcode: z.string().min(1, 'Postcode is required'),
  zip: z.string().min(1, 'Zip is required'),
  country: z.string().min(1, 'Country is required'),
  timeZone: z.string().min(1, 'Time zone is required'),
  timeFormat: z.enum(['12-hour', '24-hour']),
  language: z.string().min(1, 'Language is required'),
  defaultCurrency: z.string().min(1, 'Default currency is required'),
  priceFormat: z.string().min(1, 'Price format is required'),
  decimalFormat: z.string().min(1, 'Decimal format is required'),
  chargeSalesTax: z.boolean(),
  defaultTaxClass: z.string().optional(),
  taxPercentage: z.string().optional(),
  registrationNumber: z.string().optional(),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  defaultAddress: z.string().min(1, 'Default address is required'),
})

type ProfileFormData = z.infer<typeof profileSchema>
type StoreFormData = z.infer<typeof storeSchema>

export default function StepVerificationPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [profilePicture, setProfilePicture] = useState<string | null>(null)
  const [storeLogo, setStoreLogo] = useState<string | null>(null)
  const navigate = useNavigate()
  const { toast } = useToast()
  const { user } = useAppSelector((state) => state.auth)

  // Check if email is verified
  useEffect(() => {
    if (user && !user.isEmailVerified) {
      toast({
        title: 'Email Not Verified',
        description: 'Please verify your email before proceeding.',
        variant: 'destructive',
      })
    }
  }, [user, toast])

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    mode: 'onChange',
  })

  const storeForm = useForm<StoreFormData>({
    resolver: zodResolver(storeSchema),
    mode: 'onChange',
    defaultValues: {
      chargeSalesTax: false,
      timeFormat: '12-hour',
    },
  })

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfilePicture(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleStoreLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setStoreLogo(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const onProfileSubmit = (data: ProfileFormData) => {
    console.log('Profile data:', data)
    setCurrentStep(2)
  }

  const onStoreSubmit = (data: StoreFormData) => {
    console.log('Store data:', data)
    setCurrentStep(3)
  }

  const handleWatchDemo = () => {
    toast({
      title: 'Demo',
      description: 'Demo video will open in a new window',
    })
  }

  const handleStartWork = () => {
    toast({
      title: 'Success!',
      description: 'Your account has been set up successfully',
    })
    setTimeout(() => {
      navigate('/dashboard')
    }, 1500)
  }

  const steps = [
    { number: 1, title: 'Company Information', icon: Store },
    { number: 2, title: 'Business Settings', icon: Settings },
    { number: 3, title: 'Social Media', icon: User },
    { number: 4, title: 'Add Your Team', icon: Users },
    { number: 5, title: 'Get Started', icon: Star },
  ]

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Blue Header */}
      <header className="bg-primary-500 text-white px-6 py-4 flex items-center">
        <Power className="w-5 h-5 mr-2" />
        <span className="text-lg font-semibold">FlowTap</span>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Step Navigation */}
        <aside className="w-64 bg-white border-r border-border flex-shrink-0 p-6">
          <div className="relative">
            <div className="relative space-y-6">
              {steps.map((step, index) => {
                const isActive = currentStep === step.number
                const isCompleted = currentStep > step.number
                const isLast = index === steps.length - 1

                return (
                  <div key={step.number} className="relative flex items-start">
                    {/* Vertical Line - only show between steps */}
                    {!isLast && (
                      <div
                        className={`absolute left-4 top-8 w-0.5 ${
                          isCompleted ? 'bg-primary-500' : 'bg-border'
                        }`}
                        style={{ height: 'calc(100% + 1.5rem)' }}
                      />
                    )}

                    {/* Step Circle */}
                    <div
                      className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                        isCompleted
                          ? 'bg-primary-500 text-white'
                          : isActive
                            ? 'bg-primary-500 text-white'
                            : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <span>{step.number}</span>
                      )}
                    </div>
                    
                    {/* Step Label */}
                    <div className="ml-4 flex-1 pt-0.5">
                      <p
                        className={`text-sm font-medium ${
                          isActive || isCompleted
                            ? 'text-foreground'
                            : 'text-muted-foreground'
                        }`}
                      >
                        {step.title}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-white">
          <div className="max-w-4xl mx-auto p-8">
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="mb-6">
                    <p className="text-sm text-muted-foreground mb-1">Step 1</p>
                    <h1 className="text-2xl font-semibold">Enter Your Company Information</h1>
                  </div>

                  <form
                    onSubmit={profileForm.handleSubmit(onProfileSubmit)}
                    className="space-y-6"
                  >
                    {/* Profile Picture */}
                    <div className="flex justify-center pb-4">
                      <div className="relative">
                        <Avatar className="w-20 h-20">
                          <AvatarImage src={profilePicture || ''} />
                          <AvatarFallback className="bg-muted">
                            <User className="w-8 h-8" />
                          </AvatarFallback>
                        </Avatar>
                        <label
                          htmlFor="profilePicture"
                          className="absolute bottom-0 right-0 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-600 transition-colors"
                        >
                          <Upload className="w-3 h-3 text-white" />
                        </label>
                        <input
                          id="profilePicture"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleProfilePictureChange}
                        />
                      </div>
                    </div>

                    {/* Form Fields - Two Column Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="street">
                          Street Address <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="street"
                          placeholder="Street Address"
                          {...profileForm.register('street')}
                        />
                        {profileForm.formState.errors.street && (
                          <p className="text-xs text-destructive">
                            {profileForm.formState.errors.street.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="city">
                          City <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="city"
                          placeholder="City"
                          {...profileForm.register('city')}
                        />
                        {profileForm.formState.errors.city && (
                          <p className="text-xs text-destructive">
                            {profileForm.formState.errors.city.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="state">
                          State/County <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="state"
                          placeholder="State/County"
                          {...profileForm.register('state')}
                        />
                        {profileForm.formState.errors.state && (
                          <p className="text-xs text-destructive">
                            {profileForm.formState.errors.state.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="zipCode">
                          Zip/Postal Code <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="zipCode"
                          placeholder="Zip/Postal Code"
                          {...profileForm.register('zipCode')}
                        />
                        {profileForm.formState.errors.zipCode && (
                          <p className="text-xs text-destructive">
                            {profileForm.formState.errors.zipCode.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="mobileNumber">
                          Contact Phone <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="mobileNumber"
                          type="tel"
                          placeholder="Business Phone"
                          {...profileForm.register('mobileNumber')}
                        />
                        {profileForm.formState.errors.mobileNumber && (
                          <p className="text-xs text-destructive">
                            {profileForm.formState.errors.mobileNumber.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">
                          Business Website <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Business Website"
                          {...profileForm.register('email')}
                        />
                        {profileForm.formState.errors.email && (
                          <p className="text-xs text-destructive">
                            {profileForm.formState.errors.email.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end pt-4">
                      <Button type="submit" className="min-w-[100px]">
                        Next
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </div>
                  </form>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="mb-6">
                    <p className="text-sm text-muted-foreground mb-1">Step 2</p>
                    <h1 className="text-2xl font-semibold">Business Settings</h1>
                  </div>

                  <form
                    onSubmit={storeForm.handleSubmit(onStoreSubmit)}
                    className="space-y-6"
                  >
                    {/* Store Logo */}
                    <div className="flex justify-center pb-4">
                      <div className="relative">
                        <div className="w-20 h-20 border rounded-lg flex items-center justify-center bg-muted">
                          {storeLogo ? (
                            <img
                              src={storeLogo}
                              alt="Store logo"
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <ImageIcon className="w-8 h-8 text-muted-foreground" />
                          )}
                        </div>
                        <label
                          htmlFor="storeLogo"
                          className="absolute bottom-0 right-0 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-600 transition-colors"
                        >
                          <Upload className="w-3 h-3 text-white" />
                        </label>
                        <input
                          id="storeLogo"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleStoreLogoChange}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="businessName">
                          Business Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="businessName"
                          placeholder="Business Name"
                          {...storeForm.register('businessName')}
                        />
                        {storeForm.formState.errors.businessName && (
                          <p className="text-xs text-destructive">
                            {storeForm.formState.errors.businessName.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="storeEmail">
                          Store Email <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="storeEmail"
                          type="email"
                          placeholder="store@example.com"
                          {...storeForm.register('storeEmail')}
                        />
                        {storeForm.formState.errors.storeEmail && (
                          <p className="text-xs text-destructive">
                            {storeForm.formState.errors.storeEmail.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phoneNumber">
                          Phone Number <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="phoneNumber"
                          type="tel"
                          placeholder="Phone Number"
                          {...storeForm.register('phoneNumber')}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="website">Website</Label>
                        <Input
                          id="website"
                          type="url"
                          placeholder="https://example.com"
                          {...storeForm.register('website')}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="timeZone">
                          Time Zone <span className="text-destructive">*</span>
                        </Label>
                        <Select
                          onValueChange={(value) =>
                            storeForm.setValue('timeZone', value)
                          }
                          defaultValue={storeForm.watch('timeZone')}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select time zone" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="utc">UTC</SelectItem>
                            <SelectItem value="est">EST</SelectItem>
                            <SelectItem value="pst">PST</SelectItem>
                            <SelectItem value="gmt">GMT</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="timeFormat">
                          Time Format <span className="text-destructive">*</span>
                        </Label>
                        <Select
                          onValueChange={(value) =>
                            storeForm.setValue(
                              'timeFormat',
                              value as '12-hour' | '24-hour'
                            )
                          }
                          defaultValue={storeForm.watch('timeFormat')}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select format" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="12-hour">12-hour</SelectItem>
                            <SelectItem value="24-hour">24-hour</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="language">
                          Language <span className="text-destructive">*</span>
                        </Label>
                        <Select
                          onValueChange={(value) =>
                            storeForm.setValue('language', value)
                          }
                          defaultValue={storeForm.watch('language')}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="es">Spanish</SelectItem>
                            <SelectItem value="fr">French</SelectItem>
                            <SelectItem value="de">German</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="defaultCurrency">
                          Currency <span className="text-destructive">*</span>
                        </Label>
                        <Select
                          onValueChange={(value) =>
                            storeForm.setValue('defaultCurrency', value)
                          }
                          defaultValue={storeForm.watch('defaultCurrency')}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="usd">USD ($)</SelectItem>
                            <SelectItem value="eur">EUR (€)</SelectItem>
                            <SelectItem value="gbp">GBP (£)</SelectItem>
                            <SelectItem value="jpy">JPY (¥)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="startTime">
                          Start Time <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="startTime"
                          type="time"
                          {...storeForm.register('startTime')}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="endTime">
                          End Time <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="endTime"
                          type="time"
                          {...storeForm.register('endTime')}
                        />
                      </div>
                    </div>

                    {/* Sales Tax */}
                    <div className="space-y-3 p-4 border rounded-md">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="chargeSalesTax" className="text-sm font-medium">
                          Charge Sales Tax
                        </Label>
                        <Switch
                          id="chargeSalesTax"
                          checked={storeForm.watch('chargeSalesTax')}
                          onCheckedChange={(checked) =>
                            storeForm.setValue('chargeSalesTax', checked)
                          }
                        />
                      </div>

                      {storeForm.watch('chargeSalesTax') && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2"
                        >
                          <div className="space-y-2">
                            <Label htmlFor="defaultTaxClass">Tax Class</Label>
                            <Input
                              id="defaultTaxClass"
                              placeholder="Standard"
                              {...storeForm.register('defaultTaxClass')}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="taxPercentage">Tax %</Label>
                            <Input
                              id="taxPercentage"
                              type="number"
                              placeholder="8.5"
                              {...storeForm.register('taxPercentage')}
                            />
                          </div>
                        </motion.div>
                      )}
                    </div>

                    <div className="flex justify-end pt-4">
                      <Button type="submit" className="min-w-[100px]">
                        Next
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </div>
                  </form>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="mb-6">
                    <p className="text-sm text-muted-foreground mb-1">Step 5</p>
                    <h1 className="text-2xl font-semibold">You're All Set!</h1>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div
                      className="border-2 rounded-lg p-6 cursor-pointer hover:border-primary transition-colors"
                      onClick={handleWatchDemo}
                    >
                      <div className="flex flex-col items-center text-center space-y-3">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <PlayCircle className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold mb-1">Watch Demo</h3>
                          <p className="text-sm text-muted-foreground">
                            Learn how to use the platform
                          </p>
                        </div>
                        <Button variant="outline" className="w-full" size="sm">
                          Watch Now
                        </Button>
                      </div>
                    </div>

                    <div
                      className="border-2 rounded-lg p-6 cursor-pointer hover:border-primary transition-colors"
                      onClick={handleStartWork}
                    >
                      <div className="flex flex-col items-center text-center space-y-3">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <Briefcase className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold mb-1">Start Work</h3>
                          <p className="text-sm text-muted-foreground">
                            Begin managing your store
                          </p>
                        </div>
                        <Button className="w-full" size="sm">
                          Get Started
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  )
}

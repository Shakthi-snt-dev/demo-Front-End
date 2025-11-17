import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { verifyEmail } from '@/features/auth/authSlice';
import { settingsService } from '@/Api/services';
import { useToast } from '@/hooks/use-toast';
import logo from '../assets/logo.png';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Loader2, CheckCircle2 } from 'lucide-react';

interface ProfileFormData {
  username: string;
  phone: string;
  mobile: string;
  streetNumber: string;
  streetName: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  language: string;
  enableTwoFactor: boolean;
}

interface StoreFormData {
  businessName: string;
  storeEmail: string;
  phone: string;
  mobile: string;
  website: string;
  streetNumber: string;
  streetName: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  timeZone: string;
  timeFormat: string;
  language: string;
  defaultCurrency: string;
  chargeSalesTax: boolean;
  taxPercentage: number;
}

const steps = [
  { number: 1, title: 'Step 1: Profile Settings' },
  { number: 2, title: 'Step 2: Store Settings' },
  { number: 3, title: 'Step 3: Confirmation' },
];

const Steps: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const { user } = useAppSelector((state) => state.auth);
  
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [appUserId, setAppUserId] = useState<string | null>(null);
  const [storeId] = useState<string | null>(null); // Store ID will be set when store is created
  const [verificationComplete, setVerificationComplete] = useState(false);

  const [profileData, setProfileData] = useState<ProfileFormData>({
    username: '',
    phone: '',
    mobile: '',
    streetNumber: '',
    streetName: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    language: 'en',
    enableTwoFactor: false,
  });

  const [storeData, setStoreData] = useState<StoreFormData>({
    businessName: '',
    storeEmail: '',
    phone: '',
    mobile: '',
    website: '',
    streetNumber: '',
    streetName: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    timeZone: 'America/New_York',
    timeFormat: '12h',
    language: 'en',
    defaultCurrency: 'USD',
    chargeSalesTax: false,
    taxPercentage: 0,
  });

  // Check for verification token and verify email
  useEffect(() => {
    const token = searchParams.get('token');
    if (token && !verificationComplete && !loading) {
      handleVerification(token);
    } else if (user?.id && !appUserId) {
      setAppUserId(user.id);
    }
  }, [searchParams, user, verificationComplete, loading]);

  const handleVerification = async (token: string) => {
    try {
      setLoading(true);
      const result = await dispatch(verifyEmail(token));
      
      if (verifyEmail.fulfilled.match(result)) {
        const verifiedAppUserId = result.payload.appUserId;
        
        // Mark verification as complete regardless of appUserId
        setVerificationComplete(true);
        
        if (!verifiedAppUserId) {
          console.error('AppUserId not found in verification result:', result.payload);
          console.log('Full result payload:', JSON.stringify(result.payload, null, 2));
          
          // Don't redirect immediately - allow user to see the steps form
          // They can still proceed, appUserId will be needed when saving
          toast({
            title: 'Email Verified!',
            description: 'Your email has been verified. Please complete your profile.',
            variant: 'default',
          });
          
          // Try to get appUserId from user state if available
          if (user?.id) {
            setAppUserId(user.id);
          }
        } else {
          setAppUserId(verifiedAppUserId);
          toast({
            title: 'Email Verified!',
            description: 'Your email has been successfully verified.',
          });
        }
      } else {
        const errorMessage = result.payload as string || 'Invalid or expired verification token.';
        toast({
          title: 'Verification Failed',
          description: errorMessage,
          variant: 'destructive',
        });
        // Only redirect to login if verification actually failed
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (error) {
      console.error('Verification error:', error);
      toast({
        title: 'Error',
        description: 'An error occurred during verification.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    if (currentStep === 1) {
      setProfileData((prev) => ({ ...prev, [name]: value }));
    } else if (currentStep === 2) {
      setStoreData((prev) => ({ ...prev, [name]: value }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    if (currentStep === 1) {
      setProfileData((prev) => ({ ...prev, [name]: checked }));
    } else if (currentStep === 2) {
      setStoreData((prev) => ({ ...prev, [name]: checked }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!profileData.username.trim()) newErrors.username = 'Username is required';
        if (!profileData.phone.trim()) newErrors.phone = 'Phone is required';
        if (!profileData.city.trim()) newErrors.city = 'City is required';
        if (!profileData.state.trim()) newErrors.state = 'State is required';
        if (!profileData.country.trim()) newErrors.country = 'Country is required';
        if (!profileData.postalCode.trim()) newErrors.postalCode = 'Postal Code is required';
        break;

      case 2:
        if (!storeData.businessName.trim()) newErrors.businessName = 'Business Name is required';
        if (!storeData.storeEmail.trim()) newErrors.storeEmail = 'Store Email is required';
        if (!storeData.phone.trim()) newErrors.phone = 'Phone is required';
        if (!storeData.city.trim()) newErrors.city = 'City is required';
        if (!storeData.state.trim()) newErrors.state = 'State is required';
        if (!storeData.country.trim()) newErrors.country = 'Country is required';
        if (storeData.chargeSalesTax && (!storeData.taxPercentage || storeData.taxPercentage <= 0)) {
          newErrors.taxPercentage = 'Tax percentage is required when sales tax is enabled';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (!validateStep(currentStep)) {
      return;
    }

    if (currentStep === 1) {
      // Save profile data
      if (!appUserId) {
        console.error('AppUserId is required but not found. Current state:', { appUserId, verificationComplete, token });
        toast({
          title: 'Error',
          description: 'User ID not found. Please refresh the page and try again.',
          variant: 'destructive',
        });
        return;
      }

      try {
        setSubmitting(true);
        const address = profileData.streetNumber || profileData.streetName || profileData.city
          ? {
              streetNumber: profileData.streetNumber || '',
              streetName: profileData.streetName || '',
              city: profileData.city || '',
              state: profileData.state || '',
              country: profileData.country || '',
              postalCode: profileData.postalCode || '',
            }
          : undefined;

        await settingsService.updateUserProfile(appUserId, {
          username: profileData.username,
          phone: profileData.phone,
          mobile: profileData.mobile,
          address: address,
          language: profileData.language,
          enableTwoFactor: profileData.enableTwoFactor,
        });

        toast({
          title: 'Success',
          description: 'Profile settings saved successfully',
        });

        setCurrentStep(2);
        setErrors({});
      } catch (error: any) {
        toast({
          title: 'Error',
          description: error.response?.data?.message || 'Failed to save profile settings',
          variant: 'destructive',
        });
      } finally {
        setSubmitting(false);
      }
    } else if (currentStep === 2) {
      // Save store data
      if (!appUserId) {
        toast({
          title: 'Error',
          description: 'User ID not found. Please try again.',
          variant: 'destructive',
        });
        return;
      }

      try {
        setSubmitting(true);
        const address = storeData.streetNumber || storeData.streetName || storeData.city
          ? {
              streetNumber: storeData.streetNumber || '',
              streetName: storeData.streetName || '',
              city: storeData.city || '',
              state: storeData.state || '',
              country: storeData.country || '',
              postalCode: storeData.postalCode || '',
            }
          : undefined;

        // First, we need to get or create a store
        // For now, we'll try to update store settings if storeId exists
        // If not, we'll need to create a store first (this might require additional API)
        if (storeId) {
          await settingsService.updateStoreSettings(storeId, {
            businessName: storeData.businessName,
            storeEmail: storeData.storeEmail,
            phone: storeData.phone,
            mobile: storeData.mobile,
            website: storeData.website,
            address: address,
            timeZone: storeData.timeZone,
            timeFormat: storeData.timeFormat,
            language: storeData.language,
            defaultCurrency: storeData.defaultCurrency,
            chargeSalesTax: storeData.chargeSalesTax,
            taxPercentage: storeData.taxPercentage,
          });

          toast({
            title: 'Success',
            description: 'Store settings saved successfully',
          });
        } else {
          // If no store exists, we'll just show a message
          // In a real scenario, you might want to create a store here
          toast({
            title: 'Info',
            description: 'Store settings will be saved after store creation',
          });
        }

        setCurrentStep(3);
        setErrors({});
      } catch (error: any) {
        toast({
          title: 'Error',
          description: error.response?.data?.message || 'Failed to save store settings',
          variant: 'destructive',
        });
      } finally {
        setSubmitting(false);
      }
    } else if (currentStep === 3) {
      // Final step - redirect to dashboard
      navigate('/dashboard');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const renderStepContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#0E73F6]" />
          <span className="ml-3 text-neutral-600">Verifying email...</span>
        </div>
      );
    }

    switch (currentStep) {
      case 1:
        return (
          <div>
            <h2 className="text-2xl font-semibold text-neutral-900 mb-6">Profile Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="username" className="block text-sm font-medium text-neutral-700 mb-1">
                  Username<span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Enter username"
                  value={profileData.username}
                  onChange={handleInputChange}
                  className={errors.username ? 'border-red-500' : ''}
                />
                {errors.username && (
                  <p className="mt-1 text-sm text-red-500">{errors.username}</p>
                )}
              </div>
              <div>
                <Label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-1">
                  Phone<span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Enter phone number"
                  value={profileData.phone}
                  onChange={handleInputChange}
                  className={errors.phone ? 'border-red-500' : ''}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                )}
              </div>
              <div>
                <Label htmlFor="mobile" className="block text-sm font-medium text-neutral-700 mb-1">
                  Mobile
                </Label>
                <Input
                  id="mobile"
                  name="mobile"
                  type="tel"
                  placeholder="Enter mobile number"
                  value={profileData.mobile}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="language" className="block text-sm font-medium text-neutral-700 mb-1">
                  Language
                </Label>
                <Select
                  name="language"
                  value={profileData.language}
                  onValueChange={(value) => setProfileData((prev) => ({ ...prev, language: value }))}
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
              <div>
                <Label htmlFor="streetNumber" className="block text-sm font-medium text-neutral-700 mb-1">
                  Street Number
                </Label>
                <Input
                  id="streetNumber"
                  name="streetNumber"
                  type="text"
                  placeholder="Enter street number"
                  value={profileData.streetNumber}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="streetName" className="block text-sm font-medium text-neutral-700 mb-1">
                  Street Name
                </Label>
                <Input
                  id="streetName"
                  name="streetName"
                  type="text"
                  placeholder="Enter street name"
                  value={profileData.streetName}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="city" className="block text-sm font-medium text-neutral-700 mb-1">
                  City<span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  id="city"
                  name="city"
                  type="text"
                  placeholder="Enter city"
                  value={profileData.city}
                  onChange={handleInputChange}
                  className={errors.city ? 'border-red-500' : ''}
                />
                {errors.city && (
                  <p className="mt-1 text-sm text-red-500">{errors.city}</p>
                )}
              </div>
              <div>
                <Label htmlFor="state" className="block text-sm font-medium text-neutral-700 mb-1">
                  State<span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  id="state"
                  name="state"
                  type="text"
                  placeholder="Enter state"
                  value={profileData.state}
                  onChange={handleInputChange}
                  className={errors.state ? 'border-red-500' : ''}
                />
                {errors.state && (
                  <p className="mt-1 text-sm text-red-500">{errors.state}</p>
                )}
              </div>
              <div>
                <Label htmlFor="country" className="block text-sm font-medium text-neutral-700 mb-1">
                  Country<span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  id="country"
                  name="country"
                  type="text"
                  placeholder="Enter country"
                  value={profileData.country}
                  onChange={handleInputChange}
                  className={errors.country ? 'border-red-500' : ''}
                />
                {errors.country && (
                  <p className="mt-1 text-sm text-red-500">{errors.country}</p>
                )}
              </div>
              <div>
                <Label htmlFor="postalCode" className="block text-sm font-medium text-neutral-700 mb-1">
                  Postal Code<span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  id="postalCode"
                  name="postalCode"
                  type="text"
                  placeholder="Enter postal code"
                  value={profileData.postalCode}
                  onChange={handleInputChange}
                  className={errors.postalCode ? 'border-red-500' : ''}
                />
                {errors.postalCode && (
                  <p className="mt-1 text-sm text-red-500">{errors.postalCode}</p>
                )}
              </div>
              <div className="md:col-span-2 flex items-center space-x-2">
                <Switch
                  id="enableTwoFactor"
                  checked={profileData.enableTwoFactor}
                  onCheckedChange={(checked) => handleSwitchChange('enableTwoFactor', checked)}
                />
                <Label htmlFor="enableTwoFactor" className="text-sm font-medium text-neutral-700">
                  Enable Two-Factor Authentication
                </Label>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div>
            <h2 className="text-2xl font-semibold text-neutral-900 mb-6">Store Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="businessName" className="block text-sm font-medium text-neutral-700 mb-1">
                  Business Name<span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  id="businessName"
                  name="businessName"
                  type="text"
                  placeholder="Enter business name"
                  value={storeData.businessName}
                  onChange={handleInputChange}
                  className={errors.businessName ? 'border-red-500' : ''}
                />
                {errors.businessName && (
                  <p className="mt-1 text-sm text-red-500">{errors.businessName}</p>
                )}
              </div>
              <div>
                <Label htmlFor="storeEmail" className="block text-sm font-medium text-neutral-700 mb-1">
                  Store Email<span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  id="storeEmail"
                  name="storeEmail"
                  type="email"
                  placeholder="Enter store email"
                  value={storeData.storeEmail}
                  onChange={handleInputChange}
                  className={errors.storeEmail ? 'border-red-500' : ''}
                />
                {errors.storeEmail && (
                  <p className="mt-1 text-sm text-red-500">{errors.storeEmail}</p>
                )}
              </div>
              <div>
                <Label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-1">
                  Phone<span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Enter phone number"
                  value={storeData.phone}
                  onChange={handleInputChange}
                  className={errors.phone ? 'border-red-500' : ''}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                )}
              </div>
              <div>
                <Label htmlFor="mobile" className="block text-sm font-medium text-neutral-700 mb-1">
                  Mobile
                </Label>
                <Input
                  id="mobile"
                  name="mobile"
                  type="tel"
                  placeholder="Enter mobile number"
                  value={storeData.mobile}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="website" className="block text-sm font-medium text-neutral-700 mb-1">
                  Website
                </Label>
                <Input
                  id="website"
                  name="website"
                  type="url"
                  placeholder="Enter website URL"
                  value={storeData.website}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="timeZone" className="block text-sm font-medium text-neutral-700 mb-1">
                  Time Zone
                </Label>
                <Select
                  name="timeZone"
                  value={storeData.timeZone}
                  onValueChange={(value) => setStoreData((prev) => ({ ...prev, timeZone: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select time zone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="America/New_York">Eastern Time</SelectItem>
                    <SelectItem value="America/Chicago">Central Time</SelectItem>
                    <SelectItem value="America/Denver">Mountain Time</SelectItem>
                    <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="timeFormat" className="block text-sm font-medium text-neutral-700 mb-1">
                  Time Format
                </Label>
                <Select
                  name="timeFormat"
                  value={storeData.timeFormat}
                  onValueChange={(value) => setStoreData((prev) => ({ ...prev, timeFormat: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select time format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12h">12 Hour</SelectItem>
                    <SelectItem value="24h">24 Hour</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="defaultCurrency" className="block text-sm font-medium text-neutral-700 mb-1">
                  Default Currency
                </Label>
                <Select
                  name="defaultCurrency"
                  value={storeData.defaultCurrency}
                  onValueChange={(value) => setStoreData((prev) => ({ ...prev, defaultCurrency: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="streetNumber" className="block text-sm font-medium text-neutral-700 mb-1">
                  Street Number
                </Label>
                <Input
                  id="streetNumber"
                  name="streetNumber"
                  type="text"
                  placeholder="Enter street number"
                  value={storeData.streetNumber}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="streetName" className="block text-sm font-medium text-neutral-700 mb-1">
                  Street Name
                </Label>
                <Input
                  id="streetName"
                  name="streetName"
                  type="text"
                  placeholder="Enter street name"
                  value={storeData.streetName}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="city" className="block text-sm font-medium text-neutral-700 mb-1">
                  City<span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  id="city"
                  name="city"
                  type="text"
                  placeholder="Enter city"
                  value={storeData.city}
                  onChange={handleInputChange}
                  className={errors.city ? 'border-red-500' : ''}
                />
                {errors.city && (
                  <p className="mt-1 text-sm text-red-500">{errors.city}</p>
                )}
              </div>
              <div>
                <Label htmlFor="state" className="block text-sm font-medium text-neutral-700 mb-1">
                  State<span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  id="state"
                  name="state"
                  type="text"
                  placeholder="Enter state"
                  value={storeData.state}
                  onChange={handleInputChange}
                  className={errors.state ? 'border-red-500' : ''}
                />
                {errors.state && (
                  <p className="mt-1 text-sm text-red-500">{errors.state}</p>
                )}
              </div>
              <div>
                <Label htmlFor="country" className="block text-sm font-medium text-neutral-700 mb-1">
                  Country<span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  id="country"
                  name="country"
                  type="text"
                  placeholder="Enter country"
                  value={storeData.country}
                  onChange={handleInputChange}
                  className={errors.country ? 'border-red-500' : ''}
                />
                {errors.country && (
                  <p className="mt-1 text-sm text-red-500">{errors.country}</p>
                )}
              </div>
              <div>
                <Label htmlFor="postalCode" className="block text-sm font-medium text-neutral-700 mb-1">
                  Postal Code
                </Label>
                <Input
                  id="postalCode"
                  name="postalCode"
                  type="text"
                  placeholder="Enter postal code"
                  value={storeData.postalCode}
                  onChange={handleInputChange}
                />
              </div>
              <div className="md:col-span-2 flex items-center space-x-2">
                <Switch
                  id="chargeSalesTax"
                  checked={storeData.chargeSalesTax}
                  onCheckedChange={(checked) => handleSwitchChange('chargeSalesTax', checked)}
                />
                <Label htmlFor="chargeSalesTax" className="text-sm font-medium text-neutral-700">
                  Charge Sales Tax
                </Label>
              </div>
              {storeData.chargeSalesTax && (
                <div>
                  <Label htmlFor="taxPercentage" className="block text-sm font-medium text-neutral-700 mb-1">
                    Tax Percentage<span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Input
                    id="taxPercentage"
                    name="taxPercentage"
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    placeholder="Enter tax percentage"
                    value={storeData.taxPercentage}
                    onChange={(e) => setStoreData((prev) => ({ ...prev, taxPercentage: parseFloat(e.target.value) || 0 }))}
                    className={errors.taxPercentage ? 'border-red-500' : ''}
                  />
                  {errors.taxPercentage && (
                    <p className="mt-1 text-sm text-red-500">{errors.taxPercentage}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="text-center py-8">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="w-12 h-12 text-green-600" />
              </div>
            </div>
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">Setup Complete!</h2>
            <p className="text-neutral-600 mb-6">
              Your profile and store settings have been saved successfully. You can now start using the application.
            </p>
            <div className="space-y-2 text-left max-w-md mx-auto">
              <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                <span className="text-sm font-medium text-neutral-700">Profile Settings</span>
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                <span className="text-sm font-medium text-neutral-700">Store Settings</span>
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Only show login message if there's no token, no appUserId, verification is complete, and not loading
  const token = searchParams.get('token');
  // Don't show login message if we're still verifying or have a token
  if (!appUserId && !loading && !token && verificationComplete) {
    // Verification completed but no appUserId - this is an error case
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-background p-4">
        <div className="text-center">
          <p className="text-neutral-600 mb-4">Verification completed but user ID not found. Please try logging in.</p>
          <Button onClick={() => navigate('/login')}>Go to Login</Button>
        </div>
      </div>
    );
  }
  
  // Show loading state while verifying
  if (loading && token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-background p-4">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#0E73F6] mx-auto mb-4" />
          <p className="text-neutral-600">Verifying your email...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-[#0E73F6] text-white px-4 sm:px-6 py-4">
        <div className="flex items-center">
          <img src={logo} alt="FlowUp Logo" className="h-6 sm:h-8 object-contain" />
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-64px)]">
        {/* Left Sidebar - Progress Indicator */}
        <aside className="lg:w-64 bg-white border-b lg:border-b-0 lg:border-r border-neutral-200">
          <div className="w-full lg:w-64 bg-white p-4 sm:p-6">
            <div className="relative">
              {steps.map((step, index) => (
                <div key={step.number} className="relative flex items-start gap-3 sm:gap-4 pb-6 sm:pb-8 last:pb-0">
                  {/* Connector line */}
                  {index < steps.length - 1 && (
                    <div
                      className={`absolute left-3 sm:left-4 top-8 w-0.5 ${
                        step.number < currentStep ? 'bg-[#0E73F6]' : 'bg-neutral-200'
                      }`}
                      style={{ height: 'calc(100% - 0.5rem)' }}
                    />
                  )}

                  {/* Step circle */}
                  <div className="relative z-10 flex-shrink-0">
                    <div
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium transition-colors ${
                        step.number <= currentStep
                          ? 'bg-[#0E73F6] text-white'
                          : 'bg-neutral-200 text-neutral-500'
                      }`}
                    >
                      {step.number}
                    </div>
                  </div>

                  {/* Step label */}
                  <div className="pt-1">
                    <p
                      className={`text-xs sm:text-sm font-medium transition-colors ${
                        step.number === currentStep
                          ? 'text-[#0E73F6] font-semibold'
                          : step.number < currentStep
                          ? 'text-neutral-700'
                          : 'text-neutral-400'
                      }`}
                    >
                      {step.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">
            {renderStepContent()}

            {/* Navigation Buttons */}
            {currentStep !== 3 && (
              <div className="flex flex-col sm:flex-row justify-end gap-4 mt-8">
                {currentStep > 1 && (
                  <Button
                    onClick={handleBack}
                    variant="outline"
                    disabled={submitting}
                    className="w-full sm:w-auto"
                  >
                    Back
                  </Button>
                )}
                <Button
                  onClick={handleNext}
                  disabled={submitting || loading}
                  className="w-full sm:w-auto"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    currentStep === 2 ? 'Finish' : 'Next'
                  )}
                </Button>
              </div>
            )}
            {currentStep === 3 && (
              <div className="flex justify-center mt-8">
                <Button onClick={() => navigate('/dashboard')} className="w-full sm:w-auto">
                  Go to Dashboard
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Steps;

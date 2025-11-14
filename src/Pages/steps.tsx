import React, { useState } from 'react';
import { HiUser, HiUsers } from 'react-icons/hi2';
import logo from '../assets/logo.png';

interface FormData {
  // Step 1: Company Information
  companyName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;

  // Step 2: Business Details
  businessType: string;
  industry: string;
  numberOfEmployees: string;
  annualRevenue: string;
  website: string;
  description: string;

  // Step 3: Access Control
  accessControl: string;
}

const steps = [
  { number: 1, title: 'Step 1: Company Information' },
  { number: 2, title: 'Step 2: Business Details' },
  { number: 3, title: 'Step 3: Access Control' },
];

const Steps: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<FormData>({
    companyName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    businessType: '',
    industry: '',
    numberOfEmployees: '',
    annualRevenue: '',
    website: '',
    description: '',
    accessControl: '',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.companyName.trim()) newErrors.companyName = 'Company Name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
        if (!formData.address.trim()) newErrors.address = 'Address is required';
        if (!formData.city.trim()) newErrors.city = 'City is required';
        if (!formData.state.trim()) newErrors.state = 'State is required';
        if (!formData.zipCode.trim()) newErrors.zipCode = 'Zip Code is required';
        if (!formData.country.trim()) newErrors.country = 'Country is required';
        break;

      case 2:
        if (!formData.businessType.trim()) newErrors.businessType = 'Business Type is required';
        if (!formData.industry.trim()) newErrors.industry = 'Industry is required';
        if (!formData.numberOfEmployees.trim()) newErrors.numberOfEmployees = 'Number of Employees is required';
        if (!formData.annualRevenue.trim()) newErrors.annualRevenue = 'Annual Revenue is required';
        break;

      case 3:
        if (!formData.accessControl.trim()) newErrors.accessControl = 'Please select an access option';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) {
      return;
    }

    if (currentStep < 3) {
      setCurrentStep((prev) => prev + 1);
      setErrors({});
    } else {
      // Handle form submission
      console.log('Form submitted:', formData);
      // You can add navigation or API call here
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div>
            <h2 className="text-2xl font-semibold text-neutral-900 mb-6">Company Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-neutral-700 mb-1">
                  Company Name<span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  id="companyName"
                  name="companyName"
                  type="text"
                  placeholder="Enter company name"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className={`w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#0E73F6] focus:border-transparent ${
                    errors.companyName ? 'border-red-500' : 'border-neutral-300'
                  }`}
                />
                {errors.companyName && (
                  <p className="mt-1 text-sm text-red-500">{errors.companyName}</p>
                )}
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
                  Email<span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#0E73F6] focus:border-transparent ${
                    errors.email ? 'border-red-500' : 'border-neutral-300'
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-1">
                  Phone<span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#0E73F6] focus:border-transparent ${
                    errors.phone ? 'border-red-500' : 'border-neutral-300'
                  }`}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                )}
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-neutral-700 mb-1">
                  Address<span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  placeholder="Enter address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className={`w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#0E73F6] focus:border-transparent ${
                    errors.address ? 'border-red-500' : 'border-neutral-300'
                  }`}
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-500">{errors.address}</p>
                )}
              </div>
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-neutral-700 mb-1">
                  City<span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  placeholder="Enter city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className={`w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#0E73F6] focus:border-transparent ${
                    errors.city ? 'border-red-500' : 'border-neutral-300'
                  }`}
                />
                {errors.city && (
                  <p className="mt-1 text-sm text-red-500">{errors.city}</p>
                )}
              </div>
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-neutral-700 mb-1">
                  State<span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  id="state"
                  name="state"
                  type="text"
                  placeholder="Enter state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className={`w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#0E73F6] focus:border-transparent ${
                    errors.state ? 'border-red-500' : 'border-neutral-300'
                  }`}
                />
                {errors.state && (
                  <p className="mt-1 text-sm text-red-500">{errors.state}</p>
                )}
              </div>
              <div>
                <label htmlFor="zipCode" className="block text-sm font-medium text-neutral-700 mb-1">
                  Zip Code<span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  id="zipCode"
                  name="zipCode"
                  type="text"
                  placeholder="Enter zip code"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  className={`w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#0E73F6] focus:border-transparent ${
                    errors.zipCode ? 'border-red-500' : 'border-neutral-300'
                  }`}
                />
                {errors.zipCode && (
                  <p className="mt-1 text-sm text-red-500">{errors.zipCode}</p>
                )}
              </div>
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-neutral-700 mb-1">
                  Country<span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  id="country"
                  name="country"
                  type="text"
                  placeholder="Enter country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className={`w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#0E73F6] focus:border-transparent ${
                    errors.country ? 'border-red-500' : 'border-neutral-300'
                  }`}
                />
                {errors.country && (
                  <p className="mt-1 text-sm text-red-500">{errors.country}</p>
                )}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div>
            <h2 className="text-2xl font-semibold text-neutral-900 mb-6">Business Details</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Business Type<span className="text-red-500 ml-1">*</span>
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'sole', label: 'Sole Proprietorship' },
                    { value: 'partnership', label: 'Partnership' },
                    { value: 'corporation', label: 'Corporation' },
                    { value: 'llc', label: 'LLC' },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center gap-2 cursor-pointer hover:text-[#0E73F6]"
                    >
                      <input
                        type="radio"
                        name="businessType"
                        value={option.value}
                        checked={formData.businessType === option.value}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-[#0E73F6] focus:ring-[#0E73F6] border-neutral-300"
                      />
                      <span className="text-sm text-neutral-700">{option.label}</span>
                    </label>
                  ))}
                </div>
                {errors.businessType && (
                  <p className="mt-1 text-sm text-red-500">{errors.businessType}</p>
                )}
              </div>
              <div>
                <label htmlFor="industry" className="block text-sm font-medium text-neutral-700 mb-1">
                  Industry<span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  id="industry"
                  name="industry"
                  type="text"
                  placeholder="Enter industry"
                  value={formData.industry}
                  onChange={handleInputChange}
                  className={`w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#0E73F6] focus:border-transparent ${
                    errors.industry ? 'border-red-500' : 'border-neutral-300'
                  }`}
                />
                {errors.industry && (
                  <p className="mt-1 text-sm text-red-500">{errors.industry}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Number of Employees<span className="text-red-500 ml-1">*</span>
                </label>
                <div className="space-y-2">
                  {[
                    { value: '1-10', label: '1-10' },
                    { value: '11-50', label: '11-50' },
                    { value: '51-200', label: '51-200' },
                    { value: '201+', label: '201+' },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center gap-2 cursor-pointer hover:text-[#0E73F6]"
                    >
                      <input
                        type="radio"
                        name="numberOfEmployees"
                        value={option.value}
                        checked={formData.numberOfEmployees === option.value}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-[#0E73F6] focus:ring-[#0E73F6] border-neutral-300"
                      />
                      <span className="text-sm text-neutral-700">{option.label}</span>
                    </label>
                  ))}
                </div>
                {errors.numberOfEmployees && (
                  <p className="mt-1 text-sm text-red-500">{errors.numberOfEmployees}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Annual Revenue<span className="text-red-500 ml-1">*</span>
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'less-100k', label: 'Less than $100k' },
                    { value: '100k-500k', label: '$100k - $500k' },
                    { value: '500k-1m', label: '$500k - $1M' },
                    { value: '1m+', label: '$1M+' },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center gap-2 cursor-pointer hover:text-[#0E73F6]"
                    >
                      <input
                        type="radio"
                        name="annualRevenue"
                        value={option.value}
                        checked={formData.annualRevenue === option.value}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-[#0E73F6] focus:ring-[#0E73F6] border-neutral-300"
                      />
                      <span className="text-sm text-neutral-700">{option.label}</span>
                    </label>
                  ))}
                </div>
                {errors.annualRevenue && (
                  <p className="mt-1 text-sm text-red-500">{errors.annualRevenue}</p>
                )}
              </div>
              <div>
                <label htmlFor="website" className="block text-sm font-medium text-neutral-700 mb-1">
                  Website
                </label>
                <input
                  id="website"
                  name="website"
                  type="url"
                  placeholder="Enter website URL"
                  value={formData.website}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#0E73F6] focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-neutral-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Enter business description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#0E73F6] focus:border-transparent resize-none"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div>
            <h2 className="text-2xl font-semibold text-neutral-900 mb-6">Who can access this project?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
              <button
                onClick={() => {
                  setFormData((prev) => ({ ...prev, accessControl: 'only-me' }));
                  if (errors.accessControl) {
                    setErrors((prev) => {
                      const newErrors = { ...prev };
                      delete newErrors.accessControl;
                      return newErrors;
                    });
                  }
                }}
                className={`w-full p-6 rounded-lg border-2 transition-all ${
                  formData.accessControl === 'only-me'
                    ? 'border-[#0E73F6] bg-blue-50'
                    : 'border-neutral-200 hover:border-neutral-300 bg-white'
                }`}
              >
                <div className="flex flex-col items-center gap-3">
                  <div
                    className={`p-4 rounded-full ${
                      formData.accessControl === 'only-me' ? 'bg-[#0E73F6]' : 'bg-neutral-100'
                    }`}
                  >
                    <HiUser
                      className={`w-8 h-8 ${
                        formData.accessControl === 'only-me' ? 'text-white' : 'text-neutral-600'
                      }`}
                    />
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      formData.accessControl === 'only-me' ? 'text-[#0E73F6]' : 'text-neutral-700'
                    }`}
                  >
                    Only me
                  </span>
                </div>
              </button>
              <button
                onClick={() => {
                  setFormData((prev) => ({ ...prev, accessControl: 'everyone' }));
                  if (errors.accessControl) {
                    setErrors((prev) => {
                      const newErrors = { ...prev };
                      delete newErrors.accessControl;
                      return newErrors;
                    });
                  }
                }}
                className={`w-full p-6 rounded-lg border-2 transition-all ${
                  formData.accessControl === 'everyone'
                    ? 'border-[#0E73F6] bg-blue-50'
                    : 'border-neutral-200 hover:border-neutral-300 bg-white'
                }`}
              >
                <div className="flex flex-col items-center gap-3">
                  <div
                    className={`p-4 rounded-full ${
                      formData.accessControl === 'everyone' ? 'bg-[#0E73F6]' : 'bg-neutral-100'
                    }`}
                  >
                    <HiUsers
                      className={`w-8 h-8 ${
                        formData.accessControl === 'everyone' ? 'text-white' : 'text-neutral-600'
                      }`}
                    />
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      formData.accessControl === 'everyone' ? 'text-[#0E73F6]' : 'text-neutral-700'
                    }`}
                  >
                    Everyone
                  </span>
                </div>
              </button>
            </div>
            {errors.accessControl && (
              <p className="mt-2 text-sm text-red-500">{errors.accessControl}</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

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
            <div className="flex flex-col sm:flex-row justify-end gap-4 mt-8">
              {currentStep > 1 && (
                <button
                  onClick={handleBack}
                  className="w-full sm:w-auto px-6 py-2 rounded-md border-2 border-[#0E73F6] text-[#0E73F6] font-medium hover:bg-blue-50 transition-colors"
                >
                  Back
                </button>
              )}
              <button
                onClick={handleNext}
                className="w-full sm:w-auto px-6 py-2 rounded-md bg-[#0E73F6] text-white font-medium hover:brightness-105 transition-colors"
              >
                {currentStep === 3 ? 'Finish' : 'Next'}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Steps;

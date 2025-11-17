import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  User, Mail, Phone, MapPin, Building2, Lock, Globe, Clock, DollarSign, 
  Shield, Key, Settings as SettingsIcon
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useToast } from '@/hooks/use-toast'

// Icon mapping
const iconMap: Record<string, React.ElementType> = {
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  Lock,
  Globe,
  Clock,
  DollarSign,
  Shield,
  Key,
  Settings: SettingsIcon,
}

export interface FormField {
  id: string
  label: string
  type: string
  placeholder?: string
  helpText?: string
  required?: boolean
  disabled?: boolean
  visible?: boolean
  defaultValue?: any
  validationPattern?: string
  validationMessage?: string
  minLength?: number
  maxLength?: number
  min?: number
  max?: number
  rows?: number
  options?: Array<{ value: string; label: string; disabled?: boolean; icon?: string }>
  metadata?: Record<string, any>
  order?: number
  group?: string
  icon?: string
}

export type FormConfiguration = {
  formId: string
  title: string
  description?: string
  fields: FormField[]
  defaultValues?: Record<string, any>
  groups?: string[]
}

interface DynamicFormProps {
  configuration: FormConfiguration
  onSubmit: (data: any) => Promise<void> | void
  defaultValues?: Record<string, any>
  loading?: boolean
  submitLabel?: string
  className?: string
}

export function DynamicForm({
  configuration,
  onSubmit,
  defaultValues: externalDefaultValues,
  loading = false,
  submitLabel = 'Save',
  className = '',
}: DynamicFormProps) {
  const { toast } = useToast()
  const [dependentFields, setDependentFields] = useState<Record<string, boolean>>({})

  // Build Zod schema from configuration
  const buildSchema = (fields: FormField[]) => {
    const schemaObject: Record<string, z.ZodTypeAny> = {}

    fields.forEach((field) => {
      if (!field.visible) return

      let fieldSchema: z.ZodTypeAny

      switch (field.type) {
        case 'email':
          fieldSchema = z.string().email(field.validationMessage || 'Invalid email address')
          break
        case 'number':
          fieldSchema = z.number()
          if (field.min !== undefined) fieldSchema = fieldSchema.min(field.min)
          if (field.max !== undefined) fieldSchema = fieldSchema.max(field.max)
          break
        case 'url':
          fieldSchema = z.string().url(field.validationMessage || 'Invalid URL').or(z.literal(''))
          break
        case 'password':
          fieldSchema = z.string()
          if (field.minLength) fieldSchema = fieldSchema.min(field.minLength)
          if (field.maxLength) fieldSchema = fieldSchema.max(field.maxLength)
          break
        case 'switch':
        case 'checkbox':
          fieldSchema = z.boolean()
          break
        case 'select':
          if (field.options && field.options.length > 0) {
            const optionValues = field.options.map(opt => opt.value) as [string, ...string[]]
            fieldSchema = z.enum(optionValues)
          } else {
            fieldSchema = z.string()
          }
          break
        default:
          fieldSchema = z.string()
          if (field.minLength) fieldSchema = fieldSchema.min(field.minLength)
          if (field.maxLength) fieldSchema = fieldSchema.max(field.maxLength)
          if (field.validationPattern) {
            fieldSchema = fieldSchema.regex(
              new RegExp(field.validationPattern),
              field.validationMessage || 'Invalid format'
            )
          }
      }

      // Make optional if not required
      if (!field.required) {
        fieldSchema = fieldSchema.optional()
      }

      schemaObject[field.id] = fieldSchema
    })

    return z.object(schemaObject)
  }

  const schema = buildSchema(configuration.fields)
  type FormData = z.infer<typeof schema>

  // Merge default values
  const mergedDefaults: Record<string, any> = {}
  configuration.fields.forEach((field) => {
    if (field.defaultValue !== undefined) {
      mergedDefaults[field.id] = field.defaultValue
    }
  })
  if (configuration.defaultValues) {
    Object.assign(mergedDefaults, configuration.defaultValues)
  }
  if (externalDefaultValues) {
    Object.assign(mergedDefaults, externalDefaultValues)
  }

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: mergedDefaults,
  })

  // Handle dependent fields visibility
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (!name) return

      configuration.fields.forEach((field) => {
        if (field.metadata?.dependsOn === name) {
          const dependsOnValue = form.getValues(field.metadata.dependsOn as keyof FormData)
          setDependentFields((prev) => ({
            ...prev,
            [field.id]: !!dependsOnValue,
          }))
        }
      })
    })
    return () => subscription.unsubscribe()
  }, [form, configuration.fields])

  const handleSubmit = async (data: FormData) => {
    try {
      await onSubmit(data)
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to submit form',
        variant: 'destructive',
      })
    }
  }

  const renderField = (field: FormField) => {
    if (!field.visible) return null

    // Check dependent field visibility
    if (field.metadata?.dependsOn) {
      const isVisible = dependentFields[field.id] ?? false
      if (!isVisible) return null
    }

    const IconComponent = field.icon ? iconMap[field.icon] : undefined
    const fieldError = form.formState.errors[field.id as keyof FormData]

    const baseInputProps = {
      id: field.id,
      placeholder: field.placeholder,
      disabled: field.disabled || loading,
      className: IconComponent ? 'pl-10' : '',
    }

    return (
      <div key={field.id} className="space-y-2">
        <Label htmlFor={field.id}>
          {field.label}
          {field.required && <span className="text-destructive ml-1">*</span>}
        </Label>
        {field.helpText && (
          <p className="text-sm text-muted-foreground">{field.helpText}</p>
        )}

        <div className="relative">
          {IconComponent && (
            <IconComponent className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          )}

          {field.type === 'select' ? (
            <Controller
              name={field.id as keyof FormData}
              control={form.control}
              render={({ field: formField }) => (
                <Select
                  value={(formField.value as string) || ''}
                  onValueChange={formField.onChange}
                  disabled={field.disabled || loading}
                >
                  <SelectTrigger className={IconComponent ? 'pl-10' : ''}>
                    <SelectValue placeholder={field.placeholder || 'Select...'} />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options?.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                        disabled={option.disabled}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          ) : field.type === 'switch' || field.type === 'checkbox' ? (
            <Controller
              name={field.id as keyof FormData}
              control={form.control}
              render={({ field: formField }) => (
                <div className="flex items-center space-x-2">
                  <Switch
                    id={field.id}
                    checked={formField.value as boolean}
                    onCheckedChange={formField.onChange}
                    disabled={field.disabled || loading}
                  />
                </div>
              )}
            />
          ) : field.type === 'textarea' ? (
            <Controller
              name={field.id as keyof FormData}
              control={form.control}
              render={({ field: formField }) => (
                <Textarea
                  {...baseInputProps}
                  {...formField}
                  value={(formField.value as string) || ''}
                  rows={field.rows || 4}
                  className={IconComponent ? 'pl-10' : ''}
                />
              )}
            />
          ) : (
            <Controller
              name={field.id as keyof FormData}
              control={form.control}
              render={({ field: formField }) => (
                <Input
                  {...baseInputProps}
                  {...formField}
                  value={formField.value ?? ''}
                  type={field.type}
                  minLength={field.minLength}
                  maxLength={field.maxLength}
                  min={field.min}
                  max={field.max}
                  step={field.type === 'number' ? 0.01 : undefined}
                />
              )}
            />
          )}
        </div>

        {fieldError && (
          <p className="text-sm text-destructive">
            {fieldError.message as string}
          </p>
        )}
      </div>
    )
  }

  // Group fields if groups are defined
  const groupedFields = configuration.groups
    ? configuration.groups.map((groupName) => ({
        groupName,
        fields: configuration.fields
          .filter((f) => f.group === groupName)
          .sort((a, b) => (a.order || 0) - (b.order || 0)),
      }))
    : [
        {
          groupName: null,
          fields: configuration.fields
            .filter((f) => !f.group)
            .sort((a, b) => (a.order || 0) - (b.order || 0)),
        },
      ]

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className={className}>
      <div className="space-y-6">
        {groupedFields.map((group, groupIndex) => {
          if (group.fields.length === 0) return null

          const content = (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {group.fields.map(renderField)}
            </div>
          )

          if (group.groupName) {
            return (
              <Card key={groupIndex}>
                <CardHeader>
                  <CardTitle>{group.groupName}</CardTitle>
                </CardHeader>
                <CardContent>{content}</CardContent>
              </Card>
            )
          }

          return <div key={groupIndex}>{content}</div>
        })}

        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : submitLabel}
          </Button>
        </div>
      </div>
    </form>
  )
}


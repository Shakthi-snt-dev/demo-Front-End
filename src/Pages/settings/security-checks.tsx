import { useState, useEffect } from 'react'
import { Shield, Lock } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'

const securityActions = [
  { id: 'systemSettings', label: 'Before accessing system settings', category: 'employee' },
  { id: 'manualInOut', label: 'Before manual In/Out transactions', category: 'employee' },
  { id: 'startEndShift', label: 'Before starting or ending a shift', category: 'employee' },
  { id: 'inventoryTransfers', label: 'Before inventory transfers', category: 'employee' },
  { id: 'ticketComments', label: 'Before adding/editing ticket comments', category: 'employee' },
  { id: 'inquiries', label: 'Before adding/editing inquiries', category: 'employee' },
  { id: 'estimates', label: 'Before adding/editing estimates', category: 'employee' },
  { id: 'adminSystemSettings', label: 'Before accessing system settings', category: 'admin' },
  { id: 'adminManualInOut', label: 'Before manual In/Out transactions', category: 'admin' },
  { id: 'adminStartEndShift', label: 'Before starting or ending a shift', category: 'admin' },
  { id: 'adminInventoryTransfers', label: 'Before inventory transfers', category: 'admin' },
  { id: 'adminTicketComments', label: 'Before adding/editing ticket comments', category: 'admin' },
  { id: 'adminInquiries', label: 'Before adding/editing inquiries', category: 'admin' },
  { id: 'adminEstimates', label: 'Before adding/editing estimates', category: 'admin' },
]

export default function SecurityChecksPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [employeeChecks, setEmployeeChecks] = useState<Record<string, boolean>>({})
  const [adminChecks, setAdminChecks] = useState<Record<string, boolean>>({})

  useEffect(() => {
    // Load security checks from API or use defaults
    const defaultEmployeeChecks: Record<string, boolean> = {}
    const defaultAdminChecks: Record<string, boolean> = {}
    
    securityActions.forEach((action) => {
      if (action.category === 'employee') {
        defaultEmployeeChecks[action.id] = false
      } else {
        defaultAdminChecks[action.id] = false
      }
    })

    setEmployeeChecks(defaultEmployeeChecks)
    setAdminChecks(defaultAdminChecks)
  }, [])

  const handleEmployeeCheckChange = (id: string, value: boolean) => {
    setEmployeeChecks((prev) => ({ ...prev, [id]: value }))
  }

  const handleAdminCheckChange = (id: string, value: boolean) => {
    setAdminChecks((prev) => ({ ...prev, [id]: value }))
  }

  const handleSave = async () => {
    try {
      setLoading(true)
      // TODO: Implement API call to save security checks
      // await settingsService.updateSecurityChecks({ employee: employeeChecks, admin: adminChecks })
      
      toast({
        title: 'Success',
        description: 'Security checks updated successfully',
      })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update security checks',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const employeeActions = securityActions.filter((a) => a.category === 'employee')
  const adminActions = securityActions.filter((a) => a.category === 'admin')

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Security Checks</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Configure when access PIN is required for employees and administrators
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Employee Access PIN Required
            </CardTitle>
            <CardDescription>
              Require employees to enter their access PIN for certain actions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {employeeActions.map((action) => (
              <div key={action.id} className="flex items-center justify-between">
                <Label htmlFor={action.id} className="cursor-pointer flex-1">
                  {action.label}
                </Label>
                <Switch
                  id={action.id}
                  checked={employeeChecks[action.id] || false}
                  onCheckedChange={(checked) => handleEmployeeCheckChange(action.id, checked)}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Admin Access PIN Required
            </CardTitle>
            <CardDescription>
              Require administrators to enter their access PIN for certain actions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {adminActions.map((action) => (
              <div key={action.id} className="flex items-center justify-between">
                <Label htmlFor={action.id} className="cursor-pointer flex-1">
                  {action.label}
                </Label>
                <Switch
                  id={action.id}
                  checked={adminChecks[action.id] || false}
                  onCheckedChange={(checked) => handleAdminCheckChange(action.id, checked)}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  )
}


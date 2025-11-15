import { useEffect } from 'react'
import { useToast } from '@/hooks/use-toast'
import { useAppSelector } from '@/store/hooks'

/**
 * Hook to automatically show toast notifications for API responses
 * Use this hook in components that dispatch async thunks to automatically
 * show success/error messages from the Redux state
 */
export function useApiToast(
  sliceName: keyof ReturnType<typeof useAppSelector>,
  options?: {
    showSuccess?: boolean
    showError?: boolean
    successTitle?: string
    errorTitle?: string
  }
) {
  const { toast } = useToast()
  const sliceState = useAppSelector((state) => state[sliceName] as any)

  const {
    showSuccess = true,
    showError = true,
    successTitle = 'Success',
    errorTitle = 'Error',
  } = options || {}

  useEffect(() => {
    if (showSuccess && sliceState?.message) {
      toast({
        title: successTitle,
        description: sliceState.message,
      })
      // Clear message after showing (you may want to dispatch clearMessage action)
    }
  }, [sliceState?.message, showSuccess, successTitle, toast])

  useEffect(() => {
    if (showError && sliceState?.error) {
      toast({
        title: errorTitle,
        description: sliceState.error,
        variant: 'destructive',
      })
      // Clear error after showing (you may want to dispatch clearError action)
    }
  }, [sliceState?.error, showError, errorTitle, toast])
}

/**
 * Hook to show toast for any Redux slice message/error
 * More flexible version that accepts the state directly
 */
export function useToastFromState(
  state: { message?: string | null; error?: string | null },
  options?: {
    showSuccess?: boolean
    showError?: boolean
    successTitle?: string
    errorTitle?: string
  }
) {
  const { toast } = useToast()

  const {
    showSuccess = true,
    showError = true,
    successTitle = 'Success',
    errorTitle = 'Error',
  } = options || {}

  useEffect(() => {
    if (showSuccess && state?.message) {
      toast({
        title: successTitle,
        description: state.message,
      })
    }
  }, [state?.message, showSuccess, successTitle, toast])

  useEffect(() => {
    if (showError && state?.error) {
      toast({
        title: errorTitle,
        description: state.error,
        variant: 'destructive',
      })
    }
  }, [state?.error, showError, errorTitle, toast])
}


import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { verifyEmail } from '@/features/auth/authSlice'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, XCircle, Loader2, Mail } from 'lucide-react'
import { motion } from 'framer-motion'

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { isLoading, error } = useAppSelector((state) => state.auth)
  const { toast } = useToast()
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'verifying' | 'success' | 'error'>('idle')

  const token = searchParams.get('token')

  useEffect(() => {
    if (token) {
      handleVerification(token)
    } else {
      setVerificationStatus('error')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  const handleVerification = async (verificationToken: string) => {
    setVerificationStatus('verifying')
    try {
      const result = await dispatch(verifyEmail(verificationToken))
      
      if (verifyEmail.fulfilled.match(result)) {
        setVerificationStatus('success')
        toast({
          title: 'Email Verified!',
          description: 'Your email has been successfully verified.',
        })
        // Redirect to step verification after 2 seconds
        setTimeout(() => {
          navigate('/auth/step-verification')
        }, 2000)
      } else if (verifyEmail.rejected.match(result)) {
        setVerificationStatus('error')
        toast({
          title: 'Verification Failed',
          description: error || 'Invalid or expired verification token.',
          variant: 'destructive',
        })
      }
    } catch (err) {
      setVerificationStatus('error')
      toast({
        title: 'Verification Failed',
        description: 'An error occurred during verification.',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            {verificationStatus === 'verifying' && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <Loader2 className="w-16 h-16 text-primary-500" />
              </motion.div>
            )}
            {verificationStatus === 'success' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              >
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-green-600" />
                </div>
              </motion.div>
            )}
            {verificationStatus === 'error' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              >
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                  <XCircle className="w-10 h-10 text-red-600" />
                </div>
              </motion.div>
            )}
            {verificationStatus === 'idle' && (
              <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
                <Mail className="w-10 h-10 text-primary-600" />
              </div>
            )}
          </div>
          <CardTitle className="text-2xl">
            {verificationStatus === 'verifying' && 'Verifying Email...'}
            {verificationStatus === 'success' && 'Email Verified!'}
            {verificationStatus === 'error' && 'Verification Failed'}
            {verificationStatus === 'idle' && 'Email Verification'}
          </CardTitle>
          <CardDescription>
            {verificationStatus === 'verifying' && 'Please wait while we verify your email address.'}
            {verificationStatus === 'success' && 'Your email has been successfully verified. Redirecting...'}
            {verificationStatus === 'error' && error || 'Invalid or expired verification token. Please request a new one.'}
            {verificationStatus === 'idle' && 'Please wait...'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {verificationStatus === 'error' && (
            <div className="flex flex-col gap-4">
              <Button
                onClick={() => navigate('/login')}
                variant="outline"
                className="w-full"
              >
                Go to Login
              </Button>
              <Button
                onClick={() => navigate('/signup')}
                className="w-full"
              >
                Sign Up Again
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}


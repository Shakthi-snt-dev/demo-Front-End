import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAppDispatch } from '@/store/hooks'
import { verifyEmail } from '@/features/auth/authSlice'
import { CheckCircle2, ArrowRight, Loader2, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { useToast } from '@/hooks/use-toast'

export default function VerificationSuccessfulPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const dispatch = useAppDispatch()
  const { toast } = useToast()

  const [isVerifying, setIsVerifying] = useState(true)
  const [verificationComplete, setVerificationComplete] = useState(false)
  const [verificationError, setVerificationError] = useState<string | null>(null)
  const [hasVerified, setHasVerified] = useState(false)
  const [isAlreadyVerified, setIsAlreadyVerified] = useState(false)

  const handleVerification = async (token: string) => {
    // Prevent double verification
    if (hasVerified || verificationComplete) {
      return
    }

    try {
      setIsVerifying(true)
      setVerificationError(null)
      setHasVerified(true)
      
      const result = await dispatch(verifyEmail(token))
      
      if (verifyEmail.fulfilled.match(result)) {
        setVerificationComplete(true)
        const message = result.payload?.message || 'Your email has been successfully verified.'
        
        // Check if message indicates already verified
        // The backend returns "Email is already verified..." for already verified cases
        // and "Email verified successfully..." for first-time verification
        const messageLower = message.toLowerCase().trim()
        const alreadyVerified = messageLower.startsWith('email is already verified') || 
                               messageLower.includes('email is already verified')
        
        console.log('[Verification] Message:', message)
        console.log('[Verification] Is already verified?', alreadyVerified)
        
        setIsAlreadyVerified(alreadyVerified)
        toast({
          title: alreadyVerified ? 'Email Already Verified' : 'Email Verified!',
          description: message,
        })
        
        // Auto-redirect to login after 2 seconds
        setTimeout(() => {
          navigate('/login')
        }, 2000)
      } else {
        const errorMessage = (result.payload as string) || 'Invalid or expired verification token.'
        // Check if the error message indicates email is already verified or contains helpful info
        if (errorMessage.toLowerCase().includes('already verified') || 
            errorMessage.toLowerCase().includes('already been used')) {
          setVerificationComplete(true)
          setIsAlreadyVerified(true)
          toast({
            title: 'Email Already Verified',
            description: 'Your email has already been verified. You will be redirected to the login page shortly.',
          })
          
          // Auto-redirect to login after 2 seconds
          setTimeout(() => {
            navigate('/login')
          }, 2000)
        } else {
          setVerificationError(errorMessage)
          toast({
            title: 'Verification Failed',
            description: errorMessage,
            variant: 'destructive',
          })
        }
      }
    } catch (error) {
      console.error('Verification error:', error)
      const errorMessage = 'An error occurred during verification.'
      setVerificationError(errorMessage)
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      })
    } finally {
      setIsVerifying(false)
    }
  }

  // Verify email on mount if token exists - only run once
  useEffect(() => {
    const token = searchParams.get('token')
    if (token && !hasVerified && !verificationComplete) {
      handleVerification(token)
    } else if (!token) {
      setIsVerifying(false)
      setVerificationError('No verification token found in the URL.')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  const handleGoToSteps = () => {
    // Get token from URL if available
    const token = searchParams.get('token')
    if (token) {
      navigate(`/steps?token=${token}`)
    } else {
      navigate('/steps')
    }
  }

  const handleGoToLogin = () => {
    navigate('/login')
  }

  // Show loading state while verifying
  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-background p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md"
        >
          <Card className="border-2 border-primary-200 shadow-lg">
            <CardHeader className="text-center space-y-6 pb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: 'spring',
                  stiffness: 200,
                  damping: 15,
                  delay: 0.2,
                }}
                className="flex justify-center"
              >
                <Loader2 className="w-16 h-16 text-primary-500 animate-spin" />
              </motion.div>
              <CardTitle className="text-2xl font-bold text-primary-600">
                Verifying Your Email...
              </CardTitle>
              <CardDescription className="text-base text-muted-foreground">
                Please wait while we verify your email address.
              </CardDescription>
            </CardHeader>
          </Card>
        </motion.div>
      </div>
    )
  }

  // Show error state if verification failed
  if (verificationError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-background p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md"
        >
          <Card className="border-2 border-red-200 shadow-lg">
            <CardHeader className="text-center space-y-6 pb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: 'spring',
                  stiffness: 200,
                  damping: 15,
                  delay: 0.2,
                }}
                className="flex justify-center"
              >
                <div className="relative w-24 h-24 rounded-full bg-red-100 flex items-center justify-center shadow-lg">
                  <XCircle className="w-12 h-12 text-red-600" />
                </div>
              </motion.div>
              <CardTitle className="text-2xl font-bold text-red-600">
                Verification Failed
              </CardTitle>
              <CardDescription className="text-base text-muted-foreground">
                {verificationError}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={handleGoToLogin}
                className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-6 text-base shadow-md hover:shadow-lg transition-all duration-200"
                size="lg"
              >
                Go to Login
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  // Show success components only after verification is complete
  if (!verificationComplete) {
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-background p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <Card className="border-2 border-primary-200 shadow-lg">
          <CardHeader className="text-center space-y-6 pb-8">
            {/* Animated Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: 'spring',
                stiffness: 200,
                damping: 15,
                delay: 0.2,
              }}
              className="flex justify-center"
            >
              <div className="relative">
                {/* Outer ring animation */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1.2, opacity: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.3,
                    repeat: Infinity,
                    repeatDelay: 2,
                  }}
                  className="absolute inset-0 rounded-full bg-primary-500/20"
                />
                {/* Main icon container */}
                <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg">
                  <CheckCircle2 className="w-12 h-12 text-white" />
                </div>
              </div>
            </motion.div>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <CardTitle className="text-3xl font-bold text-primary-600">
                {isAlreadyVerified ? 'Email Already Verified!' : 'Verification Successful!'}
              </CardTitle>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <CardDescription className="text-base text-muted-foreground">
                {isAlreadyVerified 
                  ? 'Your email has already been verified successfully. You will be redirected to the login page shortly.'
                  : 'Your email has been successfully verified. You will be redirected to the login page shortly.'}
              </CardDescription>
            </motion.div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Success message box */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-primary-50 border border-primary-200 rounded-lg p-4"
            >
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-primary-900">
                    Account Verified
                  </p>
                  <p className="text-xs text-primary-700 mt-1">
                    All set! Your account is now active and ready to use.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Redirecting message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="text-center"
            >
              <p className="text-sm text-muted-foreground mb-4">
                Redirecting to login page...
              </p>
              <Button
                onClick={handleGoToLogin}
                className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-6 text-base shadow-md hover:shadow-lg transition-all duration-200"
                size="lg"
              >
                Go to Login
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}


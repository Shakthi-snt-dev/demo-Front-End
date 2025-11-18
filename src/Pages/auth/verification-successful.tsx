import { useNavigate } from 'react-router-dom'
import { CheckCircle2, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'

export default function VerificationSuccessfulPage() {
  const navigate = useNavigate()

  const handleGoToSteps = () => {
    // Get token from URL if available
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get('token')
    if (token) {
      navigate(`/steps?token=${token}`)
    } else {
      navigate('/steps')
    }
  }

  const handleGoToLogin = () => {
    navigate('/login')
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
                Verification Successful!
              </CardTitle>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <CardDescription className="text-base text-muted-foreground">
                Your email has been successfully verified. You can now proceed to login and start using your account.
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

            {/* Go to Steps Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Button
                onClick={handleGoToSteps}
                className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-6 text-base shadow-md hover:shadow-lg transition-all duration-200"
                size="lg"
              >
                Continue Setup
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>

            {/* Additional info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-center pt-2 space-y-2"
            >
              <p className="text-xs text-muted-foreground">
                Complete your profile setup to get started
              </p>
              <Button
                onClick={handleGoToLogin}
                variant="ghost"
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Or go to login instead
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}


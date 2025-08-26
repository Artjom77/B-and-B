import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Fingerprint, Eye, Lock, Sparkles, Shield, ChevronRight } from 'lucide-react';

const LoginScreen = ({ onAuthenticated }) => {
  const [authStep, setAuthStep] = useState('biometric'); // biometric, pin, guest
  const [pin, setPin] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
  }, []);

  const handleBiometricAuth = async () => {
    setIsAuthenticating(true);
    setError('');

    try {
      // Check if WebAuthn is supported
      if (!window.PublicKeyCredential) {
        throw new Error('Biometric authentication not supported');
      }

      // Create a mock authentication (in real app, this would be actual WebAuthn)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock success response
      const authResponse = {
        method: isMobile ? 'faceID' : 'touchID',
        success: Math.random() > 0.3 // 70% success rate for demo
      };

      if (authResponse.success) {
        await authenticateUser(authResponse);
      } else {
        throw new Error('Biometric authentication failed');
      }
    } catch (err) {
      console.error('Biometric auth error:', err);
      setError('Biometric authentication failed. Please use PIN instead.');
      setAuthStep('pin');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handlePinAuth = async () => {
    if (pin !== '777036') {
      setError('Invalid PIN. Try 777036');
      return;
    }

    setIsAuthenticating(true);
    setError('');

    try {
      await authenticateUser({ method: 'pin', success: true, pin });
    } catch (err) {
      setError('PIN authentication failed');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleGuestAuth = async () => {
    setIsAuthenticating(true);
    setError('');

    try {
      await authenticateUser({ method: 'guest', success: true });
    } catch (err) {
      setError('Guest authentication failed');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const authenticateUser = async (authData) => {
    // Call backend authentication
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/${authData.method}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(authData),
    });

    if (response.ok) {
      const result = await response.json();
      localStorage.setItem('bb_token', result.token);
      localStorage.setItem('bb_auth_method', result.method);
      localStorage.setItem('bb_access_level', result.access_level);
      
      // Success animation
      await new Promise(resolve => setTimeout(resolve, 1000));
      onAuthenticated(result);
    } else {
      throw new Error('Authentication failed');
    }
  };

  const BiometricButton = ({ type, icon: Icon, label, description }) => (
    <motion.div
      whileHover={{ scale: 1.02, rotateY: 5 }}
      whileTap={{ scale: 0.98 }}
      className="cursor-pointer"
      onClick={handleBiometricAuth}
    >
      <Card className="p-6 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 hover:border-white/30 transition-all duration-300">
        <div className="flex items-center space-x-4">
          <div className="p-3 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm">
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-white font-semibold">{label}</h3>
            <p className="text-white/70 text-sm">{description}</p>
          </div>
          <ChevronRight className="w-5 h-5 text-white/50" />
        </div>
      </Card>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{
            background: [
              'radial-gradient(600px circle at 20% 80%, rgba(120, 119, 198, 0.3), transparent)',
              'radial-gradient(600px circle at 80% 20%, rgba(120, 119, 198, 0.3), transparent)',
              'radial-gradient(600px circle at 40% 40%, rgba(120, 119, 198, 0.3), transparent)',
            ],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute inset-0 opacity-20"
          animate={{
            background: [
              'radial-gradient(400px circle at 80% 60%, rgba(255, 255, 255, 0.1), transparent)',
              'radial-gradient(400px circle at 20% 40%, rgba(255, 255, 255, 0.1), transparent)',
              'radial-gradient(400px circle at 60% 80%, rgba(255, 255, 255, 0.1), transparent)',
            ],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear', delay: 2 }}
        />
      </div>

      {/* Main Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md space-y-8 relative z-10"
      >
        {/* Header */}
        <div className="text-center space-y-4">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="w-20 h-20 mx-auto bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center backdrop-blur-xl"
          >
            <Sparkles className="w-10 h-10 text-white" />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-3xl font-bold text-white mb-2">
              B&B Lead Hunter
            </h1>
            <p className="text-white/70">
              Premium Dashboard Access
            </p>
          </motion.div>

          <Badge className="bg-white/10 text-white border-white/20 backdrop-blur-sm">
            <Shield className="w-3 h-3 mr-1" />
            Secure Authentication
          </Badge>
        </div>

        {/* Authentication Options */}
        <AnimatePresence mode="wait">
          {authStep === 'biometric' && (
            <motion.div
              key="biometric"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              <h2 className="text-xl font-semibold text-white text-center mb-6">
                Choose Authentication Method
              </h2>

              <div className="space-y-3">
                {!isMobile && (
                  <BiometricButton
                    type="touchID"
                    icon={Fingerprint}
                    label="Touch ID"
                    description="Use your fingerprint on MacBook"
                  />
                )}
                
                {isMobile && (
                  <BiometricButton
                    type="faceID"
                    icon={Eye}
                    label="Face ID"
                    description="Use facial recognition on your device"
                  />
                )}

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={() => setAuthStep('pin')}
                    variant="outline"
                    className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10 backdrop-blur-sm"
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    Use PIN Instead
                  </Button>
                </motion.div>
              </div>

              {isAuthenticating && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center"
                >
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4"
                  >
                    {isMobile ? <Eye className="w-8 h-8 text-white" /> : <Fingerprint className="w-8 h-8 text-white" />}
                  </motion.div>
                  <p className="text-white/80">
                    {isMobile ? 'Look at your device...' : 'Place your finger on the sensor...'}
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}

          {authStep === 'pin' && (
            <motion.div
              key="pin"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <div className="text-center">
                <h2 className="text-xl font-semibold text-white mb-2">
                  Enter PIN Code
                </h2>
                <p className="text-white/70 text-sm">
                  Use PIN: 777036
                </p>
              </div>

              <Card className="p-6 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20">
                <div className="space-y-4">
                  <Input
                    type="password"
                    placeholder="Enter 6-digit PIN"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className="text-center text-2xl tracking-widest bg-white/5 border-white/20 text-white placeholder-white/50"
                    maxLength={6}
                  />
                  
                  <Button
                    onClick={handlePinAuth}
                    disabled={pin.length !== 6 || isAuthenticating}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  >
                    {isAuthenticating ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      'Authenticate'
                    )}
                  </Button>
                </div>
              </Card>

              <Button
                onClick={() => setAuthStep('biometric')}
                variant="ghost"
                className="w-full text-white/70 hover:text-white hover:bg-white/5"
              >
                ← Back to Biometric
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Guest Access */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <Button
            onClick={handleGuestAuth}
            variant="ghost"
            className="text-white/60 hover:text-white/80 hover:bg-white/5"
            disabled={isAuthenticating}
          >
            Continue as Guest (Demo Mode)
          </Button>
        </motion.div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center"
            >
              <Card className="p-4 bg-red-500/10 border-red-500/20 backdrop-blur-xl">
                <p className="text-red-300 text-sm">{error}</p>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center text-white/40 text-xs"
        >
          <p>Secured by advanced encryption</p>
          <p className="mt-1">© 2025 B&B Lead Hunter Dashboard</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginScreen;
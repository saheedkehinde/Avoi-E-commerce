import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Mail, ArrowRight } from 'lucide-react';
import '../App.css';

const EmailVerificationPage = () => {
  const [searchParams] = useSearchParams();
  const [verificationStatus, setVerificationStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    if (!token || !email) {
      setVerificationStatus('error');
      setMessage('Invalid verification link. Please check your email for the correct link.');
      return;
    }

    setUserEmail(email);
    verifyEmail(token, email);
  }, [searchParams]);

  const verifyEmail = async (token, email) => {
    try {
      const response = await fetch('http://localhost:5001/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, email }),
      });

      const data = await response.json();

      if (response.ok) {
        setVerificationStatus('success');
        setMessage(data.message);
      } else {
        setVerificationStatus('error');
        setMessage(data.error || 'Verification failed');
      }
    } catch (error) {
      setVerificationStatus('error');
      setMessage('Network error. Please try again later.');
    }
  };

  const resendVerification = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userEmail }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessage('Verification email sent successfully. Please check your inbox.');
      } else {
        setMessage(data.error || 'Failed to resend verification email');
      }
    } catch (error) {
      setMessage('Network error. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {verificationStatus === 'verifying' && (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-avoi-orange mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Verifying Your Email</h2>
            <p className="text-gray-600">Please wait while we verify your email address...</p>
          </>
        )}

        {verificationStatus === 'success' && (
          <>
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Registration Completed!</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-green-800 font-medium">Welcome to AVOI!</p>
              <p className="text-green-700 text-sm mt-1">Your account is now verified and ready to use.</p>
            </div>

            <div className="space-y-4">
              <Link
                to="/login"
                className="w-full bg-avoi-orange text-white py-3 px-6 rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
              >
                Login to Your Account
                <ArrowRight className="h-4 w-4" />
              </Link>
              
              <Link
                to="/products"
                className="w-full border border-avoi-orange text-avoi-orange py-3 px-6 rounded-lg font-medium hover:bg-orange-50 transition-colors block"
              >
                Start Shopping
              </Link>
            </div>
          </>
        )}

        {verificationStatus === 'error' && (
          <>
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Verification Failed</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            
            <div className="space-y-4">
              {userEmail && (
                <button
                  onClick={resendVerification}
                  className="w-full bg-avoi-orange text-white py-3 px-6 rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Mail className="h-4 w-4" />
                  Resend Verification Email
                </button>
              )}
              
              <Link
                to="/register"
                className="w-full border border-avoi-orange text-avoi-orange py-3 px-6 rounded-lg font-medium hover:bg-orange-50 transition-colors block"
              >
                Back to Registration
              </Link>
            </div>
          </>
        )}

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Need help? <Link to="/contact" className="text-avoi-orange hover:underline">Contact Support</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationPage;


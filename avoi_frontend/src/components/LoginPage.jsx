import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, AlertCircle, User, ArrowRight } from 'lucide-react';
import { API_ENDPOINTS } from '../config/api';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailVerificationRequired, setEmailVerificationRequired] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setEmailVerificationRequired(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setEmailVerificationRequired(false);

    try {
      const response = await fetch(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token and user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('userEmail', formData.email);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Redirect to homepage
        navigate('/');
        window.location.reload(); // Refresh to update header state
      } else {
        if (data.email_verification_required) {
          setEmailVerificationRequired(true);
          setError(data.error);
        } else {
          setError(data.error || 'Login failed. Please check your credentials.');
        }
      }
    } catch (error) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const resendVerification = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.RESEND_VERIFICATION, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setError('Verification email sent successfully. Please check your inbox.');
      } else {
        setError(data.error || 'Failed to resend verification email');
      }
    } catch (error) {
      setError('Network error. Please try again later.');
    }
  };

  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #F54708, #FAA612)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  };

  const cardStyle = {
    maxWidth: '450px',
    width: '100%',
    background: 'white',
    borderRadius: '20px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
    padding: '40px',
    position: 'relative',
    overflow: 'hidden'
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '35px'
  };

  const titleStyle = {
    fontSize: '2.2rem',
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: '10px',
    background: 'linear-gradient(135deg, #F54708, #FAA612)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  };

  const subtitleStyle = {
    color: '#6b7280',
    fontSize: '16px',
    fontWeight: '400'
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '25px'
  };

  const inputGroupStyle = {
    position: 'relative'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '8px'
  };

  const inputStyle = {
    width: '100%',
    padding: '15px 20px 15px 50px',
    border: '2px solid #e5e7eb',
    borderRadius: '12px',
    fontSize: '16px',
    outline: 'none',
    transition: 'all 0.3s ease',
    background: '#fafafa'
  };

  const inputFocusStyle = {
    borderColor: '#F54708',
    background: 'white',
    boxShadow: '0 0 0 4px rgba(245, 71, 8, 0.1)'
  };

  const inputIconStyle = {
    position: 'absolute',
    left: '18px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#9ca3af',
    width: '18px',
    height: '18px'
  };

  const passwordToggleStyle = {
    position: 'absolute',
    right: '18px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    color: '#9ca3af',
    cursor: 'pointer',
    padding: '5px',
    borderRadius: '6px',
    transition: 'color 0.2s ease'
  };

  const errorStyle = {
    background: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '12px',
    padding: '16px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px'
  };

  const warningStyle = {
    background: '#fffbeb',
    border: '1px solid #fed7aa',
    borderRadius: '12px',
    padding: '16px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px'
  };

  const submitButtonStyle = {
    width: '100%',
    background: loading ? '#d1d5db' : 'linear-gradient(135deg, #F54708, #FAA612)',
    color: 'white',
    padding: '16px',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: loading ? 'not-allowed' : 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px'
  };

  const linkStyle = {
    color: '#F54708',
    textDecoration: 'none',
    fontWeight: '600',
    transition: 'color 0.2s ease'
  };

  const linkHoverStyle = {
    color: '#d63e07',
    textDecoration: 'underline'
  };

  const dividerStyle = {
    margin: '30px 0',
    textAlign: 'center',
    position: 'relative'
  };

  const dividerLineStyle = {
    height: '1px',
    background: '#e5e7eb',
    margin: '0 auto'
  };

  const dividerTextStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    background: 'white',
    padding: '0 20px',
    color: '#6b7280',
    fontSize: '14px'
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        {/* Decorative Elements */}
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '100px',
          height: '100px',
          background: 'linear-gradient(135deg, #F54708, #FAA612)',
          borderRadius: '50%',
          opacity: '0.1'
        }}></div>
        
        <div style={{
          position: 'absolute',
          bottom: '-30px',
          left: '-30px',
          width: '60px',
          height: '60px',
          background: 'linear-gradient(135deg, #FAA612, #F54708)',
          borderRadius: '50%',
          opacity: '0.1'
        }}></div>

        <div style={headerStyle}>
          <div style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #F54708, #FAA612)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            boxShadow: '0 10px 25px rgba(245, 71, 8, 0.3)'
          }}>
            <User size={35} color="white" />
          </div>
          <h1 style={titleStyle}>Welcome Back</h1>
          <p style={subtitleStyle}>Sign in to your AVOI account to continue your skincare journey</p>
        </div>

        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail style={inputIconStyle} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={inputStyle}
                onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                placeholder="Enter your email address"
              />
            </div>
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock style={inputIconStyle} />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                style={inputStyle}
                onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={passwordToggleStyle}
                onMouseEnter={(e) => e.target.style.color = '#F54708'}
                onMouseLeave={(e) => e.target.style.color = '#9ca3af'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <div style={emailVerificationRequired ? warningStyle : errorStyle}>
              {emailVerificationRequired ? (
                <Mail size={20} style={{ color: '#d97706', marginTop: '2px' }} />
              ) : (
                <AlertCircle size={20} style={{ color: '#dc2626', marginTop: '2px' }} />
              )}
              <div style={{ flex: 1 }}>
                <p style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: emailVerificationRequired ? '#92400e' : '#991b1b',
                  marginBottom: '4px'
                }}>
                  {emailVerificationRequired ? 'Email Verification Required' : 'Login Failed'}
                </p>
                <p style={{
                  fontSize: '13px',
                  color: emailVerificationRequired ? '#a16207' : '#b91c1c',
                  lineHeight: '1.4'
                }}>
                  {error}
                </p>
                {emailVerificationRequired && (
                  <button
                    type="button"
                    onClick={resendVerification}
                    style={{
                      ...linkStyle,
                      fontSize: '13px',
                      marginTop: '8px',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0
                    }}
                    onMouseEnter={(e) => Object.assign(e.target.style, linkHoverStyle)}
                    onMouseLeave={(e) => Object.assign(e.target.style, linkStyle)}
                  >
                    Resend verification email
                  </button>
                )}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={submitButtonStyle}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 10px 25px rgba(245, 71, 8, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }
            }}
          >
            {loading ? (
              <>
                <div style={{
                  width: '20px',
                  height: '20px',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
                Signing In...
              </>
            ) : (
              <>
                Sign In
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '25px' }}>
          <Link
            to="/forgot-password"
            style={linkStyle}
            onMouseEnter={(e) => Object.assign(e.target.style, linkHoverStyle)}
            onMouseLeave={(e) => Object.assign(e.target.style, linkStyle)}
          >
            Forgot your password?
          </Link>
        </div>

        <div style={dividerStyle}>
          <div style={dividerLineStyle}></div>
          <span style={dividerTextStyle}>New to AVOI?</span>
        </div>

        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#6b7280', fontSize: '15px', marginBottom: '15px' }}>
            Join thousands of satisfied customers
          </p>
          <Link
            to="/register"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              background: 'transparent',
              border: '2px solid #F54708',
              borderRadius: '12px',
              color: '#F54708',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '14px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#F54708';
              e.target.style.color = 'white';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.color = '#F54708';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            Create Account
            <ArrowRight size={16} />
          </Link>
        </div>

        <div style={{
          marginTop: '30px',
          paddingTop: '20px',
          borderTop: '1px solid #e5e7eb',
          textAlign: 'center'
        }}>
          <p style={{ fontSize: '12px', color: '#9ca3af', lineHeight: '1.5' }}>
            By signing in, you agree to our{' '}
            <Link to="/terms" style={{ ...linkStyle, fontSize: '12px' }}>Terms of Service</Link>
            {' '}and{' '}
            <Link to="/privacy" style={{ ...linkStyle, fontSize: '12px' }}>Privacy Policy</Link>
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;


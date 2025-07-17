import { useEffect, useState } from 'react';

const SplashScreen = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [animationPhase, setAnimationPhase] = useState(0);

  useEffect(() => {
    // Animation phases
    const phase1Timer = setTimeout(() => setAnimationPhase(1), 500);
    const phase2Timer = setTimeout(() => setAnimationPhase(2), 1500);
    const phase3Timer = setTimeout(() => setAnimationPhase(3), 2500);
    
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onComplete();
      }, 800); // Wait for fade animation to complete
    }, 3500); // Show splash for 3.5 seconds

    return () => {
      clearTimeout(phase1Timer);
      clearTimeout(phase2Timer);
      clearTimeout(phase3Timer);
      clearTimeout(timer);
    };
  }, [onComplete]);

  const containerStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #F54708 0%, #FAA612 50%, #F54708 100%)',
    backgroundSize: '400% 400%',
    animation: isVisible ? 'gradientShift 4s ease-in-out infinite' : 'fadeOut 0.8s ease-out forwards',
    overflow: 'hidden'
  };

  const contentStyle = {
    textAlign: 'center',
    color: 'white',
    position: 'relative',
    zIndex: 2
  };

  const logoTextStyle = {
    fontSize: '5rem',
    fontWeight: '900',
    letterSpacing: '0.1em',
    marginBottom: '20px',
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    textShadow: '0 4px 20px rgba(0,0,0,0.3)',
    transform: animationPhase >= 1 ? 'scale(1) translateY(0)' : 'scale(0.8) translateY(20px)',
    opacity: animationPhase >= 1 ? 1 : 0,
    transition: 'all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
  };

  const taglineStyle = {
    fontSize: '1.3rem',
    fontWeight: '300',
    lineHeight: '1.6',
    maxWidth: '600px',
    margin: '0 auto',
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    textShadow: '0 2px 10px rgba(0,0,0,0.2)',
    transform: animationPhase >= 2 ? 'translateY(0)' : 'translateY(30px)',
    opacity: animationPhase >= 2 ? 1 : 0,
    transition: 'all 0.8s ease-out 0.3s'
  };

  const decorativeElementsStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
    zIndex: 1
  };

  // Floating particles/elements
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    size: Math.random() * 8 + 4,
    left: Math.random() * 100,
    top: Math.random() * 100,
    delay: Math.random() * 3,
    duration: Math.random() * 4 + 3
  }));

  return (
    <>
      <div style={containerStyle}>
        {/* Decorative Background Elements */}
        <div style={decorativeElementsStyle}>
          {particles.map(particle => (
            <div
              key={particle.id}
              style={{
                position: 'absolute',
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '50%',
                animation: `float ${particle.duration}s ease-in-out infinite ${particle.delay}s`,
                opacity: animationPhase >= 3 ? 0.6 : 0,
                transition: 'opacity 1s ease-out'
              }}
            />
          ))}
          
          {/* Large decorative circles */}
          <div style={{
            position: 'absolute',
            top: '-10%',
            right: '-10%',
            width: '300px',
            height: '300px',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '50%',
            animation: 'rotate 20s linear infinite'
          }} />
          
          <div style={{
            position: 'absolute',
            bottom: '-15%',
            left: '-15%',
            width: '400px',
            height: '400px',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '50%',
            animation: 'rotate 25s linear infinite reverse'
          }} />
        </div>

        {/* Main Content */}
        <div style={contentStyle}>
          <div style={logoTextStyle}>
            AVOI
          </div>
          <div style={taglineStyle}>
            Skincare Inspired by Nature, Rooted in<br />
            Heritage and Perfected by Science.
          </div>
          
          {/* Loading indicator */}
          <div style={{
            marginTop: '40px',
            opacity: animationPhase >= 3 ? 1 : 0,
            transition: 'opacity 0.5s ease-out 0.5s'
          }}>
            <div style={{
              width: '60px',
              height: '4px',
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '2px',
              margin: '0 auto',
              overflow: 'hidden'
            }}>
              <div style={{
                width: '100%',
                height: '100%',
                background: 'white',
                borderRadius: '2px',
                animation: 'loading 2s ease-in-out infinite',
                transformOrigin: 'left'
              }} />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes fadeOut {
          0% { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(1.05); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes loading {
          0% { transform: scaleX(0); }
          50% { transform: scaleX(1); }
          100% { transform: scaleX(0); }
        }
        
        @media (max-width: 768px) {
          .logo-text {
            font-size: 3.5rem !important;
          }
          .tagline {
            font-size: 1.1rem !important;
            padding: 0 20px;
          }
        }
        
        @media (max-width: 480px) {
          .logo-text {
            font-size: 2.8rem !important;
          }
          .tagline {
            font-size: 1rem !important;
          }
        }
      `}</style>
    </>
  );
};

export default SplashScreen;


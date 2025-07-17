import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import logoSvg from '../assets/AVOI3_104017.svg';

const Footer = ({ isMobile, isTablet }) => {
  // Responsive styles based on device type
  const getResponsiveStyles = () => {
    if (isMobile) {
      return {
        container: {
          padding: '32px 16px',
        },
        grid: {
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '24px'
        },
        brandSection: {
          gridColumn: 'span 1',
          textAlign: 'center'
        },
        contactGrid: {
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '16px'
        },
        bottomBar: {
          flexDirection: 'column',
          textAlign: 'center',
          gap: '12px'
        },
        bottomLinks: {
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }
      };
    } else if (isTablet) {
      return {
        container: {
          padding: '40px 24px',
        },
        grid: {
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '28px'
        },
        brandSection: {
          gridColumn: 'span 2'
        },
        contactGrid: {
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '20px'
        },
        bottomBar: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          gap: '16px'
        },
        bottomLinks: {
          display: 'flex',
          gap: '20px'
        }
      };
    } else {
      return {
        container: {
          padding: '48px 20px',
        },
        grid: {
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '32px'
        },
        brandSection: {
          gridColumn: 'span 2'
        },
        contactGrid: {
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '24px'
        },
        bottomBar: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          gap: '16px'
        },
        bottomLinks: {
          display: 'flex',
          gap: '24px'
        }
      };
    }
  };

  const styles = getResponsiveStyles();

  return (
    <footer style={{ 
      background: '#FAA612',
      color: 'white',
      fontFamily: 'Source Sans Pro, sans-serif'
    }}>
      <div style={{ 
        maxWidth: '1200px',
        margin: '0 auto',
        ...styles.container
      }}>
        <div style={styles.grid}>
          {/* Brand Section */}
          <div style={styles.brandSection}>
            <Link to="/" style={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: isMobile ? 'center' : 'flex-start',
              marginBottom: '16px',
              textDecoration: 'none'
            }}>
              <img 
                src={logoSvg} 
                alt="AVOI Logo" 
                style={{ 
                  height: isMobile ? '28px' : '32px',
                  width: 'auto',
                  filter: 'brightness(0) invert(1)'
                }}
              />
            </Link>
            <p style={{ 
              color: 'rgba(255, 255, 255, 0.9)',
              marginBottom: '24px',
              maxWidth: isMobile ? '100%' : '400px',
              lineHeight: '1.6',
              fontSize: isMobile ? '14px' : '16px',
              margin: isMobile ? '0 auto 24px auto' : '0 0 24px 0'
            }}>
              Skincare Inspired by Nature, Rooted in Heritage and Perfected by Science. 
              Discover premium natural skincare products for your unique beauty journey.
            </p>
            <div style={{ 
              display: 'flex', 
              gap: '16px',
              justifyContent: isMobile ? 'center' : 'flex-start'
            }}>
              <a href="#" style={{ 
                color: 'rgba(255, 255, 255, 0.7)',
                transition: 'color 0.3s ease'
              }}>
                <Facebook size={isMobile ? 18 : 20} />
              </a>
              <a href="#" style={{ 
                color: 'rgba(255, 255, 255, 0.7)',
                transition: 'color 0.3s ease'
              }}>
                <Instagram size={isMobile ? 18 : 20} />
              </a>
              <a href="#" style={{ 
                color: 'rgba(255, 255, 255, 0.7)',
                transition: 'color 0.3s ease'
              }}>
                <Twitter size={isMobile ? 18 : 20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div style={{ textAlign: isMobile ? 'center' : 'left' }}>
            <h3 style={{ 
              fontSize: isMobile ? '16px' : '18px',
              fontWeight: '600',
              marginBottom: '16px',
              color: 'white'
            }}>
              Quick Links
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '8px' }}>
                <Link to="/products" style={{ 
                  color: 'rgba(255, 255, 255, 0.9)',
                  textDecoration: 'none',
                  transition: 'color 0.3s ease',
                  fontSize: isMobile ? '14px' : '16px'
                }}>
                  Shop All Products
                </Link>
              </li>
              <li style={{ marginBottom: '8px' }}>
                <Link to="/about" style={{ 
                  color: 'rgba(255, 255, 255, 0.9)',
                  textDecoration: 'none',
                  transition: 'color 0.3s ease',
                  fontSize: isMobile ? '14px' : '16px'
                }}>
                  About Us
                </Link>
              </li>
              <li style={{ marginBottom: '8px' }}>
                <Link to="/contact" style={{ 
                  color: 'rgba(255, 255, 255, 0.9)',
                  textDecoration: 'none',
                  transition: 'color 0.3s ease',
                  fontSize: isMobile ? '14px' : '16px'
                }}>
                  Contact
                </Link>
              </li>
              <li style={{ marginBottom: '8px' }}>
                <Link to="/account" style={{ 
                  color: 'rgba(255, 255, 255, 0.9)',
                  textDecoration: 'none',
                  transition: 'color 0.3s ease',
                  fontSize: isMobile ? '14px' : '16px'
                }}>
                  My Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div style={{ textAlign: isMobile ? 'center' : 'left' }}>
            <h3 style={{ 
              fontSize: isMobile ? '16px' : '18px',
              fontWeight: '600',
              marginBottom: '16px',
              color: 'white'
            }}>
              Customer Service
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '8px' }}>
                <a href="#" style={{ 
                  color: 'rgba(255, 255, 255, 0.9)',
                  textDecoration: 'none',
                  transition: 'color 0.3s ease',
                  fontSize: isMobile ? '14px' : '16px'
                }}>
                  Shipping Info
                </a>
              </li>
              <li style={{ marginBottom: '8px' }}>
                <a href="#" style={{ 
                  color: 'rgba(255, 255, 255, 0.9)',
                  textDecoration: 'none',
                  transition: 'color 0.3s ease',
                  fontSize: isMobile ? '14px' : '16px'
                }}>
                  Returns & Exchanges
                </a>
              </li>
              <li style={{ marginBottom: '8px' }}>
                <a href="#" style={{ 
                  color: 'rgba(255, 255, 255, 0.9)',
                  textDecoration: 'none',
                  transition: 'color 0.3s ease',
                  fontSize: isMobile ? '14px' : '16px'
                }}>
                  Size Guide
                </a>
              </li>
              <li style={{ marginBottom: '8px' }}>
                <a href="#" style={{ 
                  color: 'rgba(255, 255, 255, 0.9)',
                  textDecoration: 'none',
                  transition: 'color 0.3s ease',
                  fontSize: isMobile ? '14px' : '16px'
                }}>
                  FAQ
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div style={{ 
          borderTop: '1px solid rgba(255, 255, 255, 0.2)',
          marginTop: isMobile ? '24px' : '32px',
          paddingTop: isMobile ? '24px' : '32px'
        }}>
          <div style={styles.contactGrid}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px',
              justifyContent: isMobile ? 'center' : 'flex-start'
            }}>
              <Mail size={isMobile ? 18 : 20} style={{ color: 'white' }} />
              <span style={{ 
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: isMobile ? '14px' : '16px'
              }}>
                support@avoi.com
              </span>
            </div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px',
              justifyContent: isMobile ? 'center' : 'flex-start'
            }}>
              <Phone size={isMobile ? 18 : 20} style={{ color: 'white' }} />
              <span style={{ 
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: isMobile ? '14px' : '16px'
              }}>
                +234 123 456 7890
              </span>
            </div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px',
              justifyContent: isMobile ? 'center' : 'flex-start'
            }}>
              <MapPin size={isMobile ? 18 : 20} style={{ color: 'white' }} />
              <span style={{ 
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: isMobile ? '14px' : '16px'
              }}>
                Lagos, Nigeria
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{ 
          borderTop: '1px solid rgba(255, 255, 255, 0.2)',
          marginTop: isMobile ? '24px' : '32px',
          paddingTop: isMobile ? '24px' : '32px',
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          ...styles.bottomBar
        }}>
          <p style={{ 
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: isMobile ? '12px' : '14px',
            margin: 0
          }}>
            © 2025 AVOI. All rights reserved.
          </p>
          <div style={styles.bottomLinks}>
            <a href="#" style={{ 
              color: 'rgba(255, 255, 255, 0.8)',
              textDecoration: 'none',
              fontSize: isMobile ? '12px' : '14px',
              transition: 'color 0.3s ease'
            }}>
              Privacy Policy
            </a>
            <a href="#" style={{ 
              color: 'rgba(255, 255, 255, 0.8)',
              textDecoration: 'none',
              fontSize: isMobile ? '12px' : '14px',
              transition: 'color 0.3s ease'
            }}>
              Terms of Service
            </a>
            <a href="#" style={{ 
              color: 'rgba(255, 255, 255, 0.8)',
              textDecoration: 'none',
              fontSize: isMobile ? '12px' : '14px',
              transition: 'color 0.3s ease'
            }}>
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


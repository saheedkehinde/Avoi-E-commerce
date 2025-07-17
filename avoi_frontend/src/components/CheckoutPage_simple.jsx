import React from 'react';

const CheckoutPageSimple = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8f9fa', 
      padding: '40px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        maxWidth: '600px',
        width: '100%'
      }}>
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: 'bold', 
          color: '#F54708', 
          marginBottom: '24px' 
        }}>
          Checkout Page
        </h1>
        <p style={{ 
          fontSize: '1.1rem', 
          color: '#666', 
          marginBottom: '32px' 
        }}>
          This is the checkout page. The full checkout functionality is being implemented.
        </p>
        <div style={{
          backgroundColor: '#fff5f0',
          border: '2px solid #F54708',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '24px'
        }}>
          <h3 style={{ color: '#F54708', marginBottom: '8px' }}>Coming Soon</h3>
          <p style={{ color: '#333' }}>
            Complete checkout process with shipping, payment, and order confirmation.
          </p>
        </div>
        <a 
          href="/cart" 
          style={{
            display: 'inline-block',
            backgroundColor: '#F54708',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: '600',
            transition: 'background-color 0.3s ease'
          }}
        >
          Back to Cart
        </a>
      </div>
    </div>
  );
};

export default CheckoutPageSimple;


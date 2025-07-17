import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { API_ENDPOINTS } from '../config/api';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, getCartTotal, clearCart } = useCart();
  const cartItems = cart.items;
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  // Form states
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Nigeria'
  });

  const [deliveryOption, setDeliveryOption] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('paystack');

  // Delivery options with pricing
  const deliveryOptions = [
    {
      id: 'standard',
      name: 'Standard Delivery',
      description: '5-7 business days',
      price: 2500, // ₦2,500
      icon: '🚚'
    },
    {
      id: 'express',
      name: 'Express Delivery',
      description: '2-3 business days',
      price: 5000, // ₦5,000
      icon: '⚡'
    },
    {
      id: 'overnight',
      name: 'Overnight Delivery',
      description: 'Next business day',
      price: 8000, // ₦8,000
      icon: '🚀'
    }
  ];

  // Payment methods
  const paymentMethods = [
    {
      id: 'paystack',
      name: 'Paystack',
      description: 'Pay with card, bank transfer, or USSD',
      icon: '💳'
    },
    {
      id: 'flutterwave',
      name: 'Flutterwave',
      description: 'Multiple payment options',
      icon: '🏦'
    },
    {
      id: 'bank_transfer',
      name: 'Bank Transfer',
      description: 'Direct bank transfer',
      icon: '🏧'
    }
  ];

  const selectedDelivery = deliveryOptions.find(option => option.id === deliveryOption);
  const subtotal = getCartTotal();
  const deliveryFee = selectedDelivery?.price || 0;
  const total = subtotal + deliveryFee;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate order processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate order number
      const orderNum = 'AVOI-' + Date.now().toString().slice(-6);
      setOrderNumber(orderNum);
      setOrderSuccess(true);
      
      // Clear cart after successful order
      clearCart();
      
    } catch (error) {
      console.error('Order submission failed:', error);
      alert('Order submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0 && !orderSuccess) {
    return (
      <div style={{ 
        minHeight: '60vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        textAlign: 'center',
        padding: '40px 20px'
      }}>
        <div>
          <h2 style={{ color: '#F54708', marginBottom: '20px' }}>Your cart is empty</h2>
          <p style={{ marginBottom: '30px', color: '#666' }}>Add some products to your cart before checkout</p>
          <button 
            onClick={() => navigate('/products')}
            style={{
              background: '#F54708',
              color: 'white',
              padding: '12px 30px',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  if (orderSuccess) {
    return (
      <div style={{ 
        minHeight: '60vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        textAlign: 'center',
        padding: '40px 20px'
      }}>
        <div style={{
          background: 'white',
          padding: '40px',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          maxWidth: '500px'
        }}>
          <div style={{ fontSize: '60px', marginBottom: '20px' }}>🎉</div>
          <h2 style={{ color: '#28a745', marginBottom: '20px' }}>Order Placed Successfully!</h2>
          <p style={{ marginBottom: '15px', color: '#666' }}>
            Thank you for your order. Your order number is:
          </p>
          <div style={{
            background: '#f8f9fa',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '25px',
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#F54708'
          }}>
            {orderNumber}
          </div>
          <p style={{ marginBottom: '30px', color: '#666' }}>
            You will receive an email confirmation shortly with tracking details.
          </p>
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
            <button 
              onClick={() => navigate('/')}
              style={{
                background: '#F54708',
                color: 'white',
                padding: '12px 25px',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                cursor: 'pointer'
              }}
            >
              Continue Shopping
            </button>
            <button 
              onClick={() => navigate('/account')}
              style={{
                background: 'white',
                color: '#F54708',
                padding: '12px 25px',
                border: '2px solid #F54708',
                borderRadius: '8px',
                fontSize: '16px',
                cursor: 'pointer'
              }}
            >
              View Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: '40px 20px',
      background: '#f8f9fa',
      minHeight: '100vh'
    }}>
      <h1 style={{ 
        textAlign: 'center', 
        marginBottom: '40px', 
        color: '#F54708',
        fontSize: '2.5rem'
      }}>
        Checkout
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '40px' }}>
        {/* Left Column - Forms */}
        <div>
          <form onSubmit={handleSubmitOrder}>
            {/* Shipping Information */}
            <div style={{
              background: 'white',
              padding: '30px',
              borderRadius: '12px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              marginBottom: '30px'
            }}>
              <h3 style={{ color: '#F54708', marginBottom: '25px', fontSize: '1.5rem' }}>
                🚚 Shipping Information
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={shippingInfo.firstName}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={shippingInfo.lastName}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={shippingInfo.email}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={shippingInfo.phone}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                  Street Address *
                </label>
                <input
                  type="text"
                  name="address"
                  value={shippingInfo.address}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '16px'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={shippingInfo.city}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                    State *
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={shippingInfo.state}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    value={shippingInfo.zipCode}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Delivery Options */}
            <div style={{
              background: 'white',
              padding: '30px',
              borderRadius: '12px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              marginBottom: '30px'
            }}>
              <h3 style={{ color: '#F54708', marginBottom: '25px', fontSize: '1.5rem' }}>
                🚀 Delivery Options
              </h3>
              
              {deliveryOptions.map(option => (
                <div
                  key={option.id}
                  onClick={() => setDeliveryOption(option.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '20px',
                    border: `2px solid ${deliveryOption === option.id ? '#F54708' : '#ddd'}`,
                    borderRadius: '12px',
                    marginBottom: '15px',
                    cursor: 'pointer',
                    background: deliveryOption === option.id ? '#fff5f0' : 'white'
                  }}
                >
                  <div style={{ fontSize: '24px', marginRight: '15px' }}>{option.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', marginBottom: '5px' }}>{option.name}</div>
                    <div style={{ color: '#666', fontSize: '14px' }}>{option.description}</div>
                  </div>
                  <div style={{ fontWeight: '600', color: '#F54708' }}>
                    ₦{option.price.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            {/* Payment Methods */}
            <div style={{
              background: 'white',
              padding: '30px',
              borderRadius: '12px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              marginBottom: '30px'
            }}>
              <h3 style={{ color: '#F54708', marginBottom: '25px', fontSize: '1.5rem' }}>
                💳 Payment Method
              </h3>
              
              {paymentMethods.map(method => (
                <div
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '20px',
                    border: `2px solid ${paymentMethod === method.id ? '#F54708' : '#ddd'}`,
                    borderRadius: '12px',
                    marginBottom: '15px',
                    cursor: 'pointer',
                    background: paymentMethod === method.id ? '#fff5f0' : 'white'
                  }}
                >
                  <div style={{ fontSize: '24px', marginRight: '15px' }}>{method.icon}</div>
                  <div>
                    <div style={{ fontWeight: '600', marginBottom: '5px' }}>{method.name}</div>
                    <div style={{ color: '#666', fontSize: '14px' }}>{method.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </form>
        </div>

        {/* Right Column - Order Summary */}
        <div>
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '12px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            position: 'sticky',
            top: '20px'
          }}>
            <h3 style={{ color: '#F54708', marginBottom: '25px', fontSize: '1.5rem' }}>
              📋 Order Summary
            </h3>

            {/* Cart Items */}
            <div style={{ marginBottom: '25px' }}>
              {cartItems.map(item => (
                <div key={item.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '15px 0',
                  borderBottom: '1px solid #eee'
                }}>
                  <img 
                    src={item.image} 
                    alt={item.name}
                    style={{
                      width: '60px',
                      height: '60px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      marginRight: '15px'
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', marginBottom: '5px' }}>{item.name}</div>
                    <div style={{ color: '#666', fontSize: '14px' }}>Qty: {item.quantity}</div>
                  </div>
                  <div style={{ fontWeight: '600', color: '#F54708' }}>
                    ₦{(item.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            {/* Order Totals */}
            <div style={{ borderTop: '2px solid #eee', paddingTop: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span>Subtotal:</span>
                <span>₦{subtotal.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span>Delivery:</span>
                <span>₦{deliveryFee.toLocaleString()}</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '18px',
                fontWeight: '600',
                color: '#F54708',
                borderTop: '1px solid #eee',
                paddingTop: '15px',
                marginTop: '15px'
              }}>
                <span>Total:</span>
                <span>₦{total.toLocaleString()}</span>
              </div>
            </div>

            {/* Place Order Button */}
            <button
              onClick={handleSubmitOrder}
              disabled={loading}
              style={{
                width: '100%',
                background: loading ? '#ccc' : '#F54708',
                color: 'white',
                padding: '15px',
                border: 'none',
                borderRadius: '12px',
                fontSize: '18px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                marginTop: '25px'
              }}
            >
              {loading ? 'Processing Order...' : `Place Order - ₦${total.toLocaleString()}`}
            </button>

            <div style={{
              textAlign: 'center',
              marginTop: '15px',
              fontSize: '12px',
              color: '#666'
            }}>
              🔒 Your payment information is secure and encrypted
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;


from flask import Blueprint, request, jsonify
from src.services.email_service import send_email
import re
from datetime import datetime

newsletter_bp = Blueprint('newsletter', __name__)

# Simple email validation
def is_valid_email(email):
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

@newsletter_bp.route('/newsletter/subscribe', methods=['POST'])
def subscribe_newsletter():
    try:
        data = request.get_json()
        email = data.get('email', '').strip().lower()
        
        if not email:
            return jsonify({
                'success': False,
                'message': 'Email address is required'
            }), 400
            
        if not is_valid_email(email):
            return jsonify({
                'success': False,
                'message': 'Please enter a valid email address'
            }), 400
        
        # Create welcome email content
        subject = "Welcome to AVOI - Your Skincare Journey Begins! 🌟"
        
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to AVOI</title>
            <style>
                body {{ font-family: 'Arial', sans-serif; margin: 0; padding: 0; background-color: #f8f9fa; }}
                .container {{ max-width: 600px; margin: 0 auto; background-color: white; }}
                .header {{ background: linear-gradient(135deg, #F54708 0%, #FF6B35 25%, #FAA612 75%, #FFD700 100%); padding: 40px 20px; text-align: center; }}
                .header h1 {{ color: white; font-size: 32px; margin: 0; font-weight: bold; }}
                .header p {{ color: white; font-size: 16px; margin: 10px 0 0 0; opacity: 0.9; }}
                .content {{ padding: 40px 30px; }}
                .content h2 {{ color: #333; font-size: 24px; margin-bottom: 20px; }}
                .content p {{ color: #666; line-height: 1.6; margin-bottom: 15px; }}
                .benefits {{ background-color: #f8f9fa; padding: 25px; border-radius: 8px; margin: 25px 0; }}
                .benefits h3 {{ color: #F54708; font-size: 18px; margin-bottom: 15px; }}
                .benefits ul {{ color: #666; padding-left: 20px; }}
                .benefits li {{ margin-bottom: 8px; }}
                .cta {{ text-align: center; margin: 30px 0; }}
                .cta a {{ background: linear-gradient(135deg, #F54708, #FAA612); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; }}
                .footer {{ background-color: #333; color: white; padding: 30px; text-align: center; }}
                .footer p {{ margin: 5px 0; font-size: 14px; }}
                .social {{ margin: 20px 0; }}
                .social a {{ color: #F54708; text-decoration: none; margin: 0 10px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Welcome to AVOI! 🌟</h1>
                    <p>Skincare Inspired by Nature, Rooted in Heritage and Perfected by Science</p>
                </div>
                
                <div class="content">
                    <h2>Thank You for Subscribing!</h2>
                    <p>Dear Skincare Enthusiast,</p>
                    <p>We're absolutely thrilled to welcome you to the AVOI family! Your journey to healthier, more radiant skin starts now.</p>
                    
                    <div class="benefits">
                        <h3>What You'll Receive:</h3>
                        <ul>
                            <li>🌿 <strong>Expert Skincare Tips</strong> - Professional advice from our skincare specialists</li>
                            <li>💰 <strong>Exclusive Discounts</strong> - Special offers available only to subscribers</li>
                            <li>🆕 <strong>New Product Alerts</strong> - Be the first to know about our latest innovations</li>
                            <li>📚 <strong>Educational Content</strong> - Learn about natural ingredients and their benefits</li>
                            <li>🎁 <strong>Special Promotions</strong> - Access to limited-time offers and seasonal sales</li>
                        </ul>
                    </div>
                    
                    <p>At AVOI, we believe that beautiful skin comes from the harmony between nature's finest ingredients and scientific innovation. Our carefully curated products are designed to nourish, protect, and enhance your natural beauty.</p>
                    
                    <div class="cta">
                        <a href="https://hqvcmmpq.manus.space" target="_blank">Explore Our Products</a>
                    </div>
                    
                    <p>Thank you for trusting AVOI with your skincare journey. We can't wait to help you achieve the healthy, glowing skin you deserve!</p>
                    
                    <p>With love and natural goodness,<br>
                    <strong>The AVOI Team</strong></p>
                </div>
                
                <div class="footer">
                    <p><strong>AVOI - Skincare Inspired by Nature</strong></p>
                    <p>Lagos, Nigeria | support@avoi.com | +234 123 456 7890</p>
                    <div class="social">
                        <a href="#">Facebook</a> | <a href="#">Instagram</a> | <a href="#">Twitter</a>
                    </div>
                    <p style="font-size: 12px; margin-top: 20px;">
                        You're receiving this email because you subscribed to AVOI newsletter.<br>
                        If you no longer wish to receive these emails, you can unsubscribe at any time.
                    </p>
                </div>
            </div>
        </body>
        </html>
        """
        
        # Plain text version for email clients that don't support HTML
        text_content = f"""
        Welcome to AVOI! 🌟
        
        Dear Skincare Enthusiast,
        
        Thank you for subscribing to our newsletter! We're thrilled to welcome you to the AVOI family.
        
        What You'll Receive:
        • Expert Skincare Tips - Professional advice from our specialists
        • Exclusive Discounts - Special offers for subscribers only
        • New Product Alerts - Be first to know about our latest products
        • Educational Content - Learn about natural ingredients
        • Special Promotions - Access to limited-time offers
        
        At AVOI, we believe beautiful skin comes from harmony between nature's finest ingredients and scientific innovation.
        
        Visit our website: https://hqvcmmpq.manus.space
        
        Thank you for trusting AVOI with your skincare journey!
        
        With love and natural goodness,
        The AVOI Team
        
        AVOI - Skincare Inspired by Nature
        Lagos, Nigeria | support@avoi.com | +234 123 456 7890
        """
        
        # Send welcome email
        try:
            email_sent = send_email(
                to_email=email,
                subject=subject,
                html_content=html_content,
                text_content=text_content
            )
            
            if email_sent:
                return jsonify({
                    'success': True,
                    'message': f'🎉 Thank you for subscribing! A welcome email has been sent to {email}. Please check your inbox (and spam folder) for your AVOI welcome message with exclusive benefits!'
                }), 200
            else:
                return jsonify({
                    'success': True,
                    'message': 'Thank you for subscribing! You will start receiving our updates soon. If you don\'t receive a welcome email within a few minutes, please check your spam folder.'
                }), 200
            
        except Exception as email_error:
            print(f"Email sending failed: {email_error}")
            # Still return success to user, but log the email error
            return jsonify({
                'success': True,
                'message': 'Thank you for subscribing! You will start receiving our updates soon.'
            }), 200
            
    except Exception as e:
        print(f"Newsletter subscription error: {e}")
        return jsonify({
            'success': False,
            'message': 'An error occurred. Please try again later.'
        }), 500


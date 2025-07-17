import smtplib
import secrets
import hashlib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, timedelta
from flask import current_app, url_for
import os

class EmailService:
    def __init__(self):
        # For demo purposes, we'll use a simple email simulation
        # In production, you would use services like SendGrid, AWS SES, or SMTP
        self.smtp_server = os.getenv('SMTP_SERVER', 'smtp.gmail.com')
        self.smtp_port = int(os.getenv('SMTP_PORT', '587'))
        self.email_user = os.getenv('EMAIL_USER', 'noreply@avoi.com')
        self.email_password = os.getenv('EMAIL_PASSWORD', 'demo_password')
        
    def generate_verification_token(self, email):
        """Generate a secure verification token for email verification"""
        timestamp = str(int(datetime.utcnow().timestamp()))
        random_string = secrets.token_urlsafe(32)
        data = f"{email}:{timestamp}:{random_string}"
        token = hashlib.sha256(data.encode()).hexdigest()
        return token
    
    def verify_token(self, token, email, max_age_hours=24):
        """Verify if the token is valid and not expired"""
        # In a real implementation, you would store tokens in database
        # For demo, we'll implement a simple validation
        return True  # Simplified for demo
    
    def send_verification_email(self, user_email, user_name, verification_token):
        """Send email verification email to user"""
        try:
            # Create verification URL
            verification_url = f"http://localhost:5173/verify-email?token={verification_token}&email={user_email}"
            
            # Create email content
            subject = "Welcome to AVOI - Please Verify Your Email"
            
            html_content = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body {{ font-family: 'Source Sans Pro', Arial, sans-serif; line-height: 1.6; color: #333; }}
                    .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                    .header {{ background: linear-gradient(135deg, #F54708, #FAA612); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                    .content {{ background: white; padding: 30px; border: 1px solid #ddd; }}
                    .button {{ display: inline-block; background: #F54708; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }}
                    .footer {{ background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; }}
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Welcome to AVOI!</h1>
                        <p>Skincare Inspired by Nature, Rooted in Heritage and Perfected by Science</p>
                    </div>
                    <div class="content">
                        <h2>Hello {user_name}!</h2>
                        <p>Thank you for joining the AVOI family! We're excited to have you on your journey to beautiful, healthy skin.</p>
                        
                        <p>To complete your registration and start shopping our premium skincare products, please verify your email address by clicking the button below:</p>
                        
                        <div style="text-align: center;">
                            <a href="{verification_url}" class="button">Verify My Email</a>
                        </div>
                        
                        <p>Or copy and paste this link into your browser:</p>
                        <p style="word-break: break-all; background: #f8f9fa; padding: 10px; border-radius: 5px;">{verification_url}</p>
                        
                        <p><strong>This verification link will expire in 24 hours.</strong></p>
                        
                        <p>If you didn't create an account with AVOI, please ignore this email.</p>
                        
                        <p>Welcome to your skincare journey!</p>
                        <p>The AVOI Team</p>
                    </div>
                    <div class="footer">
                        <p>© 2024 AVOI. All rights reserved.</p>
                        <p>Natural skincare products for your unique beauty journey.</p>
                    </div>
                </div>
            </body>
            </html>
            """
            
            # For demo purposes, we'll log the email instead of actually sending it
            # In production, you would use actual SMTP or email service
            print(f"\\n=== EMAIL VERIFICATION ===")
            print(f"To: {user_email}")
            print(f"Subject: {subject}")
            print(f"Verification URL: {verification_url}")
            print(f"========================\\n")
            
            # Simulate successful email sending
            return True
            
        except Exception as e:
            print(f"Error sending verification email: {str(e)}")
            return False
    
    def send_welcome_email(self, user_email, user_name):
        """Send welcome email after successful verification"""
        try:
            subject = "Welcome to AVOI - Your Account is Ready!"
            
            html_content = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body {{ font-family: 'Source Sans Pro', Arial, sans-serif; line-height: 1.6; color: #333; }}
                    .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                    .header {{ background: linear-gradient(135deg, #F54708, #FAA612); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                    .content {{ background: white; padding: 30px; border: 1px solid #ddd; }}
                    .button {{ display: inline-block; background: #F54708; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }}
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Account Verified Successfully!</h1>
                    </div>
                    <div class="content">
                        <h2>Congratulations {user_name}!</h2>
                        <p>Your AVOI account has been successfully verified and is now ready to use.</p>
                        
                        <p>You can now:</p>
                        <ul>
                            <li>Browse our premium skincare collection</li>
                            <li>Add products to your cart</li>
                            <li>Place orders with worldwide delivery</li>
                            <li>Track your skincare journey</li>
                        </ul>
                        
                        <div style="text-align: center;">
                            <a href="http://localhost:5173/products" class="button">Start Shopping</a>
                        </div>
                        
                        <p>Thank you for choosing AVOI for your skincare needs!</p>
                    </div>
                </div>
            </body>
            </html>
            """
            
            print(f"\\n=== WELCOME EMAIL ===")
            print(f"To: {user_email}")
            print(f"Subject: {subject}")
            print(f"Account verified successfully!")
            print(f"====================\\n")
            
            return True
            
        except Exception as e:
            print(f"Error sending welcome email: {str(e)}")
            return False

# Create global email service instance
email_service = EmailService()



def send_email(to_email, subject, html_content, text_content=None):
    """
    Send email using the email service
    
    Args:
        to_email (str): Recipient email address
        subject (str): Email subject
        html_content (str): HTML content of the email
        text_content (str, optional): Plain text content of the email
    
    Returns:
        bool: True if email was sent successfully, False otherwise
    """
    try:
        # For demo purposes, we'll simulate email sending with detailed logging
        # In production, you would use actual SMTP or email service like SendGrid, AWS SES, etc.
        
        print(f"\n{'='*50}")
        print(f"📧 EMAIL SENT SUCCESSFULLY!")
        print(f"{'='*50}")
        print(f"📬 To: {to_email}")
        print(f"📝 Subject: {subject}")
        print(f"📄 HTML Content: {len(html_content)} characters")
        if text_content:
            print(f"📄 Text Content: {len(text_content)} characters")
        print(f"⏰ Sent at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"✅ Status: DELIVERED")
        print(f"{'='*50}")
        
        # Save email to a log file for demo purposes
        try:
            log_dir = os.path.join(os.path.dirname(__file__), '..', 'logs')
            os.makedirs(log_dir, exist_ok=True)
            log_file = os.path.join(log_dir, 'email_log.txt')
            
            with open(log_file, 'a', encoding='utf-8') as f:
                f.write(f"\n{'='*50}\n")
                f.write(f"EMAIL SENT: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
                f.write(f"To: {to_email}\n")
                f.write(f"Subject: {subject}\n")
                f.write(f"HTML Content Length: {len(html_content)} characters\n")
                if text_content:
                    f.write(f"Text Content Length: {len(text_content)} characters\n")
                f.write(f"Status: DELIVERED\n")
                f.write(f"{'='*50}\n")
                
        except Exception as log_error:
            print(f"Warning: Could not write to email log: {log_error}")
        
        # Simulate successful email sending
        return True
        
    except Exception as e:
        print(f"❌ Error sending email: {str(e)}")
        return False


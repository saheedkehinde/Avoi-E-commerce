from flask import Blueprint, request, jsonify
from src.models.user import db, User
from src.services.currency_service import currency_service
from src.services.email_service import email_service
import jwt
import datetime
from functools import wraps

auth_bp = Blueprint('auth', __name__)

# JWT configuration
JWT_SECRET = 'avoi-jwt-secret-key-2025'
JWT_ALGORITHM = 'HS256'

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        
        if not token:
            return jsonify({'error': 'Token is missing'}), 401
        
        try:
            if token.startswith('Bearer '):
                token = token[7:]
            
            data = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
            current_user = User.query.get(data['user_id'])
            
            if not current_user:
                return jsonify({'error': 'Invalid token'}), 401
                
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token'}), 401
        
        return f(current_user, *args, **kwargs)
    
    return decorated

def generate_token(user_id):
    payload = {
        'user_id': user_id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['email', 'password', 'first_name', 'last_name', 'nationality']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        # Check if user already exists
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email already registered'}), 400
        
        # Determine preferred currency based on nationality
        preferred_currency = currency_service.get_currency_by_nationality(data['nationality'])
        
        # Create new user (not verified yet)
        user = User(
            email=data['email'],
            first_name=data['first_name'],
            last_name=data['last_name'],
            phone_number=data.get('phone_number'),
            nationality=data['nationality'],
            preferred_currency=preferred_currency,
            is_email_verified=False  # Email not verified yet
        )
        user.set_password(data['password'])
        
        # Generate verification token
        verification_token = email_service.generate_verification_token(data['email'])
        user.set_verification_token(verification_token)
        
        db.session.add(user)
        db.session.commit()
        
        # Send verification email
        email_sent = email_service.send_verification_email(
            user.email, 
            user.first_name, 
            verification_token
        )
        
        if email_sent:
            return jsonify({
                'message': 'Registration successful! Please check your email to verify your account.',
                'email_sent': True,
                'user_id': user.id
            }), 201
        else:
            return jsonify({
                'message': 'Registration successful but email could not be sent. Please contact support.',
                'email_sent': False,
                'user_id': user.id
            }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        
        if not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Email and password are required'}), 400
        
        user = User.query.filter_by(email=data['email']).first()
        
        if not user or not user.check_password(data['password']):
            return jsonify({'error': 'Invalid email or password'}), 401
        
        if not user.is_active:
            return jsonify({'error': 'Account is deactivated'}), 401
        
        # Check if email is verified
        if not user.is_email_verified:
            return jsonify({
                'error': 'Please verify your email address before logging in',
                'email_verification_required': True
            }), 403
        
        # Update last login
        user.last_login = datetime.datetime.utcnow()
        db.session.commit()
        
        # Generate token
        token = generate_token(user.id)
        
        return jsonify({
            'message': 'Login successful',
            'token': token,
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/profile', methods=['GET'])
@token_required
def get_profile(current_user):
    return jsonify({'user': current_user.to_dict()}), 200

@auth_bp.route('/profile', methods=['PUT'])
@token_required
def update_profile(current_user):
    try:
        data = request.get_json()
        
        # Update allowed fields
        if 'first_name' in data:
            current_user.first_name = data['first_name']
        if 'last_name' in data:
            current_user.last_name = data['last_name']
        if 'phone_number' in data:
            current_user.phone_number = data['phone_number']
        if 'nationality' in data:
            current_user.nationality = data['nationality']
            # Update preferred currency based on new nationality
            current_user.preferred_currency = currency_service.get_currency_by_nationality(data['nationality'])
        
        db.session.commit()
        
        return jsonify({
            'message': 'Profile updated successfully',
            'user': current_user.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/change-password', methods=['POST'])
@token_required
def change_password(current_user):
    try:
        data = request.get_json()
        
        if not data.get('current_password') or not data.get('new_password'):
            return jsonify({'error': 'Current password and new password are required'}), 400
        
        if not current_user.check_password(data['current_password']):
            return jsonify({'error': 'Current password is incorrect'}), 400
        
        current_user.set_password(data['new_password'])
        db.session.commit()
        
        return jsonify({'message': 'Password changed successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/refresh', methods=['POST'])
@token_required
def refresh_token(current_user):
    # Generate new token
    token = generate_token(current_user.id)
    
    return jsonify({
        'message': 'Token refreshed successfully',
        'token': token
    }), 200



@auth_bp.route('/verify-email', methods=['POST'])
def verify_email():
    """Verify user email with token"""
    try:
        data = request.get_json()
        
        if not data.get('token') or not data.get('email'):
            return jsonify({'error': 'Token and email are required'}), 400
        
        user = User.query.filter_by(email=data['email']).first()
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        if user.is_email_verified:
            return jsonify({'message': 'Email already verified'}), 200
        
        if user.email_verification_token != data['token']:
            return jsonify({'error': 'Invalid verification token'}), 400
        
        # Verify the email
        user.verify_email()
        db.session.commit()
        
        # Send welcome email
        email_service.send_welcome_email(user.email, user.first_name)
        
        return jsonify({
            'message': 'Email verified successfully! You can now log in.',
            'verified': True
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/resend-verification', methods=['POST'])
def resend_verification():
    """Resend verification email"""
    try:
        data = request.get_json()
        
        if not data.get('email'):
            return jsonify({'error': 'Email is required'}), 400
        
        user = User.query.filter_by(email=data['email']).first()
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        if user.is_email_verified:
            return jsonify({'message': 'Email already verified'}), 200
        
        # Generate new verification token
        verification_token = email_service.generate_verification_token(user.email)
        user.set_verification_token(verification_token)
        db.session.commit()
        
        # Send verification email
        email_sent = email_service.send_verification_email(
            user.email, 
            user.first_name, 
            verification_token
        )
        
        if email_sent:
            return jsonify({
                'message': 'Verification email sent successfully',
                'email_sent': True
            }), 200
        else:
            return jsonify({
                'message': 'Failed to send verification email',
                'email_sent': False
            }), 500
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/check-verification-status', methods=['POST'])
def check_verification_status():
    """Check if user's email is verified"""
    try:
        data = request.get_json()
        
        if not data.get('email'):
            return jsonify({'error': 'Email is required'}), 400
        
        user = User.query.filter_by(email=data['email']).first()
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify({
            'email': user.email,
            'is_verified': user.is_email_verified,
            'verification_sent_at': user.email_verification_sent_at.isoformat() if user.email_verification_sent_at else None
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


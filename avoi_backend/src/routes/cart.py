from flask import Blueprint, request, jsonify
from src.models.user import db
from src.models.order import CartItem
from src.models.product import ProductVariant
from src.routes.auth import token_required
from src.services.currency_service import currency_service

cart_bp = Blueprint('cart', __name__)

@cart_bp.route('/', methods=['GET'])
@token_required
def get_cart(current_user):
    try:
        cart_items = CartItem.query.filter_by(user_id=current_user.id).all()
        
        # Get user currency and exchange rate
        user_currency = current_user.preferred_currency
        exchange_rate = currency_service.get_exchange_rate(user_currency)
        
        # Calculate totals
        subtotal = 0
        cart_data = []
        
        for item in cart_items:
            item_data = item.to_dict(user_currency, exchange_rate)
            if item.product_variant:
                item_price = item.product_variant.product.base_price + item.product_variant.price_adjustment
                converted_price = float(item_price) * exchange_rate
                item_total = converted_price * item.quantity
                subtotal += item_total
                
                item_data['item_total'] = round(item_total, 2)
            
            cart_data.append(item_data)
        
        return jsonify({
            'cart_items': cart_data,
            'subtotal': round(subtotal, 2),
            'currency': user_currency,
            'item_count': len(cart_items)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@cart_bp.route('/items', methods=['POST'])
@token_required
def add_to_cart(current_user):
    try:
        data = request.get_json()
        
        if not data.get('product_variant_id') or not data.get('quantity'):
            return jsonify({'error': 'Product variant ID and quantity are required'}), 400
        
        product_variant = ProductVariant.query.get_or_404(data['product_variant_id'])
        quantity = int(data['quantity'])
        
        if quantity <= 0:
            return jsonify({'error': 'Quantity must be greater than 0'}), 400
        
        # Check inventory
        if product_variant.inventory_quantity < quantity:
            return jsonify({'error': 'Insufficient inventory'}), 400
        
        # Check if item already exists in cart
        existing_item = CartItem.query.filter_by(
            user_id=current_user.id,
            product_variant_id=data['product_variant_id']
        ).first()
        
        if existing_item:
            # Update quantity
            new_quantity = existing_item.quantity + quantity
            if product_variant.inventory_quantity < new_quantity:
                return jsonify({'error': 'Insufficient inventory for requested quantity'}), 400
            
            existing_item.quantity = new_quantity
        else:
            # Create new cart item
            cart_item = CartItem(
                user_id=current_user.id,
                product_variant_id=data['product_variant_id'],
                quantity=quantity
            )
            db.session.add(cart_item)
        
        db.session.commit()
        
        return jsonify({'message': 'Item added to cart successfully'}), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@cart_bp.route('/items/<int:item_id>', methods=['PUT'])
@token_required
def update_cart_item(current_user, item_id):
    try:
        cart_item = CartItem.query.filter_by(
            id=item_id,
            user_id=current_user.id
        ).first_or_404()
        
        data = request.get_json()
        
        if not data.get('quantity'):
            return jsonify({'error': 'Quantity is required'}), 400
        
        quantity = int(data['quantity'])
        
        if quantity <= 0:
            return jsonify({'error': 'Quantity must be greater than 0'}), 400
        
        # Check inventory
        if cart_item.product_variant.inventory_quantity < quantity:
            return jsonify({'error': 'Insufficient inventory'}), 400
        
        cart_item.quantity = quantity
        db.session.commit()
        
        return jsonify({'message': 'Cart item updated successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@cart_bp.route('/items/<int:item_id>', methods=['DELETE'])
@token_required
def remove_cart_item(current_user, item_id):
    try:
        cart_item = CartItem.query.filter_by(
            id=item_id,
            user_id=current_user.id
        ).first_or_404()
        
        db.session.delete(cart_item)
        db.session.commit()
        
        return jsonify({'message': 'Item removed from cart successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@cart_bp.route('/clear', methods=['DELETE'])
@token_required
def clear_cart(current_user):
    try:
        CartItem.query.filter_by(user_id=current_user.id).delete()
        db.session.commit()
        
        return jsonify({'message': 'Cart cleared successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@cart_bp.route('/count', methods=['GET'])
@token_required
def get_cart_count(current_user):
    try:
        count = CartItem.query.filter_by(user_id=current_user.id).count()
        return jsonify({'count': count}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


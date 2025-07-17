from flask import Blueprint, request, jsonify
from src.models.user import db
from src.models.order import Order, OrderItem, OrderStatusHistory, Address, CartItem
from src.models.product import ProductVariant
from src.routes.auth import token_required
from src.services.currency_service import currency_service
from datetime import datetime

order_bp = Blueprint('order', __name__)

@order_bp.route('/', methods=['GET'])
@token_required
def get_orders(current_user):
    try:
        page = request.args.get('page', 1, type=int)
        per_page = min(request.args.get('per_page', 10, type=int), 50)
        status_filter = request.args.get('status')
        
        query = Order.query.filter_by(user_id=current_user.id)
        
        if status_filter:
            query = query.filter_by(order_status=status_filter)
        
        orders = query.order_by(Order.date_created.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'orders': [order.to_dict() for order in orders.items],
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': orders.total,
                'pages': orders.pages,
                'has_next': orders.has_next,
                'has_prev': orders.has_prev
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@order_bp.route('/<int:order_id>', methods=['GET'])
@token_required
def get_order(current_user, order_id):
    try:
        order = Order.query.filter_by(
            id=order_id,
            user_id=current_user.id
        ).first_or_404()
        
        return jsonify({'order': order.to_dict()}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@order_bp.route('/', methods=['POST'])
@token_required
def create_order(current_user):
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data.get('shipping_address_id') or not data.get('billing_address_id'):
            return jsonify({'error': 'Shipping and billing addresses are required'}), 400
        
        # Verify addresses belong to user
        shipping_address = Address.query.filter_by(
            id=data['shipping_address_id'],
            user_id=current_user.id
        ).first_or_404()
        
        billing_address = Address.query.filter_by(
            id=data['billing_address_id'],
            user_id=current_user.id
        ).first_or_404()
        
        # Get cart items
        cart_items = CartItem.query.filter_by(user_id=current_user.id).all()
        
        if not cart_items:
            return jsonify({'error': 'Cart is empty'}), 400
        
        # Get user currency and exchange rate
        user_currency = current_user.preferred_currency
        exchange_rate = currency_service.get_exchange_rate(user_currency)
        
        # Calculate order totals
        subtotal = 0
        order_items_data = []
        
        for cart_item in cart_items:
            variant = cart_item.product_variant
            
            # Check inventory
            if variant.inventory_quantity < cart_item.quantity:
                return jsonify({
                    'error': f'Insufficient inventory for {variant.product.name} - {variant.variant_name}'
                }), 400
            
            # Calculate price in user currency
            base_price = variant.product.base_price + variant.price_adjustment
            unit_price = float(base_price) * exchange_rate
            total_price = unit_price * cart_item.quantity
            subtotal += total_price
            
            order_items_data.append({
                'product_variant_id': variant.id,
                'quantity': cart_item.quantity,
                'unit_price': unit_price,
                'total_price': total_price
            })
        
        # Calculate shipping and tax (simplified)
        shipping_cost = data.get('shipping_cost', 5.0)  # Default shipping
        tax_rate = 0.075  # 7.5% tax rate
        tax_amount = subtotal * tax_rate
        total_amount = subtotal + shipping_cost + tax_amount
        
        # Create order
        order = Order(
            user_id=current_user.id,
            subtotal=subtotal,
            shipping_cost=shipping_cost,
            tax_amount=tax_amount,
            total_amount=total_amount,
            currency=user_currency,
            shipping_address_id=data['shipping_address_id'],
            billing_address_id=data['billing_address_id']
        )
        
        db.session.add(order)
        db.session.flush()  # Get order ID
        
        # Create order items
        for item_data in order_items_data:
            order_item = OrderItem(
                order_id=order.id,
                product_variant_id=item_data['product_variant_id'],
                quantity=item_data['quantity'],
                unit_price=item_data['unit_price'],
                total_price=item_data['total_price']
            )
            db.session.add(order_item)
            
            # Update inventory
            variant = ProductVariant.query.get(item_data['product_variant_id'])
            variant.inventory_quantity -= item_data['quantity']
        
        # Create initial status history
        status_history = OrderStatusHistory(
            order_id=order.id,
            status='pending',
            notes='Order created',
            updated_by=f'User {current_user.id}'
        )
        db.session.add(status_history)
        
        # Clear cart
        CartItem.query.filter_by(user_id=current_user.id).delete()
        
        db.session.commit()
        
        return jsonify({
            'message': 'Order created successfully',
            'order': order.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@order_bp.route('/<int:order_id>/cancel', methods=['POST'])
@token_required
def cancel_order(current_user, order_id):
    try:
        order = Order.query.filter_by(
            id=order_id,
            user_id=current_user.id
        ).first_or_404()
        
        # Check if order can be cancelled
        if order.order_status not in ['pending', 'processing']:
            return jsonify({'error': 'Order cannot be cancelled at this stage'}), 400
        
        # Update order status
        order.order_status = 'cancelled'
        order.payment_status = 'refunded' if order.payment_status == 'paid' else 'cancelled'
        
        # Restore inventory
        for item in order.items:
            variant = item.product_variant
            variant.inventory_quantity += item.quantity
        
        # Add status history
        status_history = OrderStatusHistory(
            order_id=order.id,
            status='cancelled',
            notes='Order cancelled by customer',
            updated_by=f'User {current_user.id}'
        )
        db.session.add(status_history)
        
        db.session.commit()
        
        return jsonify({
            'message': 'Order cancelled successfully',
            'order': order.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@order_bp.route('/<int:order_id>/status', methods=['GET'])
@token_required
def get_order_status(current_user, order_id):
    try:
        order = Order.query.filter_by(
            id=order_id,
            user_id=current_user.id
        ).first_or_404()
        
        status_history = OrderStatusHistory.query.filter_by(
            order_id=order_id
        ).order_by(OrderStatusHistory.timestamp.desc()).all()
        
        return jsonify({
            'order_id': order_id,
            'current_status': order.order_status,
            'payment_status': order.payment_status,
            'status_history': [status.to_dict() for status in status_history]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Address management routes
@order_bp.route('/addresses', methods=['GET'])
@token_required
def get_addresses(current_user):
    try:
        addresses = Address.query.filter_by(user_id=current_user.id).all()
        return jsonify({
            'addresses': [address.to_dict() for address in addresses]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@order_bp.route('/addresses', methods=['POST'])
@token_required
def create_address(current_user):
    try:
        data = request.get_json()
        
        required_fields = ['address_type', 'street_address', 'city', 'state', 'postal_code', 'country']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        # If this is set as default, unset other default addresses of the same type
        if data.get('is_default'):
            Address.query.filter_by(
                user_id=current_user.id,
                address_type=data['address_type']
            ).update({'is_default': False})
        
        address = Address(
            user_id=current_user.id,
            address_type=data['address_type'],
            street_address=data['street_address'],
            city=data['city'],
            state=data['state'],
            postal_code=data['postal_code'],
            country=data['country'],
            is_default=data.get('is_default', False)
        )
        
        db.session.add(address)
        db.session.commit()
        
        return jsonify({
            'message': 'Address created successfully',
            'address': address.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@order_bp.route('/addresses/<int:address_id>', methods=['PUT'])
@token_required
def update_address(current_user, address_id):
    try:
        address = Address.query.filter_by(
            id=address_id,
            user_id=current_user.id
        ).first_or_404()
        
        data = request.get_json()
        
        # Update fields
        if 'street_address' in data:
            address.street_address = data['street_address']
        if 'city' in data:
            address.city = data['city']
        if 'state' in data:
            address.state = data['state']
        if 'postal_code' in data:
            address.postal_code = data['postal_code']
        if 'country' in data:
            address.country = data['country']
        
        # Handle default address
        if data.get('is_default'):
            Address.query.filter_by(
                user_id=current_user.id,
                address_type=address.address_type
            ).update({'is_default': False})
            address.is_default = True
        
        db.session.commit()
        
        return jsonify({
            'message': 'Address updated successfully',
            'address': address.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@order_bp.route('/addresses/<int:address_id>', methods=['DELETE'])
@token_required
def delete_address(current_user, address_id):
    try:
        address = Address.query.filter_by(
            id=address_id,
            user_id=current_user.id
        ).first_or_404()
        
        # Check if address is used in any orders
        orders_with_address = Order.query.filter(
            (Order.shipping_address_id == address_id) | 
            (Order.billing_address_id == address_id)
        ).first()
        
        if orders_with_address:
            return jsonify({'error': 'Cannot delete address used in existing orders'}), 400
        
        db.session.delete(address)
        db.session.commit()
        
        return jsonify({'message': 'Address deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


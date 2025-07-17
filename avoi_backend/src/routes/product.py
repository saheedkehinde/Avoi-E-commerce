from flask import Blueprint, request, jsonify
from src.models.user import db
from src.models.product import Product, Category, ProductVariant, ProductImage
from src.models.review import Review
from src.routes.auth import token_required
from src.services.currency_service import currency_service
from sqlalchemy import or_

product_bp = Blueprint('product', __name__)

def get_user_currency(current_user=None):
    """Get user's preferred currency or default to USD"""
    if current_user:
        return current_user.preferred_currency
    return 'USD'

def get_exchange_rate(currency):
    """Get exchange rate for currency conversion"""
    return currency_service.get_exchange_rate(currency)

@product_bp.route('/products', methods=['GET'])
def get_products():
    try:
        # Get query parameters
        page = request.args.get('page', 1, type=int)
        per_page = min(request.args.get('per_page', 20, type=int), 100)
        category_id = request.args.get('category_id', type=int)
        search = request.args.get('search', '')
        min_price = request.args.get('min_price', type=float)
        max_price = request.args.get('max_price', type=float)
        sort_by = request.args.get('sort_by', 'name')
        
        # Get user currency from header or default to USD
        user_currency = request.headers.get('X-Currency', 'USD')
        exchange_rate = get_exchange_rate(user_currency)
        
        # Build query
        query = Product.query.filter_by(is_active=True)
        
        # Apply filters
        if category_id:
            query = query.filter_by(category_id=category_id)
        
        if search:
            query = query.filter(
                or_(
                    Product.name.contains(search),
                    Product.description.contains(search),
                    Product.brand.contains(search)
                )
            )
        
        if min_price:
            # Convert min_price from user currency to USD for database query
            min_price_usd = min_price / exchange_rate
            query = query.filter(Product.base_price >= min_price_usd)
        
        if max_price:
            # Convert max_price from user currency to USD for database query
            max_price_usd = max_price / exchange_rate
            query = query.filter(Product.base_price <= max_price_usd)
        
        # Apply sorting
        if sort_by == 'price_asc':
            query = query.order_by(Product.base_price.asc())
        elif sort_by == 'price_desc':
            query = query.order_by(Product.base_price.desc())
        elif sort_by == 'date_desc':
            query = query.order_by(Product.date_created.desc())
        else:
            query = query.order_by(Product.name.asc())
        
        # Paginate
        products = query.paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'products': [product.to_dict(user_currency, exchange_rate) for product in products.items],
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': products.total,
                'pages': products.pages,
                'has_next': products.has_next,
                'has_prev': products.has_prev
            },
            'currency': user_currency
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@product_bp.route('/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    try:
        product = Product.query.get_or_404(product_id)
        
        if not product.is_active:
            return jsonify({'error': 'Product not found'}), 404
        
        # Get user currency
        user_currency = request.headers.get('X-Currency', 'USD')
        exchange_rate = get_exchange_rate(user_currency)
        
        # Get product reviews
        reviews = Review.query.filter_by(
            product_id=product_id, 
            is_approved=True
        ).order_by(Review.date_created.desc()).limit(10).all()
        
        product_data = product.to_dict(user_currency, exchange_rate)
        product_data['reviews'] = [review.to_dict() for review in reviews]
        
        return jsonify({
            'product': product_data,
            'currency': user_currency
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@product_bp.route('/products/categories', methods=['GET'])
def get_categories():
    try:
        categories = Category.query.filter_by(is_active=True).all()
        
        # Build hierarchical structure
        category_dict = {}
        root_categories = []
        
        for category in categories:
            category_dict[category.id] = category.to_dict()
            category_dict[category.id]['subcategories'] = []
        
        for category in categories:
            if category.parent_category_id:
                parent = category_dict.get(category.parent_category_id)
                if parent:
                    parent['subcategories'].append(category_dict[category.id])
            else:
                root_categories.append(category_dict[category.id])
        
        return jsonify({'categories': root_categories}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@product_bp.route('/products/categories/<int:category_id>/products', methods=['GET'])
def get_category_products(category_id):
    try:
        category = Category.query.get_or_404(category_id)
        
        # Get query parameters
        page = request.args.get('page', 1, type=int)
        per_page = min(request.args.get('per_page', 20, type=int), 100)
        
        # Get user currency
        user_currency = request.headers.get('X-Currency', 'USD')
        exchange_rate = get_exchange_rate(user_currency)
        
        # Get products in this category
        products = Product.query.filter_by(
            category_id=category_id, 
            is_active=True
        ).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'category': category.to_dict(),
            'products': [product.to_dict(user_currency, exchange_rate) for product in products.items],
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': products.total,
                'pages': products.pages,
                'has_next': products.has_next,
                'has_prev': products.has_prev
            },
            'currency': user_currency
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@product_bp.route('/products/<int:product_id>/reviews', methods=['GET'])
def get_product_reviews(product_id):
    try:
        product = Product.query.get_or_404(product_id)
        
        page = request.args.get('page', 1, type=int)
        per_page = min(request.args.get('per_page', 10, type=int), 50)
        rating_filter = request.args.get('rating', type=int)
        
        query = Review.query.filter_by(
            product_id=product_id, 
            is_approved=True
        )
        
        if rating_filter:
            query = query.filter_by(rating=rating_filter)
        
        reviews = query.order_by(Review.date_created.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        # Calculate review statistics
        all_reviews = Review.query.filter_by(
            product_id=product_id, 
            is_approved=True
        ).all()
        
        total_reviews = len(all_reviews)
        average_rating = sum(review.rating for review in all_reviews) / total_reviews if total_reviews > 0 else 0
        
        rating_distribution = {i: 0 for i in range(1, 6)}
        for review in all_reviews:
            rating_distribution[review.rating] += 1
        
        return jsonify({
            'reviews': [review.to_dict() for review in reviews.items],
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': reviews.total,
                'pages': reviews.pages,
                'has_next': reviews.has_next,
                'has_prev': reviews.has_prev
            },
            'statistics': {
                'total_reviews': total_reviews,
                'average_rating': round(average_rating, 1),
                'rating_distribution': rating_distribution
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@product_bp.route('/products/<int:product_id>/reviews', methods=['POST'])
@token_required
def create_review(current_user, product_id):
    try:
        product = Product.query.get_or_404(product_id)
        data = request.get_json()
        
        # Validate required fields
        if not data.get('rating') or not data.get('comment'):
            return jsonify({'error': 'Rating and comment are required'}), 400
        
        if not 1 <= data['rating'] <= 5:
            return jsonify({'error': 'Rating must be between 1 and 5'}), 400
        
        # Check if user already reviewed this product
        existing_review = Review.query.filter_by(
            product_id=product_id,
            user_id=current_user.id
        ).first()
        
        if existing_review:
            return jsonify({'error': 'You have already reviewed this product'}), 400
        
        # Create review
        review = Review(
            product_id=product_id,
            user_id=current_user.id,
            rating=data['rating'],
            title=data.get('title', ''),
            comment=data['comment']
        )
        
        db.session.add(review)
        db.session.commit()
        
        return jsonify({
            'message': 'Review created successfully',
            'review': review.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


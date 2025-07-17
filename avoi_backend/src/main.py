import os
import sys
# DON'T CHANGE THIS !!!
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from flask import Flask, send_from_directory, jsonify, render_template_string
from flask_cors import CORS
from src.models.user import db
from src.models.product import Category, Product, ProductImage, ProductVariant, Inventory, InventoryMovement
from src.models.order import Address, Order, OrderItem, OrderStatusHistory, Payment, CartItem
from src.models.review import Review, WishlistItem
from src.routes.user import user_bp
from src.routes.auth import auth_bp
from src.routes.product import product_bp
from src.routes.cart import cart_bp
from src.routes.order import order_bp
from src.routes.admin import admin_bp
from src.routes.newsletter import newsletter_bp

app = Flask(__name__, static_folder=os.path.join(os.path.dirname(__file__), 'static'))
app.config['SECRET_KEY'] = 'avoi-ecommerce-secret-key-2025'

# Enable CORS for all routes
CORS(app, origins="*")

# Register blueprints
app.register_blueprint(user_bp, url_prefix='/api')
app.register_blueprint(auth_bp, url_prefix='/api')
app.register_blueprint(product_bp, url_prefix='/api')
app.register_blueprint(cart_bp, url_prefix='/api')
app.register_blueprint(order_bp, url_prefix='/api')
app.register_blueprint(admin_bp)
app.register_blueprint(newsletter_bp, url_prefix='/api')

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(os.path.dirname(__file__), 'database', 'app.db')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

# Initialize database and seed data
with app.app_context():
    db.create_all()
    
    # Import and run seed data
    try:
        from src.seed_data import seed_database
        seed_database(app)
    except Exception as e:
        print(f"Seed data already exists or error: {e}")

# API Root endpoint
@app.route('/')
def api_root():
    return jsonify({
        "message": "AVOI E-commerce API",
        "version": "1.0",
        "status": "online",
        "description": "Skincare Inspired by Nature, Rooted in Heritage and Perfected by Science",
        "admin_panel": "/admin",
        "endpoints": {
            "authentication": {
                "register": "/api/auth/register",
                "login": "/api/auth/login",
                "verify_email": "/api/auth/verify-email"
            },
            "products": {
                "get_all": "/api/products",
                "get_single": "/api/products/{id}",
                "categories": "/api/products/categories"
            },
            "cart": {
                "add_item": "/api/cart/add",
                "get_cart": "/api/cart",
                "update_item": "/api/cart/update",
                "remove_item": "/api/cart/remove"
            },
            "orders": {
                "create_order": "/api/orders",
                "get_orders": "/api/orders",
                "get_order": "/api/orders/{id}"
            }
        }
    })

@app.route('/api')
def api_info():
    return jsonify({
        "message": "AVOI E-commerce API v1.0",
        "status": "online",
        "admin_panel": "/admin"
    })

# Handle static files and SPA routing
@app.route('/<path:path>')
def serve_static(path):
    static_folder_path = app.static_folder
    if static_folder_path is None:
        return jsonify({"error": "Static folder not configured"}), 404

    if path != "" and os.path.exists(os.path.join(static_folder_path, path)):
        return send_from_directory(static_folder_path, path)
    else:
        index_path = os.path.join(static_folder_path, 'index.html')
        if os.path.exists(index_path):
            return send_from_directory(static_folder_path, 'index.html')
        else:
            return jsonify({"error": "Frontend not found", "message": "This is the AVOI backend API"}), 404


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    debug = os.environ.get('DEBUG', 'True').lower() == 'true'
    app.run(host='0.0.0.0', port=port, debug=debug)

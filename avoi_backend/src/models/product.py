from src.models.user import db
from datetime import datetime

class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    parent_category_id = db.Column(db.Integer, db.ForeignKey('category.id'))
    slug = db.Column(db.String(100), unique=True, nullable=False)
    is_active = db.Column(db.Boolean, default=True)
    
    # Self-referential relationship for subcategories
    subcategories = db.relationship('Category', backref=db.backref('parent', remote_side=[id]))
    products = db.relationship('Product', backref='category', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'parent_category_id': self.parent_category_id,
            'slug': self.slug,
            'is_active': self.is_active
        }

class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    short_description = db.Column(db.String(500))
    sku = db.Column(db.String(50), unique=True, nullable=False)
    base_price = db.Column(db.Numeric(10, 2), nullable=False)  # Base price in USD
    compare_at_price = db.Column(db.Numeric(10, 2))
    weight = db.Column(db.Numeric(8, 2))
    dimensions = db.Column(db.String(100))
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'), nullable=False)
    brand = db.Column(db.String(100))
    ingredients = db.Column(db.Text)
    usage_instructions = db.Column(db.Text)
    benefits = db.Column(db.Text)
    is_active = db.Column(db.Boolean, default=True)
    date_created = db.Column(db.DateTime, default=datetime.utcnow)
    date_modified = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    images = db.relationship('ProductImage', backref='product', lazy=True, cascade='all, delete-orphan')
    variants = db.relationship('ProductVariant', backref='product', lazy=True, cascade='all, delete-orphan')
    reviews = db.relationship('Review', backref='product', lazy=True)
    wishlist_items = db.relationship('WishlistItem', backref='product', lazy=True)

    def to_dict(self, currency='USD', exchange_rate=1.0):
        converted_price = float(self.base_price) * exchange_rate
        converted_compare_price = float(self.compare_at_price) * exchange_rate if self.compare_at_price else None
        
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'short_description': self.short_description,
            'sku': self.sku,
            'price': round(converted_price, 2),
            'compare_at_price': round(converted_compare_price, 2) if converted_compare_price else None,
            'currency': currency,
            'weight': float(self.weight) if self.weight else None,
            'dimensions': self.dimensions,
            'category_id': self.category_id,
            'brand': self.brand,
            'ingredients': self.ingredients,
            'usage_instructions': self.usage_instructions,
            'benefits': self.benefits,
            'is_active': self.is_active,
            'date_created': self.date_created.isoformat() if self.date_created else None,
            'date_modified': self.date_modified.isoformat() if self.date_modified else None,
            'images': [img.to_dict() for img in self.images],
            'variants': [variant.to_dict(currency, exchange_rate) for variant in self.variants]
        }

class ProductImage(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    image_url = db.Column(db.String(500), nullable=False)
    alt_text = db.Column(db.String(200))
    display_order = db.Column(db.Integer, default=0)
    is_primary = db.Column(db.Boolean, default=False)

    def to_dict(self):
        return {
            'id': self.id,
            'product_id': self.product_id,
            'image_url': self.image_url,
            'alt_text': self.alt_text,
            'display_order': self.display_order,
            'is_primary': self.is_primary
        }

class ProductVariant(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    variant_name = db.Column(db.String(100), nullable=False)
    sku = db.Column(db.String(50), unique=True, nullable=False)
    price_adjustment = db.Column(db.Numeric(10, 2), default=0)  # Price difference from base price
    weight = db.Column(db.Numeric(8, 2))
    inventory_quantity = db.Column(db.Integer, default=0)
    
    # Relationships
    inventory = db.relationship('Inventory', backref='product_variant', uselist=False, cascade='all, delete-orphan')
    cart_items = db.relationship('CartItem', backref='product_variant', lazy=True)
    order_items = db.relationship('OrderItem', backref='product_variant', lazy=True)

    def to_dict(self, currency='USD', exchange_rate=1.0):
        base_price = float(self.product.base_price) + float(self.price_adjustment)
        converted_price = base_price * exchange_rate
        
        return {
            'id': self.id,
            'product_id': self.product_id,
            'variant_name': self.variant_name,
            'sku': self.sku,
            'price': round(converted_price, 2),
            'currency': currency,
            'weight': float(self.weight) if self.weight else None,
            'inventory_quantity': self.inventory_quantity
        }

class Inventory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    product_variant_id = db.Column(db.Integer, db.ForeignKey('product_variant.id'), nullable=False)
    quantity_available = db.Column(db.Integer, default=0)
    quantity_reserved = db.Column(db.Integer, default=0)
    reorder_level = db.Column(db.Integer, default=10)
    last_updated = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    movements = db.relationship('InventoryMovement', backref='inventory', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'product_variant_id': self.product_variant_id,
            'quantity_available': self.quantity_available,
            'quantity_reserved': self.quantity_reserved,
            'reorder_level': self.reorder_level,
            'last_updated': self.last_updated.isoformat() if self.last_updated else None
        }

class InventoryMovement(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    inventory_id = db.Column(db.Integer, db.ForeignKey('inventory.id'), nullable=False)
    movement_type = db.Column(db.String(20), nullable=False)  # sale, restock, adjustment, return
    quantity_change = db.Column(db.Integer, nullable=False)
    reference_id = db.Column(db.String(100))  # Order ID or other reference
    notes = db.Column(db.Text)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'inventory_id': self.inventory_id,
            'movement_type': self.movement_type,
            'quantity_change': self.quantity_change,
            'reference_id': self.reference_id,
            'notes': self.notes,
            'timestamp': self.timestamp.isoformat() if self.timestamp else None
        }


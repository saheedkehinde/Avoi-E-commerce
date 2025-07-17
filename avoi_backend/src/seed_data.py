import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from src.models.user import db, User
from src.models.product import Category, Product, ProductImage, ProductVariant, Inventory
from src.models.order import Address
from src.services.currency_service import currency_service
from datetime import datetime

def seed_database(app):
    with app.app_context():
        # Clear existing data
        db.drop_all()
        db.create_all()
        
        # Create categories
        categories = [
            {
                'name': 'Cleansers',
                'description': 'Gentle cleansers for all skin types',
                'slug': 'cleansers'
            },
            {
                'name': 'Moisturizers',
                'description': 'Hydrating moisturizers and creams',
                'slug': 'moisturizers'
            },
            {
                'name': 'Serums',
                'description': 'Targeted treatment serums',
                'slug': 'serums'
            },
            {
                'name': 'Toners',
                'description': 'Balancing toners and essences',
                'slug': 'toners'
            },
            {
                'name': 'Masks',
                'description': 'Face masks and treatments',
                'slug': 'masks'
            }
        ]
        
        category_objects = []
        for cat_data in categories:
            category = Category(**cat_data)
            db.session.add(category)
            category_objects.append(category)
        
        db.session.commit()
        
        # Create products
        products = [
            {
                'name': 'Gentle Foaming Cleanser',
                'description': 'A mild, soap-free cleanser that removes impurities without stripping the skin of its natural oils.',
                'short_description': 'Gentle daily cleanser for all skin types',
                'sku': 'AVOI-CLN-001',
                'base_price': 25.00,
                'compare_at_price': 30.00,
                'category_id': 1,
                'brand': 'AVOI',
                'ingredients': 'Water, Sodium Cocoyl Isethionate, Glycerin, Cocamidopropyl Betaine, Sodium Methyl Cocoyl Taurate',
                'usage_instructions': 'Apply to damp skin, massage gently, and rinse with lukewarm water.',
                'benefits': 'Cleanses without drying, maintains skin barrier, suitable for sensitive skin'
            },
            {
                'name': 'Hydrating Daily Moisturizer',
                'description': 'A lightweight, fast-absorbing moisturizer that provides 24-hour hydration.',
                'short_description': 'Daily moisturizer with hyaluronic acid',
                'sku': 'AVOI-MOI-001',
                'base_price': 35.00,
                'category_id': 2,
                'brand': 'AVOI',
                'ingredients': 'Water, Hyaluronic Acid, Ceramides, Niacinamide, Glycerin, Squalane',
                'usage_instructions': 'Apply to clean skin morning and evening.',
                'benefits': 'Long-lasting hydration, strengthens skin barrier, improves skin texture'
            },
            {
                'name': 'Vitamin C Brightening Serum',
                'description': 'A potent antioxidant serum that brightens skin and reduces signs of aging.',
                'short_description': 'Brightening serum with 15% Vitamin C',
                'sku': 'AVOI-SER-001',
                'base_price': 45.00,
                'compare_at_price': 55.00,
                'category_id': 3,
                'brand': 'AVOI',
                'ingredients': 'L-Ascorbic Acid 15%, Vitamin E, Ferulic Acid, Hyaluronic Acid',
                'usage_instructions': 'Apply 2-3 drops to clean skin in the morning. Follow with moisturizer and SPF.',
                'benefits': 'Brightens skin tone, reduces dark spots, provides antioxidant protection'
            },
            {
                'name': 'Balancing Toner',
                'description': 'An alcohol-free toner that balances skin pH and prepares skin for other products.',
                'short_description': 'pH-balancing toner with botanical extracts',
                'sku': 'AVOI-TON-001',
                'base_price': 22.00,
                'category_id': 4,
                'brand': 'AVOI',
                'ingredients': 'Water, Witch Hazel, Aloe Vera, Rose Water, Glycerin, Panthenol',
                'usage_instructions': 'Apply to cotton pad or hands and gently pat onto clean skin.',
                'benefits': 'Balances skin pH, minimizes pores, soothes and refreshes'
            },
            {
                'name': 'Retinol Renewal Serum',
                'description': 'A gentle retinol serum that promotes cell turnover and reduces fine lines.',
                'short_description': 'Anti-aging serum with encapsulated retinol',
                'sku': 'AVOI-SER-002',
                'base_price': 55.00,
                'category_id': 3,
                'brand': 'AVOI',
                'ingredients': 'Encapsulated Retinol 0.5%, Hyaluronic Acid, Peptides, Vitamin E',
                'usage_instructions': 'Apply 2-3 drops to clean skin in the evening. Start with 2-3 times per week.',
                'benefits': 'Reduces fine lines, improves skin texture, promotes cell renewal'
            },
            {
                'name': 'Nourishing Night Cream',
                'description': 'A rich, restorative night cream that repairs and rejuvenates skin while you sleep.',
                'short_description': 'Intensive overnight moisturizer',
                'sku': 'AVOI-MOI-002',
                'base_price': 42.00,
                'category_id': 2,
                'brand': 'AVOI',
                'ingredients': 'Shea Butter, Ceramides, Peptides, Jojoba Oil, Vitamin E, Bakuchiol',
                'usage_instructions': 'Apply generously to clean skin before bedtime.',
                'benefits': 'Intensive hydration, repairs skin overnight, anti-aging benefits'
            }
        ]
        
        product_objects = []
        for prod_data in products:
            product = Product(**prod_data)
            db.session.add(product)
            product_objects.append(product)
        
        db.session.commit()
        
        # Create product variants and inventory
        for i, product in enumerate(product_objects):
            # Create main variant
            variant = ProductVariant(
                product_id=product.id,
                variant_name='Standard Size',
                sku=f'{product.sku}-STD',
                price_adjustment=0,
                inventory_quantity=100
            )
            db.session.add(variant)
            db.session.flush()
            
            # Create inventory record
            inventory = Inventory(
                product_variant_id=variant.id,
                quantity_available=100,
                quantity_reserved=0,
                reorder_level=20
            )
            db.session.add(inventory)
            
            # Create product images (placeholder URLs)
            image = ProductImage(
                product_id=product.id,
                image_url=f'https://via.placeholder.com/400x400?text={product.name.replace(" ", "+")}',
                alt_text=product.name,
                display_order=1,
                is_primary=True
            )
            db.session.add(image)
        
        # Create a test user
        test_user = User(
            email='test@avoi.com',
            first_name='Test',
            last_name='User',
            phone_number='+234-123-456-7890',
            nationality='Nigeria',
            preferred_currency='NGN'
        )
        test_user.set_password('password123')
        db.session.add(test_user)
        db.session.commit()
        
        # Create test address for the user
        test_address = Address(
            user_id=test_user.id,
            address_type='shipping',
            street_address='123 Lagos Street',
            city='Lagos',
            state='Lagos State',
            postal_code='100001',
            country='Nigeria',
            is_default=True
        )
        db.session.add(test_address)
        
        db.session.commit()
        
        print("Database seeded successfully!")
        print(f"Created {len(categories)} categories")
        print(f"Created {len(products)} products")
        print("Created test user: test@avoi.com (password: password123)")

if __name__ == '__main__':
    from main import app
    seed_database(app)


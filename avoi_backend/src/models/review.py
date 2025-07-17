from src.models.user import db
from datetime import datetime

class Review(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    rating = db.Column(db.Integer, nullable=False)  # 1-5 scale
    title = db.Column(db.String(200))
    comment = db.Column(db.Text)
    is_verified_purchase = db.Column(db.Boolean, default=False)
    is_approved = db.Column(db.Boolean, default=True)
    helpful_votes = db.Column(db.Integer, default=0)
    date_created = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'product_id': self.product_id,
            'user_id': self.user_id,
            'rating': self.rating,
            'title': self.title,
            'comment': self.comment,
            'is_verified_purchase': self.is_verified_purchase,
            'is_approved': self.is_approved,
            'helpful_votes': self.helpful_votes,
            'date_created': self.date_created.isoformat() if self.date_created else None,
            'user_name': f"{self.user.first_name} {self.user.last_name[0]}." if self.user else "Anonymous"
        }

class WishlistItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    date_added = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self, currency='USD', exchange_rate=1.0):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'product_id': self.product_id,
            'date_added': self.date_added.isoformat() if self.date_added else None,
            'product': self.product.to_dict(currency, exchange_rate) if self.product else None
        }


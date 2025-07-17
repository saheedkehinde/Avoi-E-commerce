import requests
from datetime import datetime, timedelta
import json

class CurrencyService:
    def __init__(self):
        self.base_currency = 'USD'
        self.exchange_rates = {}
        self.last_updated = None
        self.update_interval = timedelta(hours=24)  # Update rates daily
        
        # Mapping of countries to their currencies
        self.country_currency_map = {
            'Nigeria': 'NGN',
            'United States': 'USD',
            'United Kingdom': 'GBP',
            'Canada': 'CAD',
            'Australia': 'AUD',
            'South Africa': 'ZAR',
            'Ghana': 'GHS',
            'Kenya': 'KES',
            'Germany': 'EUR',
            'France': 'EUR',
            'Italy': 'EUR',
            'Spain': 'EUR',
            'Netherlands': 'EUR',
            'Japan': 'JPY',
            'China': 'CNY',
            'India': 'INR',
            'Brazil': 'BRL',
            'Mexico': 'MXN',
        }
        
        # Fallback exchange rates (approximate values)
        self.fallback_rates = {
            'NGN': 750.0,
            'GBP': 0.79,
            'EUR': 0.85,
            'CAD': 1.25,
            'AUD': 1.35,
            'ZAR': 15.0,
            'GHS': 6.0,
            'KES': 110.0,
            'JPY': 110.0,
            'CNY': 6.5,
            'INR': 75.0,
            'BRL': 5.0,
            'MXN': 20.0,
            'USD': 1.0
        }

    def get_currency_by_nationality(self, nationality):
        """Get currency code based on user's nationality"""
        return self.country_currency_map.get(nationality, 'USD')

    def should_update_rates(self):
        """Check if exchange rates need to be updated"""
        if not self.last_updated:
            return True
        return datetime.now() - self.last_updated > self.update_interval

    def fetch_exchange_rates(self):
        """Fetch current exchange rates from a free API"""
        try:
            # Using exchangerate-api.com (free tier)
            url = f"https://api.exchangerate-api.com/v4/latest/{self.base_currency}"
            response = requests.get(url, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                self.exchange_rates = data.get('rates', {})
                self.last_updated = datetime.now()
                return True
        except Exception as e:
            print(f"Error fetching exchange rates: {e}")
        
        # Fallback to stored rates if API fails
        if not self.exchange_rates:
            self.exchange_rates = self.fallback_rates.copy()
            self.last_updated = datetime.now()
        
        return False

    def get_exchange_rate(self, target_currency):
        """Get exchange rate from USD to target currency"""
        if target_currency == self.base_currency:
            return 1.0
        
        # Update rates if needed
        if self.should_update_rates():
            self.fetch_exchange_rates()
        
        return self.exchange_rates.get(target_currency, 1.0)

    def convert_price(self, price_usd, target_currency):
        """Convert price from USD to target currency"""
        if target_currency == self.base_currency:
            return float(price_usd)
        
        exchange_rate = self.get_exchange_rate(target_currency)
        return round(float(price_usd) * exchange_rate, 2)

    def format_currency(self, amount, currency_code):
        """Format currency amount with appropriate symbol and formatting"""
        currency_symbols = {
            'USD': '$',
            'NGN': '₦',
            'GBP': '£',
            'EUR': '€',
            'CAD': 'C$',
            'AUD': 'A$',
            'ZAR': 'R',
            'GHS': 'GH₵',
            'KES': 'KSh',
            'JPY': '¥',
            'CNY': '¥',
            'INR': '₹',
            'BRL': 'R$',
            'MXN': '$'
        }
        
        symbol = currency_symbols.get(currency_code, currency_code)
        
        # Format based on currency (some currencies don't use decimals)
        if currency_code in ['JPY', 'KRW']:
            return f"{symbol}{int(amount)}"
        else:
            return f"{symbol}{amount:,.2f}"

    def get_supported_currencies(self):
        """Get list of supported currencies"""
        return list(self.country_currency_map.values())

# Global currency service instance
currency_service = CurrencyService()


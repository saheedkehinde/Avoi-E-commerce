from flask import Blueprint, request, jsonify, session, render_template_string
from werkzeug.security import generate_password_hash, check_password_hash
import os

admin_bp = Blueprint('admin', __name__)

# Admin credentials (in production, these should be in environment variables)
ADMIN_EMAIL = "Saheedkehinde052@gmail.com"
ADMIN_PASSWORD_HASH = generate_password_hash("pheymous414")

# Simple HTML template for admin login
ADMIN_LOGIN_TEMPLATE = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AVOI Backend Admin Login</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #F54708, #FAA612);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .login-container {
            background: white;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            width: 100%;
            max-width: 400px;
        }
        
        .logo {
            text-align: center;
            margin-bottom: 30px;
        }
        
        .logo h1 {
            color: #F54708;
            font-size: 2.5rem;
            font-weight: bold;
            margin-bottom: 8px;
        }
        
        .logo p {
            color: #666;
            font-size: 0.9rem;
        }
        
        .form-group {
            margin-bottom: 20px;
        }
        
        label {
            display: block;
            margin-bottom: 8px;
            color: #333;
            font-weight: 600;
        }
        
        input[type="email"], input[type="password"] {
            width: 100%;
            padding: 12px;
            border: 2px solid #ddd;
            border-radius: 8px;
            font-size: 16px;
            transition: border-color 0.3s ease;
        }
        
        input[type="email"]:focus, input[type="password"]:focus {
            outline: none;
            border-color: #F54708;
        }
        
        .login-btn {
            width: 100%;
            background: #F54708;
            color: white;
            padding: 12px;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }
        
        .login-btn:hover {
            background: #d63e07;
        }
        
        .error {
            background: #fee;
            color: #c33;
            padding: 10px;
            border-radius: 6px;
            margin-bottom: 20px;
            border: 1px solid #fcc;
        }
        
        .admin-title {
            text-align: center;
            color: #666;
            margin-bottom: 30px;
            font-size: 1.1rem;
        }
    </style>
</head>
<body>
    <div class="login-container">
        <div class="logo">
            <h1>AVOI</h1>
            <p>Backend Administration</p>
        </div>
        
        <h2 class="admin-title">Admin Login</h2>
        
        {% if error %}
        <div class="error">{{ error }}</div>
        {% endif %}
        
        <form method="POST">
            <div class="form-group">
                <label for="email">Email Address</label>
                <input type="email" id="email" name="email" required>
            </div>
            
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" name="password" required>
            </div>
            
            <button type="submit" class="login-btn">Login to Admin Panel</button>
        </form>
    </div>
</body>
</html>
"""

# Admin dashboard template
ADMIN_DASHBOARD_TEMPLATE = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AVOI Backend Admin Dashboard</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #f5f5f5;
            min-height: 100vh;
        }
        
        .header {
            background: linear-gradient(135deg, #F54708, #FAA612);
            color: white;
            padding: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .header h1 {
            font-size: 1.8rem;
        }
        
        .logout-btn {
            background: rgba(255, 255, 255, 0.2);
            color: white;
            border: 1px solid rgba(255, 255, 255, 0.3);
            padding: 8px 16px;
            border-radius: 6px;
            text-decoration: none;
            transition: background-color 0.3s ease;
        }
        
        .logout-btn:hover {
            background: rgba(255, 255, 255, 0.3);
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 30px;
        }
        
        .dashboard-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .card {
            background: white;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        .card h3 {
            color: #F54708;
            margin-bottom: 15px;
            font-size: 1.2rem;
        }
        
        .api-section {
            background: white;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        .api-section h2 {
            color: #F54708;
            margin-bottom: 20px;
        }
        
        .endpoint {
            margin-bottom: 15px;
            padding: 10px;
            background: #f8f9fa;
            border-radius: 6px;
            border-left: 4px solid #F54708;
        }
        
        .endpoint code {
            font-family: 'Courier New', monospace;
            font-weight: bold;
        }
        
        .method {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 0.8rem;
            font-weight: bold;
            margin-right: 10px;
        }
        
        .method.get { background: #28a745; color: white; }
        .method.post { background: #007bff; color: white; }
        .method.put { background: #ffc107; color: black; }
        .method.delete { background: #dc3545; color: white; }
    </style>
</head>
<body>
    <div class="header">
        <h1>AVOI Backend Admin Dashboard</h1>
        <a href="/admin/logout" class="logout-btn">Logout</a>
    </div>
    
    <div class="container">
        <div class="dashboard-grid">
            <div class="card">
                <h3>System Status</h3>
                <p><strong>Status:</strong> <span style="color: #28a745;">Online</span></p>
                <p><strong>Database:</strong> <span style="color: #28a745;">Connected</span></p>
                <p><strong>API Version:</strong> v1.0</p>
            </div>
            
            <div class="card">
                <h3>Quick Stats</h3>
                <p><strong>Total Products:</strong> 6</p>
                <p><strong>Active Users:</strong> Dynamic</p>
                <p><strong>Total Orders:</strong> Dynamic</p>
            </div>
            
            <div class="card">
                <h3>Admin Access</h3>
                <p><strong>Logged in as:</strong> {{ admin_email }}</p>
                <p><strong>Access Level:</strong> Full Admin</p>
                <p><strong>Last Login:</strong> Just now</p>
            </div>
        </div>
        
        <div class="api-section">
            <h2>Available API Endpoints</h2>
            
            <div class="endpoint">
                <span class="method post">POST</span>
                <code>/api/auth/register</code> - User registration
            </div>
            
            <div class="endpoint">
                <span class="method post">POST</span>
                <code>/api/auth/login</code> - User login
            </div>
            
            <div class="endpoint">
                <span class="method get">GET</span>
                <code>/api/products</code> - Get all products
            </div>
            
            <div class="endpoint">
                <span class="method get">GET</span>
                <code>/api/products/{id}</code> - Get single product
            </div>
            
            <div class="endpoint">
                <span class="method post">POST</span>
                <code>/api/cart/add</code> - Add item to cart
            </div>
            
            <div class="endpoint">
                <span class="method get">GET</span>
                <code>/api/cart</code> - Get cart items
            </div>
            
            <div class="endpoint">
                <span class="method post">POST</span>
                <code>/api/orders</code> - Create new order
            </div>
            
            <div class="endpoint">
                <span class="method get">GET</span>
                <code>/api/orders</code> - Get user orders
            </div>
        </div>
    </div>
</body>
</html>
"""

@admin_bp.route('/admin', methods=['GET', 'POST'])
def admin_login():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        
        if email == ADMIN_EMAIL and check_password_hash(ADMIN_PASSWORD_HASH, password):
            session['admin_logged_in'] = True
            session['admin_email'] = email
            return render_template_string(ADMIN_DASHBOARD_TEMPLATE, admin_email=email)
        else:
            return render_template_string(ADMIN_LOGIN_TEMPLATE, error="Invalid email or password")
    
    # Check if already logged in
    if session.get('admin_logged_in'):
        return render_template_string(ADMIN_DASHBOARD_TEMPLATE, admin_email=session.get('admin_email'))
    
    return render_template_string(ADMIN_LOGIN_TEMPLATE)

@admin_bp.route('/admin/logout')
def admin_logout():
    session.pop('admin_logged_in', None)
    session.pop('admin_email', None)
    return render_template_string(ADMIN_LOGIN_TEMPLATE, error="Logged out successfully")

@admin_bp.route('/admin/dashboard')
def admin_dashboard():
    if not session.get('admin_logged_in'):
        return render_template_string(ADMIN_LOGIN_TEMPLATE, error="Please login first")
    
    return render_template_string(ADMIN_DASHBOARD_TEMPLATE, admin_email=session.get('admin_email'))


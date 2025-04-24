// Simple Node.js + Express + EJS setup for "This Side Up" E-commerce with User Authentication and Roles

const express = require('express');
const path = require('path');
const session = require('express-session');
const app = express();
const PORT = process.env.PORT || 3000;

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'skimboard-secret',
  resave: false,
  saveUninitialized: true
}));

// Dummy Data (can be replaced by DB later)
let users = [
  { id: 1, email: 'admin@thissideup.com', password: 'admin123', role: 'employee' },
  { id: 2, email: 'user@example.com', password: 'user123', role: 'customer' }
];

let products = [
  { id: 1, name: 'Wave Rider Skimboard', price: 120.00, image: '/images/skimboard1.jpg', type: 'wave' },
  { id: 2, name: 'Flatland Glider', price: 95.00, image: '/images/skimboard2.jpg', type: 'flatland' },
  { id: 3, name: 'Tropical Wax', price: 8.99, image: '/images/wax.jpg', type: 'accessory' },
];

// Authentication Middleware
function requireAuth(req, res, next) {
  if (!req.session.user) return res.redirect('/login');
  next();
}

function requireEmployee(req, res, next) {
  if (req.session.user?.role !== 'employee') return res.status(403).send('Access Denied');
  next();
}

// Global middleware for setting user in views
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Routes
app.get('/', (req, res) => {
  res.render('home', { products });
});

app.get('/shop', (req, res) => {
  res.render('shop', { products });
});

app.get('/design', requireAuth, (req, res) => {
  res.render('design');
});

// Authentication routes
app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    req.session.user = user;
    res.redirect('/');
  } else {
    res.send('Login failed');
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/'));
});

// Employee-only: Manage Products
app.get('/admin/products', requireEmployee, (req, res) => {
  res.render('admin-products', { products });
});

app.post('/admin/products/add', requireEmployee, (req, res) => {
  const { name, price, image, type } = req.body;
  const newProduct = { id: products.length + 1, name, price: parseFloat(price), image, type };
  products.push(newProduct);
  res.redirect('/admin/products');
});

app.post('/admin/products/delete', requireEmployee, (req, res) => {
  const id = parseInt(req.body.id);
  products = products.filter(p => p.id !== id);
  res.redirect('/admin/products');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

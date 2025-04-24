// Simple Node.js + Express + EJS setup for "This Side Up" E-commerce

const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Dummy Data (can be replaced by DB later)
const products = [
  { id: 1, name: 'Wave Rider Skimboard', price: 120.00, image: '/images/skimboard1.jpg', type: 'wave' },
  { id: 2, name: 'Flatland Glider', price: 95.00, image: '/images/skimboard2.jpg', type: 'flatland' },
  { id: 3, name: 'Tropical Wax', price: 8.99, image: '/images/wax.jpg', type: 'accessory' },
];

// Routes
app.get('/', (req, res) => {
  res.render('home', { products });
});

app.get('/shop', (req, res) => {
  res.render('shop', { products });
});

app.get('/design', (req, res) => {
  res.render('design');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

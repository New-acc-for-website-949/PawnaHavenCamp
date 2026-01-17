const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const propertyRoutes = require('./routes/properties');
const eticketRoutes = require('./routes/etickets');
const bookingRoutes = require('./routes/bookings');
const paymentRoutes = require('./routes/payments');
const { pool } = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb', parameterLimit: 50000 }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Serve static files from React admin panel
const adminPath = path.join(__dirname, 'public/admin');
const frontendPath = path.join(__dirname, '../dist');

// Middleware to handle /admin trailing slash
app.use((req, res, next) => {
  if (req.path === '/admin') {
    return res.redirect(301, '/admin/');
  }
  next();
});

// Inject environment variables into the admin panel
app.get('/admin/config.js', (req, res) => {
  const config = {
    REACT_APP_CLOUDINARY_CLOUD_NAME: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME,
    REACT_APP_CLOUDINARY_UPLOAD_PRESET: process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET,
    REACT_APP_API_URL: process.env.REACT_APP_API_URL || '/api'
  };
  res.header('Content-Type', 'application/javascript');
  res.send(`window._env_ = ${JSON.stringify(config)};`);
});

// Serve static files for admin
app.use('/admin', express.static(adminPath));

// Serve static files for main frontend
app.use(express.static(frontendPath));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/etickets', eticketRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'LoonCamp API is running',
    timestamp: new Date().toISOString(),
  });
});

// Admin SPA routing
app.get(/^\/admin.*/, (req, res) => {
  res.sendFile(path.join(adminPath, 'index.html'));
});

// Frontend SPA routing - MUST BE LAST
app.get(/^(?!\/api|\/admin).*/, (req, res) => {
  // Return index.html for all other routes to support client-side routing
  res.sendFile(path.join(frontendPath, 'index.html'), (err) => {
    if (err) {
      res.status(404).send('Frontend build not found. Please run npm run build.');
    }
  });
});

// 404 handler for API routes
app.use(/^\/api.*/, (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  
  if (err.message && err.message.includes('File size too large')) {
    return res.status(400).json({
      success: false,
      message: 'Image file size is too large (max 50MB). Please compress the image or use a smaller file.',
    });
  }

  res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server');
  await pool.end();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT signal received: closing HTTP server');
  await pool.end();
  process.exit(0);
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n=================================`);
  console.log(`LoonCamp API Server`);
  console.log(`=================================`);
  console.log(`Cloudinary Config: { cloud_name: ${process.env.CLOUDINARY_CLOUD_NAME ? 'Present' : 'Missing'}, api_key: ${process.env.CLOUDINARY_API_KEY ? 'Present' : 'Missing'}, api_secret: ${process.env.CLOUDINARY_API_SECRET ? 'Present' : 'Missing'} }`);
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`API Base URL: http://localhost:${PORT}/api`);
  console.log(`Admin Panel: http://localhost:${PORT}/admin`);
  console.log(`=================================\n`);
});

module.exports = app;

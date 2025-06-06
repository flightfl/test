const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', // the deveploment frontend URL
            'https://cs144-25s-xingbo2002.uw.r.appspot.com'], // the production frontend URL
  credentials: true, // Allow cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(cookieParser());

// Basic route for testing
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Routes
app.use('/api/produce', require('./routes/produceRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/usda', require('./routes/usdaRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });
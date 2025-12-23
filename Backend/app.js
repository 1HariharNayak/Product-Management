const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const productRoutes = require('./routes/productRoutes');
const errorHandler = require('./middleware/errorHandler');
const seedCategories = require('./seeders/categorySeeders');

const app = express();
app.use(cors());
app.use(helmet());
app.use(morgan('combined'));
app.use(express.json());

// Connect to MongoDB (no deprecated options needed in Mongoose 9.x)
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/inventory').then(async () => {
  console.log('MongoDB connected');
  await seedCategories(); // Seed categories on start
}).catch(err => console.error(err));

app.use('/api/products', productRoutes);
app.use(errorHandler);

module.exports = app;
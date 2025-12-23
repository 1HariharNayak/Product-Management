
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  quantity: { type: Number, required: true, min: 0 },
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
  createdAt: { type: Date, default: Date.now },
});

// Indexes for performance (removed duplicate name index)
productSchema.index({ categories: 1 }); // For filtering

module.exports = mongoose.model('Product', productSchema);